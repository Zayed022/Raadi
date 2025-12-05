import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    const userData = {
      name: decoded.name,
      email: decoded.email,
      googleId: decoded.sub,
      avatar: decoded.picture,
    };

    try {
      const res = await axios.post(
        "https://raadi.onrender.com/api/v1/users/google-login",
        userData,
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#f3e1cb] via-[#fdfaf4] to-[#f6d9ab]">
      <div
        data-aos="zoom-in"
        className="bg-white w-[90%] max-w-lg py-12 px-10 rounded-3xl shadow-2xl border border-gray-200 flex flex-col items-center space-y-10"
      >
        <h1 className="text-5xl font-extrabold text-[#1b2945] text-center">
          Welcome to <span className="text-orange-500">RAADI</span>
        </h1>

        <p className="text-gray-600 text-center text-lg max-w-sm">
          Premium online marketplace for luxury fragrances
        </p>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Login Failed")}
          width="350px"
        />

        <p className="text-sm text-gray-500 text-center">
          By continuing, you agree to our <span className="text-orange-500">Terms</span> &{" "}
          <span className="text-orange-500">Privacy Policy</span>
        </p>
      </div>
    </section>
  );
}
