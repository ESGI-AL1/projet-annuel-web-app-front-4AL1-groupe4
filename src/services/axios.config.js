import axios from "axios";

const URL = "https://backend-2ku9.onrender.com/api/"
export const baseUrl = axios.create({
    baseURL: `${URL}`,
});
