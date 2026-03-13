import { hospitals } from "../data/hospitals.js"

export const getHospitals = (req,res) => {

 res.json(hospitals)

}