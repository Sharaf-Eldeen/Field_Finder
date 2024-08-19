import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import EventCard from "./EventCard";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const [errorEvents, setErrorEvents] = useState(null);

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
          .catch((err) => {
            setErrorUser(err);
            setLoadingUser(false);
          });
      } catch (err) {
        setErrorUser(err);
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
          .catch((err) => {
            if (err.response?.status === 404) {
              setErrorEvents({
                message: "You haven’t created any stadiums yet.",
              });
            } else {
              setErrorEvents(err);
            }
            setLoadingEvents(false);
          });
      } catch (err) {
        setErrorEvents(err);
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
      ) : errorUser ? (
        <p>Error: {errorUser.message}</p>
      ) : (
        <p>Username: {user?.username}</p>
      )}
      {loadingEvents ? (
        <p>Loading stadiums...</p>
      ) : errorEvents ? (
        <p>{errorEvents.message}</p>
      ) : (
        events.map((event) => (
          <EventCard key={event._id} slug={event.slug} stadium={event.name} />
        ))
      )}
    </section>
  );
}
