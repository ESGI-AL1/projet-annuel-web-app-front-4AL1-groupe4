import axios from "axios";

const URL = "https://reverse-proxy-3le2.onrender.com"
export const baseUrl = axios.create({
    baseURL: `${URL}`,
});
