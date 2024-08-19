import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import EditStadiumForm from "./EditStadiumForm.jsx";
import axios from "axios";

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
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stadium/${slug}`, {
      state: { images, location, stadium, price, details, gps, phone },
    });
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleEditSubmitClick = (data) => {
    axios
      .put(`http://localhost:5500/api/stadiums/${slug}`, data)
      .then((response) => {
        console.log(`Updated post with slug ${slug}`);
        setOpenForm(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteClick = () => {
    axios
      .delete(`http://localhost:5500/api/stadiums/${slug}`)
      .then((response) => {
        console.log(`Deleted post with slug ${slug}`);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
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
      >
        <CardMedia
          component="img"
          sx={{
            height: "220px",
            width: "100%",
          }}
          image={images[0]}
          alt="Event Image"
          onClick={handleClick}
        />
        <CardContent onClick={handleClick}>
          <Typography variant="h5" color="text.secondary">
            Stadium: {stadium}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Price: {price}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="info" onClick={handleOpenForm}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteClick}>
            Delete
          </Button>
        </CardActions>
      </Card>
      <EditStadiumForm
        open={openForm}
        onClose={handleCloseForm}
        stadium={{
          slug,
          images,
          location,
          stadium,
          price,
          details,
          gps,
          phone,
        }}
        onSubmit={handleEditSubmitClick}
      />
    </Box>
  );
};

export default EventCard;
