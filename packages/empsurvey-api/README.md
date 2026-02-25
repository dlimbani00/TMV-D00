# EmpSurvey API

Spring Boot REST API for Employee Survey Management System with Oracle Database.

## Tech Stack

- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17
- **Database**: Oracle Database (Free Edition)
- **ORM**: Spring Data JPA with Hibernate
- **Build Tool**: Maven
- **Libraries**: Lombok, Validation

## Architecture

```
Controller Layer (REST API)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Oracle Database
```

## API Endpoints

Base URL: `http://localhost:8080/api`

### Surveys

- `GET /surveys` - Get all surveys
- `GET /surveys/{id}` - Get survey by ID
- `POST /surveys` - Create new survey
- `PUT /surveys/{id}` - Update survey
- `DELETE /surveys/{id}` - Delete survey
- `POST /surveys/{id}/publish` - Publish survey (change status to ACTIVE)

## Database Configuration

The application connects to Oracle Database with the following defaults:

```yaml
URL: jdbc:oracle:thin:@localhost:1521/FREEPDB1
Username: ARYA
Password: arya123
```

Override these using environment variables:
- `DB_HOST` (default: localhost)
- `DB_PORT` (default: 1521)
- `DB_SERVICE` (default: FREEPDB1)
- `DB_USER` (default: ARYA)
- `DB_PASSWORD` (default: arya123)

## Running Locally

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Oracle Database running on port 1521

### Build & Run

```bash
# Build the project
mvn clean package

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

## Running with Docker

```bash
# From project root
docker-compose up empsurvey-api
```

This will:
1. Build the Spring Boot application
2. Start Oracle Database
3. Run the API on port 8080

## Development

### Project Structure

```
src/main/java/com/arya/empsurvey/
├── EmpSurveyApplication.java       # Main application class
├── config/
│   └── WebConfig.java              # CORS and web configuration
├── controller/
│   └── SurveyController.java       # REST endpoints
├── dto/
│   ├── SurveyDTO.java             # Survey data transfer object
│   ├── QuestionDTO.java           # Question DTO
│   └── OptionDTO.java             # Option DTO
├── entity/
│   ├── Survey.java                # Survey entity
│   ├── SurveyQuestion.java        # Question entity
│   └── SurveyOption.java          # Option entity
├── exception/
│   └── GlobalExceptionHandler.java # Global error handling
├── repository/
│   └── SurveyRepository.java      # Data access layer
└── service/
    └── SurveyService.java         # Business logic layer
```

### Database Schema

The application expects these tables:
- `SURVEYS` - Main survey information
- `SURVEY_QUESTIONS` - Questions belonging to surveys
- `SURVEY_OPTIONS` - Options for multiple choice questions

Schema files are located in `../../db/init/`

## CORS Configuration

The API allows requests from:
- `http://localhost:5173` (arya-web)
- `http://localhost:5174` (survey-web)
- `http://localhost:5176` (empsurvey)

## Logging

Debug logging is enabled for:
- Application code: `com.arya.empsurvey`
- Hibernate SQL: Shows all SQL queries
- SQL Parameters: Shows bound parameters in queries

## Error Handling

All errors return JSON responses with:
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Error description"
}
```

## Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn clean test jacoco:report
```

## Building for Production

```bash
# Create JAR file
mvn clean package -DskipTests

# JAR will be in target/empsurvey-api-0.0.1-SNAPSHOT.jar
```

## License

Proprietary - ARYA Design System Project
