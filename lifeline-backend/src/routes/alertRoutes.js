import express from "express"
import { sendCrowdAlert } from "../controllers/alertController.js"

const router = express.Router()

router.post("/crowd", sendCrowdAlert)

export default router