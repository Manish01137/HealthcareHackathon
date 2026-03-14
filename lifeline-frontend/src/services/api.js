import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api"
})

export const assessSeverity = (data) => {
  return api.post("/patients/assess", data)
}

export default api