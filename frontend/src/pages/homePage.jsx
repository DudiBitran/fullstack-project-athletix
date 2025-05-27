import Slider from "react-slick";
import "../style/homepage.css";

const images = [
  "/images/banner4.jpg",
  "/images/lifter-banner.jpg",
  "/images/banner5.jpg",
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
    <main>
      <section className="banner-container">
        <div className="text-container">
          <h1>STRONG, FIT, UNSTOPPABLE.</h1>
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
    </main>
  );
};

export default HomePage;
