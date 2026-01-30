import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllQuiz } from "../../api/quizApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import QuizCardStudent from "../../components/QuizCardStudent";
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
              {quizzes.map((quiz, index) => (
                <QuizCardStudent key={quiz._id || index} quiz={quiz} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
