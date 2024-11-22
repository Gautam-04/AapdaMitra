import { useState } from "react";
import { FaCheckDouble, FaEye, FaEyeSlash } from "react-icons/fa";
import './auth.css';
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserState } from "../../context/UserContext";
import { Spinner } from "react-bootstrap";

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

    const handleLogin = async() => {
        setLoading(true);
        try {
            const config = {
                    headers: {
                        "Content-type": "application/json"
                    },
                }
            const response = await axios.post('/api/v1/user/login', {email,password},config);
            if (response.status === 200) {
                toast.success(response.data.message);
                localStorage.setItem('xxxxxxuserxxxxxx', JSON.stringify(response.data.loggedInUser));
                localStorage.setItem('xxxxxxxxxxtokenxxxxxxxxxx', response.data.accessToken);
                setUser(response.data.loggedInUser);
                navigate('/home');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to Login';
            console.log(error)
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Sign In</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Enter Email"
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
                    <button onClick={handleLogin} disabled={!(hasValidLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)} className="submit-btn">
                        {loading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
                    </button>
                    <div className="RedirectContainer">
                        <p>Have a account? <Link to='/signup'>Login here</Link></p>
                    </div>
                </div>
        </div>
    );
}

export default SignIn