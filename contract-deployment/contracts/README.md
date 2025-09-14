# YID Contracts

## Overview
Simple, basic user management contracts for YID (Your Identity) system.

## Contracts

### YIDUser.sol
- Basic user identity contract
- Stores user name, email, and active status
- Owner can update information and deactivate account
- Simple and straightforward implementation

### YIDFactory.sol
- Factory contract for deploying user contracts
- Tracks all deployed user contracts
- Simple deployment and lookup functions
- No complex features, just basic functionality

## Features
- ✅ Basic user management
- ✅ Simple deployment
- ✅ Clean, readable code
- ✅ No complex dependencies
- ✅ Easy to understand and maintain

## Deployment
Use the `deploy-yid.ts` script to deploy the YIDFactory contract.

## Usage
1. Deploy YIDFactory
2. Users call `deployUserContract(name, email)` to create their identity
3. Users can update their information through their contract
4. Factory tracks all deployed contracts

This is a simplified version focused on basic functionality without complex features.
