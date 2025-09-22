import { BrowserRouter, Route, Routes, Links } from "react-router";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
