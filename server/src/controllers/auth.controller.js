import * as authService from '../services/auth.js'
import { validateData, registerSchema, loginSchema } from '../validations/userValidation.js';

export const registerController = async (req, res) => {

    const check = validateData(registerSchema, req.body);
    if (!check.valid) return res.status(400).json({ err: 1, msg: check.msg });

    try {
        const response = await authService.registerService(check.data, true)
        return res.status(response.err ? 400 : 201).json(response);
    } catch (error) {
        return res.status(500).json({
            err:-1,
            msg:'Failed at register controller: ' + error
        })
    }
}

export const loginController = async (req, res) => {

    const check = validateData(loginSchema, req.body);
    if (!check.valid) return res.status(400).json({ err: 1, msg: check.msg });

    try {
        const response = await authService.loginService(check.data, true)
        return res.status(response.err ? 400 : 201).json(response);
    } catch (error) {
        return res.status(500).json({
            err:-1,
            msg:'Failed at login controller: ' + error
        })
    }
}