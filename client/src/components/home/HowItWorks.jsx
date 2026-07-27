import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const steps = [
  {
    icon: <LocalShippingIcon sx={{ fontSize: 45 }} />,
    title: "Request Ambulance",
    desc: "Patient requests the nearest ambulance instantly.",
  },
  {
    icon: <CheckCircleIcon sx={{ fontSize: 45 }} />,
    title: "Driver Accepts",
    desc: "Nearest available driver accepts the request.",
  },
  {
    icon: <MyLocationIcon sx={{ fontSize: 45 }} />,
    title: "Live Tracking",
    desc: "Patient tracks ambulance with live ETA.",
  },
  {
    icon: <PersonPinCircleIcon sx={{ fontSize: 45 }} />,
    title: "Patient Pickup",
    desc: "Driver reaches the location and picks up the patient.",
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 45 }} />,
    title: "Hospital Selected",
    desc: "Choose the nearest suitable hospital.",
  },
  {
    icon: <NotificationsActiveIcon sx={{ fontSize: 45 }} />,
    title: "Hospital Alert",
    desc: "Hospital receives patient details before arrival.",
  },
];

function HowItWorks() {
  return (
    <Box
      sx={{
        py: 12,
        bgcolor: "#F5F7FA",
      }}
    >
      <Container maxWidth="*1">

        <Typography
          variant="h3"
          align="center"
          fontWeight="bold"
          color="#1565C0"
        >
          How It Works
        </Typography>

        <Typography
          align="center"
          sx={{
            mt: 2,
            mb: 8,
            color: "gray",
          }}
        >
          Emergency help in just six simple steps.
        </Typography>

        <Grid container spacing={4}>
  {steps.map((step, index) => (
    <Grid
      key={index}
      size={{
        xs: 12,
        sm: 6,
        lg: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          position: "relative",
          p: 4,
          borderRadius: 5,
          height: "100%",
          overflow: "hidden",
          transition: ".35s",

          "&:hover": {
            transform: "translateY(-12px)",
            boxShadow: "0 18px 35px rgba(0,0,0,.18)",
          },
        }}
      >
       
        {/* Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#1565C0,#42A5F5)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          {step.icon}
        </Box>

        <Typography
          variant="h5"
          fontWeight={700}
        >
          {step.title}
        </Typography>

        <Typography
          sx={{
            mt: 2,
            color: "gray",
            lineHeight: 1.8,
          }}
        >
          {step.desc}
        </Typography>
      </Paper>
    </Grid>
  ))}
</Grid>

      </Container>
    </Box>
  );
}

export default HowItWorks;