import {Request, Response} from 'express';
import { RegisterWorkerData } from './interfaces/register_worker_data';
import { addData } from '../services/firestoreService';
import { getData } from '../services/firestoreService';

export const getAllWorkers = async (req: Request, res: Response) => {
    try {
        const workers = await getData('workers');
        res.status(200).json(workers);
    } catch (error) {  
        console.error(error);
        res.status(500).json({message: 'Error getting workers'});
    }
};

export const stadistics = async (req: Request, res: Response) => {
    try {
        const workers = await getData('workers');
        const numberWorkers = workers.length;
        res.status(200).json({numberWorkers});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error getting workers'});
    }
}

export const registerWorker = async (req: Request<{}, {}, RegisterWorkerData>, res: Response) => {
    const {photo, fullName, job, category, workImages, location, phoneNumber, email, password} = req.body as RegisterWorkerData;

    const workerData = {
        photo,
        fullName,
        job,
        category,
        workImages,
        location,
        phoneNumber,
        email,
        password
    };
    try {
        const workerId = await addData('workers', workerData);
        res.status(201).json({message: 'Worker registered', workerId});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error registering worker'});
    }
}

export const updateWorker = (req: Request<{ id: string }, {}, RegisterWorkerData>, res: Response) => {
    const {id} = req.params;
    const {photo, fullName, job, category, workImages, location, phoneNumber, email, password} = req.body;
    res.status(200).json({message: `Worker ${id} updated`});
}

export const deleteWorker = (req: Request<{ id: string }>, res: Response) => {
    const {id} = req.params;
    res.status(200).json({message: `Worker ${id} deleted`});
}

export const updateWorkerAvailability = (req: Request<{ id: string }, {}, { availability: boolean }>, res: Response) => {
    const {id} = req.params;
    const {availability} = req.body;
    res.status(200).json({message: `Worker ${id} availability updated to ${availability}`});
}

export const getAvailableWorkers = (req: Request, res: Response) => {
    res.status(200).json({message: 'Get available workers'});
}

export const getWorkersByCategory = (req: Request<{ category: string }, {}, {}>, res: Response) => {
    const {category} = req.params;
    res.status(200).json({message: `Get workers in category: ${category}`});
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