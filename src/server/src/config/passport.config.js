import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// URL public của backend (Render) - dùng cho OAuth callback. Local mặc định localhost:5000
const SERVER_URL = (process.env.SERVER_URL || 'http://localhost:5000').replace(/\/+$/, '');

// Cấu hình Google Strategy nếu có cấu hình
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${SERVER_URL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = {
                    id: profile.id,
                    emails: profile.emails,
                    displayName: profile.displayName,
                    accessToken,
                    refreshToken,
                };
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    ));
}

// Facebook Strategy nếu có cấu hình
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    passport.use(new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: `${SERVER_URL}/api/auth/facebook/callback`,
            // passport-facebook mặc định gọi Graph API v3.2 (đã hết hạn) -> dùng URL không phiên bản = mặc định của app
            tokenURL: 'https://graph.facebook.com/oauth/access_token',
            profileURL: 'https://graph.facebook.com/me',
            profileFields: ['id', 'displayName']
        }, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = {
                    id: profile.id,
                    displayName: profile.displayName,
                    accessToken,
                    refreshToken,
                };
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    ));
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
