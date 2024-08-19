import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SuggestedEvents from "./SuggestedEvents";

const EventDetail = () => {
  const { state } = useLocation();
  const { images, location, stadium, price, details, gps } = state || {};

  const isSigned = false;
  const [isRegistered, setIsRegistered] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRegisterClick = () => {
    if (isSigned) {
      setIsRegistered(true);
    } else {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
      <Button
        variant="contained"
        color={isRegistered ? "secondary" : "primary"}
        onClick={handleRegisterClick}
        disabled={isRegistered}
      >
        {isRegistered ? "Registered" : "Register for match"}
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Sign In Required"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You must sign in or register to participate in this match.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Sign In / Register
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetail;
