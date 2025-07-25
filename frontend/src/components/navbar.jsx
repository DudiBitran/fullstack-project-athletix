import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import "../style/navbar.css";
import Logo from "./common/logo";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useTrainerSearchFilter } from "../context/trainerSearchFilter.context";
function CustomNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { logout, user, profileImage } = useAuth();
  const navigate = useNavigate();
  const baseUrl = "http://localhost:3000";
  const navbarRef = useRef();
  const location = useLocation();
  const { search, setSearch } = useTrainerSearchFilter();

  // Only show search/filters for trainers on trainer dashboard pages
  const isTrainer = user?.role === "trainer";
  const isDashboardPage = location.pathname.startsWith("/trainer/my-programs") || location.pathname.startsWith("/trainer/my-exercises") || location.pathname.startsWith("/trainer/my-clients") || location.pathname.startsWith("/trainer/my-customers");
  const isProgramsPage = location.pathname.startsWith("/trainer/my-programs");
  const isExercisesPage = location.pathname.startsWith("/trainer/my-exercises");
  const isClientsPage = location.pathname.startsWith("/trainer/my-clients") || location.pathname.startsWith("/trainer/my-customers");
  const showTrainerFilters = isTrainer && (isProgramsPage || isExercisesPage || isClientsPage);

  // Dynamic placeholder
  let searchPlaceholder = "Search...";
  if (isProgramsPage) searchPlaceholder = "Search programs...";
  else if (isExercisesPage) searchPlaceholder = "Search exercises...";
  else if (isClientsPage) searchPlaceholder = "Search clients...";

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
                          ? (profileImage === "/public/defaults/trainer-icon.jpg" || profileImage === "public/defaults/trainer-icon.jpg"
                              ? "/trainer-icon.jpg"
                              : profileImage.startsWith("http")
                                ? profileImage
                                : `${baseUrl}/${profileImage.replace(/^\/+/,'')}`)
                          : "/default-avatar-profile.jpg"
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
                  {user?.role === "user" && (
                    <NavDropdown.Item as={NavLink} to="/dashboard" onClick={handleNavLinkClick}>
                      My Program
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
              {user && user.role === "user" && (
                <Nav.Link as={NavLink} to="/dashboard" onClick={handleNavLinkClick}>
                  Dashboard
                </Nav.Link>
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
              {user?.role === "admin" && (
                <Nav.Link as={NavLink} to="/admin" onClick={handleNavLinkClick}>
                  Admin Panel
                </Nav.Link>
              )}
            </Nav>
            {isTrainer && isDashboardPage && (
              <div className="d-none d-lg-flex align-items-center gap-2 ms-lg-4 mt-3 mt-lg-0" style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="styled-search-input"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <span className="styled-search-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" stroke="#aaa" strokeWidth="2"/><line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/></svg>
                </span>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
