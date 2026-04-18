import { Routes, Route } from "react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";



const App = () => {
  return (
    <>
      {/* <div className="bg-white pb-6 sm:pb-8 lg:pb-12"> */}
      <Navbar />

      {/* </div> */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer />
    </>

  )
}
export default App;