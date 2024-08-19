import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import EventCard from "./EventCard";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        // Fetch user data
        axios
          .get(`http://localhost:5500/api/auth/${userId}`)
          .then((response) => {
            setUser(response.data);
            setLoadingUser(false);
          })
          .catch(() => setLoadingUser(false));
      } catch {
        setLoadingUser(false);
      }
    } else {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userEmail = decoded.userEmail;

        // Fetch stadiums data
        axios
          .get(
            `http://localhost:5500/api/stadiums/findMyOwnStaduims?email=${userEmail}`
          )
          .then((response) => {
            setEvents(response.data.stadiums);
            setLoadingEvents(false);
          })
          .catch(() => setLoadingEvents(false));
      } catch {
        setLoadingEvents(false);
      }
    } else {
      setLoadingEvents(false);
    }
  }, []);

  return (
    <section>
      <h1>Profile Page</h1>
      {loadingUser ? (
        <p>Loading user data...</p>
      ) : (
        <p>Username: {user?.username}</p>
      )}
      {loadingEvents ? (
        <p>Loading stadiums...</p>
      ) : (
        events.map((event) => (
          <EventCard key={event._id} slug={event.slug} stadium={event.name} />
        ))
      )}
    </section>
  );
}
