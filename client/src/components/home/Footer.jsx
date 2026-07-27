import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        bgcolor: "#0B1F33",
        color: "#fff",
        pt: 8,
        pb: 3,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          {/* Logo */}

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <LocalHospitalIcon sx={{ fontSize: 40, color: "#42A5F5" }} />

              <Typography variant="h5" fontWeight="bold">
                Smart Emergency
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 3,
                color: "#B0BEC5",
                lineHeight: 1.8,
              }}
            >
              A smart emergency response platform connecting patients,
              ambulances and hospitals with real-time tracking and intelligent
              routing.
            </Typography>
          </Grid>

          {/* Quick Links */}

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Quick Links
            </Typography>

            <Stack spacing={1.5}>
              <Link href="#" underline="none" color="#B0BEC5">
                Home
              </Link>

              <Link href="#" underline="none" color="#B0BEC5">
                Services
              </Link>

              <Link href="#" underline="none" color="#B0BEC5">
                Features
              </Link>

              <Link href="#" underline="none" color="#B0BEC5">
                Contact
              </Link>
            </Stack>
          </Grid>

          {/* Services */}

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Services
            </Typography>

            <Stack spacing={1.5}>
              <Typography color="#B0BEC5">
                Ambulance Booking
              </Typography>

              <Typography color="#B0BEC5">
                Live Tracking
              </Typography>

              <Typography color="#B0BEC5">
                Hospital Alerts
              </Typography>

              <Typography color="#B0BEC5">
                Green Corridor
              </Typography>
            </Stack>
          </Grid>

          {/* Social */}

          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Follow Us
            </Typography>

            <Stack direction="row" spacing={2}>
              <IconButton sx={{ color: "#fff" }}>
                <FacebookIcon />
              </IconButton>

              <IconButton sx={{ color: "#fff" }}>
                <LinkedInIcon />
              </IconButton>

              <IconButton sx={{ color: "#fff" }}>
                <GitHubIcon />
              </IconButton>
            </Stack>

            <Typography
              sx={{
                mt: 3,
                color: "#B0BEC5",
              }}
            >
              Building the future of emergency healthcare.
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom */}

        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: "1px solid rgba(255,255,255,.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography color="#B0BEC5">
            © 2026 Smart Emergency Response System. All rights reserved.
          </Typography>

          <IconButton
            onClick={scrollTop}
            sx={{
              bgcolor: "#1565C0",
              color: "#fff",
              "&:hover": {
                bgcolor: "#0D47A1",
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;