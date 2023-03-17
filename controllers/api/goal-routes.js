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

// GET all user categories
router.get('/user/categories', async (req, res) =>  {
    try {
        const userId = req.session.user;
        console.log(`This request came from user ${userId}`);
        const data = await Category.findAll({
            where: {
                user_id: userId,
            },
            attributes: [
                'category_name',
            ],
            order: [
                ['category_name', 'ASC']
            ],
            include: [
                {
                    model: Goal,
                    attributes: [
                        'goal_name',
                    ]
                }
            ]
        });
        if (!data) {
            res.status(404).json("message: no categories for user found");
        }

        const categories = data.map((category) => 
            category.get({ plain: true })
        );
        res.status(200).json(categories);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET all goal INFO for the logged in user
router.get('/user/goals', async (req, res) => {
    try {
        const userId = req.session.user;
        console.log(`This request came from user ${userId}`);
        const dbGoalData = await Goal.findAll({
            where: {
                user_id: userId,
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
router.get('/user/data', async (req, res) => {
    try {
        console.log(req.session);
        const dbGoalData = await Goal.findAll({
            where: {
                user_id: req.session.user,
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

// CREATE new goal
router.post('user/goal', async (req, res) => {
    /*
    Needs the following variables from the body of the request:
    goalName,logFrequency,reminderTime,startDate,endDate,
    timePeriod,metricLabel,metricUnit,categoryName
    */
    try {
        const dbGoalData = await Goal.create({
            goal_name: req.body.goalName,
            user_id: req.session.user,
        });
        const dbHistoryData = await GoalHistory.create({
            goal_id: dbGoalData.id,
            log_frequency: req.body.logFrequency,
            reminder_time: req.body.reminderTime,
            start_date: req.body.startDate,
            end_date: req.body.endDate,
            time_period: req.body.timePeriod,
        });
        const dbMetricData = await Metric.create({
            metric_label: req.body.metricLabel,
            metric_unit: req.body.metricUnit,
            goal_history_id: dbHistoryData.id,
        });
        const dbCategoryData = await Category.create({
            category_name: req.body.categoryName,
            goal_id: dbGoalData.id,
            user_id: req.session.user,
        });

        res.status(200).json(dbGoalData, dbHistoryData, dbMetricData, dbCategoryData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// CREATE new progress data on a goal
router.post('user/goal', async (req, res) => {
    /*
    Needs the following variables from the body of the request:
    goalId,amountToUpdate,updateDate
    */
    try {
        if (req.session.loggedIn) {
            const getHistoryData = await GoalHistory.findOne({
                where: { goal_id: req.body.goalId },
                order: [
                    ['start_date', 'ASC'],
                ],
            });
            const getPeriodData = await GoalPeriod.findOne({
                where: { goal_history_id: getHistoryData.id },
                order: [
                    ['start_date', 'ASC'],
                ],
            });

            const newAmount = getPeriodData.current_amount + req.body.amountToUpdate;
            const dbPeriodData = await GoalPeriod.update({ current_amount: newAmount}, {
                where: {id: getPeriodData.id},
            });
            const dbProgressData = await Progress.create({
                goal_period_id: getPeriodData.id,
                update_date: req.body.updateDate,
                progress_amount: req.body.amountToUpdate,
            });

            res.status(200).json({dbPeriodData, dbProgressData});
        } else {
            res.status(400).json({message: "User is not logged in"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// CREATE new template goal
router.post('/template', async (req, res) => {
    /*
    Needs the following variables from the body of the request:
    goalName,logFrequency,reminderTime,startDate,endDate,
    timePeriod,metricLabel,metricUnit,categoryName
    */
    try {
        const dbCategoryData = await Category.create({
            category_name: req.body.categoryName,
        });
        const dbGoalData = await Goal.create({
            goal_name: req.body.goalName,
            category_id: dbCategoryData.id,
        });
        const dbHistoryData = await GoalHistory.create({
            goal_id: dbGoalData.id,
            log_frequency: req.body.logFrequency,
            reminder_time: req.body.reminderTime,
            start_date: req.body.startDate,
            end_date: req.body.endDate,
            time_period: req.body.timePeriod,
        }); 

        res.status(200).json({dbCategoryData, dbGoalData, dbHistoryData});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;