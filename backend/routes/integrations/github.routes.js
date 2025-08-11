import { Router } from 'express';
import { getGitHubUser } from '../../controllers/integrations/github.controller.js';

const router = Router();
router.get('/:username', getGitHubUser);
export default router;
