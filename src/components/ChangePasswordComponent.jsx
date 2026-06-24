import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordAPICall, logout } from "../services/AuthService";

const ChangePasswordComponent = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigator = useNavigate();

    function handleChangePassword(e) {
        e.preventDefault();
        setMessage("");
        setErrorMessage("");

        if (newPassword !== confirmPassword) {
            setErrorMessage("New password and confirm password do not match");
            return;
        }

        changePasswordAPICall({ currentPassword, newPassword }).then((response) => {
            setMessage(response.data || "Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }).catch(error => {
            setErrorMessage(error?.response?.data?.message || "Unable to change password");
        });
    }

    function loginAgain() {
        logout();
        navigator("/login");
    }

    function cancel() {
        navigator("/employees");
    }

    return (
        <div className="container">
            <br /> <br />
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    <h2 className="text-center mt-3">Change Password</h2>
                    <div className="card-body">
                        <form onSubmit={handleChangePassword}>
                            <div className="form-group mb-2">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="form-control"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    minLength="6"
                                    required
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength="6"
                                    required
                                />
                            </div>
                            {message && (
                                <div className="alert alert-success py-2">
                                    {message}
                                    <button className="btn btn-link p-0 ms-2" type="button" onClick={loginAgain}>
                                        Login again
                                    </button>
                                </div>
                            )}
                            {errorMessage && <div className="invalid-feedback d-block">{errorMessage}</div>}
                            <button className="btn btn-success mt-2" type="submit">Change Password</button>
                            <button className="btn btn-secondary mt-2 ms-2" type="button" onClick={cancel}>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordComponent;
