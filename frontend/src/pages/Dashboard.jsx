import { useState, useEffect } from "react";
import api from "../api/axios";

function Dashboard() {

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const [totalMachines, setTotalMachines] = useState(0);
    const [runningMachines, setRunningMachines] = useState(0);
    const [idleMachines, setIdleMachines] = useState(0);
    const [underMaintenanceMachines, setUnderMaintenanceMachines] = useState(0);

    useEffect(() => {

        const getDashboardResponse = async () => {

            try {

                const response = await api.get(
                    "/v1/machines/dashboard"
                );

                setTotalMachines(
                    response.data.totalMachines
                );

                setRunningMachines(
                    response.data.runningMachines
                );

                setIdleMachines(
                    response.data.idleMachines
                );

                setUnderMaintenanceMachines(
                    response.data.underMaintenanceMachines
                );

            } catch (err) {

                console.error(err);

            }
        };

        getDashboardResponse();

    }, []);

    return (
        <div>

            <h1>Dashboard</h1>

            <h2>Welcome {username}</h2>

            <p>Role: {role}</p>

            <hr />

            <h3>Total Machines : {totalMachines}</h3>

            <h3>Running Machines : {runningMachines}</h3>

            <h3>Idle Machines : {idleMachines}</h3>

            <h3>Under Maintenance : {underMaintenanceMachines}</h3>

        </div>
    );
}

export default Dashboard;