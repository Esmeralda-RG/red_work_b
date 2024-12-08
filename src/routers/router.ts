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
    getRequestDetails,
    submitRatings,
    search,
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
router.get('/request/worker/:id', getRequestDetails);
router.post('/ratings', submitRatings);
router.get('/workers/email/:id', getWorkerEmailById);

export default router;