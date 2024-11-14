import { useState } from "react";
import { FaCheckDouble, FaEye, FaEyeSlash } from "react-icons/fa";
import './auth.css'; // Ensure this import points to your CSS file
import { Link } from "react-router-dom";

function SignUp() {
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
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

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus on the next input box
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleOtpSend = () => {
        setOtpSent(true);
    };

    const verifyOtp = () => {
        const otpValue = otp.join('');
        console.log("Entered OTP:", otpValue);
    };

    return (
        <div className="form-container">
            <h2>Sign Up</h2>
            {!otpSent ? (
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
                    <button onClick={handleOtpSend} disabled={!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)} className="submit-btn">
                        Send OTP
                    </button>
                    <div className="RedirectContainer">
                        <p>Have a account? <Link to='/signin'>Login here</Link></p>
                    </div>
                </div>
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
                    <button onClick={verifyOtp} className="submit-btn">
                        Verify OTP
                    </button>
                </div>
            )}
        </div>
    );
}

export default SignUp;
