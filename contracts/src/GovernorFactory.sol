// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {IArbitratorV2} from "@kleros/kleros-v2-contracts/arbitration/interfaces/IArbitrableV2.sol";
import {
    IDisputeTemplateRegistry
} from "@kleros/kleros-v2-contracts/arbitration/interfaces/IDisputeTemplateRegistry.sol";
import {KlerosGovernor} from "./KlerosGovernor.sol";

/// @title GovernorFactory
/// This contract acts as a registry for KlerosGovernor instances.
contract GovernorFactory {
    // ************************************* //
    // *              Events               * //
    // ************************************* //

    /// @dev Emitted when a new Governor contract is deployed using this factory.
    /// @param _address The address of the newly deployed Governor contract.
    event NewGovernor(KlerosGovernor indexed _address);

    // ************************************* //
    // *             Storage               * //
    // ************************************* //

    KlerosGovernor[] public instances;

    // ************************************* //
    // *         State Modifiers           * //
    // ************************************* //

    /// @dev Deploy the arbitrable kleros.
    /// @param _arbitrator The arbitrator of the contract.
    /// @param _arbitratorExtraData Extra data for the arbitrator.
    /// @param _templateRegistry  Dispute Template registry address
    /// @param _templateData The dispute template data.
    /// @param _templateDataMappings The dispute template data mappings.
    /// @param _submissionBaseDeposit The base deposit required for submission.
    /// @param _submissionTimeout Time in seconds allocated for submitting transaction list.
    /// @param _executionTimeout Time in seconds after approval that allows to execute transactions of the approved list.
    /// @param _withdrawTimeout Time in seconds after submission that allows to withdraw submitted list.
    /// @param _wNative The wrapped native token address, typically wETH.
    function deploy(
        IArbitratorV2 _arbitrator,
        bytes memory _arbitratorExtraData,
        IDisputeTemplateRegistry _templateRegistry,
        string memory _templateData,
        string memory _templateDataMappings,
        uint256 _submissionBaseDeposit,
        uint256 _submissionTimeout,
        uint256 _executionTimeout,
        uint256 _withdrawTimeout,
        address _wNative
    ) public {
        KlerosGovernor instance = new KlerosGovernor(
            _arbitrator,
            _arbitratorExtraData,
            _templateRegistry,
            _templateData,
            _templateDataMappings,
            _submissionBaseDeposit,
            _submissionTimeout,
            _executionTimeout,
            _withdrawTimeout,
            _wNative
        );
        instances.push(instance);
        emit NewGovernor(instance);
    }
}
