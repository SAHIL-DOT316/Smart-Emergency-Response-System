import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  updateAdminProfile,
  changeAdminPassword,
} from "../../services/adminService";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Alert,
  Snackbar,
  InputAdornment,
  Chip,
  LinearProgress,
} from "@mui/material";

import {
  Person,
  Email,
  AdminPanelSettings,
  Security,
  Edit,
  Close,
  Lock,
  LocalShipping,
  LocalHospital,
  Emergency,
  Assessment,
  CheckCircle,
  Visibility,
  VisibilityOff,
  Dashboard,
  VerifiedUser,
  CalendarMonth,
  Shield,
  Key,
  ArrowForward,
} from "@mui/icons-material";

function Profile() {
  const { user, login, token } = useAuth();

  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    open: false,
    type: "success",
    text: "",
  });

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
        }}
      >
        <Typography color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  const fullName = user.fullName || "Administrator";
  const email = user.email || "Not available";
  const role = user.role || "admin";

  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const updatedDate = user.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const showMessage = (text, type = "success") => {
    setMessage({
      open: true,
      type,
      text,
    });
  };

  const closeMessage = () => {
    setMessage((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEditOpen = () => {
    setEditData({
      fullName: user.fullName || "",
      email: user.email || "",
    });

    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    if (
      !editData.fullName.trim() ||
      !editData.email.trim()
    ) {
      showMessage(
        "Full name and email are required",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await updateAdminProfile({
        fullName: editData.fullName.trim(),
        email: editData.email.trim(),
      });

      if (response.success) {
        login(token, response.admin);

        setOpenEdit(false);

        showMessage(
          "Profile updated successfully",
          "success"
        );
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Failed to update profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PASSWORD
  // ==========================================

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePassword = async () => {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      showMessage(
        "Please fill all password fields",
        "error"
      );
      return;
    }

    if (newPassword.length < 6) {
      showMessage(
        "New password must be at least 6 characters",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage(
        "New passwords do not match",
        "error"
      );
      return;
    }

    if (currentPassword === newPassword) {
      showMessage(
        "New password must be different from current password",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await changeAdminPassword({
        currentPassword,
        newPassword,
      });

      if (response.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

        setOpenPassword(false);

        showMessage(
          "Password changed successfully",
          "success"
        );
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Failed to change password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PERMISSIONS
  // ==========================================

  const permissions = [
    {
      title: "Driver Management",
      description: "Manage ambulance drivers",
      icon: <LocalShipping />,
    },
    {
      title: "Hospital Management",
      description: "Manage registered hospitals",
      icon: <LocalHospital />,
    },
    {
      title: "Emergency Monitoring",
      description: "Monitor emergency requests",
      icon: <Emergency />,
    },
    {
      title: "Reports & Analytics",
      description: "View system reports",
      icon: <Assessment />,
    },
  ];

  // ==========================================
  // QUICK ACTIONS
  // ==========================================

  const quickActions = [
    {
      title: "Dashboard",
      description: "Go to admin dashboard",
      icon: <Dashboard />,
    },
    {
      title: "Edit Profile",
      description: "Update your information",
      icon: <Edit />,
      action: handleEditOpen,
    },
    {
      title: "Security",
      description: "Change account password",
      icon: <Shield />,
      action: () => setOpenPassword(true),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f5f8fc 0%, #eef4fb 100%)",
        px: {
          xs: 1.5,
          sm: 3,
          md: 4,
        },
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 25,
                sm: 30,
              },
              fontWeight: 800,
              color: "#172033",
            }}
          >
            My Profile
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 14,
              color: "#718096",
            }}
          >
            Manage your administrator account
          </Typography>
        </Box>

        <Chip
          icon={<VerifiedUser sx={{ fontSize: 17 }} />}
          label="Verified Administrator"
          sx={{
            background: "#e9f7ef",
            color: "#237a43",
            fontWeight: 700,
            borderRadius: "8px",
          }}
        />
      </Box>

      {/* ==========================================
          MAIN PROFILE CARD
      ========================================== */}

      <Card
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid #e1e8f0",
          boxShadow:
            "0 10px 35px rgba(31, 41, 55, 0.07)",
          mb: 3,
        }}
      >
        {/* TOP BLUE AREA */}

        <Box
          sx={{
            height: {
              xs: 90,
              sm: 115,
            },
            background:
              "linear-gradient(110deg, #1976d2, #1565c0)",
          }}
        />

        <CardContent
          sx={{
            px: {
              xs: 2,
              sm: 3.5,
            },
            pb: 3.5,
            pt: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                gap: 2,
                mt: {
                  xs: -4,
                  sm: -4.5,
                },
              }}
            >
              <Avatar
                sx={{
                  width: {
                    xs: 78,
                    sm: 92,
                  },
                  height: {
                    xs: 78,
                    sm: 92,
                  },
                  border: "5px solid white",
                  background:
                    "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                  color: "#1565c0",
                  fontSize: {
                    xs: 25,
                    sm: 30,
                  },
                  fontWeight: 800,
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.12)",
                }}
              >
                {initials}
              </Avatar>

              <Box
                sx={{
                  mt: {
                    xs: 4,
                    sm: 4,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: 20,
                      sm: 24,
                    },
                    fontWeight: 800,
                    color: "#172033",
                  }}
                >
                  {fullName}
                </Typography>

                <Typography
                  sx={{
                    color: "#718096",
                    fontSize: 13,
                    mt: 0.3,
                  }}
                >
                  {email}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    size="small"
                    icon={
                      <AdminPanelSettings
                        sx={{ fontSize: 15 }}
                      />
                    }
                    label={role}
                    sx={{
                      background: "#eaf3ff",
                      color: "#1769aa",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: 10,
                    }}
                  />

                  <Chip
                    size="small"
                    icon={
                      <CheckCircle
                        sx={{ fontSize: 15 }}
                      />
                    }
                    label="Active"
                    sx={{
                      background: "#eaf8ef",
                      color: "#287d45",
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                  />
                </Stack>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEditOpen}
              sx={{
                width: {
                  xs: "100%",
                  md: "auto",
                },
                minWidth: 145,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
                py: 1.1,
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ==========================================
          ACCOUNT OVERVIEW
      ========================================== */}

      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 800,
          color: "#172033",
          mb: 1.8,
        }}
      >
        Account Overview
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {/* ROLE CARD */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: "15px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 5px 20px rgba(15,23,42,0.05)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#eaf3ff",
                  color: "#1976d2",
                  mb: 2,
                }}
              >
                <AdminPanelSettings />
              </Box>

              <Typography
                sx={{
                  color: "#7a8699",
                  fontSize: 12,
                }}
              >
                Account Role
              </Typography>

              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#26364a",
                  mt: 0.4,
                  textTransform: "capitalize",
                }}
              >
                {role}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* STATUS CARD */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: "15px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 5px 20px rgba(15,23,42,0.05)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#eaf8ef",
                  color: "#2e7d32",
                  mb: 2,
                }}
              >
                <CheckCircle />
              </Box>

              <Typography
                sx={{
                  color: "#7a8699",
                  fontSize: 12,
                }}
              >
                Account Status
              </Typography>

              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#2e7d32",
                  mt: 0.4,
                }}
              >
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* MEMBER SINCE */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: "15px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 5px 20px rgba(15,23,42,0.05)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff4e5",
                  color: "#ed8b00",
                  mb: 2,
                }}
              >
                <CalendarMonth />
              </Box>

              <Typography
                sx={{
                  color: "#7a8699",
                  fontSize: 12,
                }}
              >
                Member Since
              </Typography>

              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#26364a",
                  mt: 0.4,
                }}
              >
                {createdDate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* LAST UPDATED */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: "15px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 5px 20px rgba(15,23,42,0.05)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f1ecff",
                  color: "#6a4bc3",
                  mb: 2,
                }}
              >
                <Key />
              </Box>

              <Typography
                sx={{
                  color: "#7a8699",
                  fontSize: 12,
                }}
              >
                Last Updated
              </Typography>

              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#26364a",
                  mt: 0.4,
                }}
              >
                {updatedDate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ==========================================
          INFORMATION + SECURITY
      ========================================== */}

      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {/* PERSONAL INFORMATION */}

        <Grid item xs={12} lg={7}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 5px 20px rgba(15,23,42,0.05)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "10px",
                    background: "#eaf3ff",
                    color: "#1976d2",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Person />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#172033",
                    }}
                  >
                    Personal Information
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#7a8699",
                    }}
                  >
                    Your administrator account details
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "11px",
                      background: "#f8fafc",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#8490a3",
                        mb: 0.8,
                      }}
                    >
                      FULL NAME
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Person
                        sx={{
                          fontSize: 19,
                          color: "#1976d2",
                        }}
                      />

                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#26364a",
                        }}
                      >
                        {fullName}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "11px",
                      background: "#f8fafc",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#8490a3",
                        mb: 0.8,
                      }}
                    >
                      EMAIL ADDRESS
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Email
                        sx={{
                          fontSize: 19,
                          color: "#1976d2",
                        }}
                      />

                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#26364a",
                          wordBreak: "break-word",
                          fontSize: 13,
                        }}
                      >
                        {email}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "11px",
                      background: "#f8fafc",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#8490a3",
                        mb: 0.8,
                      }}
                    >
                      ACCOUNT ROLE
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <AdminPanelSettings
                        sx={{
                          fontSize: 19,
                          color: "#1976d2",
                        }}
                      />

                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#26364a",
                          textTransform: "capitalize",
                        }}
                      >
                        {role}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "11px",
                      background: "#f8fafc",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#8490a3",
                        mb: 0.8,
                      }}
                    >
                      ACCOUNT STATUS
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <CheckCircle
                        sx={{
                          fontSize: 19,
                          color: "#2e7d32",
                        }}
                      />

                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#2e7d32",
                        }}
                      >
                        Active
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* SECURITY */}

        <Grid item xs={12} lg={5}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 5px 20px rgba(15,23,42,0.05)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "10px",
                    background: "#fff1f2",
                    color: "#d32f2f",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Security />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#172033",
                    }}
                  >
                    Account Security
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#7a8699",
                    }}
                  >
                    Protect your administrator account
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Box
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  background: "#f8fafc",
                  mb: 2,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "10px",
                      background: "#eaf3ff",
                      color: "#1976d2",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Lock />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#26364a",
                      }}
                    >
                      Password Protection
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#7a8699",
                      }}
                    >
                      Your password is securely encrypted
                    </Typography>
                  </Box>

                  <CheckCircle
                    sx={{
                      color: "#2e7d32",
                      fontSize: 20,
                    }}
                  />
                </Stack>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.7 }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#596579",
                    }}
                  >
                    Security Status
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#2e7d32",
                    }}
                  >
                    Secure
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    height: 6,
                    borderRadius: 5,
                    background: "#e5e7eb",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setOpenPassword(true)}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  py: 1.1,
                }}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ==========================================
          ADMINISTRATOR ACCESS
      ========================================== */}

      <Card
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow:
            "0 5px 20px rgba(15,23,42,0.05)",
          mb: 3.5,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 800,
              color: "#172033",
            }}
          >
            Administrator Access
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "#7a8699",
              mt: 0.5,
            }}
          >
            Permissions available to your administrator account
          </Typography>

          <Divider sx={{ my: 2.5 }} />

          <Grid container spacing={2}>
            {permissions.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                key={item.title}
              >
                <Box
                  sx={{
                    p: 2.2,
                    height: "100%",
                    borderRadius: "12px",
                    border: "1px solid #e3e8ef",
                    background: "#fbfcfe",
                    transition: "all .2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: "#b9d3f2",
                      boxShadow:
                        "0 7px 20px rgba(25,118,210,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "11px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#eaf3ff",
                      color: "#1976d2",
                      mb: 1.5,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#26364a",
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#7a8699",
                      mt: 0.6,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{ mt: 1.5 }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 15,
                        color: "#2e7d32",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#2e7d32",
                      }}
                    >
                      Full Access
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* ==========================================
          QUICK ACTIONS
      ========================================== */}

      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 800,
          color: "#172033",
          mb: 1.8,
        }}
      >
        Quick Actions
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 2 }}>
        {quickActions.map((item) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={item.title}
          >
            <Card
              onClick={item.action}
              sx={{
                cursor: item.action
                  ? "pointer"
                  : "default",
                borderRadius: "15px",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 5px 20px rgba(15,23,42,0.05)",
                transition: "all .2s ease",
                "&:hover": item.action
                  ? {
                      transform: "translateY(-3px)",
                      borderColor: "#b9d3f2",
                    }
                  : {},
              }}
            >
              <CardContent
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.7,
                }}
              >
                <Box
                  sx={{
                    width: 45,
                    height: 45,
                    flexShrink: 0,
                    borderRadius: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#eaf3ff",
                    color: "#1976d2",
                  }}
                >
                  {item.icon}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: 13,
                      color: "#26364a",
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#7a8699",
                      mt: 0.4,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>

                <ArrowForward
                  sx={{
                    fontSize: 19,
                    color: "#9aa6b5",
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ==========================================
          EDIT PROFILE DIALOG
      ========================================== */}

      <Dialog
        open={openEdit}
        onClose={() =>
          !loading && setOpenEdit(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 800,
          }}
        >
          Edit Profile

          <IconButton
            onClick={() => setOpenEdit(false)}
            disabled={loading}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={editData.fullName}
            onChange={handleEditChange}
            margin="normal"
            autoComplete="name"
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={editData.email}
            onChange={handleEditChange}
            margin="normal"
            autoComplete="email"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setOpenEdit(false)}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={handleSaveProfile}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "9px",
              boxShadow: "none",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==========================================
          CHANGE PASSWORD DIALOG
      ========================================== */}

      <Dialog
        open={openPassword}
        onClose={() =>
          !loading && setOpenPassword(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 800,
          }}
        >
          Change Password

          <IconButton
            onClick={() => setOpenPassword(false)}
            disabled={loading}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* CURRENT */}

          <TextField
            fullWidth
            type={
              showCurrentPassword
                ? "text"
                : "password"
            }
            label="Current Password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    edge="end"
                  >
                    {showCurrentPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* NEW */}

          <TextField
            fullWidth
            type={
              showNewPassword
                ? "text"
                : "password"
            }
            label="New Password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            margin="normal"
            autoComplete="new-password"
            helperText="Minimum 6 characters"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    edge="end"
                  >
                    {showNewPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* CONFIRM */}

          <TextField
            fullWidth
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            label="Confirm New Password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            margin="normal"
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setOpenPassword(false)}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<Lock />}
            onClick={handleUpdatePassword}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "9px",
              boxShadow: "none",
            }}
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==========================================
          SNACKBAR
      ========================================== */}

      <Snackbar
        open={message.open}
        autoHideDuration={4000}
        onClose={closeMessage}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={message.type}
          variant="filled"
          onClose={closeMessage}
          sx={{
            borderRadius: "9px",
          }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;