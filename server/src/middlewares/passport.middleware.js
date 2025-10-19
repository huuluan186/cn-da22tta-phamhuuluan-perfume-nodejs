import passport from "passport";

// Google middleware
export const googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    failureRedirect: "/api/auth/login"
});

// Facebook middleware
export const facebookAuth = passport.authenticate("facebook", {
    scope: ["public_profile"],
    session: false,
    failureRedirect: "/api/auth/login"
});
