import axios from "axios";

const URL = "https://deploy-62iv.onrender.com/api/"
export const baseUrl = axios.create({
    baseURL: `${URL}`,
});
