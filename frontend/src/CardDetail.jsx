import React from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";

const EventDetail = () => {
  const { state } = useLocation();
  const { images, location, stadium, price, details } = state || {};

  if (!state) {
    return (
      <Typography variant="h6" color="text.secondary">
        Event details not available
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h5">{stadium}</Typography>
      <Typography variant="body1">Location: {location}</Typography>
      <Typography variant="body1">Price: {price}</Typography>
      <Typography variant="body1">Details: {details}</Typography>
    </div>
  );
};

export default EventDetail;
