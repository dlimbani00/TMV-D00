package com.teammatevoices.service;

import com.teammatevoices.model.Dispatch;
import com.teammatevoices.model.Survey;
import com.teammatevoices.repository.DispatchRepository;
import com.teammatevoices.repository.SurveyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Automated reminder service that sends follow-up emails to
 * participants who haven't completed their surveys.
 *
 * Runs every hour via Spring @Scheduled. For each dispatch that:
 * 1. Has been SENT but not SUBMITTED
 * 2. Has not exceeded max reminders
 * 3. Has waited long enough since last reminder (interval days)
 *
 * ...sends a reminder email and increments the reminder count.
 */
@Service
public class ReminderService {

    private static final Logger log = LoggerFactory.getLogger(ReminderService.class);

    private final DispatchRepository dispatchRepository;
    private final SurveyRepository surveyRepository;
    private final EmailSendingService emailSendingService;

    public ReminderService(DispatchRepository dispatchRepository,
                           SurveyRepository surveyRepository,
                           EmailSendingService emailSendingService) {
        this.dispatchRepository = dispatchRepository;
        this.surveyRepository = surveyRepository;
        this.emailSendingService = emailSendingService;
    }

    /**
     * Runs every hour to check for dispatches that need reminders.
     */
    @Scheduled(fixedRate = 3600000) // every hour
    @Transactional
    public void processReminders() {
        log.info("Running reminder check...");

        List<Dispatch> sentDispatches = dispatchRepository.findByDispatchStatus("SENT");
        int remindersSent = 0;

        for (Dispatch dispatch : sentDispatches) {
            if (shouldSendReminder(dispatch)) {
                try {
                    sendReminder(dispatch);
                    remindersSent++;
                } catch (Exception e) {
                    log.error("Failed to send reminder for dispatch {}: {}", dispatch.getDispatchId(), e.getMessage());
                }
            }
        }

        log.info("Reminder check complete: {} reminders sent out of {} pending dispatches",
                remindersSent, sentDispatches.size());
    }

    private boolean shouldSendReminder(Dispatch dispatch) {
        // Already submitted — no reminder needed
        if (dispatch.getSubmittedAt() != null) return false;

        // Exceeded max reminders
        int maxReminders = dispatch.getMaxReminders() != null ? dispatch.getMaxReminders() : 3;
        if (dispatch.getReminderCount() != null && dispatch.getReminderCount() >= maxReminders) return false;

        // Check interval since last reminder (or since sent)
        int intervalDays = dispatch.getReminderIntervalDays() != null ? dispatch.getReminderIntervalDays() : 3;
        LocalDateTime lastContact = dispatch.getLastReminderAt() != null
                ? dispatch.getLastReminderAt()
                : dispatch.getSentAt();

        if (lastContact == null) return false;

        return LocalDateTime.now().isAfter(lastContact.plusDays(intervalDays));
    }

    private void sendReminder(Dispatch dispatch) {
        // Load survey for title
        Survey survey = surveyRepository.findById(dispatch.getSurveyId()).orElse(null);
        if (survey == null || !"ACTIVE".equalsIgnoreCase(survey.getStatus())) {
            log.debug("Skipping reminder for dispatch {} — survey not active", dispatch.getDispatchId());
            return;
        }

        String surveyLink = "http://localhost:5200/respond/" + dispatch.getDispatchToken();
        String subject = "Reminder: " + survey.getTitle() + " — Your feedback matters";
        String body = "<div style='font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;'>"
                + "<h2 style='color: #012169;'>Friendly Reminder</h2>"
                + "<p>We noticed you haven't completed the <strong>" + survey.getTitle() + "</strong> survey yet.</p>"
                + "<p>Your feedback is important and helps us improve. It only takes a few minutes.</p>"
                + "<p style='margin: 24px 0;'><a href='" + surveyLink
                + "' style='background: #012169; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;'>"
                + "Complete Survey Now</a></p>"
                + "<p style='color: #86868b; font-size: 12px;'>This is reminder "
                + ((dispatch.getReminderCount() != null ? dispatch.getReminderCount() : 0) + 1)
                + ". You can unsubscribe by completing the survey.</p>"
                + "</div>";

        try {
            emailSendingService.sendHtmlEmail(dispatch.getParticipantId(), subject, body, "Teammate Voices");

            // Update dispatch
            dispatch.setReminderCount((dispatch.getReminderCount() != null ? dispatch.getReminderCount() : 0) + 1);
            dispatch.setLastReminderAt(LocalDateTime.now());
            dispatchRepository.save(dispatch);

            log.info("Sent reminder {} for dispatch {} (survey: {})",
                    dispatch.getReminderCount(), dispatch.getDispatchId(), survey.getTitle());
        } catch (Exception e) {
            log.error("Failed to send reminder email for dispatch {}", dispatch.getDispatchId(), e);
        }
    }
}
