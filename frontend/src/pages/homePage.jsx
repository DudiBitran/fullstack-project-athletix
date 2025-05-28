import Slider from "react-slick";
import "../style/homePage/banner.css";
import "../style/homePage/whoWeAre.css";
import "../style/homePage/fixed-section.css";
import { FaDumbbell, FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router";
const images = [
  "/images/banner4.jpg",
  "/images/lifter-banner.jpg",
  "/images/banner8.jpg",
  /* "/images/couple.jpg", */
];

const HomePage = () => {
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
          <button className="join-btn">Join Now!</button>
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
          <Link>
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
      <section className="couple-container">
        <div className="fixed-bg-section">
          <div className="overlay-text">
            <h1>JOIN WITH YOUR FRIENDS</h1>
            <h2>GET 1 + 1 DISCOUNT</h2>
            <p>
              Join with your friends and get a 1 + 1 discount! Bring someone
              along and enjoy double the value for the same price. Don't miss
              out on this special offer – it's the perfect time to share the
              experience and save together.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
