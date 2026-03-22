package com.teammatevoices.service;

import com.teammatevoices.dto.ProgramDTO;
import com.teammatevoices.exception.ResourceNotFoundException;
import com.teammatevoices.model.Program;
import com.teammatevoices.repository.ProgramRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgramService {

    private static final Logger log = LoggerFactory.getLogger(ProgramService.class);

    private final ProgramRepository programRepository;

    public ProgramService(ProgramRepository programRepository) {
        this.programRepository = programRepository;
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
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program", id));

        program.setName(dto.getName());
        program.setDescription(dto.getDescription());
        program.setTemplateType(dto.getTemplateType());
        program.setStatus(dto.getStatus());
        program.setSurveyProgress(dto.getSurveyProgress());

        return toDTO(programRepository.save(program));
    }

    @Transactional
    public void deleteProgram(Long id) {
        log.info("Deleting program: {}", id);
        if (!programRepository.existsById(id)) {
            throw new ResourceNotFoundException("Program", id);
        }
        programRepository.deleteById(id);
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
