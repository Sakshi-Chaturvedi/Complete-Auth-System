
import "../styles/Footer.css";
import { Link } from "react-router-dom";

import yt from "../assets/yt.png";
import git from "../assets/git.png";
import linkedin from "../assets/linkedin.png";
import x from "../assets/x.png"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>MERN Authentication</h2>
          
        </div>
        <div className="footer-social">
          <h3>Follow Me</h3>
          <div className="social-icons">
            <Link
              to="https://x.com/sakshiOlogn"
              target="_blank"
              className="social-link"
            >
              <img src={x} alt="Twitter" />
            </Link>
            
            
            <Link
              to="https://www.linkedin.com/in/sakshi-chaturvedi-ba6596258/"
              target="_blank"
              className="social-link"
            >
              <img src={linkedin} alt="LinkedIn" />
            </Link>
            <Link
              to="https://github.com/Sakshi-Chaturvedi"
              target="_blank"
              className="social-link"
            >
              <img src={git} alt="GitHub" />
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 MERN Authentication. All Rights Reserved.</p>
        <p>Designed by Sakshi Chaturvedi</p>
      </div>
    </footer>
  );
};

export default Footer;
