import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../style/navbar.css";
import Logo from "./common/logo";
import { Link, NavLink } from "react-router";
import { useAuth } from "../context/auth.context";
function CustomNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const {logout} = useAuth()
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      variant="dark"
      fixed="top"
      className={`custom-navbar ${scrolled ? "scrolled" : ""}`}
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
              <Nav.Link as={Link} to="/login" className="navbar-login-btn">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="btn">
                Join Now!
              </Nav.Link>
              <NavDropdown
                title={
                  <Image
                    src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                    roundedCircle
                    width="35"
                    height="35"
                    alt="Profile"
                  />
                }
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item>My Profile</NavDropdown.Item>
                <NavDropdown.Item>Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Nav className="order-2 order-lg-2 mx-auto nav-links-underlined">
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact">
                Contact
              </Nav.Link>
              <Nav.Link as={NavLink} to="/programs">
                Programs
              </Nav.Link>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
