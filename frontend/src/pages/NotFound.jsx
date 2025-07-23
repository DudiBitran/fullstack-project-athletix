import { Link } from "react-router";
import "../style/NotFound.css";

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-404">404</div>
      <h2 className="notfound-title">Page Not Found</h2>
      <p className="notfound-message">
        Oops! The page you are looking for doesn't exist or has been moved.<br />
        Try going back to the homepage.
      </p>
      <Link to="/" className="notfound-home-btn">
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound; 