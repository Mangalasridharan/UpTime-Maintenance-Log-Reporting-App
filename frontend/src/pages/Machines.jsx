import {useEffect, useState} from 'react';
import api from "../api/axios";

function Machines() {
     const[machines, setMachines] = useState([]);
     const[machineStatus, setMachineStatus] = useState("ALL");



    useEffect(() => {
        const getMachineListResponse = async () => {

            try {
                const response = await api.get(
                    "/v1/machines"
                );

                setMachines(response.data);

            } catch (e) {
                console.log(e);
            }
        };
        getMachineListResponse();
    }, []);


    const filteredMachines = machines.filter(machine => {
        if(machineStatus === "ALL") {
            return true;
        }
        return machine.status === machineStatus;
    });

    return (
        <div>
            <h2> Machines List</h2>
            <h3>status filter</h3>
            <select name="status" value={machineStatus} onChange={(e) => setMachineStatus(e.target.value)}>
                <option value="ALL">All</option>
                <option value="RUNNING">Running</option>
                <option value="IDLE">Idle</option>
                <option value="UNDER_MAINTENANCE">under maintenance</option>
            </select>
            <table>
                <thead>
                <tr>
                    <th>Machine Name</th>
                    <th>Machine Status</th>
                    <th>Department</th>
                </tr>
                </thead>

                <tbody>
                {filteredMachines.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.status}</td>
                        <td>{item.department.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
};

export default Machines;