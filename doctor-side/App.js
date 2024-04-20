import React, {useState} from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PatientInformation from './Components/PatientInformation/DoctorPatientInformation.jsx';
import Patient from "./Components/PatientInformation/PI.jsx";
import Login from "login.html"
import NewDoctorWelcomePage from "./Components/WelcomePage/NewDoctorWelcomePage.jsx";
import AppointmentsPage from "./Components/Calendar/DoctorAppointments.jsx";
import DoctorRequests from "./Components/Requests/DoctorRequests.jsx";

function App(){

   

    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/DoctorWelcome" exact component={NewDoctorWelcomePage} />
                    <Route path="/DoctorAppointments" component={AppointmentsPage} />
                    <Route path="/Patientlist" component={Patient} />
                    <Route path="/DoctorPrescriptions" component={DoctorRequests} />
                    <Route path="/DoctorPatientInformation" component={PatientInformation} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
