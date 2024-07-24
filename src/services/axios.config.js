import axios from "axios";

const URL =
    window.location.hostname === "localhost"
        ? "http://ec2-13-53-40-36.eu-north-1.compute.amazonaws.com:8000/api" : 'http://ec2-13-53-40-36.eu-north-1.compute.amazonaws.com:8000/api';

export const baseUrl = axios.create({
    baseURL: `${URL}`,
});
