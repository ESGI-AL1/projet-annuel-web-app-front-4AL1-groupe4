import axios from "axios";

const URL =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:8000/api";


export const baseUrl = axios.create({
    baseURL: `${URL}`,
});
