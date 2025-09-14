// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title YIDUser
 * @notice Basic user identity contract
 */
contract YIDUser is Ownable {
    
    // User data
    string public name;
    string public email;
    bool public isActive;
    uint256 public createdAt;
    
    // Events
    event UserUpdated(string name, string email);
    event UserDeactivated();
    
    /**
     * @notice Initialize the user contract
     * @param _name User's name
     * @param _email User's email
     */
    constructor(string memory _name, string memory _email) Ownable(msg.sender) {
        name = _name;
        email = _email;
        isActive = true;
        createdAt = block.timestamp;
    }
    
    /**
     * @notice Update user information
     * @param _name New name
     * @param _email New email
     */
    function updateUser(string memory _name, string memory _email) external onlyOwner {
        name = _name;
        email = _email;
        emit UserUpdated(_name, _email);
    }
    
    /**
     * @notice Deactivate user account
     */
    function deactivate() external onlyOwner {
        isActive = false;
        emit UserDeactivated();
    }
    
    /**
     * @notice Get user information
     * @return _name User's name
     * @return _email User's email
     * @return _isActive Whether user is active
     * @return _createdAt When user was created
     */
    function getUserInfo() external view returns (
        string memory _name,
        string memory _email,
        bool _isActive,
        uint256 _createdAt
    ) {
        return (name, email, isActive, createdAt);
    }
}
