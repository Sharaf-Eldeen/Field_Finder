// Initial basic form with input fields for city, stadium name, price, phone, and details.
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formValues);
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
        />
        <TextField
          margin="dense"
          label="Stadium Name"
          name="stadiumName"
          fullWidth
          variant="outlined"
          value={formValues.stadiumName}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Price"
          name="price"
          fullWidth
          variant="outlined"
          value={formValues.price}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Phone"
          name="phone"
          fullWidth
          variant="outlined"
          value={formValues.phone}
          onChange={handleInputChange}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddStadiumForm;
