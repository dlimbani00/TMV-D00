package com.teammatevoices.dto;

import java.util.List;

public class TextAnalyticsDTO {

    private SentimentDistribution sentimentDistribution;
    private List<KeywordItem> topKeywords;
    private List<QuestionSentiment> questionSentiments;

    public SentimentDistribution getSentimentDistribution() { return sentimentDistribution; }
    public void setSentimentDistribution(SentimentDistribution d) { this.sentimentDistribution = d; }
    public List<KeywordItem> getTopKeywords() { return topKeywords; }
    public void setTopKeywords(List<KeywordItem> k) { this.topKeywords = k; }
    public List<QuestionSentiment> getQuestionSentiments() { return questionSentiments; }
    public void setQuestionSentiments(List<QuestionSentiment> q) { this.questionSentiments = q; }

    public static class SentimentDistribution {
        private int positive;
        private int neutral;
        private int negative;
        private int total;

        public SentimentDistribution() {}
        public SentimentDistribution(int positive, int neutral, int negative) {
            this.positive = positive; this.neutral = neutral; this.negative = negative;
            this.total = positive + neutral + negative;
        }

        public int getPositive() { return positive; }
        public void setPositive(int p) { this.positive = p; }
        public int getNeutral() { return neutral; }
        public void setNeutral(int n) { this.neutral = n; }
        public int getNegative() { return negative; }
        public void setNegative(int n) { this.negative = n; }
        public int getTotal() { return total; }
        public void setTotal(int t) { this.total = t; }
    }

    public static class KeywordItem {
        private String word;
        private int count;
        private double sentiment;

        public KeywordItem() {}
        public KeywordItem(String word, int count, double sentiment) {
            this.word = word; this.count = count; this.sentiment = sentiment;
        }

        public String getWord() { return word; }
        public void setWord(String w) { this.word = w; }
        public int getCount() { return count; }
        public void setCount(int c) { this.count = c; }
        public double getSentiment() { return sentiment; }
        public void setSentiment(double s) { this.sentiment = s; }
    }

    public static class QuestionSentiment {
        private long questionId;
        private String questionText;
        private int totalAnswers;
        private int positive;
        private int neutral;
        private int negative;
        private double avgSentiment;
        private List<AnswerSentiment> answers;

        public long getQuestionId() { return questionId; }
        public void setQuestionId(long q) { this.questionId = q; }
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String t) { this.questionText = t; }
        public int getTotalAnswers() { return totalAnswers; }
        public void setTotalAnswers(int t) { this.totalAnswers = t; }
        public int getPositive() { return positive; }
        public void setPositive(int p) { this.positive = p; }
        public int getNeutral() { return neutral; }
        public void setNeutral(int n) { this.neutral = n; }
        public int getNegative() { return negative; }
        public void setNegative(int n) { this.negative = n; }
        public double getAvgSentiment() { return avgSentiment; }
        public void setAvgSentiment(double a) { this.avgSentiment = a; }
        public List<AnswerSentiment> getAnswers() { return answers; }
        public void setAnswers(List<AnswerSentiment> a) { this.answers = a; }
    }

    public static class AnswerSentiment {
        private String text;
        private double score;
        private String label;

        public AnswerSentiment() {}
        public AnswerSentiment(String text, double score, String label) {
            this.text = text; this.score = score; this.label = label;
        }

        public String getText() { return text; }
        public void setText(String t) { this.text = t; }
        public double getScore() { return score; }
        public void setScore(double s) { this.score = s; }
        public String getLabel() { return label; }
        public void setLabel(String l) { this.label = l; }
    }
}
