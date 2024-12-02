import Router from 'express';

import {
    getAllWorkers,
    registerWorker,
    updateWorker,
    deleteWorker,
    updateWorkerAvailability,
    getAvailableWorkers,
    getWorkersByCategory,
    createRequest,
    getRequestDetails,
    submitRatings,
    search,
    initialInfo,
    getWorkerById,
    getWorkerByPhone
} from '../controllers/controller';

const router = Router();

router.get('/', initialInfo);
router.get('/workers', getAllWorkers);
router.get('/workers/:id', getWorkerById);
router.get('/workers/phone/:phone', getWorkerByPhone);
router.post('/workers/register', registerWorker);
router.put('/workers/:id/update', updateWorker);
router.delete('/workers/:id/delete', deleteWorker);
router.post('/workers/:id/availability', updateWorkerAvailability);
router.get('/workers/available', getAvailableWorkers);
router.get('/workers/category/:category', getWorkersByCategory);
router.get('/search', search);
router.post('/request', createRequest);
router.get('/request/worker/:id', getRequestDetails);
router.post('/ratings', submitRatings);

export default router;