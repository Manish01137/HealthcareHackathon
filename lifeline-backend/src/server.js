import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import patientRoutes from "./routes/patientRoutes.js"
import hospitalRoutes from "./routes/hospitalRoutes.js"
import ambulanceRoutes from "./routes/ambulanceRoutes.js"
import alertRoutes from "./routes/alertRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/patient", patientRoutes)
app.use("/api/hospitals", hospitalRoutes)
app.use("/api/ambulance", ambulanceRoutes)
app.use("/api/alerts", alertRoutes)

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})