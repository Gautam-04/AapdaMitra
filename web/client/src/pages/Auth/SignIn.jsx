import { useState } from "react";
import { FaCheckDouble, FaEye, FaEyeSlash } from "react-icons/fa";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserState } from "../../context/UserContext";
import { Spinner } from "react-bootstrap";
import NdrfLogo from "../../assets/ndrf_logo.svg";
import AuthLogo from "../../assets/login_logo.svg";
import Footer from "../../components/footer/Footer";
import { useTranslation } from "react-i18next";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasValidLength, setHasValidLength] = useState(false);
  const navigate = useNavigate();
  const { setUser } = UserState();

  const { t } = useTranslation();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Check individual conditions
    setHasUpperCase(/[A-Z]/.test(newPassword));
    setHasLowerCase(/[a-z]/.test(newPassword));
    setHasNumber(/\d/.test(newPassword));
    setHasSpecialChar(/[!@#$%^&*]/.test(newPassword));
    setHasValidLength(newPassword.length >= 8);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post(
        "/api/v1/user/login",
        { email, password },
        config
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        localStorage.setItem(
          "xxxxxxuserxxxxxx",
          JSON.stringify(response.data.loggedInUser)
        );
        localStorage.setItem(
          "xxxxxxxxxxtokenxxxxxxxxxx",
          response.data.accessToken
        );
        setUser(response.data.loggedInUser);
        navigate("/dashboard/analytics");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to Login";
      console.log(error);
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
          <h2>{t("sign_in")}</h2>
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
              <small className={hasValidLength ? "valid-text" : "invalid-text"}>
                <FaCheckDouble /> {t("char_8")}
              </small>
              <small className={hasUpperCase ? "valid-text" : "invalid-text"}>
                <FaCheckDouble /> {t("upper_1")}
              </small>
              <small className={hasLowerCase ? "valid-text" : "invalid-text"}>
                <FaCheckDouble /> {t("lower_1")}
              </small>
              <small className={hasNumber ? "valid-text" : "invalid-text"}>
                <FaCheckDouble /> {t("num_1")}
              </small>
              <small className={hasSpecialChar ? "valid-text" : "invalid-text"}>
                <FaCheckDouble /> {t("special_1")}
              </small>
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={
              !(
                hasValidLength &&
                hasUpperCase &&
                hasLowerCase &&
                hasNumber &&
                hasSpecialChar
              )
            }
            className="submit-btn"
          >
            {loading ? <Spinner animation="border" size="sm" /> : t("sign_in")}
          </button>
          <button onClick={() => navigate("/register")} className="auth_button">
            {t("register")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignIn;
