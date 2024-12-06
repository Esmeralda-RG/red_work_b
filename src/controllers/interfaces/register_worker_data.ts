export interface RegisterWorkerData {
    photo: string;
    fullName: string;
    job: string;
    category: string;
    workImages: string[];
    location: Location;
    phone: string;
    country: string;
    email: string;
    password: string;
}

interface Location {
    latitude: number;
    longitude: number;
}

export interface Worker extends RegisterWorkerData {
    id: string; 
    isAvailable: boolean;
}
