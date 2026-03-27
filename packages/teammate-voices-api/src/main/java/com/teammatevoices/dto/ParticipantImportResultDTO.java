package com.teammatevoices.dto;

import java.util.List;

public class ParticipantImportResultDTO {

    private int totalRows;
    private int created;
    private int updated;
    private int skipped;
    private List<String> errors;

    public ParticipantImportResultDTO() {}

    public ParticipantImportResultDTO(int totalRows, int created, int updated, int skipped, List<String> errors) {
        this.totalRows = totalRows;
        this.created = created;
        this.updated = updated;
        this.skipped = skipped;
        this.errors = errors;
    }

    public int getTotalRows() { return totalRows; }
    public void setTotalRows(int totalRows) { this.totalRows = totalRows; }

    public int getCreated() { return created; }
    public void setCreated(int created) { this.created = created; }

    public int getUpdated() { return updated; }
    public void setUpdated(int updated) { this.updated = updated; }

    public int getSkipped() { return skipped; }
    public void setSkipped(int skipped) { this.skipped = skipped; }

    public List<String> getErrors() { return errors; }
    public void setErrors(List<String> errors) { this.errors = errors; }
}
