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

  const validate = () => {
    const newErrors = {};
    if (!formValues.city) newErrors.city = "City is required";
    if (!formValues.stadiumName)
      newErrors.stadiumName = "Stadium Name is required";
    if (!formValues.price || isNaN(formValues.price))
      newErrors.price = "Valid price is required";
    if (!formValues.phone || !/^\d+$/.test(formValues.phone))
      newErrors.phone = "Valid phone number is required";
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

    // Normally you'd send formData to your API here
    console.log("Form submitted with images:", formData);
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
