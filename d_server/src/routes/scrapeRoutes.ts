import { Router } from 'express';
import { ScrapeController } from '../controllers/scrapeController';

const router = Router();
const scrapeController = new ScrapeController();

router.get('/scrape', scrapeController.getCode);

export default router;