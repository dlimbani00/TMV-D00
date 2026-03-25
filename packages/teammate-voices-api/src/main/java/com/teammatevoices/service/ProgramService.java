package com.teammatevoices.service;

import com.teammatevoices.dto.ProgramDTO;
import com.teammatevoices.dto.ProgramDetailDTO;
import com.teammatevoices.dto.ProgramDetailDTO.ParticipantStatusRow;
import com.teammatevoices.exception.BusinessRuleException;
import com.teammatevoices.exception.ResourceNotFoundException;
import com.teammatevoices.model.Dispatch;
import com.teammatevoices.model.Participant;
import com.teammatevoices.model.Program;
import com.teammatevoices.repository.DispatchRepository;
import com.teammatevoices.repository.ParticipantRepository;
import com.teammatevoices.repository.ProgramRepository;
import com.teammatevoices.repository.SurveyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgramService {

    private static final Logger log = LoggerFactory.getLogger(ProgramService.class);

    private final ProgramRepository programRepository;
    private final ParticipantRepository participantRepository;
    private final DispatchRepository dispatchRepository;
    private final SurveyRepository surveyRepository;

    public ProgramService(ProgramRepository programRepository,
                          ParticipantRepository participantRepository,
                          DispatchRepository dispatchRepository,
                          SurveyRepository surveyRepository) {
        this.programRepository = programRepository;
        this.participantRepository = participantRepository;
        this.dispatchRepository = dispatchRepository;
        this.surveyRepository = surveyRepository;
    }

    /** Guard: reject edits if any linked survey is ACTIVE */
    private void requireEditableProgram(Long programId) {
        if (surveyRepository.existsByProgramIdAndStatus(programId, "ACTIVE")) {
            throw new BusinessRuleException(
                "Cannot edit program: it has active surveys. Clone the survey to make changes.");
        }
    }

    @Transactional(readOnly = true)
    public List<ProgramDTO> getAllPrograms() {
        return programRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProgramDTO getProgramById(Long id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program", id));
        return toDTO(program);
    }

    @Transactional
    public ProgramDTO createProgram(ProgramDTO dto) {
        log.info("Creating program: {}", dto.getName());
        Program program = toEntity(dto);
        return toDTO(programRepository.save(program));
    }

    @Transactional
    public ProgramDTO updateProgram(Long id, ProgramDTO dto) {
        log.info("Updating program: {}", id);
        requireEditableProgram(id);

        Program program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program", id));

        program.setName(dto.getName());
        program.setDescription(dto.getDescription());
        if (dto.getTemplateType() != null) program.setTemplateType(dto.getTemplateType());
        if (dto.getStatus() != null) program.setStatus(dto.getStatus());
        if (dto.getSurveyProgress() != null) program.setSurveyProgress(dto.getSurveyProgress());

        return toDTO(programRepository.save(program));
    }

    @Transactional
    public void deleteProgram(Long id) {
        log.info("Deleting program: {}", id);
        requireEditableProgram(id);

        if (!programRepository.existsById(id)) {
            throw new ResourceNotFoundException("Program", id);
        }
        programRepository.deleteById(id);
    }

    /**
     * Returns program info + all participants with their latest dispatch status.
     * Used by the Program Detail page.
     */
    @Transactional(readOnly = true)
    public ProgramDetailDTO getProgramDetail(Long id) {
        log.info("Getting program detail for: {}", id);
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program", id));

        List<Participant> participants = participantRepository.findByProgramId(id);

        int completedCount = 0;
        int sentCount = 0;
        int pendingCount = 0;

        List<ParticipantStatusRow> rows = new java.util.ArrayList<>();
        for (Participant p : participants) {
            ParticipantStatusRow row = new ParticipantStatusRow();
            row.setParticipantId(p.getParticipantId());
            row.setFullName(p.getFullName());
            row.setEmail(p.getEmail());
            row.setCohort(p.getCohort());
            row.setParticipantType(p.getParticipantType());
            row.setActive(Boolean.TRUE.equals(p.getIsActive()));

            // Get latest dispatch for this participant
            List<Dispatch> dispatches = dispatchRepository.findByParticipantId(p.getParticipantId());
            if (!dispatches.isEmpty()) {
                Dispatch latest = dispatches.stream()
                        .max(Comparator.comparing(Dispatch::getCreatedAt))
                        .orElse(dispatches.get(0));
                row.setDispatchStatus(latest.getDispatchStatus());
                row.setSurveyStage(latest.getSurveyStage());
                row.setSentAt(latest.getSentAt());
                row.setSubmittedAt(latest.getSubmittedAt());
                row.setReminderCount(latest.getReminderCount() != null ? latest.getReminderCount() : 0);

                // Count statuses
                if ("SUBMITTED".equals(latest.getDispatchStatus())) completedCount++;
                else if ("SENT".equals(latest.getDispatchStatus()) || "OPENED".equals(latest.getDispatchStatus())) sentCount++;
                else pendingCount++;
            } else {
                row.setDispatchStatus(null);
                row.setReminderCount(0);
                pendingCount++;
            }

            rows.add(row);
        }

        ProgramDetailDTO detail = new ProgramDetailDTO();
        detail.setProgram(toDTO(program));
        detail.setParticipants(rows);
        detail.setTotalParticipants(participants.size());
        detail.setCompletedCount(completedCount);
        detail.setSentCount(sentCount);
        detail.setPendingCount(pendingCount);

        return detail;
    }

    private ProgramDTO toDTO(Program program) {
        ProgramDTO dto = new ProgramDTO();
        dto.setProgramId(program.getProgramId());
        dto.setName(program.getName());
        dto.setDescription(program.getDescription());
        dto.setTemplateType(program.getTemplateType());
        dto.setStatus(program.getStatus());
        dto.setSurveyProgress(program.getSurveyProgress());
        dto.setCreatedAt(program.getCreatedAt());
        dto.setUpdatedAt(program.getUpdatedAt());
        return dto;
    }

    private Program toEntity(ProgramDTO dto) {
        Program program = new Program();
        program.setName(dto.getName());
        program.setDescription(dto.getDescription());
        program.setTemplateType(dto.getTemplateType() != null ? dto.getTemplateType() : "CUSTOM");
        program.setStatus(dto.getStatus() != null ? dto.getStatus() : "INACTIVE");
        program.setSurveyProgress(dto.getSurveyProgress() != null ? dto.getSurveyProgress() : "NOT_STARTED");
        return program;
    }
}
