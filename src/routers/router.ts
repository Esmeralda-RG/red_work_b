import Router from 'express';

import {
    getAllWorkers,
    registerWorker,
    updateWorker,
    deleteWorker,
    updateWorkerAvailability,
    getWorkersByCategoryAndSearch,
    initialInfo,
    getWorkerById,
    getWorkerByPhone,
    getWorkerEmailById
} from '../controllers/controller';

import {
    createRequest,
    updateRequestStatus,
    submitRatings,
    search,
    getRequestByWorker,
} from '../controllers/controllerRequest';

const router = Router();

router.get('/', initialInfo);
router.get('/workers', getAllWorkers);
router.get('/workers/:id', getWorkerById);
router.get('/workers/phone/:phone', getWorkerByPhone);
router.post('/workers/register', registerWorker);
router.put('/workers/:id/update', updateWorker);
router.delete('/workers/:id/delete', deleteWorker);
router.put('/workers/availability', updateWorkerAvailability);
router.get('/workers/category/:category', getWorkersByCategoryAndSearch);
router.get('/search', search);
router.post('/request', createRequest);
router.get('/request/worker/:id', getRequestByWorker);
router.patch('/request/worker/:id/:requestId', updateRequestStatus);
router.post('/ratings/:id', submitRatings);
router.get('/ratings/:id', getWorkerById);
router.post('/workers/reset-password', getWorkerEmailById);


export default router;