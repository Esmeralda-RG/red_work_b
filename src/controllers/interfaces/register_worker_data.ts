export interface RegisterWorkerData {
    photo: string;
    fullName: string;
    job: string;
    category: string;
    workImages: string[];
    location: Location;
    phoneNumber: string;
    email: string;
    password: string;
}

interface Location {
    latitude: number;
    longitude: number;
}