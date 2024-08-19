import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SuggestedEvents from "./SuggestedEvents";

const EventDetail = () => {
  const style = {
    fontFamily: "'Roboto', sans-serif",
  };
  // const { slug } = useParams(); // Get ID from route
  const { state } = useLocation();
  const {
    images,
    location,
    stadium,
    price,
    details,
    gps,
    phone,
    gpsCordinates,
  } = state || {};

  let gpslink;
  if (gps && gps.coordinates) {
    let gpsCordinates = gps.coordinates;
    const latitude = gpsCordinates[0];
    const longitude = gpsCordinates[1];
    gpslink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  } else if (gpsCordinates) {
    const latitude = gpsCordinates[0];
    const longitude = gpsCordinates[1];
    gpslink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  } else {
    gpslink = ` https://www.google.com/maps?q=10,10`;
  }
  // Extract coordinates

  const isSigned = false; // Assume the user is not signed in
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

  if (!state) {
    return (
      <Typography variant="h6" color="text.secondary">
        Event details not available
      </Typography>
    );
  }

  return (
    <section
      style={{
        margin: "auto",
        width: "97%",
        paddingRight: "60px",
        paddingBottom: "30px",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: { xs: "100%", sm: 800, md: 1200 },
          margin: "auto",
          marginTop: "10%",
          marginBottom: "3%",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: "lightgray" }}>
              <Carousel>
                {images &&
                  images.map((img, index) => (
                    <div key={index}>
                      <img
                        src={img}
                        alt={`Event image ${index + 1}`}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  ))}
              </Carousel>
              <CardContent sx={{ backgroundColor: "lightgray" }}>
                <Typography variant="h5" component="div" style={style}>
                  <b>Stadium:</b> {stadium}
                </Typography>
                <Typography variant="h6" component="div" style={style}>
                  <b>City:</b> {location}
                </Typography>

                <Typography variant="h6" component="div" style={style}>
                  <b>Price:</b> {price}
                </Typography>
                <Typography variant="h6" component="div" style={style}>
                  <b>Phone:</b> {phone}
                </Typography>
                <Typography variant="body1" component="p" style={style}>
                  <b>Description:</b> {details}
                </Typography>
                {/* <Button
                variant="contained"
                color={isRegistered ? "secondary" : "primary"}
                onClick={handleRegisterClick}
                disabled={isRegistered}
                sx={{ marginTop: 2 }}
              >
                {isRegistered ? "Registered" : "Register for match"}
              </Button> */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <SuggestedEvents city={location} />
            <Box
              sx={{
                marginBottom: "20%",
                marginTop: "2%",
                padding: "5%",
                backgroundColor: "lightgray",
                borderRadius: 1,
                textAlign: "center",
                width: "100%",
                boxShadow: 3,
                marginLeft: "21%",
              }}
            >
              <Typography variant="h6">GPS Location</Typography>
              <Button
                variant="outlined"
                color="primary"
                href={gpslink}
                target="_blank"
                sx={{ marginTop: 1 }}
              >
                View on Google Maps
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Sign In Required"}
          </DialogTitle>
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
    </section>
  );
};

export default EventDetail;
