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

  // Initial structure with form values and state setup

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
          onChange={(e) => {
            setFormValues({ ...formValues, City: e.target.value });
          }}
        />
        <TextField
          margin="dense"
          label="Stadium Name"
          name="stadiumName"
          fullWidth
          variant="outlined"
          value={formValues.stadiumName}
          onChange={(e) => {
            setFormValues({ ...formValues, stadiumName: e.target.value });
          }}
        />
        <TextField
          margin="dense"
          label="Price"
          name="price"
          fullWidth
          variant="outlined"
          value={formValues.price}
          onChange={(e) => {
            setFormValues({ ...formValues, price: e.target.value });
          }}
        />
        <TextField
          margin="dense"
          label="Phone"
          name="phone"
          fullWidth
          variant="outlined"
          value={formValues.phone}
          onChange={(e) => {
            setFormValues({ ...formValues, phone: e.target.value });
          }}
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
          onChange={(e) => {
            setFormValues({ ...formValues, details: e.target.value });
          }}
        />
        <Box display="flex" alignItems="center">
          <TextField
            margin="dense"
            label="GPS Location"
            name="gpsLocation"
            variant="outlined"
            value={formValues.gpsLocation}
            onChange={(e) => {
              setFormValues({ ...formValues, gpsLocation: e.target.value });
            }}
            style={{ marginRight: "10px", flex: 1 }}
          />
          <Button onClick={() => {}} variant="contained" color="success">
            Get My Location
          </Button>
        </Box>
        <Box mt={2}>
          <label style={{ marginRight: "1%" }}>Images:</label>
          <input type="file" multiple onChange={() => {}} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => {}}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditStadiumForm;
