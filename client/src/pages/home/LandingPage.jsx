import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <Container sx={{ mt: 8 }}>
        <Typography variant="h2" fontWeight="bold">
          Smart Emergency Response System
        </Typography>

        <Typography
          variant="h5"
          sx={{ mt: 3 }}
        >
          Fast Emergency Response Saves Lives
        </Typography>

        <Typography
          sx={{ mt: 3, maxWidth: 600 }}
        >
          Book the nearest ambulance,
          track it in real time,
          choose the hospital,
          and activate Green Corridor simulation.
        </Typography>

        <Box sx={{ mt: 5 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
          >
            Request Ambulance
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default LandingPage;