function HospitalCard({hospital}){

    return(
   
    <div className="border rounded p-4 shadow">
   
    <h3 className="font-bold text-lg">
   
    {hospital.name}
   
    </h3>
   
    <p>ICU Beds: {hospital.icu}</p>
    <p>Ventilators: {hospital.vent}</p>
    <p>Distance: {hospital.distance} km</p>
   
    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
   
    Route to Hospital
   
    </button>
   
    </div>
   
    )
   
   }
   
   export default HospitalCard