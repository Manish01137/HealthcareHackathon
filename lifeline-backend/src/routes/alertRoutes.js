import express from "express"
import { triggerCrowdAlert } from "../controllers/alertController.js"

const router = express.Router()

router.post("/crowd", triggerCrowdAlert)

export default router