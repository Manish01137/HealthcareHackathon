import axios from "axios"

const api = axios.create({
  baseURL: "https://healthcarehackathon.onrender.com"
})

export const assessSeverity = (data) => {
  return api.post("/patients/assess", data)
}

export default api