const router = require('express').Router();
const withAuth = require('../utils/auth');
const { Goal, GoalHistory, GoalPeriod, Category, Progress, Metric } = require('../models');

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

// Load the add-goal page with all goal templates
router.get('/add-goal', withAuth, async (req, res) => {
    try {
        const dbGoalData = await Goal.findAll({
            where: {
                user_id: null,
            },
            include: [
                {
                    model: GoalHistory,
                    attributes: [
                        'log_frequency',
                        'reminder_time',
                        'start_date',
                        'end_date',
                        'time_period',
                    ],
                },
                {
                    model: Category,
                    attributes: ['category_name'],
                },
            ],
        });
        const goals = dbGoalData.map((goal) => 
            goal.get({ plain: true })
        );
        res.render('creategoal', {
            goals,
            loggedIn: req.session.loggedIn,
        });
    
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
