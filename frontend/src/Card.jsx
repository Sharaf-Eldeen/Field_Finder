import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

const EventCard = ({
  slug,
  images,
  location,
  stadium,
  price,
  details,
  gps,
  phone,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stadium/${slug}`, {
      state: { images, location, stadium, price, details, gps, phone },
    });
  };

  return (
    <Box sx={{ margin: "1%", width: "100%", maxWidth: "90%" }}>
      <Card
        sx={{
          width: "100%",
          boxShadow: 10,
          backgroundColor: "lightgray",
          cursor: "pointer",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
        onClick={handleClick}
      >
        <CardMedia
          component="img"
          sx={{
            height: "220px",
            width: "100%",
          }}
          image={images[0]}
          alt="Event Image"
        />
        <CardContent>
          <Typography variant="h5" color="text.secondary">
            Stadium: {stadium}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Price: {price}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventCard;
