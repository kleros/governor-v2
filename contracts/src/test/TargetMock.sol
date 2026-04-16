// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TargetMock {
    bool public flag;
    uint256 public stored;

    function triggerFlag() external payable {
        require(msg.value == 0.01 ether, "Wrong value");
        flag = true;
    }

    function setValue(uint256 _value) external {
        // Use the increment to check that the tx is not executed twice.
        stored += _value;
    }
}
