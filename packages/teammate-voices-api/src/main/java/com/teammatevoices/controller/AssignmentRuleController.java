package com.teammatevoices.controller;

import com.teammatevoices.dto.AssignmentRuleDTO;
import com.teammatevoices.service.AssignmentRuleService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignment-rules")
public class AssignmentRuleController {

    private static final Logger log = LoggerFactory.getLogger(AssignmentRuleController.class);

    private final AssignmentRuleService ruleService;

    public AssignmentRuleController(AssignmentRuleService ruleService) {
        this.ruleService = ruleService;
    }

    @GetMapping
    public ResponseEntity<List<AssignmentRuleDTO>> getAllRules() {
        log.info("GET /assignment-rules");
        return ResponseEntity.ok(ruleService.getAllRules());
    }

    @PostMapping
    public ResponseEntity<AssignmentRuleDTO> createRule(@Valid @RequestBody AssignmentRuleDTO dto) {
        log.info("POST /assignment-rules - {}", dto.getRuleName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ruleService.createRule(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentRuleDTO> updateRule(@PathVariable Long id, @Valid @RequestBody AssignmentRuleDTO dto) {
        log.info("PUT /assignment-rules/{}", id);
        return ResponseEntity.ok(ruleService.updateRule(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable Long id) {
        log.info("DELETE /assignment-rules/{}", id);
        ruleService.deleteRule(id);
        return ResponseEntity.noContent().build();
    }
}
