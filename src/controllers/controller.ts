import {Request, Response} from 'express';
import { RegisterWorkerData, Worker } from './interfaces/register_worker_data';
import { addData, updateData, getData, deleteData, getDataById, getDataByPhone, getDataByCategory } from '../services/firestoreService';
import { uploadImage } from '../services/photoService';
import { capitalizeFullName, capitalizeJob } from '../utils/formatUtils';
import bcrypt from 'bcryptjs';
import { messaging } from 'firebase-admin';

export const getAllWorkers = async (req: Request, res: Response) => {
    try {
        const workers: Worker[] = await getData('workers') as Worker[];
        const filteredWorkers = workers.map(worker => ({
            id: worker.id,
            fullName: capitalizeFullName(worker.fullName),
            photo: worker.photo,
            job: capitalizeJob(worker.job)
        }));
        res.status(200).json(filteredWorkers);
    } catch (error) {  
        console.error(error);
        res.status(500).json({message: 'Error getting workers'});
    }
};

export const getWorkerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const worker: Worker = await getDataById('workers', id) as Worker;
        const filteredWorker = {
            id: worker.id,
            fullName: capitalizeFullName(worker.fullName), 
            photo: worker.photo,
            job: capitalizeJob(worker.job)
        };
        res.status(200).json(filteredWorker);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error getting worker'});
    }
};

export const getWorkerByPhone = async (req: Request, res: Response) => {
    try {
        const { phone } = req.params;
        const worker: Worker = await getDataByPhone(phone) as Worker;
        res.status(200).json({ id: worker.id });
    } catch(error){
        console.error(error);
        res.status(500).json({message: 'Error getting worker by phone'});
    }
}

export const getWorkersByCategory = async (req: Request<{ category: string }>, res: Response) => {
    try {
        const { category } = req.params;
        const workers: Worker[] = await getDataByCategory(category) as Worker[];
        res.status(200).json({ workers });
    } catch(error){
        console.error(error)
        res.status(500).json({ meesage: 'Error retrieving workers'});
    }
}

export const initialInfo = async (req: Request, res: Response) => {
    try{
        const workers = await getData('workers');
        const numberWorkers = workers.length;
        const phoneAdmin = process.env.PHONE_NUMBER_ADMIN;

        const workersRegisteredCount = numberWorkers < 1000 ? `${numberWorkers}+` : `${numberWorkers.toString().slice(0, 1)}K+`;

        res.status(200).json({
            workersRegisteredCount: workersRegisteredCount, 
            whatsappRegistrationLink: `https://wa.me/${phoneAdmin}?text=Hola%2C%20quiero%20registrarme%20como%20trabajador`,
        });
    }catch (error){
        console.error(error);
        res.status(500).json({message: 'Error getting initial info'});
    }
}

export const registerWorker = async (req: Request<{}, {}, RegisterWorkerData>, res: Response) => {
    const {photo, fullName, job, category, workImages, location, phone, country,  email, password} = req.body as RegisterWorkerData;

    const workerData = {
        photo,
        fullName,
        job,
        category,
        workImages,
        location,
        phone,
        country,
        email,
        password
    };
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        workerData.password = hashedPassword;
        const url = await uploadImage(photo, 'workers', phone);
        workerData.photo = url;
        const workerId = await addData('workers', workerData);
        res.status(201).json({message: 'Worker registered', workerId});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error registering worker'});
    }
}

export const updateWorker = async (req: Request<{ id: string }, {}, RegisterWorkerData>, res: Response) => {
    const { id } = req.params;
    const { photo, fullName, job, category, workImages, location, phone, country, email, password } = req.body;

    const updatedWorkerData = {
        photo,
        fullName,
        job,
        category,
        workImages,
        location,
        phone,
        country,
        email,
        password,
    };
    console.log("hola");
    const filteredData = Object.fromEntries(
        Object.entries(updatedWorkerData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(filteredData).length == 0){
        res.status(400).json({ message: 'No fields provided to update' });
        return;
    }

    try {
        await updateData('workers', id, filteredData);
        
        res.status(200).json({ message: `Worker ${id} updated successfully`});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating worker'});
    }
}

export const deleteWorker = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
        await deleteData('workers', id);
        res.status(200).json({ message: `Worker ${id} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting worker' });
    }
}


export const updateWorkerAvailability = (req: Request<{ id: string }, {}, { availability: boolean }>, res: Response) => {
    const {id} = req.params;
    const {availability} = req.body;
    res.status(200).json({message: `Worker ${id} availability updated to ${availability}`});
}

export const getAvailableWorkers = (req: Request, res: Response) => {
    res.status(200).json({message: 'Get available workers'});
}

export const createRequest = (req: Request, res: Response) => {
    res.status(201).json({message: 'Create request'});
}

export const getRequestDetails = (req: Request<{ id: string }>, res: Response) => {
    const {id} = req.params;
    res.status(200).json({message: `Get request details for ID: ${id}`});
}

export const submitRatings = (req: Request, res: Response) => {
    res.status(201).json({message: 'Submit ratings'});
}

export const search = (req: Request, res: Response) => {
    res.status(200).json({message: 'Search'});
}