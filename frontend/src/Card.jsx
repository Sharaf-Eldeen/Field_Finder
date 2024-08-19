import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const EventCard = ({ stadium, price }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{stadium}</Typography>
        <Typography variant="body1">Price: {price}</Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard;
