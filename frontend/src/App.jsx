import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import CustomerList from "./components/CustomerListPage/CustomerList.jsx";
import CustomerTransactions from "./components/TransactionEntry/TransactionEntry.jsx";
import LoginSignup from "./components/LoginSignup/LoginSignup.jsx"; // optional now
import "./App.css";

export default function App() {
  return (
    <div className="bg-[#2C3947] text-white min-h-screen">
      <BrowserRouter>
        <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/:id/transactions" element={<CustomerTransactions />} />

        {/* Optional: keep or remove */}
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}