import { useState } from "react";
import { FaCheckDouble, FaEye, FaEyeSlash } from "react-icons/fa";
import "./auth.css"; // Ensure this points to your CSS file
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserState } from "../../context/UserContext";
import NdrfLogo from "../../assets/ndrf_logo.svg";
import AuthLogo from "../../assets/login_logo.svg";
import { Spinner } from "react-bootstrap"; // Import Bootstrap components
import Footer from "../../components/footer/Footer";
import { useTranslation } from "react-i18next";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasValidLength, setHasValidLength] = useState(false); // State for length check
  const navigate = useNavigate();
  const { setUser } = UserState();
  const { t } = useTranslation();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setHasUpperCase(/[A-Z]/.test(newPassword));
    setHasLowerCase(/[a-z]/.test(newPassword));
    setHasNumber(/\d/.test(newPassword));
    setHasSpecialChar(/[!@#$%^&*]/.test(newPassword));
    setHasValidLength(newPassword.length >= 8);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling) element.nextSibling.focus();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOtpSend = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email or password field is not filled");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/user/register", {
        email,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setOtpSent(true);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (!otpValue || otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    const userData = {
      email,
      otp: otpValue,
      password,
    };
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.post(
        "/api/v1/user/verifyotp",
        userData,
        config
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        localStorage.setItem(
          "xxxxxxuserxxxxxx",
          JSON.stringify(response.data.createdUser)
        );
        localStorage.setItem(
          "xxxxxxxxxxtokenxxxxxxxxxx",
          response.data.accessToken
        );
        setUser(response.data.createdUser);
        navigate("/dashboard/analytics");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to verify OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <header className="authHeader">
        <img src={NdrfLogo} alt="ndrflogo.svg" className="authHeaderImg" />
      </header>
      <div className="AuthContentContainer">
        <div className="logoImg">
          <img src={AuthLogo} alt="authlogo.svg" />
        </div>
        <div className="form-container">
          <h2>{t("register")}</h2>
          {!otpSent ? (
            <>
              <input
                type="text"
                placeholder={t("enter_email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password")}
                  value={password}
                  onChange={handlePasswordChange}
                  className="input-field"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="toggle-password-icon"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <p className="forgot_password">{t("forgot_pass")}</p>
              {password.length > 0 && (
                <div className="password-conditions">
                  <small
                    className={hasValidLength ? "valid-text" : "invalid-text"}
                  >
                    <FaCheckDouble /> {t("char_8")}
                  </small>
                  <small
                    className={hasUpperCase ? "valid-text" : "invalid-text"}
                  >
                    <FaCheckDouble /> {t("upper_1")}
                  </small>
                  <small
                    className={hasLowerCase ? "valid-text" : "invalid-text"}
                  >
                    <FaCheckDouble /> {t("lower_1")}
                  </small>
                  <small className={hasNumber ? "valid-text" : "invalid-text"}>
                    <FaCheckDouble /> {t("num_1")}
                  </small>
                  <small
                    className={hasSpecialChar ? "valid-text" : "invalid-text"}
                  >
                    <FaCheckDouble /> {t("special_1")}
                  </small>
                </div>
              )}
              <button
                onClick={handleOtpSend}
                disabled={
                  !(
                    hasValidLength &&
                    hasUpperCase &&
                    hasLowerCase &&
                    hasNumber &&
                    hasSpecialChar
                  )
                }
                className="register-btn"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  t("send_otp")
                )}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="auth_button"
              >
                {t("sign_in")}
              </button>
            </>
          ) : (
            <div className="otp-container">
              <div className="otp-inputs">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    className="otp-input"
                  />
                ))}
              </div>
              <button onClick={verifyOtp} className="register-btn">
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  t("verify_otp")
                )}
              </button>
              <div className="otp-note">
                <p>{t("otp_note")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignUp;
