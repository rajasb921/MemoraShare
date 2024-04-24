import React, { useState, useRef} from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import '../styles/EventForm.css'
import axios from 'axios'

function EventForm() {
  const [formData, setFormData] = useState({
    userID: localStorage.getItem('userID'),
    date: '',
    name: '',
    description: '',
    usernames: '',
    numusers: '',
  });

  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState(false)
  const [upgradetoPremium, setUpgradeToPremium] = useState(false)
  const [images, setImages] = useState([])
  const fileInputRef = useRef(null)

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
    const formDataWithImages = new FormData();
        for (let file of selectedFiles) {
            formDataWithImages.append('images', file);
        }
        formDataWithImages.append('date', formData.date);
        formDataWithImages.append('userID', formData.userID);
        formDataWithImages.append('name', formData.name);
        formDataWithImages.append('description', formData.description);
        formDataWithImages.append('usernames', formData.usernames);
        formDataWithImages.append('numusers', formData.numusers);
      try {
          const result = await axios.post('http://localhost:8383/addevent', formDataWithImages, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
          if (result.status === 501) {
            setUpgradeToPremium(true)
          } else {
            setMessage(result.data.message);
          }
          setImages([]); // Clear images after successful upload
          setFormData({ date: '', name: '', description: '', usernames: '' , userID: ''}); // Clear form fields
      } catch (error) {
          console.error('Error uploading files:', error);
        
      }
  }


  return (
    <div style={{width:"100%", height:"100vh", position: "relative", display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#E6D3B3'}}>
    <form onSubmit={handleSubmit} style={{ width: '25%', margin: '0 auto',fontFamily: 'Outfit', display: 'flex', flexDirection:'column', alignItems:'center', backgroundColor: 'white', backdropFilter: 'blur(5px)', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '20px' }}>
      <Typography variant="h6" style={{fontFamily: 'Outfit', marginBottom: '10px' }}>Add Event</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            style={{fontFamily: 'Outfit' }}
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
            style={{fontFamily: 'Outfit' }}
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            style={{fontFamily: 'Outfit' }}
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            style={{fontFamily: 'Outfit' }}
            fullWidth
            label="Collab"
            type="text"
            name="usernames"
            value={formData.usernames}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            style={{fontFamily: 'Outfit' }}
            fullWidth
            label="Number of users"
            type="number"
            name="numusers"
            value={formData.numusers}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <div className='card'>
            <div className='top'>
              <p>Drag and Drop Image Uploading</p>
            </div>
            <div className='drag-area' >
              {isDragging ? (
                <span className='select'>Drop images here</span>
              ) : (
                <>
                Drag & Drop image here or {" "}
                <span className='select' role='button' onClick={selectFiles}>
                  Browse
                </span>
                </>
                
              )}
              
              <input name='file' type='file' className='file' multiple ref={fileInputRef} onChange={onFileSelect}></input>
            </div>
            <div className='image-container'>
              {
                images.map((images, index) => (
                  <div className='image' key={index}>
                    <span className='delete' onClick={() => deleteImage(index)}>&times;</span>
                    <img src={images.url} alt={images.name}/>
                  </div>
                ))
              }
            </div>
            <button type='button' >
              Upload
            </button>
            {message && <div>Upload successful</div>}
            {upgradetoPremium && <div>Upgrade to Premium to Insert more events!</div>}
          </div>   
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" style={{fontFamily: 'Outfit' }}>
            Add Event
          </Button>
        </Grid>
      </Grid>
    
    </form>
    </div>
  );
}

export default EventForm;