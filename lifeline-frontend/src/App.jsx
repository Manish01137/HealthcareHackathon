import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Ambulance from "./pages/Ambulance"
import Hospitals from "./pages/Hospitals"
import LiveMap from "./pages/LiveMap"
import HospitalPanel from "./pages/HospitalPanel"
import Alerts from "./pages/Alerts"

function App() {

 return (

  <BrowserRouter>

   <Navbar/>

   <div className="p-6">

    <Routes>

     <Route path="/" element={<Home/>}/>
     <Route path="/ambulance" element={<Ambulance/>}/>
     <Route path="/hospitals" element={<Hospitals/>}/>
     <Route path="/map" element={<LiveMap/>}/>
     <Route path="/hospital-panel" element={<HospitalPanel/>}/>
     <Route path="/alerts" element={<Alerts/>}/>

    </Routes>

   </div>

  </BrowserRouter>

 )
}

export default App