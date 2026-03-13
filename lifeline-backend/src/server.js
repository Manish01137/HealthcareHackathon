import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"

import patientRoutes from "./routes/patientRoutes.js"
import hospitalRoutes from "./routes/hospitalRoutes.js"
import ambulanceRoutes from "./routes/ambulanceRoutes.js"
import alertRoutes from "./routes/alertRoutes.js"
import { setupAmbulanceSocket } from "./socket/ambulanceSocket.js"

dotenv.config()

const app = express()

// Create HTTP server for Socket.io
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for prod
    methods: ["GET", "POST"]
  }
})

// Setup WebSockets
setupAmbulanceSocket(io)

app.use(cors())
app.use(express.json())

app.use("/api/patient", patientRoutes)
app.use("/api/hospitals", hospitalRoutes)
app.use("/api/ambulance", ambulanceRoutes)
app.use("/api/alerts", alertRoutes)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})