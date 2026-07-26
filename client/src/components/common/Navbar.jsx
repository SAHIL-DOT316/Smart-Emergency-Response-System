import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          🚑 Smart Emergency
        </Typography>

        <Button color="inherit">Home</Button>

        <Button color="inherit">Features</Button>

        <Button color="inherit">About</Button>

        <Button color="inherit">Contact</Button>

        <Box sx={{ ml: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;