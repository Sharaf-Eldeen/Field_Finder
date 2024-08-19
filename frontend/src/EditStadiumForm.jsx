import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function EditStadiumForm({ open, onClose, stadium }) {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    City: `${stadium.location}`,
    stadiumName: `${stadium.stadium}`,
    price: `${stadium.price}`,
    phone: `${stadium.phone}`,
    details: `${stadium.details}`,
    gpsLocation: `${stadium.gps}`,
  });
  const fullPathImage = stadium.images;
  const onlyNameOfTheImage = fullPathImage.map((url) =>
    url.replace("http://localhost:5500/", "")
  );
  const [pictures, setPictures] = useState([onlyNameOfTheImage]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleInputFocus = (e) => {
    const { name } = e.target;
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleFileChange = (e) => {
    setPictures(Array.from(e.target.files));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormValues({
            ...formValues,
            gpsLocation: `${latitude},${longitude}`,
          });
          setErrors({
            ...errors,
            gpsLocation: "", // Clear the error for GPS location
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to retrieve location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formValues.City) newErrors.City = "City is required";
    if (!formValues.stadiumName)
      newErrors.stadiumName = "Stadium Name is required";
    if (!formValues.price || isNaN(formValues.price))
      newErrors.price = "Valid price is required";
    if (!formValues.phone || !/^\d+$/.test(formValues.phone))
      newErrors.phone = "Valid phone number is required";
    if (!formValues.gpsLocation)
      newErrors.gpsLocation = "GPS Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const token = localStorage.getItem("jwtToken");
    const decoded = jwtDecode(token);
    const email = decoded.userEmail;

    const formData = new FormData();

    formData.append("name", formValues.stadiumName);
    formData.append("city", formValues.City);
    formData.append("pricePerHour", formValues.price);
    formData.append("ownerPhone", formValues.phone);
    formData.append("details", formValues.details);
    formData.append("email", email);

    for (let i = 0; i < pictures.length; i++) {
      formData.append("images", pictures[i]);
    }

    formData.append(
      "location",
      JSON.stringify({
        type: "Point",
        coordinates: formValues.gpsLocation.split(",").map(Number),
      })
    );

    try {
      const response = await axios.put(
        `http://localhost:5500/api/stadiums/${stadium.slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Stadium updated:", response.data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating stadium:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Existing Stadium</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="City"
          name="City"
          fullWidth
          variant="outlined"
          value={formValues.City}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          error={!!errors.City}
          helperText={errors.City}
        />
        <TextField
          margin="dense"
          label="Stadium Name"
          name="stadiumName"
          fullWidth
          variant="outlined"
          value={formValues.stadiumName}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          error={!!errors.stadiumName}
          helperText={errors.stadiumName}
        />
        <TextField
          margin="dense"
          label="Price"
          name="price"
          fullWidth
          variant="outlined"
          value={formValues.price}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          error={!!errors.price}
          helperText={errors.price}
        />
        <TextField
          margin="dense"
          label="Phone"
          name="phone"
          fullWidth
          variant="outlined"
          value={formValues.phone}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <TextField
          margin="dense"
          label="Details"
          name="details"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={formValues.details}
          onChange={handleInputChange}
        />
        <Box display="flex" alignItems="center">
          <TextField
            margin="dense"
            label="GPS Location"
            name="gpsLocation"
            variant="outlined"
            value={formValues.gpsLocation}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            error={!!errors.gpsLocation}
            helperText={errors.gpsLocation}
            style={{ marginRight: "10px", flex: 1 }}
          />
          <Button
            onClick={handleGetLocation}
            variant="contained"
            color="success"
          >
            Get My Location
          </Button>
        </Box>
        <Box mt={2}>
          <label style={{ marginRight: "1%" }}>Images:</label>
          <input type="file" multiple onChange={handleFileChange} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditStadiumForm;
