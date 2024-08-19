import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const EventCard = ({ slug, images, stadium, price }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stadium/${slug}`);
  };

  return (
    <Card
      onClick={handleClick}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      sx={{
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={images[0]}
        alt="Stadium Image"
      />
      <CardContent>
        <Typography variant="h5">{stadium}</Typography>
        <Typography variant="body1">Price: {price}</Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard;
