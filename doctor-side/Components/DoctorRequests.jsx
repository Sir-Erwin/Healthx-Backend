import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './DoctorRequests.css';

function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('Fetching prescriptions...');
    axios.get('http://localhost:5000/DoctorPrescriptions')
      .then(response => {
        console.log('Prescriptions fetched successfully:', response.data);
        // Update prescription date format
        const formattedPrescriptions = response.data.map(prescription => ({
          ...prescription,
          presc_date: new Date(prescription.presc_date).toLocaleDateString()
        }));
        setPrescriptions(formattedPrescriptions);
      })
      .catch(error => {
        console.error('Error fetching prescriptions:', error);
      });
  }, []);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className='grid-container'>
    {/* Sidebar */}
    <aside id='sidebar' className={sidebarOpen ? 'open' : ''}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <i className='fa fa-heartbeat'></i>
          <span>Welcome</span>
        </div>
        <span className='material-icons-outlined' onClick={closeSidebar}>
          close
        </span>
      </div>
      <ul className='sidebar-list'>
        <Link to='/Patientlist'>
          <li className='sidebar-list-item'>
            <i className='fa fa-dashboard'></i>
            <span>Patient List</span>
          </li>
        </Link>
        <Link to='/DoctorPrescriptions'>
          <li className='sidebar-list-item'>
            <i className='fa fa-user-md'></i>
            <span>Prescriptions</span>
          </li>
        </Link>
        <Link to='/DoctorAppointments'>
          <li className='sidebar-list-item'>
            <i className='fa fa-calendar'></i>
            <span>Appointments</span>
          </li>
        </Link>
        <Link to='/'>
          <li className='sidebar-list-item' id='logout'>
            <i className='fa fa-sign-out'></i>
            <span>Logout</span>
          </li>
        </Link>
      </ul>
    </aside>
    {/* End Sidebar */}

    <div className='app-container'>
      {/* Header */}
      <header className='header'>
        <div className='menu-icon' onClick={openSidebar}>
          <span className='material-icons-outlined'>menu</span>
        </div>
        <div className='header-left'>
          <Link to='../home/home.html'>
            <i className='fa fa-search'></i>
          </Link>
        </div>
        <div className='header-right'>
          <Link to='../home/home.html'>
            <i className='fa fa-home'></i>
          </Link>
        </div>
      </header>
      {/* End Header */}


        <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th>Prescription ID</th>
                <th>Patient ID</th>
                <th>Prescription Name</th>
                <th>Prescription Date</th>
                <th>Dosage</th>
                <th>Daily Intake</th>
                <th>Quantity</th>
                <th>Refills</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map(prescription => (
                <tr key={prescription.presc_id}>
                  <td>{prescription.presc_id}</td>
                  <td>{prescription.patient_id}</td>
                  <td>{prescription.presc_name}</td>
                  <td>{prescription.presc_date}</td>
                  <td>{prescription.dosage}</td>
                  <td>{prescription.daily_intake}</td>
                  <td>{prescription.quantity}</td>
                  <td>{prescription.refills}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DoctorPrescriptions;
