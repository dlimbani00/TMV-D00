package com.teammatevoices.service;

import com.teammatevoices.dto.DispatchDTO;
import com.teammatevoices.exception.ResourceNotFoundException;
import com.teammatevoices.model.Dispatch;
import com.teammatevoices.repository.DispatchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DispatchService {

    private static final Logger log = LoggerFactory.getLogger(DispatchService.class);

    private final DispatchRepository dispatchRepository;

    public DispatchService(DispatchRepository dispatchRepository) {
        this.dispatchRepository = dispatchRepository;
    }

    @Transactional(readOnly = true)
    public List<DispatchDTO> getAllDispatches() {
        return dispatchRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DispatchDTO getDispatchById(Long id) {
        Dispatch d = dispatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch", id));
        return toDTO(d);
    }

    @Transactional(readOnly = true)
    public List<DispatchDTO> getDispatchesByParticipant(String participantId) {
        return dispatchRepository.findByParticipantId(participantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private DispatchDTO toDTO(Dispatch d) {
        DispatchDTO dto = new DispatchDTO();
        dto.setDispatchId(d.getDispatchId());
        dto.setParticipantId(d.getParticipantId());
        dto.setSurveyId(d.getSurveyId());
        dto.setSurveyStage(d.getSurveyStage());
        dto.setDispatchStatus(d.getDispatchStatus());
        dto.setSentAt(d.getSentAt());
        dto.setOpenedAt(d.getOpenedAt());
        dto.setSubmittedAt(d.getSubmittedAt());
        dto.setReminderCount(d.getReminderCount());
        dto.setDispatchToken(d.getDispatchToken());
        dto.setCreatedAt(d.getCreatedAt());
        dto.setUpdatedAt(d.getUpdatedAt());
        return dto;
    }
}
