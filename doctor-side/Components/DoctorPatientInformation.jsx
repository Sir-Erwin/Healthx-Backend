import React from "react";
import { Link } from "react-router-dom";
import './DoctorPatientInformation.css';

const DoctorPatientInformation = ({ location }) => {
  const selectedPatient = location.state ? location.state.patientData : null;

  // Function to format date of birth (DOB)
  const formatDOB = (dob) => {
    return new Date(dob).toISOString().split('T')[0];
  };

  return (
    <>
      <h1>Patient Information</h1>
      {selectedPatient ? (
        <div>
          <ul className="list-group">
            <li className="list-group-item">Patient's Name: {selectedPatient.Name}</li>
            <li className="list-group-item">Patient's ID: {selectedPatient.PID}</li>
            <li className="list-group-item">Patient's DOB: {formatDOB(selectedPatient.DOB)}</li> {/* Format DOB */}
            <li className="list-group-item">Patient's Gender: {selectedPatient.Gender}</li>
            <li className="list-group-item">Patient's Blood Type: {selectedPatient.BloodType}</li>
            <li className="list-group-item">Patient's Phone Number: {selectedPatient.PhoneNum}</li>
            <li className="list-group-item">Patient's Hair color: {selectedPatient.HairColor}</li> {/* Updated field name */}
            <li className="list-group-item">Patient's Eye Color: {selectedPatient.EyeColor}</li> {/* Updated field name */}
            <li className="list-group-item">Patient's Email: {selectedPatient.Email}</li>
            <li className="list-group-item">Patient's Mailing address: {selectedPatient.MailingAddress}</li>
            <li className="list-group-item">Patient's Weight: {selectedPatient.Weight}</li> {/* Updated field name */}
            <li className="list-group-item">Patient's Height: {selectedPatient.Height}</li>
            <li className="list-group-item">Patient's PCP_EID: {selectedPatient.PCP_EID}</li>
          </ul>
        </div>
      ) : (
        <p>No patient selected.</p>
      )}
      <Link to="/Patientlist">Back to Patient List</Link>
    </>
  );
};

export default DoctorPatientInformation;
