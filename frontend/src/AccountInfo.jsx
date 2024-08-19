import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardImage,
} from "mdb-react-ui-kit";
import EventCard from "./AccountCard";
import { Navigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const [errorEvents, setErrorEvents] = useState(null);
  const navigate = useNavigate();

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
        console.error("Failed to decode JWT:", err);
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
            ` http://localhost:5500/api/stadiums/findMyOwnStaduims?email=${userEmail}`
          )
          .then((response) => {
            setEvents(response.data.stadiums);
            setLoadingEvents(false);
          })
          .catch((err) => {
            if (err.response.status == "404") {
              setErrorEvents({
                message: "You haven’t created the stadiums yet.",
              });
              setLoadingEvents(false);
            } else {
              setErrorEvents(err);
              setLoadingEvents(false);
            }
          });
      } catch (err) {
        console.error("Failed to decode JWT:", err);
        setLoadingEvents(false);
      }
    } else {
      setLoadingEvents(false);
    }
  }, []);

  if (loadingUser) return <div>Loading user data...</div>;
  if (errorUser) return <div>Error: {errorUser.message}</div>;
  function handleLogout() {
    localStorage.removeItem("jwtToken");
    navigate("/");
    window.location.reload();
  }
  return (
    <section
      style={{
        margin: "auto",
        width: "100%",
        marginTop: "30px",
      }}
    >
      <MDBContainer className="py-5 px-4" style={{ maxWidth: "100%" }}>
        <MDBCard style={{ backgroundColor: "lightgray" }}>
          <MDBCardBody>
            <MDBRow className="justify-content-center">
              <MDBCol lg="4" className="text-center mb-4">
                <MDBCardImage
                  src="./download.png"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ backgroundColor: "Lightgray", marginBottom: "5px" }}
                  fluid
                />
                <MDBCardText className="text-muted">
                  {user ? user.username : "Loading..."}
                </MDBCardText>
                <MDBCardText className="text-muted">
                  {user ? user.email : "Loading..."}
                </MDBCardText>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                >
                  logout
                </Button>
              </MDBCol>

              <MDBCol lg="8">
                <h5>Added Stadiums:</h5>
                {loadingEvents ? (
                  <div>Loading stadiums...</div>
                ) : errorEvents ? (
                  <div> {errorEvents.message}</div>
                ) : events.length === 0 ? (
                  <div>No stadiums added yet.</div>
                ) : (
                  <MDBRow>
                    {events.map((event) => (
                      <MDBCol md="6" key={event._id} className="mb-4">
                        <EventCard
                          slug={event.slug}
                          images={event.images}
                          location={event.city}
                          stadium={event.name}
                          price={event.pricePerHour}
                          details={event.details}
                          phone={event.ownerPhone}
                          gps={event.location.coordinates}
                        />
                      </MDBCol>
                    ))}
                  </MDBRow>
                )}
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </section>
  );
}
