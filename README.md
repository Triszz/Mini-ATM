# Mini ATM System
This project provides a minimalist backend API for a core banking application, built with Node.js, Express.js, and MongoDB. The system's primary function is to facilitate secure account management and funds transfers between users. The design emphasizes data integrity and transactional safety, leveraging Mongoose as the Object Data Modeling (ODM) library to interact with the MongoDB database.

## Live Demo: https://mini-atm-r9hy.onrender.com

## Tech Stack
### Frontend: ReactJS
### Backend: NodeJS + ExpressJS
### Database: MongoDB

## Core Features:
- **Account Management**: Defines a robust Account model to store critical user information, including account numbers and real-time balances.
- **Secure Fund Transfers**: Implements a secure method for transferring funds between accounts. The process incorporates a strict validation pipeline:
  + **PIN Authentication**: Requires sender PIN verification before initiating any transaction.
  + **Recipient Validation**: Ensures the beneficiary account exists within the system.
  + **Balance Verification**: Confirms the sender has sufficient funds to complete the transfer.
