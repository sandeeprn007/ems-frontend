import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuth2RedirectComponent = () => {
    const [searchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("");
    const { completeOAuthLogin } = useAuth();
    const navigator = useNavigate();

    useEffect(() => {
        const error = searchParams.get("error");
        const token = searchParams.get("token");
        const username = searchParams.get("username");
        const roles = searchParams.get("roles");

        if (error) {
            setErrorMessage(error);
            return;
        }

        if (!token || !username) {
            setErrorMessage("Google login did not return a valid session.");
            return;
        }

        completeOAuthLogin(token, username, roles);
        navigator("/employees", { replace: true });
    }, [completeOAuthLogin, navigator, searchParams]);

    return (
        <div className="container auth-page">
            <div className="card auth-card text-center">
                <div className="card-body">
                    {errorMessage ? (
                        <>
                            <h2 className="h4">Google Login Failed</h2>
                            <p className="text-danger">{errorMessage}</p>
                            <Link className="btn btn-primary" to="/login">Back to Login</Link>
                        </>
                    ) : (
                        <>
                            <div className="spinner-border text-primary mb-3" role="status" />
                            <p className="mb-0">Completing Google login...</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OAuth2RedirectComponent;
