package com.msd.uptime.backend.support;

import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.models.ComplaintStatus;
import com.msd.uptime.backend.models.Department;
import com.msd.uptime.backend.models.Employee;
import com.msd.uptime.backend.models.EmployeeRole;
import com.msd.uptime.backend.models.Machine;
import com.msd.uptime.backend.models.MachineStatus;
import com.msd.uptime.backend.models.Notification;
import com.msd.uptime.backend.models.Specialization;

import java.time.LocalDateTime;

/**
 * Object-mother factory used as mock data for the unit tests.
 *
 * <p>The JPA repositories, dashboards and messaging collaborators are replaced by Mockito mocks in
 * each test class; this factory supplies the real entity instances those mocks should return.</p>
 */
public final class TestDataFactory {

    private static final LocalDateTime FIXED_TIME = LocalDateTime.of(2026, 1, 1, 10, 0);

    private TestDataFactory() {
    }

    public static Department department(Long id, String name) {
        Department department = new Department(name);
        department.setId(id);
        return department;
    }

    public static Employee employee(Long id, String username, String email,
                                    EmployeeRole role, Department department,
                                    Specialization specialization) {
        return new Employee(id, username, email, "encodedPassword",
                role, department, FIXED_TIME, specialization);
    }

    public static Machine machine(Long id, String name, MachineStatus status,
                                  Department department) {
        return new Machine(id, name, status, department);
    }

    public static Complaint complaint(Long id, String description, Machine machine,
                                      Employee reportedBy, ComplaintStatus status,
                                      Employee assignedTo) {
        return new Complaint(id, description, machine, reportedBy, FIXED_TIME,
                status, assignedTo, null, null);
    }

    public static Notification notification(Long id, Employee recipient, String title,
                                            String message, boolean read) {
        return new Notification(id, recipient, title, message, read, FIXED_TIME);
    }
}