import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddStadiumForm from "./AddStadiumForm";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  overflow: "hidden",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "20%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      "&:focus": {
        maxWidth: "100%",
      },
    },
  },
}));

export default function SearchAppBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsSigned(true);
    }
  }, []);
  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  const handleSignIn = () => {
    handleCloseSignUp();
    navigate("/signin");
  };
  const handleClickOpen = () => {
    if (isSigned) {
      setOpenForm(true);
    } else {
      setOpenSignUp(true);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    navigate(`/events?search=${searchTerm}`);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#004d40" }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              textDecoration: "none",
              color: "inherit",
            }}
          >
            KickSpot
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <AddStadiumForm open={openForm} onClose={handleCloseForm} />
      <Dialog open={openSignUp} onClose={handleCloseSignUp}>
        <DialogTitle>{"Sign Up Required"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You need to sign in first to add a stadium.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSignUp} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSignIn} color="primary" autoFocus>
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
