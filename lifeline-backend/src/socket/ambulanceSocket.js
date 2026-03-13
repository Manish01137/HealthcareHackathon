export function setupAmbulanceSocket(io) {
    // Hackathon Demo: Simulate ambulance moving every 3 seconds
    setInterval(() => {
        const mockData = {
            id: "AMB-001",
            lat: 40.7128 + (Math.random() * 0.002 - 0.001),
            lng: -74.006 + (Math.random() * 0.002 - 0.001),
            status: "en-route",
            driver: "Rajesh Kumar",
            selectedHospitalId: 1
        };
        io.emit("ambulanceLocationUpdate", mockData);
    }, 3000);

    io.on("connection", (socket) => {
        console.log("Client connected to ambulance socket:", socket.id);

        // If a real ambulance sends GPS location
        socket.on("updateLocation", (data) => {
            // server broadcasts location updates
            // data: { id, lat, lng, speed, etc }
            socket.broadcast.emit("ambulanceLocationUpdate", data);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}
