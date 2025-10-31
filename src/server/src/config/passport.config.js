import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Cấu hình Google Strategy
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Lưu lại tất cả thông tin cần dùng
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

// Facebook Strategy
passport.use(new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
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

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
