import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { isUserLoggedIn, loginAPICall, storeLoggedInUser } from "../services/AuthService";

const LoginComponent = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigator = useNavigate();
    const location = useLocation();

    if (isUserLoggedIn()) {
        return <Navigate to="/employees" replace />;
    }

    function handleLogin(e) {
        e.preventDefault();
        setErrorMessage("");

        loginAPICall(usernameOrEmail, password).then((response) => {
            const { accessToken, username, roles } = response.data;
            storeLoggedInUser(accessToken, username, roles);
            navigator(location.state?.from?.pathname || "/employees");
        }).catch(error => {
            setErrorMessage(error?.response?.data?.message || "Unable to login");
        });
    }

    return (
        <div className="container login-container">
            <div className="row w-100">
                <div className="card col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                    <h2 className="text-center mt-3">Login</h2>
                    <div className="card-body">
                        <form onSubmit={handleLogin}>
                            <div className="form-group mb-3">
                                <label className="form-label">Username or Email</label>
                                <input
                                    type="text"
                                    name="usernameOrEmail"
                                    className="form-control"
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
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
                            {errorMessage && <div className="invalid-feedback d-block">{errorMessage}</div>}
                            <button className="btn btn-success w-100 mt-2" type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
