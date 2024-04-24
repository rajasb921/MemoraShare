import axios from 'axios'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import React, { useState, useEffect, useContext } from "react";
import { Navigate, Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
import SearchBar from './SearchBar';


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
import "../styles/Gallery.css"

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
  const params = useParams()
  const [data, setData] = useState();
  const [userID, setUserID] = useState()
  const {currentUser,dispatch} = useContext(AuthContext)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setUserID(localStorage.getItem('userID'))
      const res = await axios.post(
        'http://localhost:8383/user-events-images', { userId: params.userID }
      );
      setData(res.data)
      console.log(res.data)
      
    };
    fetchData();  
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("userID");
    dispatch({ type: "LOGOUT", payload: null });
    <Navigate to="/login" />;
  }

  const handleSettings = () => {

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
          <SearchBar placeholder="Enter username..."/>
          <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
          <StyledButton onClick={handleLogout}>
            <Typography variant="h9" style={{ fontFamily: "Outfit" , color:"#976045"}}>
              LOGOUT
            </Typography>
          </StyledButton>
          <StyledButton onClick={handleSettings}>
            <Typography variant="h9" style={{ fontFamily: "Outfit" , color:"#976045"}}>
              FREE/PREM
            </Typography>
          </StyledButton>
          </div>
        </StyledToolbar>
    </AppBar>
      <VerticalTimeline lineColor='grey'>
      {data && data.events.map((event, index) => (
        <VerticalTimelineElement
        key={index} // Ensure a unique key for each element
        className="vertical-timeline-element--work"
        contentStyle={{
          background: '#F5F5F5',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #D2B48C',
          borderRadius: '10px',
          padding: '10px',
          color: '#4E433C', // Brownish text color for readability
        }}
        contentArrowStyle={{ borderRight: '3px solid #F5F5F5' }}
        iconStyle={{ background: '#8B4513', color: '#F5F5F5' }} // Dark brown background with light text color
      > 
          <div>
            <div className='event-top' style={{display:"flex", flexDirection:"row", justifyContent:"space-between", padding:"10px", alignItems:"center"}}>
              <div style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '2px' }}>{event.eventDetails[0].name}</div>
              <div style={{ fontSize: '16px', marginBottom: '0' }}>
                {`${event.eventDetails[0].date.substring(5, 7)}/${event.eventDetails[0].date.substring(8, 10)}/${event.eventDetails[0].date.substring(0, 4)}`}
              </div>
          </div>
          <div className='gallery'>
            {event.eventImages.map((detail, idx) => (
              <div className='pics' key={idx}>
                <img
                  src={`http://localhost:8383/${detail.file_path.replace(/\\/g, '/')}`}
                  style={{ width: '100%', borderRadius: '5px', marginBottom: '10px' }}
                  alt={`Image ${idx}`}
                />
              </div>
            ))}
          </div>
          <div className='collab-users'>
            {event.collabUsernames.map((element, idx) => {
              if (element.userid !== currentUser) {
                return (
                  <a
                    key={idx}
                    className='collab-user'
                    href={`http://localhost:3000/${element.userid}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {element.username}
                  </a>
                );
              } else {
                return null; // Don't render the <a> tag if condition is met
              }
            })}
          </div>
        </div>
      </VerticalTimelineElement>
      ))}
      </VerticalTimeline>
    {params.userID === localStorage.getItem('userID') && <AppBar position="sticky" className="bottom-navbar" style={{ top: 'auto', bottom: 5, backgroundColor: "rgba(151, 96, 69, 0.8)", backdropFilter: "blur(5px)", border: "1px solid rgba(0, 0, 0, 0.2)", borderRadius: "10px", width: "50%", left: "25%", margin: "0 5px", borderRadius: "50px" }}>
        <StyledToolbar style={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}> 
          <IconButton color="inherit" onClick={handleNavigate}>
            <AddIcon />
          </IconButton>    
        </StyledToolbar>
    </AppBar>}
    </div>
    </>
  );
}

export default App;
