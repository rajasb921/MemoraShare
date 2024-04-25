import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
} from "@mui/material";

import axios from 'axios'
import '../styles/Login.css'
import { AuthContext } from "../contexts/AuthContext.js";


const LoginForm = () => {
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [specialChr, setspecialChar] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
        e.preventDefault();

        try{
          const response = await axios.post('http://localhost:8383/login', { username, password });
          localStorage.setItem('userID', response.data.userID);
          dispatch({ type: "LOGIN", payload: response.data.userID });  
          navigate(`/${response.data.userID}`)
        } catch (error){
          if(error.response.status === 400){
            setspecialChar(true)
            console.log(specialChr)
          }
          if(error.response.status === 401){
            setInvalidCredentials(true)
            console.log(invalidCredentials)
          }
        }  
    };
  
    return (
      <div className="container">
        <div className="login">
          <Typography variant="h5" align="center" gutterBottom style={{ fontFamily: "Outfit", color: "black" }}>
            Login
          </Typography>
          <form onSubmit={handleLogin} className="form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth 
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" style={{fontFamily: "Outfit", backgroundColor:"green"}}>
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item style={{marginTop: "5px"}}>
                <MuiLink component={Link} to="/signup" variant="body2" style={{fontFamily: "Outfit"}}>
                  Don't have an account? Sign Up
                </MuiLink>
              </Grid>
            </Grid>
            </Grid>
            {invalidCredentials && (
              <Typography variant="body2" color="error">
                Wrong email or password!
              </Typography>
            )}
            {specialChr && (
              <Typography variant="body2" color="error">
                Special Characters!
              </Typography>
            )}
          </form>
        </div>
      </div>
    );
  };
  
  export default LoginForm;
  


