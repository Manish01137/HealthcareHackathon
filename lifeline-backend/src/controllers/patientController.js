import { assessSeverity } from "../services/severityService.js"

export const evaluatePatient = (req,res)=>{

 const severity = assessSeverity(req.body)

 res.json({
  severity
 })

}