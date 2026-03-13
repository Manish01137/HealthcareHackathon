// Firebase Admin SDK — only initializes if serviceAccount.json exists
import { createRequire } from "module"
import { existsSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const serviceAccountPath = join(__dirname, "serviceAccount.json")

let admin = null

if (existsSync(serviceAccountPath)) {
    try {
        const require = createRequire(import.meta.url)
        const adminModule = require("firebase-admin")
        const serviceAccount = require("./serviceAccount.json")
        adminModule.initializeApp({
            credential: adminModule.credential.cert(serviceAccount)
        })
        admin = adminModule
        console.log("[Firebase] ✅ Admin SDK initialized")
    } catch (e) {
        console.warn("[Firebase] ⚠️ Failed to initialize:", e.message)
    }
} else {
    console.warn("[Firebase] ⚠️ serviceAccount.json not found — running without push notifications")
}

export default admin