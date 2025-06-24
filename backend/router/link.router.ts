import { Router } from 'express';
import { 
  saveLink, 
  getLinks, 
  getLinkDetails, 
  deleteLink, 
  searchLinks 
} from '../controller/link.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/', saveLink);
router.get('/', getLinks);
router.get('/search', searchLinks);
router.get('/:id', getLinkDetails);
router.delete('/:id', deleteLink);

export default router;