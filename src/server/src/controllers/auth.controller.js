import * as authService from '../services/auth.js'
import { registerSchema, loginSchema } from '../validations/userValidation.js';
import { validateData } from '../validations/validation.js';
import { setAuthCookie, clearAuthCookie  } from "../utils/index.js";

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
        if (response.err) return res.status(401).json(response);
        // Gắn token vào HttpOnly cookie
        setAuthCookie(res, response.token);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err:-1,
            msg:'Failed at login controller: ' + error
        })
    }
}

export const logoutController = async (req, res) => {
    try {
        clearAuthCookie(res);
        return res.status(200).json({ err: 0, msg: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at logout controller: " + error,
        });
    }
};

export const googleCallbackController = async (req, res) => {
    try {
        //console.log('------Callback req.user: -------', req.user); 
        const profile = req.user;
        const payload = {
            provider: "google",
            providerUserId: profile.id,
            profile,
            email: profile.emails?.[0]?.value,
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
        };

        const response = await authService.socialLoginService(payload);
        setAuthCookie(res, response.token);
        if (response.err === 0) return res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
        return res.status(401).json(response);
    } catch (error) {
        //console.error('Google login error:', error);
        return res.status(500).json({ err: -1, msg: 'Failed at Google login: ' + error.message });
    }
};

export const facebookCallbackController = async (req, res) => {
    try {
        //console.log('------Callback req.user (Facebook):-------', req.user);
        if (!req.user || !req.user.id) {
            //console.error('❌ No user data or missing id:', req.user);
            return res.status(401).json({ err: 1, msg: 'No user data from Facebook' });
        }
        const profile = req.user;
        const email = profile.emails?.[0]?.value || `${profile.id}@gmail.com`;
        const payload = {
            provider: "facebook",
            providerUserId: profile.id,
            profile, // giữ full dữ liệu Facebook
            email,
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
        };
        const response = await authService.socialLoginService(payload);
        setAuthCookie(res, response.token);
        if (response.err === 0) return res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
        return res.status(401).json(response);
    } catch (error) {
        //console.error('Facebook login error:', error);
        return res.status(500).json({ err: -1, msg: 'Failed at Facebook login: ' + error.message });
    }
};