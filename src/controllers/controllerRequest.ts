import {Request, Response} from 'express';
import { RegisterWorkerData, Worker } from './interfaces/register_worker_data';
import { addData } from '../services/firestoreService';
import { hostService, host } from '../config/config';

export const createRequest = async (req: Request, res: Response) => {
    try {
        const { phoneNumberClient, phoneNumberWorker, clientName} = req.body;  

        if (!phoneNumberClient || !phoneNumberWorker || !clientName) {
            res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        const requestData = {
            clientName,
            phoneNumberClient,
            phoneNumberWorker,
            status: 'pending', 
            createdAt: new Date(),  
        };

        const requestId = await addData('requests', requestData);

        res.status(201).json({ message: 'Request created successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating request:'});
    }
};

export const getRequestDetails = (req: Request<{ id: string }>, res: Response) => {
    const {id} = req.params;
    res.status(200).json({message: `Get request details for ID: ${id}`});
}

export const requestRatings = (req: Request, res: Response) => {
    res.status(500).json({ message: 'Error creating request:'});
}

export const submitRatings = (req: Request, res: Response) => {
    res.status(201).json({message: 'Submit ratings'});
}

export const search = (req: Request, res: Response) => {
    res.status(200).json({message: 'Search'});
}