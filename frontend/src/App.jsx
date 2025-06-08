import { Route, Routes } from "react-router";
import "./App.css";
import CustomNavbar from "./components/navbar";
import HomePage from "./pages/homePage";
import Footer from "./components/footer";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <div className="app-layout">
      <header>
        <CustomNavbar />
      </header>

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
