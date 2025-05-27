import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../style/navbar.css";
import Logo from "./logo";
function CustomNavbar() {
  const [scrolled, setScrolled] = useState(false);

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
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          Athleti
          <Logo className="logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex justify-content-between w-100 align-items-center flex-column flex-lg-row">
            <Nav className="order-3 order-lg-3 mt-3 mt-lg-0 gap-3">
              <Nav.Link className="login-btn">Login</Nav.Link>
              <Nav.Link className="btn">Join Now!</Nav.Link>
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
                <NavDropdown.Item href="#profile">My Profile</NavDropdown.Item>
                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Nav className="order-2 order-lg-2 mx-auto nav-links-underlined">
              <Nav.Link href="#link1">Home</Nav.Link>
              <Nav.Link href="#link1">About</Nav.Link>
              <Nav.Link href="#link2">Contact</Nav.Link>
              <Nav.Link href="#link3">Programs</Nav.Link>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
