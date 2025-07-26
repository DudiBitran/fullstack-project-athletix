import "../style/homePage/homePage.css";
import "../style/homePage/banner.css";
import "../style/homePage/whoWeAre.css";
import "../style/homePage/fixed-section.css";
import "../style/homePage/ourProcess.css";
import "../style/homePage/faq.css";
import Slider from "react-slick";
import { Accordion } from "react-bootstrap";
import { FaDumbbell, FaExternalLinkAlt } from "react-icons/fa";
import { Link, Navigate } from "react-router";
import { useAuth } from "../context/auth.context";
const images = [
  "/images/banner4.jpg",
  "/images/lifter-banner.jpg",
  "/images/banner8.jpg",
  /* "/images/couple.jpg", */
];

function HomePage() {
  const { user } = useAuth();

  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
  };

  if (user) {
    // Redirect based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin" />;
    } else if (user.role === "trainer") {
      return <Navigate to="/trainer/my-programs" />;
    } else if (user.role === "user") {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return (
    <main className="main-background">
      <section className="banner-container">
        <div className="text-container">
          <h1>POWER, FIT, PERFORMANCE.</h1>
          <p>
            "Take your body to the next level with our personal trainers —
            tailored workout plans, expert nutrition guidance, and the
            motivation you need to achieve real, lasting results. Whether you're
            just starting out or pushing past plateaus, our certified coaches
            are here to support you every step of the way."
          </p>
          <Link to="/register">
            <button className="join-btn">Join Now!</button>
          </Link>
        </div>
        <div style={{ width: "100%", maxHeight: "950px", overflow: "hidden" }}>
          <Slider {...settings}>
            {images.map((src, i) => (
              <div key={i} className="slider-image-container">
                <img
                  src={src}
                  alt={`banner-${i}`}
                  className="fade-zoom-image"
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className="whoWeAre-container container">
        <div className="box1">
          <div className="box-content">
            <h3>Join Membership Now!</h3>
          </div>
          <Link to="/register">
            <div className="icon">
              <FaExternalLinkAlt size={24} />
            </div>
          </Link>
        </div>
        <div className="box2">
          <div className="icon">
            <img src="./images/icon-muscle.jpg" alt="trainer icon" />
          </div>
          <div className="box-content">
            <h3>Professional Trainers </h3>
            <p>Accredited professional ensuring safe and effective workouts.</p>
          </div>
        </div>
        <div className="box3">
          <div className="icon">
            <FaDumbbell size={50} />
          </div>
          <div className="box-content">
            <h3>User-Friendly App</h3>
            <p>Designed for a smooth, intuitive, and hassle-free experience.</p>
          </div>
        </div>
      </section>

      <section className="our-process-container">
        <div className="process-content">
          <h1></h1>
          <h2></h2>
          <h3></h3>
        </div>
      </section>

      <section className="couple-container">
        <div className="fixed-bg-section">
          <div className="overlay-text">
            <h1>JOIN WITH YOUR FRIENDS</h1>
            <h2>GET 1 + 1 DISCOUNT</h2>
            <p>
              Join with your friends and get a 1+1 discount — double the value
              for the same price! Bring someone along and enjoy this
              limited-time offer together — don’t miss out!
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section container">
        <div className="faq-content">
          <div>
            <h1>FAQS</h1>
            <h2>Your Path to Fitness Achievement</h2>
          </div>
          <Accordion defaultActiveKey="0" className="accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Would I need to commit to a long-term program?
              </Accordion.Header>
              <Accordion.Body>
                No, it depends on your goals. The only thing you need to commit
                to is the process.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                What kinds of workouts are best for losing weight?
              </Accordion.Header>
              <Accordion.Body>
                Incorporating both aerobic activities (like jogging, biking, or
                swimming) and resistance training works well for shedding
                pounds. Aim to burn more calories than you consume by following
                a well-rounded exercise plan alongside nutritious eating habits.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                How soon can I expect to see results from regular gym workouts?
              </Accordion.Header>
              <Accordion.Body>
                The time frame varies based on factors such as dedication,
                consistency, and individual differences. Typically, you might
                begin to notice increased strength and better energy levels
                within several weeks. However, visible changes in your physique
                often take longer, usually around 8 to 12 weeks or more.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>
                How do I stay motivated to go to the gym?
              </Accordion.Header>
              <Accordion.Body>
                Staying motivated can be challenging, but having support makes a
                big difference. Our coaching Escort in AthletiX is designed to
                keep you accountable and inspired throughout your fitness
                journey. With personalized guidance, progress tracking, and
                regular encouragement, Escort helps you stay on track and reach
                your goals — making the gym feel less like a chore and more like
                a positive habit.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        <div className="img-container">
          <img src="/images/banner2.jpg" alt="" className="faq-img" />
        </div>
      </section>
    </main>
  );
}

export default HomePage;
