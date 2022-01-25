// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Login {

    // Private variables
    // slot 0 - One bytes 32 variable would occupy 1 slot
    // because bytes32 variable has 256 bits(32*8)
    // which is the size of 1 slot
    bytes32 private username;
    // slot 1
    bytes32 private password;
    
    constructor(bytes32  _username, bytes32  _password) {
        username = _username;
        password = _password;
    }
}