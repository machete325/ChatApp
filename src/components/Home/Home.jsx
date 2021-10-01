import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import s from './Home.module.css';

const Home = () => {
  const history = useHistory();
  const [state, setState] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  };

  const loginHandle = async ({ email, password }) => {
    try {
      const responce = await axios.post('http://hofenterprise.com:4000/user/login', {
        email,
        password,
      });
      return responce.data.user;
    } catch (e) {
      return e;
    }
  };

  const handleClick = async () => {
    const user = await loginHandle(state);
    localStorage.setItem('user', JSON.stringify(user));
    console.log('ok');
    if (user) {
      setTimeout(() => history.push('/chat'), 3000);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.page}>Home Page</div>
      <div className={s.form}>
        <div className={s.title}>Login</div>
        <TextField
          id="standard-basic"
          name="email"
          label="Enter your email"
          variant="outlined"
          value={state.email}
          onChange={handleChange}></TextField>
        <TextField
          id="standard-basic"
          name="password"
          label="Enter your password"
          variant="outlined"
          value={state.password}
          onChange={handleChange}></TextField>
        <Button variant="contained" color="success" onClick={handleClick}>
          LOGIN
        </Button>
      </div>
    </div>
  );
};

export default Home;
