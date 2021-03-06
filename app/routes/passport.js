var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var CONFIG = require('config');

(function () {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    if (CONFIG.passport.TWITTER_CONSUMER_KEY == '')
        return;

    passport.use(new TwitterStrategy({
        consumerKey: CONFIG.passport.TWITTER_CONSUMER_KEY,
        consumerSecret: CONFIG.passport.TWITTER_CONSUMER_SECRET,
        callbackURL: CONFIG.passport.resolveURL + "/auth/twitter/callback"
    }, function (token, tokenSecret, profile, done) {
        passport.session.accessToken = token;
        passport.session.profile = profile;
        process.nextTick(function () {
            return done(null, profile);
        });
    }));
})();

(function () {
    if (CONFIG.passport.FACEBOOK_APP_ID == '')
        return;

    passport.use(new FacebookStrategy({
        clientID: CONFIG.passport.FACEBOOK_APP_ID,
        clientSecret: CONFIG.passport.FACEBOOK_APP_SECRET,
        callbackURL: CONFIG.passport.resolveURL + "/auth/facebook/callback"
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            done(null, profile);
        });
    }));
})();

(function () {
    if (CONFIG.passport.GITHUB_CLIENT_ID == '')
        return;

    passport.use(new GitHubStrategy({
        clientID: CONFIG.passport.GITHUB_CLIENT_ID,
        clientSecret: CONFIG.passport.GITHUB_CLIENT_SECRET,
        callbackURL: CONFIG.passport.resolveURL + "/auth/github/callback"
    }, function (accessToken, refreshToken, profile, done) {
        profile.displayName = profile.username;
        profile.loginName = profile.username;
        console.log(profile);
        process.nextTick(function () {
            return done(null, profile);
        });
    }));
})();

exports.passport = passport;

