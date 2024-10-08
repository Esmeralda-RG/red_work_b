import Router from 'express';

import {
    getAllWorkers,
    registerWorker,
    updateWorkerAvailability,
    getAvailableWorkers,
    getWorkersByCategory,
    createRequest,
    getRequestDetails,
    submitRatings
} from '../controllers/controller';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'Welcome to the API'});
});
router.get('/workers', getAllWorkers);
router.post('/workers/register', registerWorker);
router.post('/workers/:id/availability', updateWorkerAvailability);
router.get('/workers/available', getAvailableWorkers);
router.get('/workers/category/:category', getWorkersByCategory);
router.post('/request', createRequest);
router.get('/request/worker/:id', getRequestDetails);
router.post('/ratings', submitRatings);

export default router;