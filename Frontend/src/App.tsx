import { Routes, Route } from "react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";


const App = () => {
  return (
    <>
      {/* <div className="bg-white pb-6 sm:pb-8 lg:pb-12"> */}
        <Navbar />
      
      {/* </div> */}
      <Routes>
       <Route path="/" element={<Index/>}/>
       <Route path="/product" element={<Product/>}/>
       <Route path="/cart" element={<Cart/>}/>
        <Route path="/login" element={<Login/>}/>
         <Route path="/signup" element={<SignUp/>}/>
      </Routes>
     
      <Footer />
    </>

  )
}
export default App;