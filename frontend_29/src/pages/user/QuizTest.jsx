import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById, saveResults } from "../../api/quizApi";
import "../../styles/quiztest.css";

const QuizTest = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [quizMeta, setQuizMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuiz();
    return () => clearInterval(timerRef.current);
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const res = await getQuizById(quizId);
      const data = res.data;

      const quiz = data.quiz || {};
      setQuizMeta(quiz);

      const raw = data.question?.questions;
      const qs = Array.isArray(raw) ? raw : raw?.questions || [];
      setQuestions(qs);

      const minutes = parseInt(quiz.time_duration, 10) || 10;
      setTimeLeft(minutes * 60);
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start timer once questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !isSubmitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [questions, isSubmitted]);

  // Auto-submit when timer reaches 0
  const handleSubmit = useCallback(async () => {
    if (isSubmitted) return;
    clearInterval(timerRef.current);
    setIsSubmitted(true);

    let marks = 0;
    questions.forEach((q, i) => {
      if (answers[i] && answers[i] === q.answer) {
        marks++;
      }
    });
    setScore(marks);

    setSaving(true);
    try {
      await saveResults({ marks, quiz_id: quizId });
    } catch (err) {
      console.error("Failed to save results:", err);
    } finally {
      setSaving(false);
    }
  }, [isSubmitted, questions, answers, quizId]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, questions, isSubmitted, handleSubmit]);

  const selectOption = (optionLetter) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentQ]: optionLetter }));
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <div className="qt-layout">
        <p className="qt-loading">Loading test...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="qt-layout">
        <div className="qt-empty">
          <p>No questions found for this quiz.</p>
          <button className="qt-back-btn" onClick={() => navigate(`/student/quiz/${quizId}`)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Result Screen
  if (isSubmitted) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="qt-layout">
        <div className="qt-result-container">
          <div className="qt-result-card">
            <div className="qt-result-header">
              <h1>Test Completed</h1>
              <p className="qt-result-topic">{quizMeta.topic}</p>
            </div>

            <div className="qt-score-circle">
              <span className="qt-score-value">{score}</span>
              <span className="qt-score-total">/ {questions.length}</span>
            </div>

            <p className="qt-score-percent">{percentage}%</p>

            <div className="qt-result-stats">
              <div className="qt-stat">
                <span className="qt-stat-label">Correct</span>
                <span className="qt-stat-value qt-correct">{score}</span>
              </div>
              <div className="qt-stat">
                <span className="qt-stat-label">Wrong</span>
                <span className="qt-stat-value qt-wrong">{answeredCount - score}</span>
              </div>
              <div className="qt-stat">
                <span className="qt-stat-label">Unanswered</span>
                <span className="qt-stat-value qt-unanswered">{questions.length - answeredCount}</span>
              </div>
            </div>

            {saving && <p className="qt-saving">Saving result...</p>}

            <button
              className="qt-back-btn"
              onClick={() => navigate("/student/dashboard")}
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Test Screen
  const q = questions[currentQ];

  return (
    <div className="qt-layout">
      {/* Top Bar */}
      <div className="qt-topbar">
        <div className="qt-topbar-left">
          <span className="qt-topic">{quizMeta.topic}</span>
        </div>
        <div className={`qt-timer ${timeLeft <= 60 ? "qt-timer-warning" : ""}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="qt-topbar-right">
          <span className="qt-progress">
            {answeredCount} / {questions.length} answered
          </span>
        </div>
      </div>

      <div className="qt-body">
        {/* Question Navigator */}
        <div className="qt-sidebar">
          <p className="qt-sidebar-title">Questions</p>
          <div className="qt-nav-grid">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`qt-nav-btn ${
                  i === currentQ ? "qt-nav-active" : ""
                } ${answers[i] ? "qt-nav-answered" : ""}`}
                onClick={() => setCurrentQ(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Area */}
        <div className="qt-question-area">
          <div className="qt-question-card">
            <div className="qt-question-header">
              <span className="qt-question-num">Question {currentQ + 1}</span>
              <span className="qt-question-of">of {questions.length}</span>
            </div>

            <p className="qt-question-text">{q.question}</p>

            <div className="qt-options">
              {q.options?.map((opt, i) => {
                const letter = getOptionLetter(i);
                const isSelected = answers[currentQ] === letter;
                return (
                  <button
                    key={i}
                    className={`qt-option ${isSelected ? "qt-option-selected" : ""}`}
                    onClick={() => selectOption(letter)}
                  >
                    <span className="qt-option-letter">{letter}</span>
                    <span className="qt-option-text">{opt.replace(/^[A-D]\)\s*/, "")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="qt-controls">
            <button
              className="qt-ctrl-btn qt-prev"
              onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
              disabled={currentQ === 0}
            >
              Previous
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                className="qt-ctrl-btn qt-next"
                onClick={() => setCurrentQ((p) => Math.min(questions.length - 1, p + 1))}
              >
                Next
              </button>
            ) : (
              <button className="qt-ctrl-btn qt-submit" onClick={handleSubmit}>
                Submit Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTest;
