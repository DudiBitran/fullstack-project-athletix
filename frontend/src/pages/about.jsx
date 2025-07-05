import "../style/about.css";

function About() {
  return (
    <main className="about-container">
      <section className="about">
        <div className="fixed-bg-section">
          <div className="overlay-text">
            <h1>About Us</h1>
          </div>
        </div>
      </section>
      <section className="our-story-container container">
        <h1>OUR STORY</h1>
        <div>
          <div className="our-story">
            <p className="bigger-p">
              AthletiX was born from a simple idea: to make professional fitness
              tools accessible to everyone. We combined our love for fitness and
              technology to create a platform that empowers both trainers and
              athletes.
            </p>
            <p>
              From the beginning, our goal has been to revolutionize how people
              train, track progress, and stay motivated. We saw the challenges
              faced by personal trainers juggling multiple clients, and by
              individuals struggling to stay on course with their fitness goals.
              AthletiX brings everything into one place — smart scheduling,
              personalized workout plans, performance analytics, and real-time
              communication. Whether you're a beginner or a seasoned athlete,
              the platform adapts to your journey, offering support every step
              of the way. With a clean interface and powerful features, AthletiX
              isn’t just about workouts — it's about building long-term habits,
              staying consistent, and achieving your full potential through
              clarity, structure, and motivation.
            </p>
          </div>
          <div className="box1">
            <div className="box1-context">
              <h2>OPEN DOOR POLICY</h2>
              <p>
                AthletiX promotes an open and inclusive environment where
                everyone can freely access support and services. This policy
                encourages transparency and easy communication between trainers
                and users.
              </p>
            </div>
            <div className="about-icon">
              <img src="/images/about-icon1.png" alt="about-icon" />
            </div>
          </div>
          <div className="box2">
            <div className="box2-context">
              <h2>FULLY INSURED</h2>
              <p>
                All trainers and services on AthletiX are fully insured to
                ensure safety and peace of mind. This coverage protects both
                trainers and clients throughout the training process.
              </p>
            </div>
            <div className="about-icon">
              <img src="/images/about-icon2.png" alt="about-icon" />
            </div>
          </div>
          <div className="box3">
            <div className="box3-context">
              <h2>PERSONAL TRAINER</h2>
              <p>
                AthletiX connects users with certified personal trainers
                tailored to their fitness goals. Trainers provide personalized
                coaching and guidance to maximize results.
              </p>
            </div>
            <div className="about-icon">
              <img src="/images/about-icon3.png" alt="about-icon" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
