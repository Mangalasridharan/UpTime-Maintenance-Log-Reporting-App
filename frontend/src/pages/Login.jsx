import {useState} from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {

    const [employeeEmail, setEmployeeEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            console.log("reached here")
            const response = await api.post(
                "/v1/employee/auth/login",
                {
                    email: employeeEmail,
                    password: password
                }
            );

            console.log(employeeEmail, password);

            localStorage.setItem(
                "token",
                response.data.jwtToken
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            localStorage.setItem(
                "username",
                response.data.username
            );

            console.log(response.data);

            navigate("/dashboard");

        } catch(error) {

            console.error(error);

        }
    };

    return (
        <div>
            <h1>UpTime - Maintenance Log Reporting App</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>
                    <br/>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={employeeEmail}
                        onChange={(e) => setEmployeeEmail(e.target.value)}
                    />
                    <br />
                </div>

                <div>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>

            </form>
        </div>
    );
}

export default Login;
