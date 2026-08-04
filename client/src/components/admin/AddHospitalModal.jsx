import { useState, useEffect } from "react";
import TextInput from "../auth/TextInput";
import PasswordInput from "../auth/PasswordInput";
import SubmitButton from "../common/SubmitButton";


import { toast } from "react-toastify";
import {
  addHospital,
  updateHospital,
} from "../../services/hospitalService";

function AddDriverModal({ show, onClose, onSuccess,  editHospital, }) {
  if (!show) return null;
  const [formData, setFormData] = useState({
     hospitalName: "",
      phone: "",
      email: "",
      password: "",
      address: "",
      city: "",
      emergencyBeds: "",
      availableBeds: "",
});

const [loading, setLoading] = useState(false);

useEffect(() => {
  if (editHospital) {
    setFormData({
      hospitalName: editHospital.hospitalName || "",
      phone: editHospital.phone || "",
      email: editHospital.email || "",
      password: "",
      address: editHospital.address || "",
      city: editHospital.city || "",
      emergencyBeds: editHospital.emergencyBeds || "",
      availableBeds: editHospital.availableBeds || "",
    });
  } else {
    setFormData({
      hospitalName: "",
      phone: "",
      email: "",
      password: "",
      address: "",
      city: "",
      emergencyBeds: "",
      availableBeds: "",
    });
  }
}, [editHospital]);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
   const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {

    let response;

    if (editHospital){
      response = await updateHospital(
  editHospital._id,
  formData
);
    } else {
    response = await addHospital(formData);
    }

    toast.success(response.message);

   setFormData({
  hospitalName: "",
  phone: "",
  email: "",
  password: "",
  address: "",
  city: "",
  emergencyBeds: "",
  availableBeds: "",
});

    onClose();

    if (onSuccess) {
      onSuccess();
    }

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Operation Failed"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div
      className="modal d-block"
      style={{ background: "rgba(0,0,0,.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h4>
  {editHospital ? "Edit Hospital" : "Add Hospital"}
</h4>

            <button
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">

          <form onSubmit={handleSubmit}>

  <div className="row">

    <div className="col-md-6">
      <TextInput
  label="Hospital Name"
  name="hospitalName"
  value={formData.hospitalName}
  onChange={handleChange}
  placeholder="Enter hospital name"
/>
    </div>

    <div className="col-md-6">
      <TextInput
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter phone"
      />
    </div>

    <div className="col-md-6 mt-3">
      <TextInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter email"
      />
    </div>

    <div className="col-md-6 mt-3">
      <PasswordInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create password"
      />
    </div>

    <div className="col-md-6 mt-3">
     <TextInput
  label="Address"
  name="address"
  value={formData.address}
  onChange={handleChange}
  placeholder="Hospital address"
/>
    </div>

    <div className="col-md-6 mt-3">
      <TextInput
  label="City"
  name="city"
  value={formData.city}
  onChange={handleChange}
  placeholder="City"
/>
    </div>

 <div className="col-md-6 mt-3">
    <TextInput
  label="Emergency Beds"
  type="number"
  name="emergencyBeds"
  value={formData.emergencyBeds}
  onChange={handleChange}
/>
 </div>

 <div className="col-md-6 mt-3">
    <TextInput
  label="Available Beds"
  type="number"
  name="availableBeds"
  value={formData.availableBeds}
  onChange={handleChange}
/>
 </div>
  </div>

  <div className="mt-4">
 <SubmitButton
  loading={loading}
  text={
    editHospital
      ? "Update Hospital"
      : "Add Hospital"
  }
  loadingText={
    editHospital
      ? "Updating..."
      : "Adding..."
  }
/>
  </div>

</form>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AddDriverModal;