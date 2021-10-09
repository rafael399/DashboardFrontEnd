import axios from 'axios';

export const AUTH_TOKEN = 'Bearer f90453ec712ce4505cc425e7e881e1d58ea274c3';

export const api = axios.create({
    baseURL: 'https://localhost:44324/api'
});
