import axios from 'axios'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import React, { useState, useEffect, useContext } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import {
  AppBar,
  Box,
  styled,
  Toolbar,
  Typography,
  InputBase,
  Grid,
  Paper,
  Container,
  Button,
} from "@mui/material";
import "../styles/TimeLine.css"

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});


const StyledButton = styled("button")(({ theme }) => ({
  backgroundColor: "white",
  padding: "0 10px",
  borderRadius: theme.shape.borderRadius,
  width: "100px",
  height: "30px",
  borderRadius: "10px",
  border: "none",
  transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out", // Add transition property
  "&:hover": {
    backgroundColor: "lightgray", // Change to desired hover background color
    color: "rgb(33, 150, 243)", // Change to desired hover text color
    cursor: "pointer",
    
  }
}));

// Format datestring
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
}

function App() {
  
  const [data, setData] = useState();
  const {dispatch} = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        'http://localhost:8383'
      );
      setData(res.data)
    };
    fetchData();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("userID");
    dispatch({ type: "LOGOUT", payload: null });
    <Navigate to="/login" />;
  }

  const handleNavigate = () => {
    navigate('/addevent')
  }

  return (
    <>
    <div style={{width:"100%", height:"100vh", position: "relative"}}>
    <AppBar position="sticky" className="appbar" style={{backgroundColor:"#976045"}}>
        <StyledToolbar>
          <Typography variant="h6" style={{ fontFamily: "Outfit" }}>
            MEMORASHARE
          </Typography>
          <StyledButton onClick={handleLogout}>
            <Typography variant="h9" style={{ fontFamily: "Outfit" , color:"#976045"}}>
              LOGOUT
            </Typography>
          </StyledButton>
        </StyledToolbar>
    </AppBar>
      <VerticalTimeline lineColor='grey'>
      {data &&
        data.map((item, index) => (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'lightgrey', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  lightgrey' }}
            date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            
          >
            <h3 className="vertical-timeline-element-title">{item.fname} {item.lname}</h3>
          </VerticalTimelineElement>
        ))
      }
    </VerticalTimeline>
    <AppBar position="sticky" className="bottom-navbar" style={{ top: 'auto', bottom: 5, backgroundColor: "rgba(151, 96, 69, 0.8)", backdropFilter: "blur(5px)", border: "1px solid rgba(0, 0, 0, 0.2)", borderRadius: "10px", width: "50%", left: "25%", margin: "0 5px", borderRadius: "50px" }}>
        <StyledToolbar style={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
          
          <IconButton color="inherit" onClick={handleNavigate}>
            <AddIcon />
          </IconButton>
          
        </StyledToolbar>
    </AppBar>
    </div>
    </>
  );
}

export default App;
