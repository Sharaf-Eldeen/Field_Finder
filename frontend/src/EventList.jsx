import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import EventCard from "./Card.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const itemsPerPage = 12;

const EventList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const searchTerm = urlParams.get("search") || "";

    if (token) {
      localStorage.setItem("jwtToken", token);
      navigate("/"); // Redirect to home or another page after storing the token
    }

    const fetchEvents = async (pageNum) => {
      try {
        const response = await axios.get(`http://localhost:5500/api/stadiums`, {
          params: {
            page: pageNum,
            limit: itemsPerPage,
            city: searchTerm,
            // StadiumName: searchTerm,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setEvents(response.data.stadiums);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents(page);
  }, [location, page, navigate]); // Depend on location, page, and navigate

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <section
      style={{
        margin: "auto",
        width: "97%",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          padding: "2%",
          paddingLeft: "5%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "5%",
          maxWidth: "100%", // Adjusting maxWidth to make it responsive
        }}
      >
        <Grid container spacing={2}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <EventCard
                slug={event.slug}
                images={event.images}
                location={event.city}
                stadium={event.name}
                price={event.pricePerHour}
                details={event.details}
                phone={event.ownerPhone}
                gps={event.location}
              />
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChange}
            color="success"
          />
        </Box>
      </Box>
    </section>
  );
};

export default EventList;
