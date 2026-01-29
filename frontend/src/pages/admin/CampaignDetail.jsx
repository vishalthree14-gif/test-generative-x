import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMembers, addMember } from "../../api/compainsApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/campaigndetail.css";

const CampaignDetail = () => {
  const { id } = useParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email_address: "",
    whatsapp_number: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Bulk action state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsapp, setSendWhatsapp] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [id]);

  const fetchMembers = async () => {
    try {
      const res = await getMembers(id);
      setMembers(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await addMember({ ...formData, compain_id: id });
      const newMember = res.data.member || res.data;
      setMembers((prev) => [newMember, ...prev]);
      setFormData({ name: "", email_address: "", whatsapp_number: "" });
      setShowForm(false);
      setMessage({ text: "Member added successfully!", type: "success" });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to add member",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Selection helpers
  const toggleSelect = (memberId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === members.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(members.map((m) => m._id)));
    }
  };

  const isAllSelected = members.length > 0 && selectedIds.size === members.length;
  const isSendDisabled = selectedIds.size === 0 || (!sendEmail && !sendWhatsapp);

  const handleSend = () => {
    const payload = members
      .filter((m) => selectedIds.has(m._id))
      .map((m) => ({
        name: m.name,
        email: sendEmail ? m.email_address : null,
        whatsapp: sendWhatsapp ? m.whatsapp_number : null,
      }));

    console.log("Outreach payload:", payload);
    setMessage({
      text: `Outreach sent to ${payload.length} member${payload.length !== 1 ? "s" : ""} (check console)`,
      type: "success",
    });
  };

  return (
    <div className="cd-layout">
      <Header />

      <main className="cd-main">
        <div className="cd-container">
          <div className="cd-top-bar">
            <Link to="/mentor/dashboard" className="cd-back-btn">
              &larr; Back to Dashboard
            </Link>
          </div>

          <div className="cd-header">
            <div>
              <h1>Campaign Members</h1>
              <p>{members.length} member{members.length !== 1 ? "s" : ""}</p>
            </div>
            <button
              className="cd-add-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Add Member"}
            </button>
          </div>

          {message.text && (
            <div className={`cd-message ${message.type}`}>{message.text}</div>
          )}

          {showForm && (
            <div className="cd-form-card">
              <h2>Add New Member</h2>
              <form onSubmit={handleAddMember}>
                <div className="cd-form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter member name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="cd-form-row">
                  <div className="cd-form-group">
                    <label htmlFor="email_address">Email</label>
                    <input
                      type="email"
                      id="email_address"
                      name="email_address"
                      placeholder="Enter email"
                      value={formData.email_address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="cd-form-group">
                    <label htmlFor="whatsapp_number">WhatsApp Number</label>
                    <input
                      type="tel"
                      id="whatsapp_number"
                      name="whatsapp_number"
                      placeholder="Enter WhatsApp number"
                      value={formData.whatsapp_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="cd-submit-btn"
                  disabled={formLoading}
                >
                  {formLoading ? "Adding..." : "Add Member"}
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <p className="cd-loading">Loading members...</p>
          ) : members.length === 0 ? (
            <div className="cd-empty">
              <p>No members yet. Add your first member!</p>
            </div>
          ) : (
            <>
              {/* Bulk Action Bar */}
              <div className="cd-action-bar">
                <label className="cd-select-all">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                  <span>
                    {isAllSelected ? "Deselect All" : "Select All"}
                    {selectedIds.size > 0 && (
                      <span className="cd-selected-count">
                        ({selectedIds.size})
                      </span>
                    )}
                  </span>
                </label>

                <div className="cd-channel-toggles">
                  <button
                    className={`cd-toggle ${sendEmail ? "active" : ""}`}
                    onClick={() => setSendEmail(!sendEmail)}
                  >
                    <span className="cd-toggle-dot" />
                    Email
                  </button>
                  <button
                    className={`cd-toggle ${sendWhatsapp ? "active" : ""}`}
                    onClick={() => setSendWhatsapp(!sendWhatsapp)}
                  >
                    <span className="cd-toggle-dot" />
                    WhatsApp
                  </button>
                </div>

                <button
                  className="cd-send-btn"
                  disabled={isSendDisabled}
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>

              {/* Member List */}
              <div className="cd-member-list">
                <div className="cd-member-header">
                  <span></span>
                  <span>Name</span>
                  <span>Email</span>
                  <span>WhatsApp</span>
                </div>
                {members.map((member, index) => {
                  const hasEmail = Boolean(member.email_address);
                  const hasWhatsapp = Boolean(member.whatsapp_number);
                  const isSelected = selectedIds.has(member._id);

                  return (
                    <div
                      className={`cd-member-row ${isSelected ? "selected" : ""}`}
                      key={member._id || index}
                    >
                      <span className="cd-member-check">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(member._id)}
                        />
                      </span>
                      <span className="cd-member-name">{member.name}</span>
                      <span
                        className={`cd-member-email ${!hasEmail || !sendEmail ? "cd-disabled" : ""}`}
                      >
                        {hasEmail ? member.email_address : "—"}
                      </span>
                      <span
                        className={`cd-member-phone ${!hasWhatsapp || !sendWhatsapp ? "cd-disabled" : ""}`}
                      >
                        {hasWhatsapp ? member.whatsapp_number : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CampaignDetail;
