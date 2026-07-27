import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/hero.svg";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#F5F7FA",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="center">
          {/* Left Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                color: "#1565C0",
              }}
            >
              Smart Emergency Response System
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 3,
                color: "#555",
              }}
            >
              Fast Emergency Response Saves Lives
            </Typography>

            <Typography
              sx={{
                mt: 3,
                fontSize: 18,
                lineHeight: 1.8,
              }}
            >
              Book the nearest ambulance, track it live, choose the best
              hospital and enable Green Corridor simulation for faster emergency
              response.
            </Typography>

            <Box sx={{ mt: 5 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "#D32F2F",
                  mr: 2,
                }}
                onClick={() => navigate("/login")}
              >
                Request Ambulance
              </Button>

              <Button
                variant="outlined"
                size="large"
              >
                Learn More
              </Button>
            </Box>
          </Grid>

          {/* Right Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={heroImage}
              alt="Emergency Ambulance"
              sx={{
                width: "100%",
                maxWidth: 550,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HeroSection;