const router = require('express').Router();
const withAuth = require('../utils/auth');


router.get('/', withAuth, (req, res) => {
    console.log('HOME');
    res.render('home', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/login', (req, res) => {
    console.log('LOGIN');
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

module.exports = router;
