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
import CreateProgram from "./pages/trainerDashboard/createProgram";
import MyCustomers from "./pages/trainerDashboard/myCustomers";
import MyPrograms from "./pages/trainerDashboard/myPrograms";
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
          <Route path="/trainer/create-program" element={<CreateProgram />} />
          <Route path="/trainer/my-customers" element={<MyCustomers />} />
          <Route path="/trainer/my-programs" element={<MyPrograms />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
