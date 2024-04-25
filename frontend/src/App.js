import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TimeLine from "./components/TimeLine"
import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import EventForm from "./pages/EventForm"


function App () {
  const { currentUser } = useContext(AuthContext);
  const RequireAuth = ({ children }) => {
    // Check if currentUser exists and is truthy
    if (!currentUser) {
      // Assuming Navigate is imported correctly from React Router
      return <Navigate to='/login' />;
    }

    // Render children if currentUser exists and is truthy
    return children;
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route
              index
              path="/:userID"
              element={
                <RequireAuth>
                  <TimeLine />
                </RequireAuth>
              }
          />
          <Route
              index
              path="/"
              element={
                <RequireAuth>
                  <TimeLine />
                </RequireAuth>
              }
          />
          <Route
              index
              path="/addevent"
              element={
                <RequireAuth>
                  <EventForm />
                </RequireAuth>
              }
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
