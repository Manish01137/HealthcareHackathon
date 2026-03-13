import { getDistance } from "geolib"

export function rankHospitals(patient, ambulanceLocation, hospitals){

 return hospitals.map(hospital=>{

  const distance = getDistance(
   ambulanceLocation,
   {latitude:hospital.lat, longitude:hospital.lng}
  )

  let score = 0

  score += hospital.icuBeds * 3
  score += hospital.ventilators * 2
  score += hospital.doctors * 2

  score -= distance/100

  return {
   ...hospital,
   score
  }

 }).sort((a,b)=>b.score-a.score)

}