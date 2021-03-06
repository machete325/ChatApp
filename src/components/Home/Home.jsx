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
      const responce = await axios.post(
        'https://murmuring-citadel-71705.herokuapp.com/user/login',
        {
          email,
          password,
        },
      );
      return responce.data.user;
    } catch (e) {
      return e;
    }
  };

  const handleClick = async () => {
    const user = await loginHandle(state);
    localStorage.setItem('user', JSON.stringify(user));
    if (user) {
      setTimeout(() => history.push('/chat'), 3000);
    }
  };

  const handleClickChat = () => {
    history.push('/chat');
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
      {JSON.parse(localStorage.getItem('user')) && (
        <div className={s.button_chat}>
          <Button variant="contained" color="success" onClick={handleClickChat}>
            Going to chat
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
