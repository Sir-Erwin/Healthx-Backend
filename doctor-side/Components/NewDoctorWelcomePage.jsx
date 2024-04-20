import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NewDoctorWelcomePage.css";

const NewDoctorWelcomePage = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="grid-container">
      {/* Header */}
      <header className="header">
        <div className="menu-icon" onClick={openSidebar}>
          <span className="material-icons-outlined">menu</span>
        </div>
        <div className="header-left">
          <Link to="../home/home.html">
            <i className="fa fa-search"></i>
          </Link>
        </div>
        <div className="header-right">
          <Link to="../home/home.html">
            <i className="fa fa-home"></i>
          </Link>
        </div>
      </header>
      {/* End Header */}

      {/* Sidebar */}
      <aside id="sidebar">
        <div className="sidebar-title">
          <div className="sidebar-brand">
            <i className="fa fa-heartbeat"></i>
            <span>Welcome</span>
          </div>
          <span className="material-icons-outlined" onClick={closeSidebar}>
            close
          </span>
        </div>

        <ul className="sidebar-list">
          <Link to="/Patientlist">
            <li className="sidebar-list-item">
              <i className="fa fa-dashboard"></i>
              <span>Patient List</span>
            </li>
          </Link>
          <Link to="/DoctorPrescriptions">
            <li className="sidebar-list-item">
              <i className="fa fa-user-md"></i>
              <span>Prescriptions</span>
            </li>
          </Link>
          <Link to="/DoctorAppointments">
            <li className="sidebar-list-item">
              <i className="fa fa-calendar"></i>
              <span>Appointments</span>
            </li>
          </Link>
          <Link to="/DoctorAccountInformation">
            <li className="sidebar-list-item">
              <i className="fa fa-building"></i>
              <span>Account Information</span>
            </li>
          </Link>
          <Link to="/Login">
            <li className="sidebar-list-item" id="logout">
              <i className="fa fa-sign-out"></i>
              <span>Logout</span>
            </li>
          </Link>
        </ul>
      </aside>
      {/* End Sidebar */}

      {/* Main */}
      <main className="main-container">
        <div className="main-title">
        </div>
        <div className="data">
          <div className="table-info">
            <table>
              <thead>
                <tr>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </main>
      {/* End Main */}
    </div>
  );
};

export default NewDoctorWelcomePage;
