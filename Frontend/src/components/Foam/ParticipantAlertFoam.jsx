import React from "react";
import "../../styles/Participantalert.css";

const ParticipantAlert = ({ currentParticipants, maxParticipants }) => {
  const remainingSpots = maxParticipants - currentParticipants;

  let alertMessage = "";
  let alertClass = "";

  if (remainingSpots === 0) {
    alertMessage = "마감";
    alertClass = "alert-full";
  } else if (remainingSpots === 1) {
    alertMessage = "마감 임박";
    alertClass = "alert-almost-full";
  }

  if (!alertMessage) {
    return null;
  }

  return (
    <div className={`participant-alert ${alertClass}`}>
      {alertMessage && alertMessage}
    </div>
  );
};

export default ParticipantAlert;
