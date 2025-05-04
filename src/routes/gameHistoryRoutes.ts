import { Router } from 'express';
import { GameHistoryController } from '../controllers/GameHistoryController';

const router = Router();
const controller = new GameHistoryController();

router.get('/user/:userId', controller.getUserHistory.bind(controller));
router.get('/:id', controller.getHistoryById.bind(controller));
router.post('/', controller.createHistory.bind(controller));
router.put('/:id', controller.updateHistory.bind(controller));
router.delete('/:id', controller.deleteHistory.bind(controller));

export default router;