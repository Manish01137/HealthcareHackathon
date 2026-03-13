import { getNearbyUsers } from "../services/geofenceService.js"
import { sendAlert } from "../services/notificationService.js"

export const triggerCrowdAlert = async(req,res)=>{

 const {ambulanceLocation, users} = req.body

 const nearbyUsers = getNearbyUsers(ambulanceLocation, users)

 for(const user of nearbyUsers){

  await sendAlert(user.token)

 }

 res.json({
  notified: nearbyUsers.length
 })

}