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

function AddStadiumForm({ open, onClose }) {
  const [formValues, setFormValues] = useState({
    city: "",
    stadiumName: "",
    price: "",
    phone: "",
    details: "",
    gpsLocation: "",
  });

  const [pictures, setPictures] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPictures(e.target.files);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormValues((prevValues) => ({
            ...prevValues,
            gpsLocation: `${latitude},${longitude}`,
          }));
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
    if (!formValues.city) newErrors.city = "City is required";
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

  const handleSubmit = () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", formValues.stadiumName);
    formData.append("city", formValues.city);
    formData.append("pricePerHour", formValues.price);
    formData.append("ownerPhone", formValues.phone);
    formData.append("details", formValues.details);

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

    console.log("Form submitted with location and images:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Stadium</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="City"
          name="city"
          fullWidth
          variant="outlined"
          value={formValues.city}
          onChange={handleInputChange}
          error={!!errors.city}
          helperText={errors.city}
        />
        <TextField
          margin="dense"
          label="Stadium Name"
          name="stadiumName"
          fullWidth
          variant="outlined"
          value={formValues.stadiumName}
          onChange={handleInputChange}
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
            error={!!errors.gpsLocation}
            helperText={errors.gpsLocation}
            sx={{ marginRight: 2, flex: 1 }}
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

export default AddStadiumForm;
