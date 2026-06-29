import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGoogleOAuthUrl } from "../services/AuthService";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const LoginComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { isAuthenticated, login } = useAuth();
    const navigator = useNavigate();
    const location = useLocation();

    if (isAuthenticated) {
        return <Navigate to="/employees" replace />;
    }

    function handleLogin(e) {
        e.preventDefault();
        setErrorMessage("");

        if (!EMAIL_REGEX.test(email.trim())) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        login(email.trim(), password).then(() => {
            navigator(location.state?.from?.pathname || "/employees");
        }).catch(error => {
            setErrorMessage(error?.response?.data?.message || "Unable to login");
        }).finally(() => {
            setLoading(false);
        });
    }

    function handleGoogleLogin() {
        window.location.href = getGoogleOAuthUrl();
    }

    return (
        <div className="container auth-page">
            <div className="card auth-card">
                <h2 className="text-center mt-3">Employee Management System</h2>
                <div className="card-body">
                    <form onSubmit={handleLogin}>
                        <div className="form-group mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="text-end mb-3">
                            <button className="btn btn-link p-0" type="button">Forgot Password?</button>
                        </div>
                        {errorMessage && <div className="invalid-feedback d-block mb-2">{errorMessage}</div>}
                        <button className="btn btn-success w-100" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    <div className="oauth-divider">
                        <span>or</span>
                    </div>
                    <button className="btn btn-outline-dark w-100" type="button" onClick={handleGoogleLogin}>
                        Continue with Google
                    </button>
                    <div className="text-center mt-3">
                        Don't have an account? <Link to="/register">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
