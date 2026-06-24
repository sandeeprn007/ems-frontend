import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdminAPICall } from "../services/AuthService";

const RegisterAdminComponent = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigator = useNavigate();

    function handleRegisterAdmin(e) {
        e.preventDefault();
        setMessage("");
        setErrorMessage("");

        const registerObj = { name, username, email, password };

        registerAdminAPICall(registerObj).then((response) => {
            setMessage(response.data || "Admin registered successfully!");
            setName("");
            setUsername("");
            setEmail("");
            setPassword("");
        }).catch(error => {
            setErrorMessage(error?.response?.data?.message || "Unable to register admin");
        });
    }

    function cancel() {
        navigator("/employees");
    }

    return (
        <div className="container">
            <br /> <br />
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    <h2 className="text-center mt-3">Register Admin</h2>
                    <div className="card-body">
                        <form onSubmit={handleRegisterAdmin}>
                            <div className="form-group mb-2">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-2">
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
                                    minLength="6"
                                    required
                                />
                            </div>
                            {message && <div className="alert alert-success py-2">{message}</div>}
                            {errorMessage && <div className="invalid-feedback d-block">{errorMessage}</div>}
                            <button className="btn btn-success mt-2" type="submit">Register Admin</button>
                            <button className="btn btn-secondary mt-2 ms-2" type="button" onClick={cancel}>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterAdminComponent;
