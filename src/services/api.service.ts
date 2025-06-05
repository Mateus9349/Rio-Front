import axios from 'axios';

const api = axios.create({
  baseURL: 'http://181.215.134.205:3000',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '3a2de9bc56463e72d5190206faf4bff3c4985311ff57c620546a746bf376542e',
  },
});

export default api;