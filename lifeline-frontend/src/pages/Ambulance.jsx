/* eslint-disable no-unused-vars */
import { useState } from "react"

function Ambulance(){

 const [age,setAge] = useState("")
 const [symptoms,setSymptoms] = useState("")
 const [severity,setSeverity] = useState("")

 const assessSeverity = () => {

  if(symptoms.includes("chest")){
   setSeverity("High")
  } else {
   setSeverity("Low")
  }

 }

 return(

 <div className="max-w-xl mx-auto">

 <h2 className="text-2xl font-bold mb-6">

 Patient Information

 </h2>

 <input
 className="border p-3 w-full mb-4"
 placeholder="Age"
 onChange={(e)=>setAge(e.target.value)}
 />

 <textarea
 className="border p-3 w-full mb-4"
 placeholder="Symptoms"
 onChange={(e)=>setSymptoms(e.target.value)}
 />

 <button
 onClick={assessSeverity}
 className="bg-red-500 text-white px-6 py-3 rounded w-full">

 Assess Severity

 </button>

 {severity && (

  <div className="mt-6 p-4 bg-green-100 rounded">

   Severity: {severity}

  </div>

 )}

 </div>

 )

}

export default Ambulance