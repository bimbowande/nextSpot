import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://arvofinance.herokuapp.com/api/v1',
  timeout: 50000,
  'Content-Type': 'application/x-www-form-urlencoded',
});

export const setAuthorizationToken = (token) => {
  const defaultHeaders = http.defaults.headers.common || {};

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  } else {
    delete defaultHeaders.Authorization;
  }
  return defaultHeaders;
};

//save user info to local storage

export const saveToLocalStorage = (key = 'user-info', data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

//get user info from local storage
export const getFromLocalStorage = (key = 'user-info') => JSON.parse(localStorage.getItem(key));

//reomove user info from local storage
export const removeFromLocalStorage = (key = 'user-info') => {
  localStorage.removeItem(key);
};