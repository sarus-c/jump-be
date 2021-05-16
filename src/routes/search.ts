import express from 'express';
import controller from '../controllers/search';

const router = express.Router();

router.get('/', controller.getSearches);
router.get('/one/:id', controller.getSearcheById);
router.post('/create', controller.createSearch);
router.delete('/delete/:id', controller.deleteSearchAndItems);

export = router;