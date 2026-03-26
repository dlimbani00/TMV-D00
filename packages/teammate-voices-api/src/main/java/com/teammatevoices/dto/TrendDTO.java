package com.teammatevoices.dto;

import java.util.List;

public class TrendDTO {

    private SurveySnapshot current;
    private SurveySnapshot previous;
    private List<TrendPoint> trendLine;

    public SurveySnapshot getCurrent() { return current; }
    public void setCurrent(SurveySnapshot current) { this.current = current; }
    public SurveySnapshot getPrevious() { return previous; }
    public void setPrevious(SurveySnapshot previous) { this.previous = previous; }
    public List<TrendPoint> getTrendLine() { return trendLine; }
    public void setTrendLine(List<TrendPoint> trendLine) { this.trendLine = trendLine; }

    public static class SurveySnapshot {
        private Long surveyId;
        private String title;
        private String cycle;
        private long totalResponses;
        private double averageScore;
        private double enps;
        private double responseRate;

        public Long getSurveyId() { return surveyId; }
        public void setSurveyId(Long surveyId) { this.surveyId = surveyId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCycle() { return cycle; }
        public void setCycle(String cycle) { this.cycle = cycle; }
        public long getTotalResponses() { return totalResponses; }
        public void setTotalResponses(long totalResponses) { this.totalResponses = totalResponses; }
        public double getAverageScore() { return averageScore; }
        public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
        public double getEnps() { return enps; }
        public void setEnps(double enps) { this.enps = enps; }
        public double getResponseRate() { return responseRate; }
        public void setResponseRate(double responseRate) { this.responseRate = responseRate; }
    }

    public static class TrendPoint {
        private String label;
        private double avgScore;
        private double enps;
        private long responses;

        public TrendPoint() {}
        public TrendPoint(String label, double avgScore, double enps, long responses) {
            this.label = label; this.avgScore = avgScore; this.enps = enps; this.responses = responses;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public double getAvgScore() { return avgScore; }
        public void setAvgScore(double avgScore) { this.avgScore = avgScore; }
        public double getEnps() { return enps; }
        public void setEnps(double enps) { this.enps = enps; }
        public long getResponses() { return responses; }
        public void setResponses(long responses) { this.responses = responses; }
    }
}
