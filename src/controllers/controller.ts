import {Request, Response} from 'express';
import { RegisterWorkerData } from './interfaces/register_worker_data';

export const getAllWorkers = (req: Request, res: Response) => {
    res.status(200).json({message: 'Get all workers'});
};

export const registerWorker = (req: Request<{}, {}, RegisterWorkerData>, res: Response) => {
    const {photo, fullName, job, category, workImages, location, phoneNumber, email, password} = req.body as RegisterWorkerData;
    res.status(201).json({message: 'Register worker'});
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