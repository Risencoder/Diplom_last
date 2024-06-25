import React, { useState, useEffect } from 'react'; // Додайте цей імпорт
import './App.css';
import LoginForm from './Components/Common/LoginForm';
import RegisterForm from './Components/Common/RegisterForm';
import ResetForm from './Components/ResetForm';
import HomeDoctor from './Components/HomeDoctor';
import HomePatient from './Components/HomePatient';
import HomeAdmin from './Components/HomeAdmin';
import Home from './Components/Home';
import PatientAppointments from './Components/PatientAppointments';
import Doctors from './Components/Doctors';
import EditPatientProfile from './Components/EditPatientProfile';
import EditAdminProfile from './Components/EditAdminProfile';
import EditDoctorProfile from './Components/EditDoctorProfile';
import AdminDoctors from './Components/AdminDoctors';
import EyeMl from './Components/EyeMl';
import Patients from './Components/Patients'; // Імпорт компонента перегляду пацієнтів
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { database } from './firebase-config';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, child, get, update } from "firebase/database";

// Core App to run
function App() {
  const [email, setEmail] = useState(''); // Store email
  const [password, setPassword] = useState(''); // Store password
  const [role, setRole] = useState(''); // Store role
  const [name, setName] = useState(''); // Store name
  let navigate = useNavigate(); // navigate function

  const handleAction = (id) => {
    const authentication = getAuth();
    if (id === 1) {
      signInWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          let dbRef = ref(database);
          get(child(dbRef, `users`)).then((snapshot) => {
            let snapshot_val = snapshot.val();
            let uid_val = response.user.uid;
            let role_val = snapshot_val[uid_val]['role'];
            sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
            sessionStorage.setItem('UID', response.user.uid);
            if (role_val === 'Doctor') {
              navigate('/homedoctor');
            } else if (role_val === 'Patient') {
              navigate('/homepatient');
            } else if (role_val === 'Admin') {
              navigate('/homeadmin');
            }
          }).catch((error) => {
            console.error(error);
          });
        })
        .catch((error) => {
          console.log(error.code);
          if (error.code === 'auth/wrong-password') {
            toast.error('Please check the Password', { autoClose: 2000 });
          }
          if (error.code === 'auth/user-not-found') {
            toast.error('Please check the Email', { autoClose: 2000 });
          }
        });
    }
    if (id === 2) {
      createUserWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          const postData = {
            name: name,
            role: role,
            email: email
          };

          const dbRef = ref(database);
          const updates = {};
          updates['/users/' + response.user.uid] = postData;

          update(dbRef, updates);

          if (role === 'Doctor') {
            const doctorData = {
              name: name,
              hospital: 'Fortes',
              image: "https://firebasestorage.googleapis.com/v0/b/med-data-19269.appspot.com/o/EvV01iliyMaMQAMN6nBf8IH9ZLi2%2Fprofile_pic?alt=media",
              email: email,
              age: 35,
              detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc augue. Sed pretium erat eros, quis vestibulum sapien vehicula a. Nullam ornare, mauris in mattis vehicula, nisl mi ullamcorper ex, vel mattis purus mauris sit amet neque. In varius consequat rhoncus. Proin vel rhoncus mauris, sit amet blandit magna. Suspendisse dapibus lacinia augue, lobortis rhoncus odio sollicitudin at. Quisque gravida arcu eu lorem aliquam laoreet. Nam sit amet molestie mauris, et dignissim lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec quam consectetur, condimentum massa in, congue dui. Suspendisse ac lectus elit. In vel purus tortor. Aenean vitae tellus velit. Aenean diam elit, luctus vel maximus at, tincidunt tincidunt est. Nullam hendrerit lectus magna, a tempus nulla egestas vel."
            };
            const doc_updates = {};
            doc_updates['/doctors/' + response.user.uid] = doctorData;

            update(dbRef, doc_updates);
          }
          if (role === 'Doctor') {
            navigate('/homedoctor');
          } else if (role === 'Patient') {
            navigate('/homepatient');
          } else if (role === 'Admin') {
            navigate('/homeadmin');
          }
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
          sessionStorage.setItem('UID', response.user.uid);
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            toast.error('Email Already in Use');
          }
        });
    }
  };

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');
    if (authToken) {
      if (role === 'Doctor') {
        navigate('/homedoctor');
      } else if (role === 'Patient') {
        navigate('/homepatient');
      } else if (role === 'Admin') {
        navigate('/homeadmin');
      }
    }
  }, [navigate, role]);

  return (
    <div className="App">
      <>
        <Routes>
          <Route
            path='/login'
            element={
              <LoginForm
                title="Login"
                setEmail={setEmail}
                setPassword={setPassword}
                handleAction={() => handleAction(1)}
              />}
          />
          <Route
            path='/register'
            element={
              <RegisterForm
                title="Registration"
                setEmail={setEmail}
                setPassword={setPassword}
                setRole={setRole}
                setName={setName}
                handleAction={() => handleAction(2)}
              />}
          />

          <Route
            path='/homedoctor'
            element={
              <HomeDoctor />}
          />

          <Route
            path='/homepatient'
            element={
              <HomePatient />}
          />

          <Route
            path='/homeadmin'
            element={
              <HomeAdmin />}
          />

          <Route
            path='/'
            element={
              <Home />}
          />

          <Route
            path='/doctors'
            element={
              <Doctors />}
          />
          <Route
            path='/appointments-patient'
            element={
              <PatientAppointments />}
          />
          <Route
            path='/edit-patient-profile'
            element={
              <EditPatientProfile />}
          />

          <Route
            path='/reset-password'
            element={
              <ResetForm />}
          />

          <Route
            path='/edit-admin-profile'
            element={
              <EditAdminProfile />}
          />

          <Route
            path='/look-doctors'
            element={
              <AdminDoctors />}
          />

          <Route
            path='/eye-ml'
            element={
              <EyeMl />}
          />

          <Route
            path='/edit-doctor-profile'
            element={
              <EditDoctorProfile />}
          />

          <Route
            path='/patients'
            element={
              <Patients />}
          />

        </Routes>
      </>
      <ToastContainer />
    </div>
  );
}

export default App;
