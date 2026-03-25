package com.teammatevoices.service;

import com.teammatevoices.dto.DispatchDTO;
import com.teammatevoices.exception.BusinessRuleException;
import com.teammatevoices.exception.ResourceNotFoundException;
import com.teammatevoices.model.Dispatch;
import com.teammatevoices.model.Participant;
import com.teammatevoices.model.Survey;
import com.teammatevoices.model.Program;
import com.teammatevoices.repository.DispatchRepository;
import com.teammatevoices.repository.ParticipantRepository;
import com.teammatevoices.repository.ProgramRepository;
import com.teammatevoices.repository.SurveyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DispatchService {

    private static final Logger log = LoggerFactory.getLogger(DispatchService.class);

    private final DispatchRepository dispatchRepository;
    private final ParticipantRepository participantRepository;
    private final SurveyRepository surveyRepository;
    private final ProgramRepository programRepository;
    private final EmailSendingService emailSendingService;

    public DispatchService(DispatchRepository dispatchRepository,
                           ParticipantRepository participantRepository,
                           SurveyRepository surveyRepository,
                           ProgramRepository programRepository,
                           EmailSendingService emailSendingService) {
        this.dispatchRepository = dispatchRepository;
        this.participantRepository = participantRepository;
        this.surveyRepository = surveyRepository;
        this.programRepository = programRepository;
        this.emailSendingService = emailSendingService;
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

    @Transactional(readOnly = true)
    public List<DispatchDTO> getDispatchesBySurvey(Long surveyId) {
        return dispatchRepository.findBySurveyId(surveyId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Dispatch a survey to all participants in its linked program.
     *
     * For each active participant:
     * 1. Create a Dispatch record with a unique token
     * 2. Send invitation email with the survey link
     * 3. Mark dispatch as SENT
     *
     * @param surveyId the survey to dispatch
     * @param baseUrl  the frontend base URL for building survey links
     * @return summary of dispatches created and emails sent
     */
    @Transactional
    public DispatchResult dispatchSurvey(Long surveyId, String baseUrl) {
        log.info("Dispatching survey {} to program participants", surveyId);

        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", surveyId));

        // Survey must be ACTIVE
        if (!"ACTIVE".equalsIgnoreCase(survey.getStatus())) {
            throw new BusinessRuleException("Survey must be ACTIVE to dispatch. Current status: " + survey.getStatus());
        }

        // Survey must be linked to a program
        if (survey.getProgramId() == null) {
            throw new BusinessRuleException("Survey must be linked to a program before dispatching.");
        }

        // Get all active participants in the program
        List<Participant> participants = participantRepository.findByProgramId(survey.getProgramId());
        List<Participant> activeParticipants = participants.stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsActive()))
                .collect(Collectors.toList());

        if (activeParticipants.isEmpty()) {
            throw new BusinessRuleException("No active participants found in program " + survey.getProgramId());
        }

        // Check for existing dispatches (don't double-dispatch)
        List<Dispatch> existingDispatches = dispatchRepository.findBySurveyId(surveyId);
        Set<String> alreadyDispatched = existingDispatches.stream()
                .map(Dispatch::getParticipantId)
                .collect(Collectors.toSet());

        int created = 0;
        int emailsSent = 0;
        int skipped = 0;
        List<String> errors = new ArrayList<>();

        for (Participant participant : activeParticipants) {
            // Skip if already dispatched
            if (alreadyDispatched.contains(participant.getParticipantId())) {
                skipped++;
                continue;
            }

            // Generate unique token
            String token = UUID.randomUUID().toString().replace("-", "");

            // Create dispatch record
            Dispatch dispatch = new Dispatch();
            dispatch.setParticipantId(participant.getParticipantId());
            dispatch.setSurveyId(surveyId);
            dispatch.setSurveyStage(survey.getSurveyStage() != null ? survey.getSurveyStage() : "GENERAL");
            dispatch.setDispatchStatus("SENT");
            dispatch.setDispatchToken(token);
            dispatch.setSentAt(LocalDateTime.now());
            dispatch.setReminderCount(0);

            dispatchRepository.save(dispatch);
            created++;

            // Build survey link
            String surveyLink = baseUrl + "/respond/" + token;

            // Build merge data for email
            Map<String, String> mergeData = new HashMap<>();
            mergeData.put("{{participant_name}}", participant.getFullName());
            mergeData.put("{{email}}", participant.getEmail());
            mergeData.put("{{cohort}}", participant.getCohort() != null ? participant.getCohort() : "");
            mergeData.put("{{participant_type}}", participant.getParticipantType());
            mergeData.put("{{manager_name}}", participant.getManagerName() != null ? participant.getManagerName() : "");
            mergeData.put("{{survey_title}}", survey.getTitle());
            mergeData.put("{{survey_link}}", surveyLink);
            mergeData.put("{{survey_description}}", survey.getDescription() != null ? survey.getDescription() : "");
            mergeData.put("{{company_name}}", "Teammate Voices");

            // Send email
            try {
                boolean sent = emailSendingService.sendHtmlEmail(
                        participant.getEmail(),
                        "You're invited: " + survey.getTitle(),
                        buildInvitationHtml(participant.getFullName(), survey.getTitle(), surveyLink),
                        "Teammate Voices"
                );
                if (sent) emailsSent++;
            } catch (Exception e) {
                log.error("Failed to send email to {}: {}", participant.getEmail(), e.getMessage());
                errors.add("Failed to email " + participant.getEmail() + ": " + e.getMessage());
            }
        }

        log.info("Dispatch complete: {} created, {} emails sent, {} skipped, {} errors",
                created, emailsSent, skipped, errors.size());

        // Update program progress: NOT_STARTED → IN_PROGRESS
        if (created > 0) {
            programRepository.findById(survey.getProgramId()).ifPresent(program -> {
                if ("NOT_STARTED".equalsIgnoreCase(program.getSurveyProgress())
                        || program.getSurveyProgress() == null) {
                    program.setSurveyProgress("IN_PROGRESS");
                    programRepository.save(program);
                    log.info("Updated program {} progress to IN_PROGRESS", program.getProgramId());
                }
            });
        }

        return new DispatchResult(created, emailsSent, skipped, errors);
    }

    /**
     * Look up a survey via dispatch token.
     */
    @Transactional
    public Dispatch getDispatchByToken(String token) {
        Dispatch dispatch = dispatchRepository.findByDispatchToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatch", "token=" + token));

        // Mark as opened if not already
        if ("SENT".equals(dispatch.getDispatchStatus())) {
            dispatch.setDispatchStatus("OPENED");
            dispatch.setOpenedAt(LocalDateTime.now());
            dispatchRepository.save(dispatch);
        }

        return dispatch;
    }

    private String buildInvitationHtml(String name, String surveyTitle, String surveyLink) {
        return "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;\">"
                + "<div style=\"background: #1d1d1f; color: white; padding: 24px 32px; border-radius: 12px 12px 0 0;\">"
                + "<h1 style=\"margin: 0; font-size: 20px;\">Teammate Voices</h1>"
                + "</div>"
                + "<div style=\"background: white; padding: 32px; border: 1px solid #e5e5ea; border-top: none; border-radius: 0 0 12px 12px;\">"
                + "<p style=\"font-size: 16px; color: #1d1d1f;\">Hi " + name + ",</p>"
                + "<p style=\"font-size: 15px; color: #48484a;\">You've been invited to complete the <strong>" + surveyTitle + "</strong> survey. Your feedback is valuable and helps us improve.</p>"
                + "<div style=\"text-align: center; margin: 32px 0;\">"
                + "<a href=\"" + surveyLink + "\" style=\"background: #1d1d1f; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block;\">Take Survey</a>"
                + "</div>"
                + "<p style=\"font-size: 13px; color: #86868b;\">If the button doesn't work, copy this link: <br/>" + surveyLink + "</p>"
                + "<hr style=\"border: none; border-top: 1px solid #e5e5ea; margin: 24px 0;\" />"
                + "<p style=\"font-size: 12px; color: #aeaeb2;\">This survey is confidential. Your responses are anonymous.</p>"
                + "</div>"
                + "</div>";
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

    /** Result of a survey dispatch operation */
    public record DispatchResult(int created, int emailsSent, int skipped, List<String> errors) {}
}
