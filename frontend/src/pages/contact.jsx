import "../style/contact.css";

function Contact() {
  return (
    <main className="contact-container">
      <section className="contact">
        <div className="fixed-bg-section">
          <div className="overlay-text">
            <h1>Contact Us</h1>
          </div>
        </div>
      </section>
      <div className="contact-wrapper">
        <div className="contact-card">
          <div className="contact-left">
            <h1>Get in Touch</h1>
            <p className="subtitle">We’d love to hear from you</p>

            <div className="info">
              <div>
                <h3>Name</h3>
                <p>John Doe</p>
              </div>
              <div>
                <h3>Email</h3>
                <p>johndoe@example.com</p>
              </div>
              <div>
                <h3>Phone</h3>
                <p>+1 234 567 890</p>
              </div>
              <div>
                <h3>Address</h3>
                <p>123 Main Street, San Francisco, CA</p>
              </div>
            </div>
          </div>

          <div className="contact-right">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0198995631943!2d-122.42177868468068!3d37.77492977975908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c5d4e62d3%3A0x3ff53e4d4d2f5b61!2s123%20Main%20St%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
