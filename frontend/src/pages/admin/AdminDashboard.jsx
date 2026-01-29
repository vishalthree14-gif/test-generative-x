import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createQuiz, getQuiz, getCampaigns, createCampaign } from "../../api/quizApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import QuizCard from "../../components/QuizCard";
import CampaignCard from "../../components/CampaignCard";
import "../../styles/admindashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("quizzes");

  const [campaigns, setCampaigns] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizForm, setQuizForm] = useState({
    topic: "",
    time_duration: "",
    difficulty: "",
  });
  const [quizLoading, setQuizLoading] = useState(false);

  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignLoading, setCampaignLoading] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchCampaigns();
    fetchQuiz();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await getCampaigns();
      setCampaigns(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuiz = async () => {
    try {
      const res = await getQuiz();
      setQuizzes(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setQuizLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await createQuiz(quizForm);
      const newQuiz = res.data.quiz || res.data;
      setQuizzes((prev) => [newQuiz, ...prev]);
      setQuizForm({ topic: "", time_duration: "", difficulty: "" });
      setShowQuizForm(false);
      setMessage({ text: "Quiz created successfully!", type: "success" });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to create quiz",
        type: "error",
      });
    } finally {
      setQuizLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCampaignLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await createCampaign({ name: campaignName });
      const newCampaign = res.data.campaign || res.data;
      setCampaigns((prev) => [newCampaign, ...prev]);
      setCampaignName("");
      setShowCampaignForm(false);
      setMessage({ text: "Campaign created successfully!", type: "success" });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to create campaign",
        type: "error",
      });
    } finally {
      setCampaignLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setShowQuizForm(false);
    setShowCampaignForm(false);
    setMessage({ text: "", type: "" });
  };

  return (
    <div className="dashboard-layout">
      <Header />

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome */}
          <div className="dashboard-welcome">
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back! Manage your quizzes and campaigns.</p>
            </div>
            <span className="role-badge">{user?.role}</span>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`dashboard-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === "quizzes" ? "active" : ""}`}
              onClick={() => switchTab("quizzes")}
            >
              Quizzes
              <span className="tab-count">{quizzes.length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "campaigns" ? "active" : ""}`}
              onClick={() => switchTab("campaigns")}
            >
              Campaigns
              <span className="tab-count">{campaigns.length}</span>
            </button>
          </div>

          {/* Quizzes Tab */}
          {activeTab === "quizzes" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2 className="section-title">Your Quizzes</h2>
                <button
                  className="create-btn"
                  onClick={() => setShowQuizForm(!showQuizForm)}
                >
                  {showQuizForm ? "Cancel" : "+ Create Quiz"}
                </button>
              </div>

              {showQuizForm && (
                <div className="form-card">
                  <form onSubmit={handleCreateQuiz}>
                    <div className="form-group">
                      <label htmlFor="topic">Topic</label>
                      <input
                        type="text"
                        id="topic"
                        placeholder="Enter quiz topic"
                        value={quizForm.topic}
                        onChange={(e) =>
                          setQuizForm({ ...quizForm, topic: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="duration">Duration (minutes)</label>
                        <input
                          type="number"
                          id="duration"
                          placeholder="e.g. 120"
                          value={quizForm.time_duration}
                          onChange={(e) =>
                            setQuizForm({
                              ...quizForm,
                              time_duration: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="difficulty">Difficulty</label>
                        <select
                          id="difficulty"
                          value={quizForm.difficulty}
                          onChange={(e) =>
                            setQuizForm({
                              ...quizForm,
                              difficulty: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select difficulty</option>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={quizLoading}
                    >
                      {quizLoading ? "Creating..." : "Create Quiz"}
                    </button>
                  </form>
                </div>
              )}

              {loading ? (
                <p className="loading-text">Loading quizzes...</p>
              ) : quizzes.length === 0 ? (
                <div className="empty-state">
                  <p>No quizzes yet. Create your first quiz!</p>
                </div>
              ) : (
                <div className="quiz-grid">
                  {quizzes.map((quiz, index) => (
                    <QuizCard key={quiz._id || index} quiz={quiz} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <div className="tab-content">
              <div className="tab-header">
                <h2 className="section-title">Your Campaigns</h2>
                <button
                  className="create-btn"
                  onClick={() => setShowCampaignForm(!showCampaignForm)}
                >
                  {showCampaignForm ? "Cancel" : "+ Create Campaign"}
                </button>
              </div>

              {showCampaignForm && (
                <div className="form-card">
                  <form onSubmit={handleCreateCampaign}>
                    <div className="form-group">
                      <label htmlFor="campaignName">Campaign Name</label>
                      <input
                        type="text"
                        id="campaignName"
                        placeholder="Enter campaign name"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={campaignLoading}
                    >
                      {campaignLoading ? "Creating..." : "Create Campaign"}
                    </button>
                  </form>
                </div>
              )}

              {loading ? (
                <p className="loading-text">Loading campaigns...</p>
              ) : campaigns.length === 0 ? (
                <div className="empty-state">
                  <p>No campaigns yet. Create your first campaign!</p>
                </div>
              ) : (
                <div className="campaign-grid">
                  {campaigns.map((campaign, index) => (
                    <CampaignCard
                      key={campaign._id || index}
                      campaign={campaign}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
