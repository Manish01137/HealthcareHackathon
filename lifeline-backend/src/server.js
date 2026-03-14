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

// Create HTTP server
const server = http.createServer(app)

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Initialize ambulance socket system
setupAmbulanceSocket(io)

app.use(cors())
app.use(express.json())

// API routes
app.use("/api/patients", patientRoutes)
app.use("/api/hospitals", hospitalRoutes)
app.use("/api/ambulance", ambulanceRoutes)
app.use("/api/alerts", alertRoutes)

const PORT = process.env.PORT || 5000

function startServer(port) {

  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
  })

  server.on("error", (err) => {

    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} busy, trying ${port + 1}`)
      startServer(port + 1)
    } else {
      console.error(err)
    }

  })
}

startServer(PORT)