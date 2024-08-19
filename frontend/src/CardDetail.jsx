import React from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SuggestedEvents from "./SuggestedEvents";

const EventDetail = () => {
  const { state } = useLocation();
  const { images, location, stadium, price, details, gps } = state || {};

  let gpslink;
  if (gps && gps.coordinates) {
    const [latitude, longitude] = gps.coordinates;
    gpslink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  } else {
    gpslink = `https://www.google.com/maps?q=10,10`;
  }

  if (!state) {
    return (
      <Typography variant="h6" color="text.secondary">
        Event details not available
      </Typography>
    );
  }

  return (
    <Box>
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
      <SuggestedEvents city={location} />
      <Button variant="outlined" href={gpslink} target="_blank">
        View on Google Maps
      </Button>
    </Box>
  );
};

export default EventDetail;
