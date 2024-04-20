import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorAppointments.css';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointment data from the database
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/DoctorAppointments');
        if (response.status !== 200) {
          throw new Error('Failed to fetch appointments');
        }
        // Format dates
        const formattedAppointments = response.data.map(appointment => ({
          ...appointment,
          // Convert date string to Date object and format as YYYY-MM-DD
          Datetime: new Date(appointment.Datetime).toISOString().split('T')[0]
        }));
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchAppointments();

  }, []);

  return (
    <div className="appointments-container">
      <h1>Upcoming Appointments</h1>
      <table>
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Primary Physician</th>
            <th>Date</th> 
            <th>Doctor's Comments</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            <th>Clinic ID</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.AID}>
              <td>{appointment.AID}</td>
              <td>{appointment.PrimaryPhys === 1 ? 'Yes' : 'No'}</td>
              <td>{appointment.Datetime}</td>
              <td>{appointment.Doctors_Comments}</td>
              <td>{appointment.PATIENT_PID}</td>
              <td>{appointment.DOCTOR_EID}</td>
              <td>{appointment.CLINIC_clinic_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorAppointments;
