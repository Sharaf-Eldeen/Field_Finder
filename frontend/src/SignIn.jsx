import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect } from "react";

const defaultTheme = createTheme();

export default function SignIn() {
  // const location = useLocation();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = React.useState({});
  const [formValues, setFormValues] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const credentials = {
      email: data.get("email"),
      password: data.get("password"),
    };

    const errors = validate(credentials);
    if (Object.keys(errors).length !== 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const result = await response.json();
        if (response.status === 404) {
          setFormErrors({ general: "Invalid email or password" });
        } else if (response.status === 400) {
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

      navigate("/");
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
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  const handleGoogleSignIn = () => {
    window.open("http://localhost:5500/google/auth/google", "_self");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
        <Container component="main" maxWidth="xs">
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
            <Avatar sx={{ m: 1, bgcolor: "#4caf50" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formValues.email}
                onChange={handleInputChange}
                onFocus={() => setFormErrors({ ...formErrors, email: "" })}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formValues.password}
                onChange={handleInputChange}
                onFocus={() => setFormErrors({ ...formErrors, password: "" })}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              {formErrors.general && (
                <Typography color="error" variant="body2">
                  {formErrors.general}
                </Typography>
              )}
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href="/signup"
                    variant="body2"
                    onClick={handleSignUpRedirect}
                  >
                    {"Don't have an account? Sign Up"}
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
                  Sign in with Google
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
