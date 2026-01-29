import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllQuiz } from "../../api/quizApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/studentdashboard.css";

const UserDashboard = () => {
  const { user } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await getAllQuiz();
      setQuizzes(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-layout">
      <Header />

      <main className="student-main">
        <div className="student-container">
          <div className="student-welcome">
            <div>
              <h1>Available Quizzes</h1>
              <p>Browse and attempt quizzes assigned to you.</p>
            </div>
            <span className="role-badge">{user?.role}</span>
          </div>

          {loading ? (
            <p className="student-loading">Loading quizzes...</p>
          ) : quizzes.length === 0 ? (
            <div className="student-empty">
              <p>No quizzes available right now.</p>
            </div>
          ) : (
            <div className="student-quiz-grid">
              {quizzes.map((quiz, index) => {
                const difficultyClass = `s-badge-${quiz.difficulty?.toLowerCase() || "medium"}`;
                return (
                  <div className="s-quiz-card" key={quiz._id || index}>
                    <div className="s-quiz-card-top">
                      <span className={`s-quiz-badge ${difficultyClass}`}>
                        {quiz.difficulty || "N/A"}
                      </span>
                      <span className="s-quiz-duration">
                        {quiz.time_duration} min
                      </span>
                    </div>
                    <h3 className="s-quiz-topic">{quiz.topic}</h3>
                    <div className="s-quiz-meta">
                      <span>{quiz.questions?.length || 0} Questions</span>
                      <span>
                        {quiz.createdAt
                          ? new Date(quiz.createdAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <button className="s-quiz-open-btn">Open Quiz</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
