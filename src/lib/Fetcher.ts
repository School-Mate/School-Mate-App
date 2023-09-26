import axios from "axios"

const fetcher = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
})

export default fetcher