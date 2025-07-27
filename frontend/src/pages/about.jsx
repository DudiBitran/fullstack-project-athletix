import "../style/about.css";

function About() {
  return (
    <main className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">About Us</h1>
              <p className="hero-subtitle">Discover our journey and mission</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title">OUR STORY</h2>
              <div className="story-content">
                <p className="story-intro">
                  AthletiX was born from a simple idea: to make professional fitness
                  tools accessible to everyone. We combined our love for fitness and
                  technology to create a platform that empowers both trainers and
                  athletes.
                </p>
                <p className="story-details">
                  From the beginning, our goal has been to revolutionize how people
                  train, track progress, and stay motivated. We saw the challenges
                  faced by personal trainers juggling multiple clients, and by
                  individuals struggling to stay on course with their fitness goals.
                  AthletiX brings everything into one place — smart scheduling,
                  personalized workout plans, performance analytics, and real-time
                  communication. Whether you're a beginner or a seasoned athlete,
                  the platform adapts to your journey, offering support every step
                  of the way. With a clean interface and powerful features, AthletiX
                  isn't just about workouts — it's about building long-term habits,
                  staying consistent, and achieving your full potential through
                  clarity, structure, and motivation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/images/about-icon1.png" alt="Open Door Policy" />
                </div>
                <div className="feature-content">
                  <h3>OPEN DOOR POLICY</h3>
                  <p>
                    AthletiX promotes an open and inclusive environment where
                    everyone can freely access support and services. This policy
                    encourages transparency and easy communication between trainers
                    and users.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/images/about-icon2.png" alt="Fully Insured" />
                </div>
                <div className="feature-content">
                  <h3>FULLY INSURED</h3>
                  <p>
                    All trainers and services on AthletiX are fully insured to
                    ensure safety and peace of mind. This coverage protects both
                    trainers and clients throughout the training process.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/images/about-icon3.png" alt="Personal Trainer" />
                </div>
                <div className="feature-content">
                  <h3>PERSONAL TRAINER</h3>
                  <p>
                    AthletiX connects users with certified personal trainers
                    tailored to their fitness goals. Trainers provide personalized
                    coaching and guidance to maximize results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
