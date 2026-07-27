import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";

function ContactSection() {
  return (
    <Box
      sx={{
        py: 12,
        background: "#F5F7FA",
      }}
    >
      <Container maxWidth="xl">

        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="#1565C0"
        >
          Contact Us
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 8,
          }}
        >
          Have questions? We'd love to hear from you.
        </Typography>

        <Grid container spacing={5}>

          {/* Left */}

          <Grid
            size={{
              xs:12,
              md:5
            }}
          >

            <Card
              sx={{
                p:5,
                borderRadius:5,
                height:"100%"
              }}
            >

              <Typography
                variant="h4"
                fontWeight={700}
                mb={4}
              >
                Get In Touch
              </Typography>

              <Stack spacing={4}>

                <Box display="flex" gap={2} alignItems="center">
                  <CallIcon color="primary"/>
                  <Typography>
                    +91 9596768764
                  </Typography>
                </Box>

                <Box display="flex" gap={2} alignItems="center">
                  <EmailIcon color="primary"/>
                  <Typography>
                    support@smartemergency.com
                  </Typography>
                </Box>

                <Box display="flex" gap={2} alignItems="center">
                  <LocationOnIcon color="primary"/>
                  <Typography>
                    India
                  </Typography>
                </Box>

              </Stack>

              <Box
                sx={{
                  mt:6,
                  p:3,
                  bgcolor:"#1565C0",
                  color:"white",
                  borderRadius:4,
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  🚑 Emergency?
                </Typography>

                <Typography mt={1}>
                  Use the Smart Emergency Response App
                  for instant ambulance booking.
                </Typography>

              </Box>

            </Card>

          </Grid>

          {/* Right */}

          <Grid
            size={{
              xs:12,
              md:7
            }}
          >

            <Card
              sx={{
                p:5,
                borderRadius:5
              }}
            >

              <Typography
                variant="h4"
                fontWeight={700}
                mb={4}
              >
                Send Message
              </Typography>

              <Stack spacing={3}>

                <TextField
                  label="Full Name"
                  fullWidth
                />

                <TextField
                  label="Email"
                  fullWidth
                />

                <TextField
                  label="Subject"
                  fullWidth
                />

                <TextField
                  label="Message"
                  multiline
                  rows={5}
                  fullWidth
                />

                <Button
                  variant="contained"
                  size="large"
                  endIcon={<SendIcon/>}
                  sx={{
                    py:1.5,
                    borderRadius:3
                  }}
                >
                  Send Message
                </Button>

              </Stack>

            </Card>

          </Grid>

        </Grid>

      </Container>
    </Box>
  );
}

export default ContactSection;