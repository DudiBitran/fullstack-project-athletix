import { Route, Routes } from "react-router";
import "./App.css";
import CustomNavbar from "./components/navbar";
import HomePage from "./pages/homePage";
import Footer from "./components/footer";
import Login from "./pages/login";
import Register from "./pages/register";
import Contact from "./pages/contact";
import About from "./pages/about";
import UserMainDash from "./pages/userDashboard/userMainDash";
function App() {
  return (
    <div className="app-layout">
      <header>
        <CustomNavbar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<UserMainDash />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
