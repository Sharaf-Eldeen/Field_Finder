import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = React.useState({});
  const [formValues, setFormValues] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userData = {
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    };

    const errors = validate(userData);
    if (Object.keys(errors).length !== 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const result = await response.json();

        if (response.status === 400) {
          const validationErrors = {};
          result.errors.forEach((error) => {
            validationErrors[error.param] = error.msg;
          });
          setFormErrors(validationErrors);
        } else {
          setFormErrors({ general: "Server error. Please try again later." });
        }
        return;
      }

      const result = await response.json();
      localStorage.setItem("jwtToken", result.token);

      navigate("/signin");
      window.location.reload();
    } catch (error) {
      setFormErrors({ general: "Server error. Please try again later." });
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    if (formErrors[name] || formErrors.general) {
      setFormErrors({ ...formErrors, [name]: "", general: "" });
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Username is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleGoogleSignIn = () => {
    window.open("http://localhost:5500/google/auth/google", "_self");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // padding: 2,
          // marginLeft: "85%",
          marginTop: "55px",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            padding: 4,
            borderRadius: 1,
            boxShadow: 3,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={formValues.username}
                  onChange={handleInputChange}
                  onFocus={() => setFormErrors({ ...formErrors, username: "" })}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  onFocus={() => setFormErrors({ ...formErrors, email: "" })}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  onFocus={() => setFormErrors({ ...formErrors, password: "" })}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>
            </Grid>
            {formErrors.general && (
              <Typography color="error" variant="body2">
                {formErrors.general}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
              >
                Sign up with Google
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
