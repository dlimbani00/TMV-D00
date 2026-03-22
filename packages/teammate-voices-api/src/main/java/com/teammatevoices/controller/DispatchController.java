package com.teammatevoices.controller;

import com.teammatevoices.dto.DispatchDTO;
import com.teammatevoices.service.DispatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dispatches")
public class DispatchController {

    private static final Logger log = LoggerFactory.getLogger(DispatchController.class);

    private final DispatchService dispatchService;

    public DispatchController(DispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @GetMapping
    public ResponseEntity<List<DispatchDTO>> getAllDispatches() {
        log.info("GET /dispatches");
        return ResponseEntity.ok(dispatchService.getAllDispatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DispatchDTO> getDispatchById(@PathVariable Long id) {
        log.info("GET /dispatches/{}", id);
        return ResponseEntity.ok(dispatchService.getDispatchById(id));
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<DispatchDTO>> getByParticipant(@PathVariable String participantId) {
        log.info("GET /dispatches/participant/{}", participantId);
        return ResponseEntity.ok(dispatchService.getDispatchesByParticipant(participantId));
    }
}
