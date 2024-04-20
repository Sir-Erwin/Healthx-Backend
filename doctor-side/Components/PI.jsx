import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PI.css';

function Patient() {
  const [patients, setPatients] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('Fetching patients...');
    axios.get('http://localhost:5000/Patientlist')
      .then(response => {
        console.log('Patients fetched successfully:', response.data);
        setPatients(response.data);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
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
          <Link to='/Login'>
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
                <th>PatientID</th>
                <th>PatientName</th>
                <th>PatientInformation</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.PID}>
                  <td>{patient.PID}</td>
                  <td>{patient.Name}</td>
                  <td>
                    <Link
                      to={{
                        pathname: '/DoctorPatientInformation',
                        state: { patientData: patient }
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Patient;
