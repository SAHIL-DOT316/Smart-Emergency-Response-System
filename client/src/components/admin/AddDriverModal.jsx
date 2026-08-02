import { useState } from "react";
import TextInput from "../auth/TextInput";
import PasswordInput from "../auth/PasswordInput";
import SubmitButton from "../common/SubmitButton";


import { toast } from "react-toastify";
import { addDriver } from "../../services/driverService";

function AddDriverModal({ show, onClose, onSuccess }) {
  if (!show) return null;
  const [formData, setFormData] = useState({
  fullName: "",
  phone: "",
  email: "",
  password: "",
  ambulanceNumber: "",
  licenseNumber: "",
});

const [loading, setLoading] = useState(false);

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
    const response = await addDriver(formData);

    toast.success(response.message);

    setFormData({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      ambulanceNumber: "",
      licenseNumber: "",
    });

    onClose();

    if (onSuccess) {
      onSuccess();
    }

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add driver"
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
            <h4>Add Driver</h4>

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
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Enter full name"
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
        label="Ambulance Number"
        name="ambulanceNumber"
        value={formData.ambulanceNumber}
        onChange={handleChange}
        placeholder="JK21AB1234"
      />
    </div>

    <div className="col-md-6 mt-3">
      <TextInput
        label="License Number"
        name="licenseNumber"
        value={formData.licenseNumber}
        onChange={handleChange}
        placeholder="Driving License"
      />
    </div>

  </div>

  <div className="mt-4">
    <SubmitButton
      loading={loading}
      text="Add Driver"
      loadingText="Adding Driver..."
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