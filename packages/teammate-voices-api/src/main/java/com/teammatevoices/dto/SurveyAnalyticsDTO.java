package com.teammatevoices.dto;

import java.util.List;

public class SurveyAnalyticsDTO {

    private long totalResponses;
    private long completedResponses;
    private long totalDispatched;
    private double averageScore;
    private double enps;
    private List<TimelinePoint> responseTimeline;
    private List<ScoreDistributionItem> scoreDistribution;
    private List<CategoryScoreItem> categoryScores;
    private List<QuestionRankingItem> questionRankings;
    private List<DemographicItem> demographicBreakdown;
    private List<OpenEndedItem> openEndedResponses;

    // Getters and setters
    public long getTotalResponses() { return totalResponses; }
    public void setTotalResponses(long totalResponses) { this.totalResponses = totalResponses; }

    public long getCompletedResponses() { return completedResponses; }
    public void setCompletedResponses(long completedResponses) { this.completedResponses = completedResponses; }

    public long getTotalDispatched() { return totalDispatched; }
    public void setTotalDispatched(long totalDispatched) { this.totalDispatched = totalDispatched; }

    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }

    public double getEnps() { return enps; }
    public void setEnps(double enps) { this.enps = enps; }

    public List<TimelinePoint> getResponseTimeline() { return responseTimeline; }
    public void setResponseTimeline(List<TimelinePoint> responseTimeline) { this.responseTimeline = responseTimeline; }

    public List<ScoreDistributionItem> getScoreDistribution() { return scoreDistribution; }
    public void setScoreDistribution(List<ScoreDistributionItem> scoreDistribution) { this.scoreDistribution = scoreDistribution; }

    public List<CategoryScoreItem> getCategoryScores() { return categoryScores; }
    public void setCategoryScores(List<CategoryScoreItem> categoryScores) { this.categoryScores = categoryScores; }

    public List<QuestionRankingItem> getQuestionRankings() { return questionRankings; }
    public void setQuestionRankings(List<QuestionRankingItem> questionRankings) { this.questionRankings = questionRankings; }

    public List<DemographicItem> getDemographicBreakdown() { return demographicBreakdown; }
    public void setDemographicBreakdown(List<DemographicItem> demographicBreakdown) { this.demographicBreakdown = demographicBreakdown; }

    public List<OpenEndedItem> getOpenEndedResponses() { return openEndedResponses; }
    public void setOpenEndedResponses(List<OpenEndedItem> openEndedResponses) { this.openEndedResponses = openEndedResponses; }

    // --- Inner classes ---

    public static class TimelinePoint {
        private String date;
        private int count;
        private int cumulative;

        public TimelinePoint() {}
        public TimelinePoint(String date, int count, int cumulative) {
            this.date = date; this.count = count; this.cumulative = cumulative;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
        public int getCumulative() { return cumulative; }
        public void setCumulative(int cumulative) { this.cumulative = cumulative; }
    }

    public static class ScoreDistributionItem {
        private int score;
        private long count;

        public ScoreDistributionItem() {}
        public ScoreDistributionItem(int score, long count) {
            this.score = score; this.count = count;
        }

        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class CategoryScoreItem {
        private String category;
        private double avgScore;
        private int questionCount;

        public CategoryScoreItem() {}
        public CategoryScoreItem(String category, double avgScore, int questionCount) {
            this.category = category; this.avgScore = avgScore; this.questionCount = questionCount;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public double getAvgScore() { return avgScore; }
        public void setAvgScore(double avgScore) { this.avgScore = avgScore; }
        public int getQuestionCount() { return questionCount; }
        public void setQuestionCount(int questionCount) { this.questionCount = questionCount; }
    }

    public static class QuestionRankingItem {
        private long questionId;
        private String questionText;
        private double avgScore;
        private long responseCount;
        private String pageLabel;

        public QuestionRankingItem() {}

        public long getQuestionId() { return questionId; }
        public void setQuestionId(long questionId) { this.questionId = questionId; }
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        public double getAvgScore() { return avgScore; }
        public void setAvgScore(double avgScore) { this.avgScore = avgScore; }
        public long getResponseCount() { return responseCount; }
        public void setResponseCount(long responseCount) { this.responseCount = responseCount; }
        public String getPageLabel() { return pageLabel; }
        public void setPageLabel(String pageLabel) { this.pageLabel = pageLabel; }
    }

    public static class DemographicItem {
        private long questionId;
        private String field;
        private String value;
        private long count;

        public DemographicItem() {}
        public DemographicItem(long questionId, String field, String value, long count) {
            this.questionId = questionId; this.field = field; this.value = value; this.count = count;
        }

        public long getQuestionId() { return questionId; }
        public void setQuestionId(long questionId) { this.questionId = questionId; }
        public String getField() { return field; }
        public void setField(String field) { this.field = field; }
        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class OpenEndedItem {
        private long questionId;
        private String questionText;
        private List<String> answers;

        public OpenEndedItem() {}

        public long getQuestionId() { return questionId; }
        public void setQuestionId(long questionId) { this.questionId = questionId; }
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        public List<String> getAnswers() { return answers; }
        public void setAnswers(List<String> answers) { this.answers = answers; }
    }
}
