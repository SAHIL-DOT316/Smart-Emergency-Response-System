import {
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RouteIcon from "@mui/icons-material/Route";
import TrafficIcon from "@mui/icons-material/Traffic";
import CampaignIcon from "@mui/icons-material/Campaign";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const steps = [
  {
    icon: <LocalShippingIcon sx={{ fontSize: 45 }} />,
    title: "Ambulance Starts",
    desc: "Driver accepts the emergency request and begins the journey.",
  },
  {
    icon: <RouteIcon sx={{ fontSize: 45 }} />,
    title: "Smart Route",
    desc: "Dijkstra algorithm calculates the shortest and fastest route.",
  },
  {
    icon: <CampaignIcon sx={{ fontSize: 45 }} />,
    title: "Nearby Vehicles",
    desc: "Vehicles within a 5 km radius receive a notification to give way.",
  },
  {
    icon: <TrafficIcon sx={{ fontSize: 45 }} />,
    title: "Traffic Priority",
    desc: "Future integration with smart traffic signals to create a green corridor.",
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 45 }} />,
    title: "Hospital Ready",
    desc: "The hospital receives patient details before arrival.",
  },
];

function GreenCorridorSection() {
  return (
    <Box
      sx={{
        py: 12,
        background: "linear-gradient(180deg,#EAF4FF,#F8FBFF)",
      }}
    >
      <Container maxWidth="lg">

        <Chip
          label="FUTURE FEATURE"
          color="success"
          sx={{
            display: "block",
            mx: "auto",
            width: "fit-content",
            mb: 3,
          }}
        />

        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="#1565C0"
        >
          Smart Green Corridor
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 8,
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.8,
          }}
        >
          Our future vision is to reduce emergency response time by
          automatically creating a smart green corridor for ambulances.
        </Typography>

        {steps.map((step, index) => (
          <Box key={index}>
            <Grid
              container
              justifyContent="center"
            >
              <Grid
                size={{
                  xs: 12,
                  md: 8,
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    display: "flex",
                    gap: 3,
                    alignItems: "center",
                    transition: ".3s",

                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
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
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </Box>

                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1.5 }}
                    >
                      {step.desc}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {index !== steps.length - 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 2,
                }}
              >
                <ArrowDownwardIcon
                  sx={{
                    color: "#1565C0",
                    fontSize: 36,
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Container>
    </Box>
  );
}

export default GreenCorridorSection;