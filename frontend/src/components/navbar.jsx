import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import "../style/navbar.css";
import Logo from "./common/logo";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";
function CustomNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { logout, user, profileImage } = useAuth();
  const navigate = useNavigate();
  const baseUrl = "http://localhost:3000";
  const navbarRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutUser = () => {
    logout();
    navigate("/login");
    return;
  };

  // Collapse navbar on link click (for mobile)
  const handleNavLinkClick = () => {
    const nav = document.getElementById("basic-navbar-nav");
    if (nav && nav.classList.contains("show")) {
      nav.classList.remove("show");
    }
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      fixed="top"
      className={`custom-navbar ${scrolled ? "scrolled" : ""}`}
      ref={navbarRef}
    >
      <Container>
        <Navbar.Brand className="d-flex align-items-center">
          Athleti
          <Logo className="logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex justify-content-between w-100 align-items-center flex-column flex-lg-row">
            <Nav className="order-3 order-lg-3 mt-3 mt-lg-0 gap-3">
              {!user && (
                <Nav.Link as={Link} to="/login" className="navbar-login-btn" onClick={handleNavLinkClick}>
                  Login
                </Nav.Link>
              )}
              {!user && (
                <Nav.Link as={Link} to="/register" className="btn" onClick={handleNavLinkClick}>
                  Join Now!
                </Nav.Link>
              )}
              {user && (
                <NavDropdown
                  title={
                    <Image
                      src={
                        profileImage
                          ? `${baseUrl}/${profileImage.replace(/^\/+/, "")}`
                          : `${baseUrl}/public/defaults/trainer-icon.jpg`
                      }
                      roundedCircle
                      width="35"
                      height="35"
                      alt="Profile"
                    />
                  }
                  id="profile-dropdown"
                  align="end"
                >
                  {user?.role === "trainer" && (
                    <NavDropdown.Item as={NavLink} to="/trainer/create-program" onClick={handleNavLinkClick}>
                      Create a program
                    </NavDropdown.Item>
                  )}
                  {user?.role === "trainer" && (
                    <NavDropdown.Item
                      as={NavLink}
                      to="/trainer/create-exercise"
                      onClick={handleNavLinkClick}
                    >
                      Create a exercise
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item as={NavLink} to="/profile-settings" onClick={handleNavLinkClick}>Profile Settings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => { handleNavLinkClick(); logoutUser(); }}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>

            <Nav className="order-2 order-lg-2 mx-auto nav-links-underlined">
              {!user && (
                <>
                  <Nav.Link as={NavLink} to="/" onClick={handleNavLinkClick}>
                    Home
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/about" onClick={handleNavLinkClick}>
                    About
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/contact" onClick={handleNavLinkClick}>
                    Contact
                  </Nav.Link>
                </>
              )}
              {user?.role === "trainer" && (
                <Nav.Link as={NavLink} to="/trainer/my-programs" onClick={handleNavLinkClick}>
                  My Programs
                </Nav.Link>
              )}
              {user?.role === "trainer" && (
                <Nav.Link as={NavLink} to="/trainer/my-exercises" onClick={handleNavLinkClick}>
                  My exercises
                </Nav.Link>
              )}
              {user?.role === "trainer" && (
                <Nav.Link as={NavLink} to="/trainer/my-customers" onClick={handleNavLinkClick}>
                  My clients
                </Nav.Link>
              )}
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
