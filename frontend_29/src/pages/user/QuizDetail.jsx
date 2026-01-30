import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getQuizById } from "../../api/quizApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/quizdetail.css";

const QuizDetail = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const res = await getQuizById(quizId);
      setQuizData(res.data);
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const quiz = quizData?.quiz || {};
  const questionsRaw = quizData?.question?.questions;
  const questions = Array.isArray(questionsRaw)
    ? questionsRaw
    : questionsRaw?.questions || [];
  const youtube = quizData?.youtube?.video_link || [];
  const blogs = quizData?.blogs?.web_links || [];

  return (
    <div className="qd-layout">
      <Header />

      <main className="qd-main">
        <div className="qd-container">
          <div className="qd-top-bar">
            <Link to="/student/dashboard" className="qd-back-btn">
              &larr; Back to Dashboard
            </Link>
          </div>

          <div className="qd-header">
            <h1>{quiz.topic || "Quiz Details"}</h1>
          </div>

          {loading ? (
            <p className="qd-loading">Loading quiz...</p>
          ) : !quizData ? (
            <div className="qd-empty">
              <p>Quiz not found.</p>
            </div>
          ) : (
            <>
              {/* Section Tabs */}
              <div className="qd-tabs">
                <button
                  className={`qd-tab ${activeSection === "overview" ? "active" : ""}`}
                  onClick={() => setActiveSection("overview")}
                >
                  Overview
                </button>
                <button
                  className={`qd-tab ${activeSection === "youtube" ? "active" : ""}`}
                  onClick={() => setActiveSection("youtube")}
                >
                  YouTube
                  <span className="qd-tab-count">{youtube.length}</span>
                </button>
                <button
                  className={`qd-tab ${activeSection === "blogs" ? "active" : ""}`}
                  onClick={() => setActiveSection("blogs")}
                >
                  Blogs
                  <span className="qd-tab-count">{blogs.length}</span>
                </button>
              </div>

              {/* Overview Section */}
              {activeSection === "overview" && (
                <div className="qd-section">
                  <div className="qd-info-card">
                    <div className="qd-info-grid">
                      <div className="qd-info-item">
                        <span className="qd-info-label">Topic</span>
                        <span className="qd-info-value">{quiz.topic || "N/A"}</span>
                      </div>
                      <div className="qd-info-item">
                        <span className="qd-info-label">Difficulty</span>
                        <span className={`qd-info-badge badge-${(quiz.difficulty || "medium").toLowerCase()}`}>
                          {quiz.difficulty || "N/A"}
                        </span>
                      </div>
                      <div className="qd-info-item">
                        <span className="qd-info-label">Duration</span>
                        <span className="qd-info-value">{quiz.time_duration || "—"} min</span>
                      </div>
                      <div className="qd-info-item">
                        <span className="qd-info-label">Questions</span>
                        <span className="qd-info-value">{questions.length}</span>
                      </div>
                    </div>

                    {questions.length > 0 ? (
                      <button
                        className="qd-start-btn"
                        onClick={() => navigate(`/student/quiz/${quizId}/test`)}
                      >
                        Start Test
                      </button>
                    ) : (
                      <p className="qd-no-questions">
                        Questions have not been generated yet. Check back later.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* YouTube Section */}
              {activeSection === "youtube" && (
                <div className="qd-section">
                  {youtube.length === 0 ? (
                    <div className="qd-empty">
                      <p>No YouTube resources available yet.</p>
                    </div>
                  ) : (
                    <div className="qd-yt-grid">
                      {youtube.map((yt, index) => (
                        <a
                          href={yt.url || yt.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="qd-yt-card"
                          key={yt._id || index}
                        >
                          <div className="qd-yt-thumb">
                            <img
                              src={`https://img.youtube.com/vi/${yt.video_id}/mqdefault.jpg`}
                              alt={yt.title || "YouTube video"}
                            />
                            <span className="qd-yt-play">&#9654;</span>
                          </div>
                          <p className="qd-yt-title">
                            {yt.title || yt.url || yt.link}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Blogs Section */}
              {activeSection === "blogs" && (
                <div className="qd-section">
                  {blogs.length === 0 ? (
                    <div className="qd-empty">
                      <p>No blog resources available yet.</p>
                    </div>
                  ) : (
                    <div className="qd-resource-list">
                      {blogs.map((blog, index) => {
                        const url = typeof blog === "string" ? blog : blog.url || blog.link;
                        const title = typeof blog === "string" ? blog : blog.title || blog.url || blog.link;
                        return (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="qd-resource-card"
                            key={index}
                          >
                            <span className="qd-resource-icon">&#128196;</span>
                            <div className="qd-resource-info">
                              <p className="qd-resource-title">{title}</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuizDetail;
