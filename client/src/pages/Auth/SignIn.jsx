import { useState } from "react";
import { FaCheckDouble, FaEye, FaEyeSlash } from "react-icons/fa";
import './auth.css';
import { Link } from "react-router-dom";

function SignIn() {
  const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [hasUpperCase, setHasUpperCase] = useState(false);
    const [hasLowerCase, setHasLowerCase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        // Check individual conditions
        setHasUpperCase(/[A-Z]/.test(newPassword));
        setHasLowerCase(/[a-z]/.test(newPassword));
        setHasNumber(/\d/.test(newPassword));
        setHasSpecialChar(/[!@#$%^&*]/.test(newPassword));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        
    };

    return (
        <div className="form-container">
            <h2>Sign In</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Enter Mobile Number"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        className="input-field"
                    />
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="input-field"
                        />
                        <span onClick={togglePasswordVisibility} className="toggle-password-icon">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {password.length > 0 && (
                        <div className="password-conditions">
                            <small className={hasUpperCase ? 'valid-text' : 'invalid-text'}>
                                <FaCheckDouble /> 1 uppercase letter
                            </small>
                            <small className={hasLowerCase ? 'valid-text' : 'invalid-text'}>
                                <FaCheckDouble /> 1 lowercase letter
                            </small>
                            <small className={hasNumber ? 'valid-text' : 'invalid-text'}>
                                <FaCheckDouble /> 1 number
                            </small>
                            <small className={hasSpecialChar ? 'valid-text' : 'invalid-text'}>
                                <FaCheckDouble /> 1 special character
                            </small>
                        </div>
                    )}
                    <button onClick={handleLogin} disabled={!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)} className="submit-btn">
                        Login
                    </button>
                    <div className="RedirectContainer">
                        <p>Have a account? <Link to='/signup'>Login here</Link></p>
                    </div>
                </div>
        </div>
    );
}

export default SignIn