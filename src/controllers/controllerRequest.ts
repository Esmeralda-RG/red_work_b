import {Request, Response} from 'express';
import { RegisterWorkerData, Worker } from './interfaces/register_worker_data';
import db, { addData, deleteData, getData, getDataById, updateData } from '../services/firestoreService';
import { hostService, host } from '../config/config';

interface RequestData {
    id?: string;
    nameClient: string;
    phoneClient: string;
    workerId: string;
    status: string;
}

export const createRequest = async (req: Request, res: Response) => {
    try {
        const { phoneClient, workerId, nameClient} = req.body;  

        if (!phoneClient || !workerId) {
            res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        const requestData: RequestData = {
            nameClient,
            phoneClient,
            workerId,
            status: 'pending', 
        };

        await addData('requests', requestData);
        res.status(201).json({ message: 'Request created successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating request:'});
    }
};


export const getRequestByWorker = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = await getData('requests') as RequestData[];
        if (!request) {
            res.status(404).json({ message: 'Request not found'});
        }
        const workerRequests = request.filter((request) => request.workerId === id);       

        if (!workerRequests) {
            res.status(404).json({ message: 'Request not found'});
        }

        res.status(200).json(workerRequests);
         
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting request:'});
    }
};

export const updateRequestStatus = async(req: Request, res: Response) => {
   try{
    const {id, requestId} = req.params;
    const {status} = req.body;

    console.log(id, requestId, status);

    const request = await getDataById('requests', requestId) as RequestData;
    if (!id || !requestId || !status) {
        res.status(400).json({ message: 'Faltan datos requeridos'});
    }


    if (status === 'finished') {
        const worker = await getDataById('workers', request.workerId) as Worker;
       await fetch(`${hostService}/api/request-rating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: request.id,
                workerId: request.workerId,
                workerName: worker.fullName,
                clientPhone: request.phoneClient,
                clientName: request.nameClient,
            }),
        }
    );
    console.log('Request finished');    
    }

 
    await deleteData('requests', requestId);
    res.status(200).json({message: 'Request updated successfully'});
   }catch(error){
    res.status(500).json({message: 'Error updating request'});
   }
}

export const ratingsByWorker = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'Faltan datos requeridos'});
        }


        const ratings = await db.collection('ratings').doc(id).collection('ratings').get();

        if (ratings.empty) {
            res.status(404).json({ ratings: []});
        }

        const ratingsData = ratings.docs.map((doc) => doc.data());

        res.status(200).json({ ratings: ratingsData.map((rating) => ({
            client: rating.client,
            rating: rating.rating,
            date: rating.date.toDate(),
        }))});

    } catch (error) {
        
        console.error(error);
        res.status(500).json({ message: 'Error getting ratings'});
    }
}

export const submitRatings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { client, rating, date } = req.body;
    console.log(id, client, rating, date);
    if (!id || !client || !rating || !date) {
        res.status(400).json({ message: 'Faltan datos requeridos'});
    }
    
    await db
      .collection("ratings")
      .doc(id)
      .collection("ratings").add({
        client,
        rating,
        date,
      });

    res.status(201).json({ message: 'Rating created successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating request:'});
  }
}

export const search = (req: Request, res: Response) => {
    res.status(200).json({message: 'Search'});
}