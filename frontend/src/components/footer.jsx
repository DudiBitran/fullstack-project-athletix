import "../style/footer.css";
import Logo from "./common/logo";
import {
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaPrint,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer text-center text-lg-start text-white">
      <div className="container p-4 pb-0">
        <section>
          <div className="row">
            {/* Company Info */}
            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3 d-flex align-items-center justify-content-center logo-text">
              <h6 className="mb-4">Athleti</h6>
              <Logo className="footer-logo" />
            </div>

            <hr className="w-100 clearfix d-md-none" />

            {/* Products */}
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">Products</h6>
              <p>
                <a href="#!" className="text-white">
                  MDBootstrap
                </a>
              </p>
              <p>
                <a href="#!" className="text-white">
                  MDWordPress
                </a>
              </p>
              <p>
                <a href="#!" className="text-white">
                  BrandFlow
                </a>
              </p>
              <p>
                <a href="#!" className="text-white">
                  Bootstrap Angular
                </a>
              </p>
            </div>

            <hr className="w-100 clearfix d-md-none" />

            {/* Contact */}
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mx-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
              <p>
                <FaHome className="me-2" /> New York, NY 10012, US
              </p>
              <p>
                <FaEnvelope className="me-2" /> info@gmail.com
              </p>
              <p>
                <FaPhone className="me-2" /> +01 234 567 88
              </p>
              <p>
                <FaPrint className="me-2" /> +01 234 567 89
              </p>
            </div>

            {/* Social Media */}
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto my-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">
                Follow us
              </h6>
              <a
                className="btn btn-primary btn-floating facebook"
                href="#!"
                role="button"
              >
                <FaFacebookF />
              </a>
              <a
                className="btn btn-primary btn-floating twitter"
                href="#!"
                role="button"
              >
                <FaTwitter />
              </a>
              <a
                className="btn btn-primary btn-floating google"
                href="#!"
                role="button"
              >
                <FaGoogle />
              </a>
              <a
                className="btn btn-primary btn-floating instagram"
                href="#!"
                role="button"
              >
                <FaInstagram />
              </a>
              <a
                className="btn btn-primary btn-floating linkedin"
                href="#!"
                role="button"
              >
                <FaLinkedinIn />
              </a>
              <a
                className="btn btn-primary btn-floating github"
                href="#!"
                role="button"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </section>
      </div>

      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © {new Date().getFullYear()} Copyright:{" "}
        <span className="">
          Athleti
          <Logo className="logo" />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
