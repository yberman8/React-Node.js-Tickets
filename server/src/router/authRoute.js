import express from 'express'
import AuthController from '../../src/controllers/AuthController.js';
import authToken from '../middleware/authToken.js';
const router = express.Router();

// בקשות API
router.post('/login', AuthController.Login);
router.post('/verify_code', AuthController.verifyEmailCode);

router.post('/forgotPassword', AuthController.forgotPassword);
router.put('/resetPassword', authToken, AuthController.resetPassword);

export default router;