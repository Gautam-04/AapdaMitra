import { useState } from "react";
import { FaCheckDouble, FaEye, FaEyeSlash } from "react-icons/fa";
import './auth.css'; // Ensure this points to your CSS file
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserState } from "../../context/UserContext";
import { Button, Spinner } from "react-bootstrap"; // Import Bootstrap components

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
            const response = await axios.post('http://localhost:8000/api/v1/user/register', { email });
            if (response.status === 200) {
                toast.success(response.data.message);
                setOtpSent(true);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send OTP';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        const otpValue = otp.join('');
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
                        "Content-type": "application/json"
                    },
                    withCredentials: true,
                }
            const response = await axios.post('http://localhost:8000/api/v1/user/verifyotp', userData,config);
            if (response.status === 200) {
                toast.success(response.data.message);
                localStorage.setItem('xxxxxxuserxxxxxx', JSON.stringify(response.data.createdUser));
                localStorage.setItem('xxxxxxxxxxtokenxxxxxxxxxx', response.data.accessToken);
                setUser(response.data.createdUser);
                navigate('/home');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to verify OTP';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Sign Up</h2>
            {!otpSent ? (
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                            <small className={hasValidLength ? 'valid-text' : 'invalid-text'}>
                                <FaCheckDouble /> At least 8 characters
                            </small>
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
                    <button
                        onClick={handleOtpSend}
                        disabled={!(hasValidLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)}
                        className="submit-btn"
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Send OTP'}
                    </button>
                    <div className="RedirectContainer">
                        <p>Have an account? <Link to='/signin'>Login here</Link></p>
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
                    <Button onClick={verifyOtp} className="submit-btn">
                        {loading ? <Spinner animation="border" size="sm" /> : 'Verify OTP'}
                    </Button>
                    <div className="otp-note">
                        <p>If you did not receive the OTP, please check your spam folder.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignUp;
