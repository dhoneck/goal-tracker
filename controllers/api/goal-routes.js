const router = require('express').Router();
const { Goal, GoalHistory, GoalPeriod, Category, Progress, Metric } = require('../../models');

// GET all goal templates information
router.get('/templates', async (req, res) => {
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

// GET all goal information for the logged in user
router.get('/:id', async (req, res) => {
    try {
        console.log(req.session);
        const dbGoalData = await Goal.findAll({
            where: {
                user_id: req.params.id,
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

        if (!dbGoalData) {
            res.status(400).json("message: no goals for user found");
        }

        const goals = dbGoalData.map((goal) => 
            goal.get({ plain: true })
        );
        res.status(200).json(goals);
    
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET all goal DATA for the logged in user
router.get('data/:id', async (req, res) => {
    try {
        console.log(req.session);
        const dbGoalData = await Goal.findAll({
            where: {
                user_id: req.params.id,
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
                    include: [
                        {
                            model: GoalPeriod,
                            attributes: [
                                'start_date',
                                'end_date',
                                'goal_amount',
                                'current_amount',
                                'goal_complete',
                            ],
                            include: [
                                {
                                    model: Progress,
                                    attributes: [
                                        'update_date',
                                        'progress_amount',
                                    ],
                                },
                            ],
                        },
                        {
                            model: Metric,
                            attributes: [
                                'metric_label',
                                'metric_unit',
                            ]
                        }
                    ],
                },
                {
                    model: Category,
                    attributes: ['category_name'],
                },
            ],
        });

        if (!dbGoalData) {
            res.status(400).json("message: no goals for user found");
        }

        const goals = dbGoalData.map((goal) => 
            goal.get({ plain: true })
        );
        res.status(200).json(goals);
    
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;