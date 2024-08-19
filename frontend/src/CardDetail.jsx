import React from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
      <Carousel>
        {images &&
          images.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`Event image ${index + 1}`} />
            </div>
          ))}
      </Carousel>
      <Typography variant="h5">{stadium}</Typography>
      <Typography variant="body1">Location: {location}</Typography>
      <Typography variant="body1">Price: {price}</Typography>
      <Typography variant="body1">Details: {details}</Typography>
    </div>
  );
};

export default EventDetail;
