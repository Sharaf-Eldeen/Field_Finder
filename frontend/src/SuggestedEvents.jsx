import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useNavigate } from "react-router-dom";

const numberOfSuggestedStadiums = 5;

const SuggestedEvents = ({ city }) => {
  const [suggestedEvents, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5500/api/stadiums`, {
          params: {
            city: city,
            limit: numberOfSuggestedStadiums,
          },
        });

        setEvents(response.data.stadiums);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, [city]);

  const handleCardClick = (event) => {
    navigate(`/stadium/${event.slug}`, {
      state: {
        images: event.images,
        location: event.city,
        stadium: event.name,
        price: event.pricePerHour,
        details: event.details,
        gpsCordinates: event.location.coordinates,
        phone: event.ownerPhone,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Suggested Stadiums
      </Typography>
      <Grid container spacing={2}>
        {suggestedEvents.map((event) => (
          <Grid item key={event.id}>
            <Card
              sx={{ display: "flex", cursor: "pointer" }}
              onClick={() => handleCardClick(event)}
            >
              <CardMedia
                component="img"
                sx={{ width: "30%" }}
                image={event.images[0]}
                alt="Event Image"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {event.pricePerHour}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SuggestedEvents;
