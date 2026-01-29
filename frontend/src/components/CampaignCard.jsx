import { Link } from "react-router-dom";
import "../styles/campaigncard.css";

const CampaignCard = ({ campaign }) => {
  return (
    <Link to={`/mentor/campaign/${campaign._id}`} className="campaign-card-link">
      <div className="campaign-card">
        <div className="campaign-card-icon">C</div>
        <div className="campaign-card-body">
          <h3 className="campaign-card-name">{campaign.name}</h3>
          <span className="campaign-card-date">
            {campaign.createdAt
              ? new Date(campaign.createdAt).toLocaleDateString()
              : "—"}
          </span>
        </div>
        <span className="campaign-card-arrow">&rarr;</span>
      </div>
    </Link>
  );
};

export default CampaignCard;
