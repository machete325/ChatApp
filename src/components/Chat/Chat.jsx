import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@material-ui/styles';
import s from './Chat.module.css';

const socket = io.connect('https://murmuring-citadel-71705.herokuapp.com');

const useStyles = makeStyles({
  field: {
    width: '250px',
  },
  buton: {
    width: '100px',
  },
});

const Chat = () => {
  const history = useHistory();
  const classes = useStyles();
  const [friends, setFriends] = useState([]);
  const [state, setState] = useState({ message: '', name: '' });
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    socket.emit('join_room', { room_name: user.id });
    getFriends();
  }, []);

  useEffect(() => {
    socket.on('message_to_client', (data) => {
      setChat([...chat, { name: data.from, message: data.msg }]);
    });
  }, [chat]);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setState({ ...state, [name]: value });
  };

  const handleChangeSelect = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const friend = friends.find((user) => user.name === value);
    if (room !== null) {
      socket.emit('leave_room', { room_name: room });
    }
    socket.emit('join_room', { room_name: friend.id });
    setChat([]);
    setRoom(friend.id);
    setState({ ...state, [name]: value });
  };

  const handleClick = () => {
    if (state.name !== '') {
      const { name, message } = state;
      socket.emit('message_to_server', { room_name: room, from: user.name, msg: message });
      setState({ message: '', name });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    history.push('/');
  };

  const getFriendsData = async (email, secret_key) => {
    try {
      const responce = await axios.get(
        `https://murmuring-citadel-71705.herokuapp.com/user/friends?email=${email}&secret_key=${secret_key}`,
      );
      setFriends([...friends, ...responce.data.friends]);
    } catch (e) {
      console.log(e);
    }
  };

  const getFriends = () => {
    const { email, secret_key } = user;
    getFriendsData(email, secret_key);
  };

  const renderMessages = () => {
    return (
      <>
        {chat.map((item, index) => (
          <div key={index} className={s.message_container}>
            <div className={s.name}>{item.name}:</div>
            <div className={s.message}>{item.message}</div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={s.container}>
      <div className={s.first_column}>
        <div className={s.title_messanger}>Messanger</div>
        <FormControl className={classes.field}>
          <InputLabel id="name">Name</InputLabel>

          <Select
            labelId="name"
            id="name"
            value={state.name === '' ? '' : state.name}
            label="name"
            name="name"
            onChange={handleChangeSelect}>
            {friends.map((elem, index) => (
              <MenuItem key={index} value={elem.name}>
                {elem.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="outlined-basic"
          name="message"
          label="Enter message"
          variant="outlined"
          value={state.message}
          className={classes.field}
          onChange={handleChange}
        />
        <div className={s.buttons}>
          <Button
            variant="contained"
            color="success"
            className={classes.buton}
            onClick={handleLogout}>
            Logout
          </Button>
          <Button
            variant="contained"
            color="success"
            className={classes.buton}
            onClick={handleClick}>
            Send
          </Button>
        </div>
      </div>
      <div className={s.second_column}>
        <div className={s.title_messanger_second}>Chat</div>
        {renderMessages()}
      </div>
    </div>
  );
};

export default Chat;
