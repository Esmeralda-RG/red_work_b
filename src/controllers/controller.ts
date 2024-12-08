import {Request, Response} from 'express';
import { RegisterWorkerData, Worker } from './interfaces/register_worker_data';
import { addData, updateData, getData, deleteData, getDataById, getDataByPhone, getDataByCategory, createRequestInFirebase } from '../services/firestoreService';
import { uploadImage } from '../services/photoService';
import { capitalizeFullName, capitalizeJob } from '../utils/formatUtils';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../services/emailService';
import { hostService, host } from '../config/config';
import SocketsClients from '../sockes';



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

export const getWorkerEmailById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Obtener el trabajador desde la base de datos
        const worker: Worker = await getDataById('workers', id) as Worker;

        if (!worker) {
            res.status(404).json({ message: 'Worker not found' });
            return;
        }

        const subject = 'Enlace para restablecer contraseña';
        const logoUrl = 'https://res.cloudinary.com/dlq7gkrvq/image/upload/f_auto,q_auto/bt9d54drdkja28ws2klj'; 
        const resetLink = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; 

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
            <img src="${logoUrl}" alt="RedWork Logo" style="width: 150px; margin-bottom: 20px;">
            <h2>Hola ${worker.fullName},</h2>
            <p>Recibimos una solicitud para restablecer tu contraseña de RedWork.</p>
            <p>Ingresa al siguiente enlace para ingresar tu nueva contraseña:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
            <p style="margin-top: 20px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
        </div>
        `;
        // Enviar el correo
        await sendEmail('pedro.bernal@correounivalle.edu.co', subject, htmlContent);

        res.status(200).json({ message: 'Email sent successfully', worker });
    } catch (error) {
        console.error('Error getting worker email by id:', error);
        res.status(500).json({ message: 'Error getting worker email by id' });
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

export const getWorkersByCategoryAndSearch = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const search: string | undefined = req.query.search as string;
        const idClient = new Date().getTime().toString();
        let workers: Worker[] = await getDataByCategory(category) as Worker[];
        const sockes = SocketsClients.getInstance();
        let filteredWorkers = workers.map(worker => ({
            id: worker.id,
            fullName: capitalizeFullName(worker.fullName),
            photo: worker.photo,
            job: capitalizeJob(worker.job),
            phone: worker.phone,
            isAvailable: worker.isAvailable
        })).filter(worker => {
            if (search) {
                return worker.job.toLowerCase().includes(search.toLowerCase());
            }
            return true;
        });

        if (filteredWorkers.length === 0 && search) {
            filteredWorkers = workers.map(worker => ({
                id: worker.id,
                fullName: capitalizeFullName(worker.fullName),
                photo: worker.photo,
                job: capitalizeJob(worker.job),
                phone: worker.phone,
                isAvailable: worker.isAvailable
            }))};
        const message = "Hola, alguien está haciendo una búsqueda que se ajusta a tu perfil. ¿Deseas notificar tu disponibilidad? \n1. Sí \n2. No";
        filteredWorkers.map(async worker => {
            try {
                await fetch(`${hostService}/api/send-message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phone: worker.phone, country: '57', message: message, userType: 'worker', typeRequest: 'confirm' }),
                });
            } catch (error) {
                console.error(`Error sending message to worker ${worker.id}:`, error);
            }
        }); 
        sockes.createClient(idClient,filteredWorkers.map((worker) => worker.id));
        res.status(200).json({
            refreshResult: host,
            client: idClient,
            channel: 'refresh',
            data: filteredWorkers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving workers' });
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

    const workerData: RegisterWorkerData = {
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

    const updatedWorkerData: RegisterWorkerData = {
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

    const filteredData = Object.fromEntries(
        Object.entries(updatedWorkerData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(filteredData).length === 0) {
        res.status(400).json({ message: 'No fields provided to update' });
        return;
    }

    if (filteredData.photo) {
        const url = await uploadImage(photo, 'workers', phone);
        filteredData.photo = url;
    }

    try {
        await updateData('workers', id, filteredData);
        res.status(200).json({ message: `Worker ${id} updated successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating worker' });
    }
};



export const deleteWorker = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
        const worker = await getDataByPhone(id) as Worker | null;
        if (!worker) {
            res.status(404).json({ message: 'Worker not found' });
            return;
        }
        await deleteData('workers', worker.id);
        res.status(200).json({ message: `Worker ${id} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting worker' });
    }
}


export const updateWorkerAvailability = async (req: Request, res: Response) => {
    try {
       const { phone, isAvailable } = req.body;
       const worker: Worker = await getDataByPhone(phone) as Worker;
       const sockes = SocketsClients.getInstance(); 
        if (!worker) {
        res.status(404).json({ message: 'Worker not found' });
        return;
        }
      worker.isAvailable = isAvailable;
      await updateData('workers', worker.id, { isAvailable });
      sockes.refreshResult({
        id: worker.id,
        isAvailable: isAvailable
       });
      res.status(200).json({ message: 'Availability updated successfully' });
    } catch (error) {
      console.error('Error updating availability:', error);
      res.status(500).json({ message: 'Error updating availability' });
    }
  };
  

export const getAvailableWorkers = (req: Request, res: Response) => {
    res.status(200).json({message: 'Get available workers'});
}

export const createRequest = async (req: Request, res: Response) => {
    try {
        const { phoneNumberClient, phoneNumberWorker } = req.body;  
        const clientName = req.body.clientName;  

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

        const requestId = await createRequestInFirebase(requestData);

        res.status(201).json({ message: 'Solicitud creada exitosamente'});
    } catch (error) {
        console.error('Error al crear la solicitud:', error);
        res.status(500).json({ message: 'Error al crear la solicitud', error });
    }
};

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