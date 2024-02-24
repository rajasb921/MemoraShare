import './App.css';
import axios from 'axios'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import React, { useState, useEffect } from "react";


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

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        'http://localhost:8383'
      );
      setData(res.data);
    };
    fetchData();
  }, []);
  
  return (
    <VerticalTimeline lineColor='grey'>
      {data &&
        data.map((item, index) => (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            
          >
            <h3 className="vertical-timeline-element-title">{item.name}</h3>
            <h4 className="vertical-timeline-element-subtitle">{formatDate(item.date)}</h4>
            <p>
              {item.description}
            </p>
          </VerticalTimelineElement>
        ))
      }
</VerticalTimeline>
  );
}

export default App;
