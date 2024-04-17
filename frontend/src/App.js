import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TimeLine from "./components/TimeLine"
import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';


function App () {
  const { currentUser } = useContext(AuthContext);
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route
              index
              path="/"
              element={
                <RequireAuth>
                  <TimeLine />
                </RequireAuth>
              }
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
