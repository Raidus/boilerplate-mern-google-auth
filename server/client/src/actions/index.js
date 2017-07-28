import axios from 'axios';
import { FETCH_USER } from './types';

// https://www.udemy.com/node-with-react-fullstack-web-development/learn/v4/t/lecture/7605096?start=0
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};
