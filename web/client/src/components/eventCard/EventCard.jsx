import React from "react";

const EventCard = (data) => {
  const obj = data.data;
  return (
    <div className="card">
      <div className="card-content">
        <div className="card-left">
          <h2 className="headline">{obj.headline}</h2>
          <h2 className="headline">{obj.post_title}</h2>
          <p className="text">{obj.post_body}</p>
        </div>
        <div className="card-center">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Location</span>
              <span className="info-value">{obj.location}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{obj.date}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Disaster Type</span>
              <span className="info-value">{obj.disaster_type}</span>
              <div className="info-item">
                <span className="info-label">Priority</span>
                <span className="info-value">{obj.priority}</span>
              </div>
            </div>
          </div>
          <div className="source">{obj.source}</div>
        </div>
        <div className="card-right">
          <img
            src={obj.post_image_url}
            alt={obj.post_title}
            className="card-image"
          />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
