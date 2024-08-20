import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import EventCard from "./Card.jsx";
import { useLocation, useNavigate } from "react-router-dom";

const itemsPerPage = 12;

const EventList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Placeholder for future implementation
  }, [location, page, navigate]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <section style={{ margin: "auto", width: "97%" }}>
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
          {/* Placeholder for EventCard rendering */}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
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
