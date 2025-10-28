import * as authService from '../services/auth.js'
import { registerSchema, loginSchema } from '../validations/userValidation.js';
import { validateData } from '../validations/validation.js';

export const registerController = async (req, res) => {

    const check = validateData(registerSchema, req.body);
    if (!check.valid) return res.status(400).json({ err: 1, msg: check.msg });

    try {
        const response = await authService.registerService(check.data, true)
        return res.status(response.err === 1 ? 400 : response.err === 2 ? 409 : 201).json(response);
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
        return res.status(response.err ? 401 : 201).json(response);
    } catch (error) {
        return res.status(500).json({
            err:-1,
            msg:'Failed at login controller: ' + error
        })
    }
}

export const googleCallbackController = async (req, res) => {
    try {
        console.log('------Callback req.user: -------', req.user); 

        if (!req.user || !req.user.id) {
            console.error('❌ No user data or missing id:', req.user);
            return res.status(401).json({ err: 1, msg: 'No user data from Google' });
        }

        const { id, emails, displayName, accessToken, refreshToken } = req.user;

        const response = await authService.socialLoginService({
            email: emails?.[0]?.value,
            provider: 'google',
            providerUserId: id,
            accessToken,
            refreshToken,
            profile: { displayName }
        });

        if (response.err === 0) {
            return res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${response.token}`);
        }
        return res.status(401).json(response);
    } catch (error) {
        console.error('Google login error:', error);
        return res.status(500).json({ err: -1, msg: 'Failed at Google login: ' + error.message });
    }
};

export const facebookCallbackController = async (req, res) => {
    try {
        console.log('------Callback req.user (Facebook):-------', req.user);
        if (!req.user || !req.user.id) {
            console.error('❌ No user data or missing id:', req.user);
            return res.status(401).json({ err: 1, msg: 'No user data from Facebook' });
        }
        const { id, displayName, emails = [{ value: null }], accessToken, refreshToken } = req.user;
        const email = emails[0].value || `facebook_${id}@example.com`;
        const response = await authService.socialLoginService({
            email,
            provider: 'facebook',
            providerUserId: id,
            accessToken,
            refreshToken,
            profile: { displayName }
        });
        if (response.err === 0) {
            return res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${response.token}`);
        }
        return res.status(401).json(response);
    } catch (error) {
        console.error('Facebook login error:', error);
        return res.status(500).json({ err: -1, msg: 'Failed at Facebook login: ' + error.message });
    }
};