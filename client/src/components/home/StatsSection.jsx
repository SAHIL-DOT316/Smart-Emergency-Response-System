import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const stats = [
  {
    icon: <LocalShippingIcon sx={{ fontSize: 45, color: "#1565C0" }} />,
    value: "250+",
    label: "Ambulances",
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 45, color: "#1565C0" }} />,
    value: "120+",
    label: "Hospitals",
  },
  {
    icon: <PersonIcon sx={{ fontSize: 45, color: "#1565C0" }} />,
    value: "500+",
    label: "Drivers",
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 45, color: "#1565C0" }} />,
    value: "< 8 min",
    label: "Avg Response",
  },
];

function StatsSection() {
  return (
    <Box sx={{ py: 8, bgcolor: "#F5F7FA" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {stats.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 4,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                {item.icon}

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ mt: 2 }}
                   sx={{ ml: 13}}
                >
                  {item.value}
                </Typography>

                <Typography color="text.secondary">
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default StatsSection;