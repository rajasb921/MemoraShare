import React from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import '../styles/SearchBar.css'

function SearchBar({placeholder}) {

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get('http://localhost:8383/searchUsers');
        setData(response.data);
        localStorage.setItem('Username', response.data.username);
      } catch (error) {
        console.error('Error searching users:');
      }
    };

    handleSearch();
  }, []); // Empty dependency array means this effect runs only once on mount

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.username.filter((value) => {
      return value.username.toLowerCase().includes(searchWord.toLowerCase());
    });

    if(searchWord === '') {
      setFilteredData([]);
    }else{
    setFilteredData(newFilter);
    }
  }

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  }

  return(
    <div className='search' >
      <div className='searchInputs'>
        <input type='text' className='search-input' placeholder={placeholder} value = {wordEntered} onChange={handleFilter}/>
      </div>
      {filteredData.length !== 0 && (
      <div className='dataResult'>
        {filteredData.map((value,key) => {
          return (
          <a className='dataItem' href={`http://localhost:3000/${value.userid}`} target='_blank' rel='noopener noreferrer'> 
            <p>{value.username}</p>
          </a>
          );
        })}
      </div>
      )}
    </div>
  );
}

export default SearchBar