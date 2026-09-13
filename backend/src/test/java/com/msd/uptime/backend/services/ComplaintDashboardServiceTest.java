package com.msd.uptime.backend.services;

import com.msd.uptime.backend.models.Complaint;
import com.msd.uptime.backend.models.ComplaintStatus;
import com.msd.uptime.backend.repositories.ComplaintRepository;
import com.msd.uptime.backend.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ComplaintDashboardServiceTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ComplaintDashboardService complaintDashboardService;

    @Test
    void getComplaintList_returnsAllComplaints() {
        when(complaintRepository.findAll()).thenReturn(List.of(
                TestDataFactory.complaint(1L, "Fix it", null, null, ComplaintStatus.OPEN, null)));

        assertThat(complaintDashboardService.getComplaintList()).hasSize(1);
    }

    @Test
    void publishComplaintDashboard_sendsComplaintListToTopic() {
        List<Complaint> complaints = List.of(
                TestDataFactory.complaint(1L, "Fix it", null, null, ComplaintStatus.OPEN, null));
        when(complaintRepository.findAll()).thenReturn(complaints);

        complaintDashboardService.publishComplaintDashboard();

        verify(messagingTemplate).convertAndSend(eq("/topic/complaints"), eq(complaints));
    }
}