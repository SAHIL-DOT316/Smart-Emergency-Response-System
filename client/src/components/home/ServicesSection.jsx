import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TrafficIcon from "@mui/icons-material/Traffic";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const services = [
  {
    icon: <LocalShippingIcon sx={{ fontSize: 45 }} />,
    title: "Nearest Ambulance",
    description:
      "Automatically detects and dispatches the closest available ambulance using live GPS.",
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 45 }} />,
    title: "Smart Hospital",
    description:
      "Find nearby hospitals and notify medical staff before the patient arrives.",
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 45 }} />,
    title: "Live Tracking",
    description:
      "Track ambulance location in real time with ETA and route updates.",
  },
  {
    icon: <TrafficIcon sx={{ fontSize: 45 }} />,
    title: "Green Corridor",
    description:
      "Future smart-city integration for signal priority and traffic alerts.",
  },
];

function ServicesSection() {
  return (
    <Box
      sx={{
        py: 12,
        background: "linear-gradient(to bottom,#F8FBFF,#EEF5FF)",
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="#1565C0"
        >
          Our Smart Services
        </Typography>

        <Typography
          align="center"
          sx={{
            mt: 2,
            color: "text.secondary",
            maxWidth: 700,
            mx: "auto",
            mb: 8,
            fontSize: 18,
          }}
        >
          Everything you need for a faster, safer and smarter emergency
          response system.
        </Typography>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                lg: 3,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  minHeight: 420,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 5,
                  p: 2,
                  backdropFilter: "blur(15px)",
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  transition: "0.35s",
                  cursor: "pointer",

                  "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow: "0 20px 45px rgba(0,0,0,.15)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
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
                      mb: 3,
                    }}
                  >
                    {service.icon}
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={2}
                  >
                    {service.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.8,
                      flexGrow: 1,
                    }}
                  >
                    {service.description}
                  </Typography>

                  <Button
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 4,
                      alignSelf: "flex-start",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#1565C0",
                      p: 0,

                      "&:hover": {
                        background: "transparent",
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ServicesSection;