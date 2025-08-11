import { Router } from 'express';
import { sendContactMessage } from '../../controllers/common/contact.controller.js';

const router = Router();

router.post('/', sendContactMessage);

export default router;
