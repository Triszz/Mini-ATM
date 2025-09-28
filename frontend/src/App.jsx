import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { useAuthContext } from "./hooks/useAuthContext";
// pages & component
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TransactionHistory from "./pages/TransactionHistory";
import Withdraw from "./pages/Withdraw";
import Deposit from "./pages/Deposit";
import Transfer from "./pages/Transfer";
import "./App.css";

function App() {
  const { user, isInitialized } = useAuthContext();
  if (!isInitialized) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/history"
              element={user ? <TransactionHistory /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/withdraw"
              element={user ? <Withdraw /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/deposit"
              element={user ? <Deposit /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/transfer"
              element={user ? <Transfer /> : <Navigate to="/login" />}
            ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
