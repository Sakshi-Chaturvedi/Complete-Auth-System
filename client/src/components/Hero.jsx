import { useContext } from "react";
import "../styles/Hero.css";
import heroImage from "../assets/img1.png";
import { Context } from "../main";

const Hero = () => {
  const { user } = useContext(Context);
  return (
    <>
      <div className="hero-section">
        <img src={heroImage} alt="hero-image" />
        <h4>Hello, {user ? user.name : "Everyone"}</h4>
        <h1>Welcome to My Full-Stack Authentication Application</h1>
        <p>
          A complete authentication system built using the MERN stack, featuring
          secure OTP verification through Twilio (phone) and Nodemailer (email).
          The system includes user registration, login, verification workflows,
          and a robust backend architecture designed for scalability and
          real-world application use.
        </p>
      </div>
    </>
  );
};

export default Hero;
