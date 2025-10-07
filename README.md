# Mini ATM System
This project provides a minimalist backend API for a core banking application, built with Node.js, Express.js, and MongoDB. The system's primary function is to facilitate secure account management and funds transfers between users. The design emphasizes data integrity and transactional safety, leveraging Mongoose as the Object Data Modeling (ODM) library to interact with the MongoDB database.

## Live Demo: https://mini-atm-r9hy.onrender.com

## Tech Stack
### Frontend: ReactJS
### Backend: NodeJS + ExpressJS
### Database: MongoDB

### Deployment
- **Frontend:** Render
- **Backend:** Render
- **Database:** MongoDB Atlas

## Project Structure

```
Todo-list/
├── backend/                     # Node.js backend API
│   ├── controllers/             # Handles the business logic for routes
│   │   └── account.controller.js
│   ├── middleware/             # Custom middleware for auth
│   │   └── requireAuth.js
│   ├── models/                 # Mongoose models
│   │   └── account.model.js
│   │   └── transaction.model.js
│   ├── routes/                 # API routes
│   │   └── account.route.js
│   ├── index.js                # Server entry point
│   └── package.json
├── frontend/                   # React frontend application
│   ├── src/   
│   │   ├── components/  
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/                
│   │   ├── services/
│   │   │   └── api.js        # Axios configuration
│   │   ├── App.css          
│   │   ├── App.jsx           # Main App component
│   │   ├── index.css         
│   │   └── main.jsx          # Entry point
│   ├── public/   
│   └── package.json
└── README.md
```
## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Triszz/Mini-ATM.git
cd Mini-ATM
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create a .env file in the root directory
# and add your environment variables based on .env.example
# Example:
# MONGODB_URI=your-mongodb-connection-string
# PORT=8080
# JWT_SECRET=your-secret-key

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start development server
npm run dev
```

### 4. Open Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/signup` | Create a new user account |
| `POST` | `/api/auth/login` | 	Authenticate user and get a JWT token |
| `GET` | `/api/` | Get current user's account infomation |
| `POST` | `/api/withdraw` | Withdrawal |
| `POST` | `/api/deposit` | Deposit |
| `POST` | `/api/transfer` | Transfer funds to another account |
| `GET` | `/api/history` | Get the transaction history for the user |

### Example API Usage

**Transfer Funds:**
```bash
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [your_jwt_token]" \
  -d '{
        "receiverAccountNumber": "123456789",
        "amount": 100,
        "content": "ABC transfer",
        "pin": "1234"
      }'

```
## Core Features:
- **Account Management**: Defines a robust Account model to store critical user information, including account numbers and real-time balances.
- **Secure Fund Transfers**: Implements a secure method for transferring funds between accounts. The process incorporates a strict validation pipeline:
  + **PIN Authentication**: Requires sender PIN verification before initiating any transaction.
  + **Recipient Validation**: Ensures the beneficiary account exists within the system.
  + **Balance Verification**: Confirms the sender has sufficient funds to complete the transfer.

This project is open source and available under the [MIT License](LICENSE).

## Author

**Trần Thanh Trí**
- GitHub: [Triszz](https://github.com/Triszz)
- LinkedIn: [Trí Trần Thanh](https://linkedin.com/in/trí-trần-thanh-199526363)

***
