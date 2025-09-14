// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./YIDUser.sol";

/**
 * @title YIDFactory
 * @notice Simple factory for deploying user contracts
 */
contract YIDFactory is Ownable {

    /**
     * @notice Initialize the YID Factory
     */
    constructor() Ownable(msg.sender) {}
    
    // Mapping from user address to their contract address
    mapping(address => address) public userContracts;
    
    // Array of all deployed contracts
    address[] public allContracts;
    
    // Total number of contracts deployed
    uint256 public totalContracts;
    
    // Events
    event UserContractDeployed(address indexed user, address indexed contractAddress, string name);
    
    /**
     * @notice Deploy a new user contract
     * @param _name User's name
     * @param _email User's email
     * @return contractAddress The address of the deployed contract
     */
    function deployUserContract(string memory _name, string memory _email) external returns (address contractAddress) {
        require(userContracts[msg.sender] == address(0), "User already has a contract");
        
        // Deploy new user contract
        YIDUser newUser = new YIDUser(_name, _email);
        contractAddress = address(newUser);
        
        // Update mappings
        userContracts[msg.sender] = contractAddress;
        allContracts.push(contractAddress);
        totalContracts++;
        
        emit UserContractDeployed(msg.sender, contractAddress, _name);
    }
    
    /**
     * @notice Get user's contract address
     * @param _user User's address
     * @return contractAddress The user's contract address
     */
    function getUserContract(address _user) external view returns (address contractAddress) {
        return userContracts[_user];
    }
    
    /**
     * @notice Check if user has a contract
     * @param _user User's address
     * @return hasContract Whether user has a contract
     */
    function hasUserContract(address _user) external view returns (bool hasContract) {
        return userContracts[_user] != address(0);
    }
    
    /**
     * @notice Get all contract addresses
     * @return contracts Array of all contract addresses
     */
    function getAllContracts() external view returns (address[] memory contracts) {
        return allContracts;
    }
    
    /**
     * @notice Get contract count
     * @return count Total number of contracts
     */
    function getContractCount() external view returns (uint256 count) {
        return totalContracts;
    }
}
