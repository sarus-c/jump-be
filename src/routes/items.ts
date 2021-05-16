import express from 'express';
import controller from '../controllers/item';

const router = express.Router();

router.post('/create/:search_id', controller.createItem);
router.delete('/delete/:id', controller.deleteItem);

export = router;