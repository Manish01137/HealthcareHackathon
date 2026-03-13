import { getDistance } from "geolib"

export function getNearbyUsers(ambulance, users){

 return users.filter(user=>{

  const distance = getDistance(

   {latitude:ambulance.lat, longitude:ambulance.lng},

   {latitude:user.lat, longitude:user.lng}

  )

  return distance < 500

 })

}