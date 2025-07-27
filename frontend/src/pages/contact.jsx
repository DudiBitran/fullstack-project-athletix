import "../style/contact.css";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function Contact() {
  return (
    <main className="contact-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-background">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">Contact Us</h1>
              <p className="hero-subtitle">Get in touch with our team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-12 mb-4">
              <div className="info-card">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>Our Location</h3>
                <p>123 Main Street<br />San Francisco, CA 94105</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-4">
              <div className="info-card">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <h3>Phone Number</h3>
                <p>+1 (234) 567-8900<br />+1 (234) 567-8901</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-4">
              <div className="info-card">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <h3>Email Address</h3>
                <p>info@athletix.com<br />support@athletix.com</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-4">
              <div className="info-card">
                <div className="info-icon">
                  <FaClock />
                </div>
                <h3>Working Hours</h3>
                <p>Mon - Fri: 9AM - 6PM<br />Sat: 10AM - 4PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <div className="map-card">
                <h3>Find Us</h3>
                <div className="map-container">
                  <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0198995631943!2d-122.42177868468068!3d37.77492977975908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c5d4e62d3%3A0x3ff53e4d4d2f5b61!2s123%20Main%20St%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                    width="100%"
                    height="400"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="social-links">
                  <h4>Follow Us</h4>
                  <div className="social-icons">
                    <a href="#" className="social-icon">
                      <FaFacebookF />
                    </a>
                    <a href="#" className="social-icon">
                      <FaTwitter />
                    </a>
                    <a href="#" className="social-icon">
                      <FaInstagram />
                    </a>
                    <a href="#" className="social-icon">
                      <FaLinkedinIn />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
