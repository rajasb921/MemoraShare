import './App.css';
import axios from 'axios'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import React, { useState, useEffect } from "react";


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
            <h3 className="vertical-timeline-element-title">{item.position}</h3>
            <h4 className="vertical-timeline-element-subtitle">{item.location}</h4>
            <p>
              {item.name}
            </p>
          </VerticalTimelineElement>
        ))
      }
</VerticalTimeline>
  );
}

export default App;
