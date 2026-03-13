import { Link } from "react-router-dom"

function Navbar() {

 return (

  <div className="bg-white shadow-md p-4 flex justify-between items-center">

   <h1 className="text-xl font-bold text-red-500">
    LifeLineAI 🚑
   </h1>

   <div className="flex gap-6">

    <Link to="/">Home</Link>
    <Link to="/ambulance">Ambulance</Link>
    <Link to="/hospitals">Hospitals</Link>
    <Link to="/map">Live Map</Link>
    <Link to="/hospital-panel">Hospital Panel</Link>
    <Link to="/alerts">Alerts</Link>

   </div>

  </div>

 )
}

export default Navbar