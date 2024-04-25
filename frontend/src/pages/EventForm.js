import React, { useState, useRef, useEffect} from 'react';
import { AppBar, TextField, Button, Grid, Typography, Toolbar, styled, } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { MultiSelect } from 'react-multi-select-component';
import '../styles/EventForm.css'
import axios from 'axios'

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});


function EventForm() {
  const [formData, setFormData] = useState({
    userID: localStorage.getItem('userID'),
    date: '',
    name: '',
    description: '',
    usernames: '',
  });
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOption] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState(false)
  const [upgradetoPremium, setUpgradeToPremium] = useState(false)
  const [images, setImages] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get('http://localhost:8383/searchUsernames');
        setOptions(response.data);
        localStorage.setItem('Username', response.data.username);
      } catch (error) {
        console.error('Error searching users:');
      }
    };

    handleSearch();
  }, []);

  function selectFiles () {
    fileInputRef.current.click();
  }

  function deleteImage (index) {
    setImages((prevImages) => (
      prevImages.filter((_,i) => i !== index)
    ))

    const updatedSelectedFiles = [...selectedFiles];
    updatedSelectedFiles.splice(index, 1);
    setSelectedFiles(updatedSelectedFiles);
    console.log(setSelectedFiles)
  }

  function onFileSelect (event) {

    const files = event.target.files
    setSelectedFiles(files); 
    console.log(setSelectedFiles)


    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
     
      if(files[i].type.split('/')[0] !== 'image') continue;
      if(!images.some((e) => e.name === files[i].name)){
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          }
        ])
      }
    }
    
  }
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedOptions)
    const formDataWithImages = new FormData();
        for (let file of selectedFiles) {
            formDataWithImages.append('images', file);
        }
        formDataWithImages.append('date', formData.date);
        formDataWithImages.append('userID', formData.userID);
        formDataWithImages.append('name', formData.name);
        formDataWithImages.append('description', formData.description);
        if (options.length !== 0){
          console.log('added')
          for (let option of selectedOptions) {
              formDataWithImages.append('usernames', option.value);
          }
        } else {
          formDataWithImages.append('usernames', '');
        }
      try {
          const result = await axios.post('http://localhost:8383/addevent', formDataWithImages, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
         
          setMessage(result.data.message);
          setImages([]); // Clear images after successful upload
          setFormData({ date: '', name: '', description: '', usernames: '' , userID: ''}); // Clear form fields
          navigate(`/${localStorage.getItem('userID')}`)
      } catch (error) {
        if(error.response.status === 500){
          setUpgradeToPremium(true)
        }
        console.error('Error uploading files:', error);
        
      }
  }


  return (
    <>
    <AppBar position="sticky" className="appbar" style={{backgroundColor:"#976045"}}>
        <StyledToolbar>
          <Typography variant="h6" style={{ fontFamily: "Outfit" }}>
            MEMORASHARE
          </Typography>
        </StyledToolbar>
    </AppBar>
    <div style={{width:"100%", height:"90vh", position: "relative", display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#E6D3B3'}}>
    <form onSubmit={handleSubmit} style={{ width: '80%', margin: '0 auto', fontFamily: 'Outfit', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'white', backdropFilter: 'blur(5px)', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '20px' }}>
  <div style={{ width: '50%' }}>
    <Typography variant="h6" style={{ fontFamily: 'Outfit', marginBottom: '10px' }}>Add Event</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          style={{ fontFamily: 'Outfit' }}
          fullWidth
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          style={{ fontFamily: 'Outfit' }}
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          style={{ fontFamily: 'Outfit' }}
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <MultiSelect
          options={options}
          value={selectedOptions}
          onChange={setSelectedOption}
          labelledBy="Select Usernames"
          hasSelectAll={false}
        />
      </Grid>
      <Grid item xs={12} >
        <Button type="submit" variant="contained" color="primary" style={{ fontFamily: 'Outfit' }}>
          Add Event
        </Button>
      </Grid>
    </Grid>
  </div>
  <div style={{ width: '50%' }}>
    <div className='card'>
      <div className='top'>
        <p>Image Uploading</p>
      </div>
      <div className='drag-area' >
        {isDragging ? (
          <span className='select'>Drop images here</span>
        ) : (
          <>
           
            <span className='select' role='button' onClick={selectFiles}>
              Browse
            </span>
          </>
        )}
        <input name='file' type='file' className='file' multiple ref={fileInputRef} onChange={onFileSelect}></input>
      </div>
      <div className='image-container'>
        {
          images.map((image, index) => (
            <div className='image' key={index}>
              <span className='delete' onClick={() => deleteImage(index)}>&times;</span>
              <img src={image.url} alt={image.name} />
            </div>
          ))
        }
      </div>
      {message && <div>Upload successful</div>}
      {upgradetoPremium && <div>Upgrade to Premium to Insert more events!</div>}
    </div>
  </div>
</form>
    </div>
    </>);
}

export default EventForm;