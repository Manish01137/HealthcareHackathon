import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function LiveMap(){

 const ambulancePosition = [40.7128,-74.006]

 const hospitalPosition = [40.739,-73.975]

 return(

 <div>

 <h2 className="text-2xl font-bold mb-4">
 Live Ambulance Tracking
 </h2>

 <MapContainer
 center={ambulancePosition}
 zoom={13}
 className="h-[500px]"
 >

 <TileLayer
 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
 />

 <Marker position={ambulancePosition}>
 <Popup>Ambulance 🚑</Popup>
 </Marker>

 <Marker position={hospitalPosition}>
 <Popup>Hospital 🏥</Popup>
 </Marker>

 </MapContainer>

 </div>

 )

}

export default LiveMap