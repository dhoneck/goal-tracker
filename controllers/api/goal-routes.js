const router = require('express').Router();
const { Goal, GoalHistory, GoalPeriod, Category, Progress, Metric } = require('../../models');

// GET goal information by id
router.get('/goalByID/:id', async (req, res) => {
    try {
        const dbGoalData = await Goal.findAll({
            where: {
                id: req.params.id,
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
        res.status(200).json({
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
                        'id'
                    ],
                    include: [
                        {
                            model: GoalHistory,
                            include: {
                                model: GoalPeriod,
                                include: {
                                    model: Progress
                                }
                            }
                        },
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

// Function to calculate Goal Periods with start and end dates
function renderPeriodsFromHistory(startDate, endDate, frequency) {
    // Calculate goal period values to create each one
    let numPeriods = 1;
    let startPeriodDate = new Date(startDate);
    let endPeriodDate = new Date(endDate);
    const startDates = [];
    const endDates = [];

    // variables to help calculate each period
    const difYears = endPeriodDate.getUTCFullYear() - startPeriodDate.getUTCFullYear();
    const difMonths = endPeriodDate.getUTCMonth() - startPeriodDate.getUTCMonth();
    const difDays = endPeriodDate.getUTCDate() - startPeriodDate.getUTCDate();
    const difHours = endPeriodDate.getUTCHours() - startPeriodDate.getUTCHours();
    const difMinutes = endPeriodDate.getUTCMinutes() - startPeriodDate.getUTCMinutes();

    // switch to find the proper start and end dates
    switch (frequency) {
        case 'Per Hour':
            totDif = difYears*8760 + difMonths*730 + difDays*24 + difHours + difMinutes/60;
            numPeriods = Math.ceil(totDif);
            if (numPeriods > 1) {
                for (let i = 0; i < numPeriods - 1; i++) {
                    startDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCHours(startPeriodDate.getUTCHours() + 1);
                    startPeriodDate.setUTCSeconds(0);
                    endDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCSeconds(1);
                }
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            } else {
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            }
            break;
        case 'Per Day':
            totDif = difYears*365 + difMonths*365/12 + difDays + difHours/24 + difMinutes/1440;
            numPeriods = Math.ceil(totDif);
            if (numPeriods > 1) {
                for (let i = 0; i < numPeriods - 1; i++) {
                    startDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCDate(startPeriodDate.getUTCDate() + 1);
                    startPeriodDate.setUTCSeconds(0);
                    endDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCSeconds(1);
                }
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            } else {
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            }
            break;
        case 'Per Week':
            totDif = difYears*365/7 + difMonths*365/7/12 + difDays/7 + difHours/168 + difMinutes/10080;
            numPeriods = Math.ceil(totDif);
            if (numPeriods > 1) {
                for (let i = 0; i < numPeriods - 1; i++) {
                    startDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCDate(startPeriodDate.getUTCDate() + 7);
                    startPeriodDate.setUTCSeconds(0);
                    endDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCSeconds(1);
                }
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            } else {
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            }
            break;
        case 'Every Two Weeks':
            totDif = difYears*365/7/2 + difMonths*365/7/12/2 + difDays/7/2 + difHours/168/2 + difMinutes/10080/2;
            numPeriods = Math.ceil(totDif);
            if (numPeriods > 1) {
                for (let i = 0; i < numPeriods - 1; i++) {
                    startDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCDate(startPeriodDate.getUTCDate() + 14);
                    startPeriodDate.setUTCSeconds(0);
                    endDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCSeconds(1);
                }
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            } else {
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            }
            break;
        case 'Per Month':
            totDif = difYears*12 + difMonths + difDays/365*12 + difHours/365*12/24 + difMinutes/365*12/24/60;
            numPeriods = Math.ceil(totDif);
            if (numPeriods > 1) {
                for (let i = 0; i < numPeriods - 1; i++) {
                    startDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCMonth(startPeriodDate.getUTCMonth() + 1);
                    startPeriodDate.setUTCSeconds(0);
                    endDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCSeconds(1);
                }
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            } else {
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            }
            break;
        case 'Every Two Months':
            totDif = difYears*12/2 + difMonths/2 + difDays/365*12/2 + difHours/365*12/24/2 + difMinutes/365*12/24/60/2;
            numPeriods = Math.ceil(totDif);
            if (numPeriods > 1) {
                for (let i = 0; i < numPeriods - 1; i++) {
                    startDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCMonth(startPeriodDate.getUTCMonth() + 2);
                    startPeriodDate.setUTCSeconds(0);
                    endDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCSeconds(1);
                }
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            } else {
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            }
            break;
        case 'Per Quarter':
            totDif = difYears*4 + difMonths/3 + difDays/365*12/3 + difHours/365*12/24/3 + difMinutes/365*12/24/60/3;
            numPeriods = Math.ceil(totDif);
            if (numPeriods > 1) {
                for (let i = 0; i < numPeriods - 1; i++) {
                    startDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCMonth(startPeriodDate.getUTCMonth() + 3);
                    startPeriodDate.setUTCSeconds(0);
                    endDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCSeconds(1);
                }
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            } else {
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            }
            break;
        case 'Every Six Months':
            totDif = difYears*2 + difMonths/6 + difDays/365*2 + difHours/4380 + difMinutes/262800;
            numPeriods = Math.ceil(totDif);
            if (numPeriods > 1) {
                for (let i = 0; i < numPeriods - 1; i++) {
                    startDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCMonth(startPeriodDate.getUTCMonth() + 6);
                    startPeriodDate.setUTCSeconds(0);
                    endDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCSeconds(1);
                }
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            } else {
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            }
            break;
        case 'Per Year':
            totDif = difYears + difMonths/12 + difDays/365 + difHours/8760 + difMinutes/525600;
            numPeriods = Math.ceil(totDif);
            if (numPeriods > 1) {
                for (let i = 0; i < numPeriods - 1; i++) {
                    startDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCFullYear(startPeriodDate.getUTCFullYear() + 1);
                    startPeriodDate.setUTCSeconds(0);
                    endDates.push(startPeriodDate.toISOString());
                    startPeriodDate.setUTCSeconds(1);
                }
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            } else {
                startDates.push(startPeriodDate);
                endDates.push(endPeriodDate);
            }
            break;
        default:
            startDates.push(startPeriodDate);
            endDates.push(endPeriodDate);
            break;
    }

    return [ startDates, endDates ];
}

// CREATE new goal
router.post('/user/goal', async (req, res) => {
    /*
    Needs the following variables from the body of the request:
    goalName,logFrequency,reminderTime,startDate,endDate,
    timePeriod,metricLabel,metricUnit,categoryName
    */
    try {
        const dbCategoryData = await Category.findOrCreate({
            where: { 
                category_name: req.body.categoryName, 
                user_id: req.session.user,
            },
        });
        const catID = dbCategoryData[0].dataValues.id;
        const dbGoalData = await Goal.create({
            goal_name: req.body.goalName,
            user_id: req.session.user,
            category_id: catID,
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

        // Calculate goal period values to create each one
        const dbPeriodData = [];
        const [ starts, ends ] = renderPeriodsFromHistory(dbHistoryData.start_date, dbHistoryData.end_date, dbHistoryData.log_frequency);
        for (let i = 0; i < starts.length; i++) {
            const strt = starts[i];
            const end = ends[i];

            // Creates each GoalPeriod row given the time constraints on the incoming goal
            const PeriodData = await GoalPeriod.create({
                goal_history_id: dbHistoryData.id,
                start_date: strt,
                end_date: end,
                goal_amount: dbHistoryData.time_period * dbMetricData.metric_label,
                current_amount: 0,
                goal_complete: false,
            });
            dbPeriodData.push(PeriodData);
        }

        res.status(200).json({dbGoalData, dbHistoryData, dbMetricData, dbCategoryData, dbPeriodData});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// CREATE new progress data on a goal
router.post('/user/goal', async (req, res) => {
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

// CREATE new goal progress
router.post('/progress', async (req, res) => {
    /*
    Needs the following variables from the body of the request:
    goalName,logFrequency,reminderTime,startDate,endDate,
    timePeriod,metricLabel,metricUnit,categoryName
    */
    try {
        // TODO: Determine goal period id based on time
        const goalId = req.body.goalId
        const parentGoal = await Goal.findOne({
            where: {
                user_id: req.session.user,
                id: goalId
            },
            plain: true
        });
        console.log('Parent goal');
        console.log(parentGoal);

        // TODO: Adjust this to get correct goal history once we implement that functionality - right now we only have 1 goal history per goal
        const goalHistory = await GoalHistory.findOne({
            where: {
                goal_id: parentGoal.dataValues.id
            },
            plain: true
        })
        console.log('goalHistoryId: ' + goalHistory.dataValues.id)
        const goalPeriods = await GoalPeriod.findAll({
            where: {
                goal_history_id: goalHistory.dataValues.id
            },
            raw: true
        });

        console.log('All Goal Periods');
        console.log(goalPeriods);
        let goalPeriodId;
        for (const period of goalPeriods) {
            let start_date = new Date(period.start_date);
            let end_date = new Date(period.end_date);
            let progressDate = new Date(req.body.progressDate);
            if (progressDate >= start_date && progressDate <= end_date) {
                goalPeriodId = period.id;
                console.log(`THIS PROGRESS BELONGS TO GOAL PERIOD # ${goalPeriodId}`);
            }
        }

        // Return 400 status if no goal period found
        if (!goalPeriodId) {
            res.status(400).json({ message: "No goal period found" });
            return;
        }
        const newProgress = await Progress.create({
            goal_period_id: goalPeriodId,
            update_date: req.body.progressDate,
            progress_amount: req.body.progressAmount
        });
        res.status(200).json({newProgress});
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