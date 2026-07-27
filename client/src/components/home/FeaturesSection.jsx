import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import heroImage from "../../assets/Emergency.svg";

const features = [
  "Live Ambulance Tracking",
  "Shortest Route using Dijkstra",
  "Nearby Hospital Recommendation",
  "Driver & Patient Dashboard",
  "Hospital Alert System",
  "Future Green Corridor Integration",
];

function FeaturesSection() {
  return (
    <Box
      sx={{
        py: 12,
        bgcolor: "#ffffff",
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={8}
          alignItems="center"
        >
          {/* Left */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Chip
              label="WHY CHOOSE US"
              color="primary"
              sx={{ mb: 3 }}
            />

            <Typography
              variant="h3"
              fontWeight={700}
              mb={3}
            >
              Smarter Emergency Response
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mb: 5,
                lineHeight: 1.8,
                fontSize: 18,
              }}
            >
              Our platform connects patients, ambulance drivers and hospitals
              into one intelligent emergency response network for faster and
              safer medical assistance.
            </Typography>

            <Stack spacing={3}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      color: "#2E7D32",
                      fontSize: 30,
                    }}
                  />

                  <Typography fontSize={18}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                mt: 5,
                px: 4,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Explore Features
            </Button>
          </Grid>

          {/* Right */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="Features"
              sx={{
                width: "100%",
                maxWidth: 600,
                display: "block",
                mx: "auto",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturesSection;