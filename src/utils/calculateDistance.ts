import { Worker } from '../controllers/interfaces/register_worker_data';

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export const calculateDistance = (worker: Worker, clientLatitude: number, clientLongitude: number) => {
    const earthRadius = 6371; //Earth radius in km

    const workerLatitude = worker.location.latitude;
    const workerLongitude = worker.location.longitude;

    const latDistance = deg2rad(clientLatitude - workerLatitude);
    const lonDistance = deg2rad(clientLongitude - workerLongitude);

    // Haversine formula
    const a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
              Math.cos(deg2rad(workerLatitude)) * Math.cos(deg2rad(clientLatitude)) *
              Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return {
        workerId: worker.id,
        workerName: worker.fullName, 
        distance: parseFloat(distance.toFixed(2)), 
    };
};
