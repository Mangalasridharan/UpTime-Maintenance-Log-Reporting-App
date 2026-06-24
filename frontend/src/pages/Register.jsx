import {useState} from "react";
import api from "../api/axios.js";

function Register() {

    const [employeeName, setEmployeeName] = useState("");
    const [employeeEmail, setEmployeeEmail] = useState("");
    const [password, setPassword] = useState("");
    const [employeeRole, setEmployeeRole] = useState("");
    const [deptId, setDeptId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await api.post(
                "/v1/employee/auth/register",
                {
                    username: employeeName,
                    email: employeeEmail,
                    password: password,
                    employeeRole: employeeRole,
                    departmentId: deptId
                }
            );

            console.log(response.data);

        } catch(error) {

            console.error(error);

        }
    };

    return (
        <div>
            <h1>UpTime - Maintenance Log Reporting App</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Name</label>
                    <br/>
                    <input
                        type="name"
                        placeholder="Enter your name"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                    />
                    <br />
                </div>

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
                    <br/>
                </div>

                <div>
                    <label>Employee Role</label>
                    <br />
                    <select name="Employee Role" value={employeeRole}
                            onChange={(e) => setEmployeeRole(e.target.value)}>
                        <option value="HEAD">Head</option>
                        <option value="HOD">HOD</option>
                        <option value="SHIFT_WORKER">SHIFT WORKER</option>
                        <option value="GENERAL_WORKER">GENERAL WORKER</option>
                    </select>
                    <br/>
                </div>

                <div>
                    <label>Dept</label>
                    <br/>
                    <select
                        value={deptId}
                        onChange={(e) => setDeptId(e.target.value)}
                    >
                        <option value="">Select Department</option>

                        <option value="1">Boiler</option>
                        <option value="2">CBR</option>
                        <option value="3">CDR</option>
                        <option value="4">CPB</option>
                        <option value="5">CWR</option>
                        <option value="6">Fabric Batching</option>
                        <option value="7">Finishing-Dry</option>
                        <option value="8">Finishing-Wet</option>
                        <option value="9">Inspection</option>
                        <option value="10">Printing</option>
                        <option value="11">Softflow</option>
                        <option value="12">Softflow-Sample</option>
                        <option value="13">Winding</option>
                        <option value="14">Yarn Dyeing</option>
                    </select>
                    <br/>
                </div>

                <button type="submit">
                    Register
                </button>

            </form>
        </div>
    );
}

export default Register;
