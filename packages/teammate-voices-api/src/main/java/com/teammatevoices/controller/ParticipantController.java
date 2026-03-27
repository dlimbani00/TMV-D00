package com.teammatevoices.controller;

import com.teammatevoices.dto.ParticipantDTO;
import com.teammatevoices.dto.ParticipantImportResultDTO;
import com.teammatevoices.service.ParticipantService;
import com.teammatevoices.service.ParticipantImportService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/participants")
public class ParticipantController {

    private static final Logger log = LoggerFactory.getLogger(ParticipantController.class);

    private final ParticipantService participantService;
    private final ParticipantImportService participantImportService;

    public ParticipantController(ParticipantService participantService, ParticipantImportService participantImportService) {
        this.participantService = participantService;
        this.participantImportService = participantImportService;
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

    @PostMapping("/import")
    public ResponseEntity<?> importParticipants(@RequestParam("file") MultipartFile file) {
        log.info("POST /participants/import - file={}, size={}", file.getOriginalFilename(), file.getSize());
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        if (!filename.endsWith(".xlsx")) {
            return ResponseEntity.badRequest().body("Only .xlsx files are supported");
        }
        try {
            ParticipantImportResultDTO result = participantImportService.importFromExcel(file);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            log.error("Failed to parse Excel file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to parse file: " + e.getMessage());
        }
    }
}
