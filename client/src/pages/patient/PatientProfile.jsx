import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PatientNavbar from "../../components/patient/PatientNavbar";

import {
  getPatientProfile,
  updatePatientProfile,
} from "../../services/authService";

import "./PatientProfile.css";


function PatientProfile() {

  // ==========================================
  // PROFILE DATA
  // ==========================================

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);


  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    profileImage: "",
  });


  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = async () => {

    try {

      setLoading(true);

      const response = await getPatientProfile();

      console.log(
        "PATIENT PROFILE:",
        response
      );

      const patient = response.patient;

      if (!patient) {
        throw new Error("Patient data not found");
      }

      setProfile(patient);

      setFormData({
        fullName: patient.fullName || "",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || "",
        emergencyContactName:
          patient.emergencyContactName || "",
        emergencyContactNumber:
          patient.emergencyContactNumber || "",
        profileImage:
          patient.profileImage || "",
      });

    } catch (error) {

      console.error(
        "Profile fetch error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to load profile"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    fetchProfile();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEdit = () => {

    setEditing(true);

  };


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {

    if (!profile) {
      return;
    }

    setFormData({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      email: profile.email || "",
      address: profile.address || "",
      emergencyContactName:
        profile.emergencyContactName || "",
      emergencyContactNumber:
        profile.emergencyContactNumber || "",
      profileImage:
        profile.profileImage || "",
    });

    setEditing(false);

  };


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      const data = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        emergencyContactName:
          formData.emergencyContactName,
        emergencyContactNumber:
          formData.emergencyContactNumber,
        profileImage:
          formData.profileImage,
      };

      const response =
        await updatePatientProfile(data);

      console.log(
        "PROFILE UPDATED:",
        response
      );

      if (response.patient) {

        setProfile(response.patient);

        setFormData({
          fullName:
            response.patient.fullName || "",
          phone:
            response.patient.phone || "",
          email:
            response.patient.email || "",
          address:
            response.patient.address || "",
          emergencyContactName:
            response.patient.emergencyContactName || "",
          emergencyContactNumber:
            response.patient.emergencyContactNumber || "",
          profileImage:
            response.patient.profileImage || "",
        });

      }

      setEditing(false);

      toast.success(
        response.message ||
        "Profile updated successfully"
      );

    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // GET INITIALS
  // ==========================================

  const getInitials = (name) => {

    if (!name) {
      return "P";
    }

    const words = name
      .trim()
      .split(" ")
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="profile-page">

        <PatientNavbar />

        <main className="profile-main">

          <div className="profile-loading">

            <div className="profile-spinner"></div>

            <p>
              Loading your profile...
            </p>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="profile-page">

      <PatientNavbar />


      <main className="profile-main">


        {/* ======================================
            HEADER
        ====================================== */}

        <section className="profile-header">

          <div>

            <div className="profile-badge">

              Patient Profile

            </div>


            <h1>
              My Profile
            </h1>


            <p>
              View and manage your personal
              information and emergency contact
              details.
            </p>

          </div>


          {!editing && (

            <button
              className="edit-profile-btn"
              onClick={handleEdit}
            >

              Edit Profile

            </button>

          )}

        </section>



        {/* ======================================
            PROFILE CARD
        ====================================== */}

        <form
          className="profile-card"
          onSubmit={handleSave}
        >


          {/* ====================================
              PROFILE TOP
          ==================================== */}

          <div className="profile-card-top">


            <div className="profile-avatar">

              {formData.profileImage ? (

                <img
                  src={formData.profileImage}
                  alt="Profile"
                />

              ) : (

                <span>

                  {getInitials(
                    formData.fullName
                  )}

                </span>

              )}

            </div>


            <div className="profile-heading">

              <h2>
                {formData.fullName ||
                  "Patient"}
              </h2>


              <p>
                {formData.email}
              </p>


              <span className="profile-active">

                Active Patient

              </span>

            </div>

          </div>



          {/* ====================================
              PERSONAL INFORMATION
          ==================================== */}

          <section className="profile-section">

            <div className="profile-section-heading">

              <h3>
                Personal Information
              </h3>

              <p>
                Your basic account information.
              </p>

            </div>


            <div className="profile-grid">


              {/* FULL NAME */}

              <div className="profile-field">

                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!editing || saving}
                  placeholder="Enter your full name"
                />

              </div>



              {/* PHONE */}

              <div className="profile-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing || saving}
                  placeholder="Enter your phone number"
                  maxLength="10"
                />

                <small>
                  Enter a valid 10-digit phone number.
                </small>

              </div>



              {/* EMAIL */}

              <div className="profile-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />

                <small>
                  Email address cannot be changed.
                </small>

              </div>



              {/* ADDRESS */}

              <div className="profile-field">

                <label htmlFor="address">
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editing || saving}
                  placeholder="Enter your address"
                />

              </div>

            </div>

          </section>



          {/* ====================================
              EMERGENCY INFORMATION
          ==================================== */}

          <section className="profile-section emergency-profile-section">

            <div className="profile-section-heading">

              <h3>
                Emergency Contact
              </h3>

              <p>
                This person can be contacted during
                an emergency.
              </p>

            </div>


            <div className="profile-grid">


              {/* CONTACT NAME */}

              <div className="profile-field">

                <label htmlFor="emergencyContactName">

                  Emergency Contact Name

                </label>

                <input
                  id="emergencyContactName"
                  type="text"
                  name="emergencyContactName"
                  value={
                    formData.emergencyContactName
                  }
                  onChange={handleChange}
                  disabled={!editing || saving}
                  placeholder="Enter contact name"
                />

              </div>



              {/* CONTACT NUMBER */}

              <div className="profile-field">

                <label htmlFor="emergencyContactNumber">

                  Emergency Contact Number

                </label>

                <input
                  id="emergencyContactNumber"
                  type="tel"
                  name="emergencyContactNumber"
                  value={
                    formData.emergencyContactNumber
                  }
                  onChange={handleChange}
                  disabled={!editing || saving}
                  placeholder="Enter contact number"
                  maxLength="10"
                />

                <small>
                  Keep this number updated for emergencies.
                </small>

              </div>

            </div>

          </section>



          {/* ====================================
              PROFILE IMAGE
          ==================================== */}

          {editing && (

            <section className="profile-section">

              <div className="profile-section-heading">

                <h3>
                  Profile Image
                </h3>

                <p>
                  Enter an image URL for your profile
                  picture.
                </p>

              </div>


              <div className="profile-grid">

                <div className="profile-field">

                  <label htmlFor="profileImage">

                    Profile Image URL

                  </label>

                  <input
                    id="profileImage"
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="https://example.com/image.jpg"
                  />

                </div>

              </div>

            </section>

          )}



          {/* ====================================
              ACTIONS
          ==================================== */}

          {editing && (

            <div className="profile-actions">

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancel}
                disabled={saving}
              >

                Cancel

              </button>


              <button
                type="submit"
                className="save-profile-btn"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          )}

        </form>



        {/* ======================================
            ACCOUNT INFO
        ====================================== */}

        {profile && (

          <div className="account-info-card">

            <div>

              <h3>
                Account Status
              </h3>

              <p>
                Your Smart Emergency patient
                account is currently active.
              </p>

            </div>


            <span className="account-status">

              Active

            </span>

          </div>

        )}

      </main>

    </div>

  );

}


export default PatientProfile;