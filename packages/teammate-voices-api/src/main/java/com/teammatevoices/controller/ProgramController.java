package com.teammatevoices.controller;

import com.teammatevoices.dto.ProgramDTO;
import com.teammatevoices.service.ProgramService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programs")
public class ProgramController {

    private static final Logger log = LoggerFactory.getLogger(ProgramController.class);

    private final ProgramService programService;

    public ProgramController(ProgramService programService) {
        this.programService = programService;
    }

    @GetMapping
    public ResponseEntity<List<ProgramDTO>> getAllPrograms() {
        log.info("GET /programs");
        return ResponseEntity.ok(programService.getAllPrograms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgramDTO> getProgramById(@PathVariable Long id) {
        log.info("GET /programs/{}", id);
        return ResponseEntity.ok(programService.getProgramById(id));
    }

    @PostMapping
    public ResponseEntity<ProgramDTO> createProgram(@Valid @RequestBody ProgramDTO programDTO) {
        log.info("POST /programs - {}", programDTO.getName());
        ProgramDTO created = programService.createProgram(programDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgramDTO> updateProgram(@PathVariable Long id, @Valid @RequestBody ProgramDTO programDTO) {
        log.info("PUT /programs/{}", id);
        return ResponseEntity.ok(programService.updateProgram(id, programDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        log.info("DELETE /programs/{}", id);
        programService.deleteProgram(id);
        return ResponseEntity.noContent().build();
    }
}
