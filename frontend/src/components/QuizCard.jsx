import "../styles/quizcard.css";

const QuizCard = ({ quiz }) => {
  const difficultyClass = `badge-${quiz.difficulty?.toLowerCase() || "medium"}`;

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <span className={`quiz-badge ${difficultyClass}`}>
          {quiz.difficulty || "N/A"}
        </span>
        <span className="quiz-duration">{quiz.time_duration} min</span>
      </div>
      <h3 className="quiz-title">{quiz.topic}</h3>
      <div className="quiz-card-footer">
        <span className="quiz-questions">
          {quiz.questions?.length || 0} Questions
        </span>
        <span className="quiz-date">
          {quiz.createdAt
            ? new Date(quiz.createdAt).toLocaleDateString()
            : "—"}
        </span>
      </div>
    </div>
  );
};

export default QuizCard;
