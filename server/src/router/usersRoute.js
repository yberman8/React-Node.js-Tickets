import express from 'express'
import UsersController from '../controllers/UsersController.js';
import authToken from '../middleware/authToken.js';
const router = express.Router();

// בקשות API
router.get('/get_users',authToken, UsersController.getUsers);
router.post('/create_user',authToken, UsersController.createUser);
router.put('/edit_user',authToken, UsersController.editUser);
router.delete('/delete_user',authToken, UsersController.deleteUser);

router.post('/swich_to_user',authToken, UsersController.swichToUser);


export default router;