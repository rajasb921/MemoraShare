import axios from 'axios'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';

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

  return (
    <VerticalTimeline lineColor='grey'>
      <button onClick={handleLogout}>
        Logout
      </button>
      {data &&
        data.map((item, index) => (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            
          >
            <h3 className="vertical-timeline-element-title">{item.fname} {item.lname}</h3>
          </VerticalTimelineElement>
        ))
      }
</VerticalTimeline>
  );
}

export default App;
