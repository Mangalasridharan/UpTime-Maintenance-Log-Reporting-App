package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.DTO.ComplaintRequest;
import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.models.ComplaintStatus;
import com.msd.uptime.backend.services.ComplaintService;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ComplaintControllerTest {

    @Mock
    private ComplaintService complaintService;

    @InjectMocks
    private ComplaintController complaintController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(complaintController).build();
    }

    @Test
    void createComplaint_delegatesToService() throws Exception {
        Complaint complaint = TestDataFactory
                .complaint(1L, "Belt snapped", null, null, ComplaintStatus.OPEN, null);
        when(complaintService.createComplaint(any(ComplaintRequest.class))).thenReturn(complaint);

        mockMvc.perform(post("/uptime/api/v1/complaint")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"description":"Belt snapped","machineId":1,"employeeId":2}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    void assignComplaint_delegatesToService() throws Exception {
        Complaint complaint = TestDataFactory
                .complaint(10L, "Belt snapped", null, null, ComplaintStatus.ASSIGNED, null);
        when(complaintService.assignComplaint(anyLong(), anyLong())).thenReturn(complaint);

        mockMvc.perform(patch("/uptime/api/v1/complaint/10/assign").param("id", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ASSIGNED"));
    }

    @Test
    void resolveComplaint_delegatesToService() throws Exception {
        Complaint complaint = TestDataFactory
                .complaint(10L, "Belt snapped", null, null, ComplaintStatus.COMPLETED, null);
        when(complaintService.completeComplaint(10L)).thenReturn(complaint);

        mockMvc.perform(patch("/uptime/api/v1/complaint/10/resolve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void verifyComplaint_delegatesToService() throws Exception {
        Complaint complaint = TestDataFactory
                .complaint(10L, "Belt snapped", null, null, ComplaintStatus.VERIFIED, null);
        when(complaintService.verifyComplaint(10L)).thenReturn(complaint);

        mockMvc.perform(patch("/uptime/api/v1/complaint/10/verify"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VERIFIED"));
    }

    @Test
    void getComplaintList_returnsList() throws Exception {
        when(complaintService.getAllComplaints()).thenReturn(List.of(
                TestDataFactory.complaint(1L, "Belt snapped", null, null, ComplaintStatus.OPEN, null)));

        mockMvc.perform(get("/uptime/api/v1/complaint"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}