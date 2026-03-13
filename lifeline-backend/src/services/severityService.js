import admin from "../config/firebase.js"

export async function sendAlert(token){

 const message = {

  notification:{
   title:"Ambulance Alert",
   body:"🚑 Ambulance approaching. Please clear the road."
  },

  token

 }

 await admin.messaging().send(message)

}