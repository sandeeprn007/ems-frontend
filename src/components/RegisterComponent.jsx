import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAPICall } from "../services/AuthService";

const GMAIL_REGEX = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

const RegisterComponent = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigator = useNavigate();

    function validateForm() {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
            return "All fields are required.";
        }

        if (!GMAIL_REGEX.test(email.trim())) {
            return "Please enter a valid Gmail address.";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        if (password !== confirmPassword) {
            return "Password and confirm password do not match.";
        }

        return "";
    }

    function handleRegister(e) {
        e.preventDefault();
        setMessage("");
        setErrorMessage("");

        const validationError = validateForm();

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        const trimmedEmail = email.trim();
        const registerObj = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            name: `${firstName.trim()} ${lastName.trim()}`,
            username: trimmedEmail.substring(0, trimmedEmail.indexOf("@")),
            email: trimmedEmail,
            password,
            confirmPassword
        };

        setLoading(true);
        registerAPICall(registerObj).then((response) => {
            setMessage(response.data || "Registration successful. Please login.");
            setTimeout(() => navigator("/login"), 800);
        }).catch(error => {
            setErrorMessage(error?.response?.data?.message || "Unable to register user");
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className="container auth-page">
            <div className="card auth-card">
                <h2 className="text-center mt-3">Register</h2>
                <div className="card-body">
                    <form onSubmit={handleRegister}>
                        <div className="row">
                            <div className="form-group mb-3 col-md-6">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 col-md-6">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Gmail Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength="6"
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength="6"
                                required
                            />
                        </div>
                        {message && <div className="alert alert-success py-2">{message}</div>}
                        {errorMessage && <div className="invalid-feedback d-block mb-2">{errorMessage}</div>}
                        <button className="btn btn-success w-100" type="submit" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;
