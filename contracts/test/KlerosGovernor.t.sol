// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {KlerosGovernor} from "../src/KlerosGovernor.sol";
import {IArbitrableV2, IArbitratorV2, ArbitratorMock} from "../src/test/ArbitratorMock.sol";
import {IDisputeTemplateRegistry, DisputeTemplateRegistryMock} from "../src/test/DisputeTemplateRegistryMock.sol";
import {TargetMock} from "../src/test/TargetMock.sol";

contract KlerosGovernorTest is Test {
    KlerosGovernor klerosGovernor;
    ArbitratorMock arbitrator;
    DisputeTemplateRegistryMock registry;
    TargetMock target;

    address governor;
    address submitter1;
    address submitter2;
    address submitter3;
    address other;

    uint256 submissionBaseDeposit;
    uint256 submissionTimeout;
    uint256 executionTimeout;
    uint256 withdrawTimeout;

    bytes arbitratorExtraData;
    string templateData;
    string templateDataMappings;
    uint256 arbitrationCost;

    uint256 arbitrumBlock = 123456;

    function setUp() public {
        governor = msg.sender;
        submitter1 = vm.addr(1);
        submitter2 = vm.addr(2);
        submitter3 = vm.addr(3);
        other = vm.addr(9);

        vm.deal(submitter1, 10 ether);
        vm.deal(submitter2, 10 ether);
        vm.deal(submitter3, 10 ether);

        submissionBaseDeposit = 0.5 ether;
        submissionTimeout = 3600;
        executionTimeout = 3000;
        withdrawTimeout = 100;

        // Extradata is irrelevant for mock arbitrator and doesn't influence the arbitration cost.
        arbitratorExtraData = "0xfa";
        templateData = "AAA";
        templateDataMappings = "BBB";
        arbitrationCost = 0.03 ether;

        arbitrator = new ArbitratorMock(arbitrationCost);
        registry = new DisputeTemplateRegistryMock();

        vm.prank(governor);
        klerosGovernor = new KlerosGovernor(
            arbitrator,
            arbitratorExtraData,
            registry,
            templateData,
            templateDataMappings,
            submissionBaseDeposit,
            submissionTimeout,
            executionTimeout,
            withdrawTimeout
        );
        target = new TargetMock();

        // Handle the arbitrum precompiled address
        vm.etch(address(100), hex"00");
        vm.mockCall(address(100), abi.encodeWithSignature("arbBlockNumber()"), abi.encode(uint256(arbitrumBlock)));
    }

    function test_setUp() public {
        assertEq(address(klerosGovernor.arbitrator()), address(arbitrator), "Wrong arbitrator");
        assertEq(klerosGovernor.arbitratorExtraData(), "0xfa", "Wrong arbitratorExtraData");
        assertEq(klerosGovernor.lastApprovalTime(), block.timestamp, "Wrong lastApprovalTime");
        assertEq(klerosGovernor.submissionBaseDeposit(), 0.5 ether, "Wrong submissionBaseDeposit");
        assertEq(klerosGovernor.submissionTimeout(), 3600, "Wrong submissionTimeout");
        assertEq(klerosGovernor.executionTimeout(), 3000, "Wrong executionTimeout");
        assertEq(klerosGovernor.withdrawTimeout(), 100, "Wrong withdrawTimeout");
        assertEq(klerosGovernor.templateId(), 0, "Wrong templateId");
        assertEq(address(klerosGovernor.templateRegistry()), address(registry), "Wrong registry address");
        assertEq(klerosGovernor.getNumberOfCreatedLists(), 1, "Wrong number of created lists"); // Submissions array is pushed during deployment, for UI purposes.
        assertEq(klerosGovernor.getCurrentSessionNumber(), 0, "Wrong session number");

        assertEq(arbitrator.arbitrationCost(arbitratorExtraData), 0.03 ether, "Wrong arbitration cost");
        assertEq(registry.templates(), 1, "Wrong templates index in the registry");

        KlerosGovernor.Session memory session = klerosGovernor.getSession(0);

        // All values should be empty in a new session
        assertEq(session.ruling, 0, "Ruling should be empty");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0, "sumDeposit should be 0");
        assertEq(uint256(session.status), uint256(KlerosGovernor.Status.NoDispute), "Status should be NoDispute");
        assertEq(session.durationOffset, 0, "durationOffset should be 0");
        assertEq(session.submittedLists.length, 0, "Session list array should be empty");

        assertEq(klerosGovernor.getTotalSubmissionDeposit(), 0.53 ether, "Wrong required deposit value");
    }

    function test_changeSubmissionDeposit() public {
        vm.expectRevert(bytes("Only the governor allowed."));
        vm.prank(other);
        klerosGovernor.changeSubmissionDeposit(0.01 ether);
        vm.prank(address(klerosGovernor));
        klerosGovernor.changeSubmissionDeposit(0.01 ether);
        assertEq(klerosGovernor.submissionBaseDeposit(), 0.01 ether, "Wrong submissionBaseDeposit after change");
    }

    function test_changeSubmissionTimeout() public {
        vm.expectRevert(bytes("Only the governor allowed."));
        vm.prank(other);
        klerosGovernor.changeSubmissionTimeout(3666);
        vm.prank(address(klerosGovernor));
        klerosGovernor.changeSubmissionTimeout(3666);
        assertEq(klerosGovernor.submissionTimeout(), 3666, "Wrong submissionTimeout after change");

        vm.warp(block.timestamp + 3666 + 1); // Skip submission timeout to pass the submission period

        vm.expectRevert(bytes("Submission time has ended."));
        vm.prank(address(klerosGovernor));
        klerosGovernor.changeSubmissionTimeout(10000);
    }

    function test_changeExecutionTimeout() public {
        vm.expectRevert(bytes("Only the governor allowed."));
        vm.prank(other);
        klerosGovernor.changeExecutionTimeout(1111);
        vm.prank(address(klerosGovernor));
        klerosGovernor.changeExecutionTimeout(1111);
        assertEq(klerosGovernor.executionTimeout(), 1111, "Wrong executionTimeout after change");
    }

    function test_changeWithdrawTimeout() public {
        vm.expectRevert(bytes("Only the governor allowed."));
        vm.prank(other);
        klerosGovernor.changeWithdrawTimeout(123);
        vm.prank(address(klerosGovernor));
        klerosGovernor.changeWithdrawTimeout(123);
        assertEq(klerosGovernor.withdrawTimeout(), 123, "Wrong withdrawTimeout after change");
    }

    function test_changeArbitrator() public {
        vm.expectRevert(bytes("Only the governor allowed."));
        vm.prank(other);
        klerosGovernor.changeArbitrator(IArbitratorV2(other), "0xffff");
        vm.prank(address(klerosGovernor));
        klerosGovernor.changeArbitrator(IArbitratorV2(other), "0xffff");
        assertEq(address(klerosGovernor.arbitrator()), other, "Wrong arbitrator after change");
        assertEq(klerosGovernor.arbitratorExtraData(), "0xffff", "Wrong arbitratorExtraData after change");

        vm.warp(block.timestamp + 3666 + 1); // Skip submission timeout to pass the submission period

        vm.expectRevert(bytes("Submission time has ended."));
        vm.prank(address(klerosGovernor));
        klerosGovernor.changeArbitrator(arbitrator, "0xfa");
    }

    function test_changeDisputeTemplate() public {
        string memory newTemplateData = "Y";
        string memory newTemplateDataMappings = "Z";
        uint256 newTemplateId = 1;

        vm.expectRevert(bytes("Only the governor allowed."));
        vm.prank(other);
        klerosGovernor.changeDisputeTemplate(newTemplateData, newTemplateDataMappings);
        vm.prank(address(klerosGovernor));
        vm.expectEmit(true, true, true, true);
        emit IDisputeTemplateRegistry.DisputeTemplate(newTemplateId, "", newTemplateData, newTemplateDataMappings);
        klerosGovernor.changeDisputeTemplate(newTemplateData, newTemplateDataMappings);

        assertEq(klerosGovernor.templateId(), newTemplateId, "Wrong templateId");
        assertEq(registry.templates(), 2, "Wrong templates index in the registry");
    }

    function test_submitList() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        // Create arrays with incompatible size to check the require
        uint256[] memory badDataSize = new uint256[](1);
        badDataSize[0] = data1.length;

        uint256[] memory badValues = new uint256[](1);
        badValues[0] = 0.01 ether;

        // Warp to check durationOffset later
        vm.warp(block.timestamp + 555);

        // Check the requires first
        vm.expectRevert(bytes("Wrong input: target and value"));
        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            badValues,
            fullData,
            dataSize,
            description
        );

        vm.expectRevert(bytes("Wrong input: target and datasize"));
        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            badDataSize,
            description
        );

        vm.expectRevert(bytes("Not enough ETH to cover deposit"));
        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost - 1}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        uint256 sessionID = 0;
        uint256 listID = 1;

        vm.prank(submitter1);
        vm.expectEmit(true, true, true, true);
        emit KlerosGovernor.ListSubmitted(listID, submitter1, sessionID, "test submission"); // listID, submitter, sessionID, description
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        // Check stored values
        assertEq(klerosGovernor.getNumberOfCreatedLists(), 2, "Wrong number of created lists"); // First list was created in constructor.

        KlerosGovernor.Session memory session = klerosGovernor.getSession(sessionID);
        assertEq(session.ruling, 0, "Ruling should be empty");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0.53 ether, "Wrong sumDeposit value");
        assertEq(uint256(session.status), uint256(KlerosGovernor.Status.NoDispute), "Status should be NoDispute");
        assertEq(session.durationOffset, 555, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 1, "Incorrect length of submission array");
        assertEq(session.submittedLists[0], listID, "Incorrect index of the submitted list");

        assertEq(klerosGovernor.getNumberOfTransactions(listID), 2, "Wrong number of transactions in the list");

        KlerosGovernor.Submission memory submission = klerosGovernor.getSubmission(listID);
        assertEq(submission.submitter, payable(submitter1), "Wrong submitter address");
        assertEq(submission.deposit, 0.53 ether, "Wrong submission deposit");
        assertEq(submission.txs.length, 2, "Wrong txs length");

        bytes32 listHash = _computeListHash(targets, values, fullData, dataSize);
        assertEq(submission.listHash, listHash, "Wrong listHash");
        assertEq(submission.submissionTime, block.timestamp, "Wrong submissionTime");
        assertEq(submission.approved, false, "List should not be approved");
        assertEq(submission.approvalTime, 0, "Approval time should be 0");
        assertEq(submission.submissionBlock, 123456, "Wrong submission block");

        uint256[] memory submittedLists = new uint256[](1);
        submittedLists[0] = 1;

        assertEq(klerosGovernor.getSubmittedLists(sessionID), submittedLists, "Wrong submittedLists array");
        assertEq(klerosGovernor.alreadySubmitted(sessionID, listHash), true, "List should be marked as submitted");
    }

    function test_submitList_txInfo() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        uint256 listID = 1;

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        (address targetAddress, uint256 value, bytes memory data, bool executed) = klerosGovernor.getTransactionInfo(
            listID,
            0
        );
        assertEq(targetAddress, address(target), "Wrong target address for 1st tx");
        assertEq(value, 0.01 ether, "Wrong value for 1st tx");
        assertEq(data, data1, "Wrong data for 1st tx");
        assertEq(executed, false, "1st tx should not be executed");

        (targetAddress, value, data, executed) = klerosGovernor.getTransactionInfo(listID, 1);
        assertEq(targetAddress, other, "Wrong target address for 2nd tx");
        assertEq(value, 0, "Wrong value for 2nd tx");
        assertEq(data, data2, "Wrong data for 2nd tx");
        assertEq(executed, false, "2nd tx should not be executed");
    }

    function test_submitList_duplicate() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        vm.expectRevert(bytes("List already submitted"));
        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );
    }

    function test_submitList_wrongPeriod() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        vm.warp(block.timestamp + 3600 + 1); // Skip submission timeout to pass the submission period

        vm.expectRevert(bytes("Submission time has ended."));
        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );
    }

    function test_submitList_checkFunding() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        assertEq(address(klerosGovernor).balance, 0, "Balance of the contract should be empty");
        assertEq(submitter1.balance, 10 ether, "Balance of the submitter is incorrect");

        // Overpay to check the reimbursement
        vm.prank(submitter1);
        klerosGovernor.submitList{value: 5 ether}(targets, values, fullData, dataSize, description);

        assertEq(address(klerosGovernor).balance, 0.53 ether, "Balance of the contract is incorrect");
        assertEq(submitter1.balance, 9.47 ether, "Balance of the submitter is incorrect");
        assertEq(klerosGovernor.reservedETH(), 0.53 ether, "Wrong reservedETH");
        assertEq(klerosGovernor.getExpendableFunds(), 0, "Should not have expendable funds");
    }

    function test_submitList_secondList() public {
        // Check that the values after 2nd submission are properly incremented.

        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        uint256 sessionID = 0;

        // Warp to check durationOffset later
        vm.warp(block.timestamp + 555);

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        // Change targets array a bit to make the 2nd list different.
        targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        // Warp a bit more to check that durationOffset is not changed after the 2nd list.
        vm.warp(block.timestamp + 100);

        vm.prank(submitter2);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        // Check stored values
        assertEq(klerosGovernor.getNumberOfCreatedLists(), 3, "Wrong number of created lists"); // First list was created in constructor.

        KlerosGovernor.Session memory session = klerosGovernor.getSession(sessionID);
        assertEq(session.sumDeposit, 1.06 ether, "Wrong sumDeposit value");
        assertEq(uint256(session.status), uint256(KlerosGovernor.Status.NoDispute), "Status should be NoDispute");
        assertEq(session.durationOffset, 555, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 2, "Incorrect length of submission array");

        uint256[] memory submittedLists = new uint256[](2);
        submittedLists[0] = 1;
        submittedLists[1] = 2;

        assertEq(klerosGovernor.getSubmittedLists(sessionID), submittedLists, "Wrong submittedLists array");

        assertEq(address(klerosGovernor).balance, 1.06 ether, "Balance of the contract is incorrect");
        assertEq(klerosGovernor.reservedETH(), 1.06 ether, "Wrong reservedETH");
        assertEq(klerosGovernor.getExpendableFunds(), 0, "Should not have expendable funds");

        // Check that duration offset is behaving correctly after 2nd submission
        vm.warp(block.timestamp + 3500 + 1);

        targets = new address[](2);
        targets[0] = other;
        targets[1] = other;

        vm.expectRevert(bytes("Submission time has ended."));
        vm.prank(submitter3);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );
    }

    function test_submitList_expendableFunds() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        assertEq(address(klerosGovernor).balance, 0.53 ether, "Balance of the contract is incorrect");
        assertEq(submitter1.balance, 9.47 ether, "Balance of the submitter is incorrect");
        assertEq(klerosGovernor.reservedETH(), 0.53 ether, "Wrong reservedETH");
        assertEq(klerosGovernor.getExpendableFunds(), 0, "Should not have expendable funds");

        vm.prank(submitter1);
        payable(address(klerosGovernor)).transfer(1 ether);

        assertEq(address(klerosGovernor).balance, 1.53 ether, "Balance of the contract is incorrect after transfer");
        assertEq(submitter1.balance, 8.47 ether, "Balance of the submitter is incorrect after transfer");
        assertEq(klerosGovernor.reservedETH(), 0.53 ether, "Wrong reservedETH after transfer");
        assertEq(klerosGovernor.getExpendableFunds(), 1 ether, "Wrong expendable funds value after transfer");
    }

    function test_withdrawList() public {
        // Submit two lists but withdraw only the first one

        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";
        bytes32 listHash1 = _computeListHash(targets, values, fullData, dataSize);

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        // Change targets array a bit to make the 2nd list different.
        targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        bytes32 listHash2 = _computeListHash(targets, values, fullData, dataSize);

        vm.prank(submitter2);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        uint256 listID = 0; // Withdrawal index is not global and belongs to the current session, so it starts with 0.
        uint256 sessionID = 0;

        // Submitter1 withdraws.
        // Check the requires first.
        vm.expectRevert(bytes("Wrong list hash"));
        vm.prank(submitter1);
        klerosGovernor.withdrawTransactionList(listID, listHash2);

        vm.expectRevert(bytes("Only submitter can withdraw"));
        vm.prank(submitter2);
        klerosGovernor.withdrawTransactionList(listID, listHash1);

        vm.prank(submitter1);
        klerosGovernor.withdrawTransactionList(listID, listHash1);

        KlerosGovernor.Session memory session = klerosGovernor.getSession(sessionID);
        assertEq(session.sumDeposit, 0.53 ether, "sumDeposit value should decrease");
        assertEq(uint256(session.status), uint256(KlerosGovernor.Status.NoDispute), "Status should be NoDispute");
        assertEq(session.submittedLists.length, 1, "Incorrect length of submission array after withdrawal");
        assertEq(session.submittedLists[0], 2, "Incorrect global index of the remaining list");
        assertEq(
            klerosGovernor.alreadySubmitted(sessionID, listHash1),
            false,
            "List should not be marked as submitted"
        );

        assertEq(address(klerosGovernor).balance, 0.53 ether, "Balance of the contract is incorrect");
        assertEq(submitter1.balance, 10 ether, "Balance of the submitter1 is incorrect");
        assertEq(submitter2.balance, 9.47 ether, "Balance of the submitter2 is incorrect");
        assertEq(klerosGovernor.reservedETH(), 0.53 ether, "Wrong reservedETH");
        assertEq(klerosGovernor.getExpendableFunds(), 0, "Should not have expendable funds");
    }

    function test_withdrawList_checkWithdrawTimeout() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";
        bytes32 listHash = _computeListHash(targets, values, fullData, dataSize);

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        uint256 listID = 0; // Withdrawal index is not global and belongs to the current session, so it starts with 0.

        vm.warp(block.timestamp + 100 + 1);

        vm.expectRevert(bytes("Withdrawing time has passed."));
        vm.prank(submitter1);
        klerosGovernor.withdrawTransactionList(listID, listHash);
    }

    function test_withdrawList_checkWithdrawTimeout_secondHalf() public {
        // Warp to the 2nd half of the submission period
        vm.warp(block.timestamp + submissionTimeout / 2 + 1);
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";
        bytes32 listHash = _computeListHash(targets, values, fullData, dataSize);

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        uint256 listID = 0; // Withdrawal index is not global and belongs to the current session, so it starts with 0.

        vm.expectRevert(bytes("Should be in first half"));
        vm.prank(submitter1);
        klerosGovernor.withdrawTransactionList(listID, listHash);
    }

    function test_executeSubmissions_emptySession() public {
        vm.expectRevert(bytes("Approval time not started yet."));
        vm.prank(other);
        klerosGovernor.executeSubmissions();

        uint256 previousApprovalTime = klerosGovernor.lastApprovalTime();

        vm.warp(block.timestamp + submissionTimeout + 1);

        vm.prank(other);
        klerosGovernor.executeSubmissions();

        assertEq(
            klerosGovernor.lastApprovalTime(),
            previousApprovalTime + submissionTimeout + 1,
            "Wrong lastApprovalTime"
        );
        assertEq(klerosGovernor.getCurrentSessionNumber(), 1, "Wrong session number");

        uint256 previousSessionID = 0;
        uint256 currentSessionID = 1;

        KlerosGovernor.Session memory session = klerosGovernor.getSession(previousSessionID);
        assertEq(session.ruling, 0, "Ruling should be empty");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0, "Wrong sumDeposit value");
        assertEq(
            uint256(session.status),
            uint256(KlerosGovernor.Status.Resolved),
            "Status should be Resolved for the past session"
        );
        assertEq(session.durationOffset, 0, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 0, "Incorrect length of submission array");

        session = klerosGovernor.getSession(currentSessionID);
        assertEq(session.ruling, 0, "Ruling should be empty");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0, "Wrong sumDeposit value");
        assertEq(
            uint256(session.status),
            uint256(KlerosGovernor.Status.NoDispute),
            "Status should be NoDispute for the current session"
        );
        assertEq(session.durationOffset, 0, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 0, "Incorrect length of submission array");
    }

    function test_executeSubmissions_approval() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        uint256 previousApprovalTime = klerosGovernor.lastApprovalTime();
        vm.warp(block.timestamp + submissionTimeout + 1);

        vm.prank(other);
        klerosGovernor.executeSubmissions();

        assertEq(
            klerosGovernor.lastApprovalTime(),
            previousApprovalTime + submissionTimeout + 1,
            "Wrong lastApprovalTime"
        );
        assertEq(klerosGovernor.getCurrentSessionNumber(), 1, "Wrong session number");

        uint256 previousSessionID = 0;
        uint256 currentSessionID = 1;
        uint256 listID = 1;

        // Sessions
        KlerosGovernor.Session memory session = klerosGovernor.getSession(previousSessionID);
        assertEq(session.ruling, 0, "Ruling should be empty");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0, "sumDeposit should be nullified");
        assertEq(
            uint256(session.status),
            uint256(KlerosGovernor.Status.Resolved),
            "Status should be Resolved for the past session"
        );
        assertEq(session.durationOffset, 0, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 1, "Incorrect length of submission array");
        assertEq(session.submittedLists[0], listID, "Incorrect index of the submitted list");

        session = klerosGovernor.getSession(currentSessionID);
        assertEq(session.ruling, 0, "Ruling should be empty");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0, "sumDeposit should be 0");
        assertEq(
            uint256(session.status),
            uint256(KlerosGovernor.Status.NoDispute),
            "Status should be NoDispute for the current session"
        );
        assertEq(session.durationOffset, 0, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 0, "Incorrect length of submission array in the current session");

        // Balances
        assertEq(address(klerosGovernor).balance, 0, "Balance of the contract should be emptied");
        assertEq(submitter1.balance, 10 ether, "Balance of the submitter1 is incorrect");
        assertEq(klerosGovernor.reservedETH(), 0, "Wrong reservedETH");
        assertEq(klerosGovernor.getExpendableFunds(), 0, "Should not have expendable funds");

        // Submission
        KlerosGovernor.Submission memory submission = klerosGovernor.getSubmission(listID);
        assertEq(submission.submitter, payable(submitter1), "Wrong submitter address");
        assertEq(submission.deposit, 0.53 ether, "Submission deposit should not change");
        assertEq(submission.txs.length, 2, "Wrong txs length");

        bytes32 listHash = _computeListHash(targets, values, fullData, dataSize);
        assertEq(submission.listHash, listHash, "Wrong listHash");
        assertEq(submission.submissionTime, block.timestamp - submissionTimeout - 1, "Wrong submissionTime");
        assertEq(submission.approved, true, "List should be approved");
        assertEq(submission.approvalTime, block.timestamp, "Approval time should be defined");
    }

    function test_executeSubmissions_dispute() public {
        // Submit two lists to create a dispute

        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        // Change targets array a bit to make the 2nd list different.
        targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        vm.prank(submitter2);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        vm.warp(block.timestamp + submissionTimeout + 1);

        uint256 disputeId = 0;
        uint256 templateId = 0;
        uint256 sessionId = 0;

        vm.prank(other);
        vm.expectEmit(true, true, true, true);
        emit IArbitratorV2.DisputeCreation(disputeId, IArbitrableV2(address(klerosGovernor)));
        vm.expectEmit(true, true, true, true);
        emit IArbitrableV2.DisputeRequest(arbitrator, disputeId, templateId);
        klerosGovernor.executeSubmissions();

        vm.expectRevert(bytes("Already disputed"));
        vm.prank(other);
        klerosGovernor.executeSubmissions();

        (IArbitrableV2 arbitrated, uint256 choices, uint256 fees, uint256 ruling, bool ruled) = arbitrator.disputes(
            disputeId
        );
        assertEq(address(arbitrated), address(klerosGovernor), "Incorrect arbitrable");
        assertEq(choices, 2, "Wrong amount of choices");
        assertEq(fees, 0.03 ether, "Incorrect fees");
        assertEq(ruling, 0, "No ruling given yet");
        assertEq(ruled, false, "Not yet ruled");

        KlerosGovernor.Session memory session = klerosGovernor.getSession(sessionId);
        assertEq(session.ruling, 0, "Ruling should be empty");
        assertEq(session.disputeID, 0, "Wrong dispute ID");
        assertEq(session.sumDeposit, 1.03 ether, "Wrong sumDeposit"); // 0.53 * 2 - 0.03
        assertEq(
            uint256(session.status),
            uint256(KlerosGovernor.Status.DisputeCreated),
            "Status should be DisputeCreated"
        );

        assertEq(address(klerosGovernor).balance, 1.03 ether, "Balance of the contract is incorrect"); // 0.53 * 2 - 0.03
        assertEq(submitter1.balance, 9.47 ether, "Balance of the submitter1 is incorrect");
        assertEq(submitter2.balance, 9.47 ether, "Balance of the submitter2 is incorrect");
        assertEq(klerosGovernor.reservedETH(), 1.03 ether, "Wrong reservedETH"); // 0.53 * 2 - 0.03
    }

    function test_rule() public {
        // Submit two lists to create a dispute

        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        // Change targets array a bit to make the 2nd list different.
        targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        vm.prank(submitter2);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        vm.warp(block.timestamp + submissionTimeout + 1);

        uint256 disputeId = 0;
        uint256 templateId = 0;
        uint256 sessionId = 0;
        uint256 winningListID = 1;
        uint256 losingListID = 2;

        vm.expectRevert(bytes("Wrong status"));
        vm.prank(address(arbitrator));
        klerosGovernor.rule(disputeId, winningListID);

        vm.prank(other);
        klerosGovernor.executeSubmissions();

        vm.expectRevert(bytes("Only arbitrator allowed"));
        vm.prank(other);
        klerosGovernor.rule(disputeId, winningListID);

        vm.expectRevert(bytes("Ruling is out of bounds."));
        vm.prank(address(arbitrator));
        klerosGovernor.rule(disputeId, 3);

        vm.expectEmit(true, true, true, true);
        emit IArbitratorV2.Ruling(IArbitrableV2(address(klerosGovernor)), disputeId, winningListID);
        vm.expectEmit(true, true, true, true);
        emit IArbitrableV2.Ruling(IArbitratorV2(address(arbitrator)), disputeId, winningListID);
        arbitrator.giveRuling(disputeId, winningListID);

        // Dispute
        (, , , uint256 ruling, bool ruled) = arbitrator.disputes(disputeId);
        assertEq(ruling, winningListID, "Incorrect ruling");
        assertEq(ruled, true, "Should be ruled");

        uint256 previousSessionID = 0;
        uint256 currentSessionID = 1;

        // Sessions
        KlerosGovernor.Session memory session = klerosGovernor.getSession(previousSessionID);
        assertEq(session.ruling, winningListID, "Wrong ruling");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0, "sumDeposit should be nullified");
        assertEq(
            uint256(session.status),
            uint256(KlerosGovernor.Status.Resolved),
            "Status should be Resolved for the past session"
        );
        assertEq(session.durationOffset, 0, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 2, "Incorrect length of submission array");
        assertEq(session.submittedLists[0], winningListID, "Incorrect index of the winning list");
        assertEq(session.submittedLists[1], losingListID, "Incorrect index of the losing list");

        session = klerosGovernor.getSession(currentSessionID);
        assertEq(session.ruling, 0, "Ruling should be empty");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0, "sumDeposit should be 0");
        assertEq(
            uint256(session.status),
            uint256(KlerosGovernor.Status.NoDispute),
            "Status should be NoDispute for the current session"
        );
        assertEq(session.durationOffset, 0, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 0, "Incorrect length of submission array in the current session");

        // Balances
        assertEq(address(klerosGovernor).balance, 0, "Balance of the contract should be emptied");
        assertEq(submitter1.balance, 10.5 ether, "Balance of the submitter1 is incorrect"); // 9.47 + 0.53*2 - 0.03
        assertEq(submitter2.balance, 9.47 ether, "Balance of the submitter2 is incorrect");
        assertEq(klerosGovernor.reservedETH(), 0, "Wrong reservedETH");
        assertEq(klerosGovernor.getExpendableFunds(), 0, "Should not have expendable funds");

        // Submissions
        KlerosGovernor.Submission memory submission = klerosGovernor.getSubmission(winningListID);
        assertEq(submission.approved, true, "List should be approved");
        assertEq(submission.approvalTime, block.timestamp, "Approval time should be defined");

        submission = klerosGovernor.getSubmission(losingListID);
        assertEq(submission.approved, false, "List should not be approved");
        assertEq(submission.approvalTime, 0, "Approval time should not be defined");
    }

    function test_rule_tiedChoice() public {
        // Submit two lists to create a dispute

        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        // Change targets array a bit to make the 2nd list different.
        targets = new address[](2);
        targets[0] = address(target);
        targets[1] = other;

        vm.prank(submitter2);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        vm.warp(block.timestamp + submissionTimeout + 1);

        uint256 disputeId = 0;
        uint256 winnerRuling = 0;

        vm.prank(other);
        klerosGovernor.executeSubmissions();

        vm.expectEmit(true, true, true, true);
        emit IArbitratorV2.Ruling(IArbitrableV2(address(klerosGovernor)), disputeId, winnerRuling);
        vm.expectEmit(true, true, true, true);
        emit IArbitrableV2.Ruling(IArbitratorV2(address(arbitrator)), disputeId, winnerRuling);
        arbitrator.giveRuling(disputeId, winnerRuling);

        // Dispute
        (, , , uint256 ruling, bool ruled) = arbitrator.disputes(disputeId);
        assertEq(ruling, winnerRuling, "Incorrect ruling");
        assertEq(ruled, true, "Should be ruled");

        uint256 previousSessionID = 0;
        uint256 currentSessionID = 1;

        // Sessions
        KlerosGovernor.Session memory session = klerosGovernor.getSession(previousSessionID);
        assertEq(session.ruling, winnerRuling, "Wrong ruling");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0, "sumDeposit should be nullified");
        assertEq(
            uint256(session.status),
            uint256(KlerosGovernor.Status.Resolved),
            "Status should be Resolved for the past session"
        );
        assertEq(session.durationOffset, 0, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 2, "Incorrect length of submission array");

        session = klerosGovernor.getSession(currentSessionID);
        assertEq(session.ruling, 0, "Ruling should be empty");
        assertEq(session.disputeID, 0, "DisputeID should be 0");
        assertEq(session.sumDeposit, 0, "sumDeposit should be 0");
        assertEq(
            uint256(session.status),
            uint256(KlerosGovernor.Status.NoDispute),
            "Status should be NoDispute for the current session"
        );
        assertEq(session.durationOffset, 0, "Wrong durationOffset");
        assertEq(session.submittedLists.length, 0, "Incorrect length of submission array in the current session");

        // Balances
        assertEq(address(klerosGovernor).balance, 1.03 ether, "Balance of the contract should have sumDeposit");
        assertEq(submitter1.balance, 9.47 ether, "Balance of the submitter1 is incorrect");
        assertEq(submitter2.balance, 9.47 ether, "Balance of the submitter2 is incorrect");
        assertEq(klerosGovernor.reservedETH(), 0, "Wrong reservedETH");
        assertEq(klerosGovernor.getExpendableFunds(), 1.03 ether, "Should have sumDeposit as expendable funds");

        // Submissions
        KlerosGovernor.Submission memory submission = klerosGovernor.getSubmission(1);
        assertEq(submission.approved, false, "List should not be approved");
        assertEq(submission.approvalTime, 0, "Approval time should not be defined");

        submission = klerosGovernor.getSubmission(2);
        assertEq(submission.approved, false, "List should not be approved");
        assertEq(submission.approvalTime, 0, "Approval time should not be defined");
    }

    function test_executeTransactionList() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        uint256 listID = 1;

        vm.expectRevert(bytes("Should be approved"));
        vm.prank(other);
        klerosGovernor.executeTransactionList(listID, 0, 2); // ListID, cursor, count

        vm.warp(block.timestamp + submissionTimeout + 1);
        vm.prank(other);
        klerosGovernor.executeSubmissions();

        assertEq(klerosGovernor.getExpendableFunds(), 0, "Should not have expendable funds yet");

        vm.prank(other);
        klerosGovernor.executeTransactionList(listID, 0, 2); // ListID, cursor, count

        (address targetAddress, uint256 value, bytes memory data, bool executed) = klerosGovernor.getTransactionInfo(
            listID,
            0
        );
        assertEq(executed, false, "1st tx should not be executed as there were no funds");
        assertEq(target.flag(), false, "Target flag should not be raised");

        (targetAddress, value, data, executed) = klerosGovernor.getTransactionInfo(listID, 1);
        assertEq(executed, true, "2nd tx should be executed");
        assertEq(target.stored(), 42, "Target value should be stored");

        // Add a bit of funds to execute a tx
        vm.prank(submitter1);
        payable(address(klerosGovernor)).transfer(0.01 ether);

        assertEq(klerosGovernor.getExpendableFunds(), 0.01 ether, "Should have expendable funds");

        vm.prank(other);
        klerosGovernor.executeTransactionList(listID, 0, 2); // ListID, cursor, count

        (targetAddress, value, data, executed) = klerosGovernor.getTransactionInfo(listID, 0);
        assertEq(executed, true, "1st tx should be executed");
        assertEq(target.flag(), true, "Target flag should be raised");

        (targetAddress, value, data, executed) = klerosGovernor.getTransactionInfo(listID, 1);
        assertEq(executed, true, "2nd tx should be executed");
        assertEq(target.stored(), 42, "Target value should not change");
    }

    function test_executeTransactionList_checkTimeout() public {
        // Prepare target's calldata
        address[] memory targets = new address[](2);
        targets[0] = address(target);
        targets[1] = address(target);

        uint256[] memory values = new uint256[](2);
        values[0] = 0.01 ether;
        values[1] = 0;

        bytes memory data1 = abi.encodeWithSignature("triggerFlag()");
        bytes memory data2 = abi.encodeWithSignature("setValue(uint256)", 42);

        bytes memory fullData = bytes.concat(data1, data2);
        uint256[] memory dataSize = new uint256[](2);
        dataSize[0] = data1.length;
        dataSize[1] = data2.length;

        string memory description = "test submission";

        vm.prank(submitter1);
        klerosGovernor.submitList{value: submissionBaseDeposit + arbitrationCost}(
            targets,
            values,
            fullData,
            dataSize,
            description
        );

        uint256 listID = 1;

        vm.warp(block.timestamp + submissionTimeout + 1);
        vm.prank(other);
        klerosGovernor.executeSubmissions();

        vm.warp(block.timestamp + executionTimeout + 1);

        vm.expectRevert(bytes("Time to execute has passed"));
        vm.prank(other);
        klerosGovernor.executeTransactionList(listID, 0, 2); // ListID, cursor, count
    }

    function _computeListHash(
        address[] memory _target,
        uint256[] memory _value,
        bytes memory _data,
        uint256[] memory _dataSize
    ) internal pure returns (bytes32) {
        bytes32 listHash;
        bytes32 currentTxHash;
        uint256 readingPosition;
        for (uint256 i = 0; i < _target.length; i++) {
            bytes memory readData = new bytes(_dataSize[i]);
            for (uint256 j = 0; j < _dataSize[i]; j++) {
                readData[j] = _data[readingPosition + j];
            }
            readingPosition += _dataSize[i];
            currentTxHash = keccak256(abi.encodePacked(_target[i], _value[i], readData));
            listHash = keccak256(abi.encodePacked(currentTxHash, listHash));
        }
        return listHash;
    }
}
