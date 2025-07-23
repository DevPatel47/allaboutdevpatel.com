import { Router } from 'express';
import { getPortfolioByUsername } from '../../controllers/portfolio/portfolio.controller.js';

const router = Router();

router.get('/:username', getPortfolioByUsername);

export default router;
