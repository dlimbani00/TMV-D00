package com.teammatevoices.controller;

import com.teammatevoices.dto.ParticipantDTO;
import com.teammatevoices.service.ParticipantService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/participants")
public class ParticipantController {

    private static final Logger log = LoggerFactory.getLogger(ParticipantController.class);

    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping
    public ResponseEntity<List<ParticipantDTO>> getAllParticipants() {
        log.info("GET /participants");
        return ResponseEntity.ok(participantService.getAllParticipants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParticipantDTO> getParticipantById(@PathVariable String id) {
        log.info("GET /participants/{}", id);
        return ResponseEntity.ok(participantService.getParticipantById(id));
    }

    @PostMapping
    public ResponseEntity<ParticipantDTO> createParticipant(@Valid @RequestBody ParticipantDTO dto) {
        log.info("POST /participants - {}", dto.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(participantService.createParticipant(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable String id) {
        log.info("DELETE /participants/{}", id);
        participantService.deleteParticipant(id);
        return ResponseEntity.noContent().build();
    }
}
