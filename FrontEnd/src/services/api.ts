import axios from "axios";
// import 'dotenv/config';

/* const apiUrl: string | undefined = process.env.REACT_APP_API_URL;

console.log(process.env) */

export const api = axios.create({
  baseURL: "http://localhost:3000" // apiUrl
});
