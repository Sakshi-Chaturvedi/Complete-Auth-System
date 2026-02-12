import "../styles/Instructor.css";
import instructorImage from "../assets/profile.jpeg";

const Instructor = () => {
  return (
    <div className="instructor-page">
      <div className="instructor-card">
        <div className="instructor-image">
          <img src={instructorImage} alt="Instructor" />
        </div>
        <div className="instructor-info">
          <h1>Sakshi Chaturvedi</h1>
          <h4>Full-Stack Developer</h4>
          <p>
            Hello! I'm Sakshi Chaturvedi, a passionate MERN Stack Developer
            driven by curiosity and a strong desire to build scalable,
            high-performance web applications. With hands-on experience in
            JavaScript, React, Node.js, Express, and MongoDB, I enjoy developing
            secure backend systems and intuitive, responsive user interfaces. I
            believe in continuous learning and consistently sharpening my
            problem-solving skills while building real-world projects. My goal
            is to create impactful digital solutions and grow as a developer
            through innovation, consistency, and clean code practices.
          </p>
          <div className="social-links">
            <a
              href="https://github.com/Sakshi-Chaturvedi"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/sakshi-chaturvedi-ba6596258/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/sakshiOlogn"
              target="_blank"
              rel="noopener noreferrer"
            >
              X.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
