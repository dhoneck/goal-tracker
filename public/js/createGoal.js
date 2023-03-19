// Define DOM elements we will need later
const goalNameInput = document.querySelector('#goalName');
const templateButtons = document.querySelectorAll('.goal-template');
const continueGoalButton = document.querySelector('#continue-goal');
const finishGoalButton = document.querySelector('#submit-goal');
const addNewCategoryButton = document.querySelector('#add-category-form-btn');
const submitNewCategoryButton = document.querySelector('#submit-category-btn');

// Define goal form DOM elements for submission
const goalNameFormInput = document.querySelector('#goal-name-form');
const categoryInput = document.querySelector('#add-category-form');
const timePeriodInput = document.querySelector('#time_period');
const goalFrequencyInput = document.querySelector('#log-frequency');
const reminderFrequencyInput = document.querySelector('#reminder-frequency');
const startDateInput = document.querySelector('#start-date');
const endDateInput = document.querySelector('#end-date');
const quantityInput = document.querySelector('#goal-quantity');
const unitsInput = document.querySelector('#metric-unit');

// Event listener to add a new post
const getGoalTemplateInfo = async (e) => {
    e.preventDefault();

    // get the goal id from the element then fetch its information
    const goalId = (this.document.activeElement.id).split('-')[1];
    const response = await fetch(`/api/goals/goalByID/${goalId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // if the api talks back to local, pre-load the data into the form
    if (response.ok) {
        response.json().then((res) => {
            console.log(res);
            // Load the name of the goal onto both forms
            goalNameInput.className = 'form-control active';
            goalNameInput.value = res.goals[0].goal_name;
            goalNameFormInput.className = 'form-control active';
            goalNameFormInput.value = res.goals[0].goal_name;

            // Modal form data gets populated with the template's data
            const gHist = res.goals[0].goal_histories[0]
            timePeriodInput.value = gHist.time_period;
            goalFrequencyInput.value = gHist.log_frequency;
            reminderFrequencyInput.value = gHist.reminder_time;
            // Start and end dates/times
            startDateInput.value = gHist.start_date.slice(0, -8);
            endDateInput.value = gHist.end_date.slice(0, -8);
        });
    }
    else {
        alert('Could not understand template request');
    }
};

// Function for the event listener to the continue button 
const continueCreatingGoal = async (e) => {
    e.preventDefault();

    let goalName = goalNameInput.value
    if (goalName) {
        document.getElementById('continue-goal').disabled = false;
        continueGoalButton.setAttribute("data-mdb-target", "#continueGoalForm");
        goalNameFormInput.className = 'form-control active';
        goalNameFormInput.value = goalNameInput.value;
    } 
    else {
        document.getElementById('continue-goal').disabled = true;
        continueGoalButton.setAttribute("data-mdb-target", "#staticBackdrop");
    }
}

// Function to render the category names for the user
const renderUserCategories = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/goals//user/categories', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
        response.json().then((res) => {
            console.log(res);
            for (let i = 0; i < res.length; i++) {
                const cat = res[i].category_name;
                let nextCatOpt = document.createElement('option');
                nextCatOpt.value = cat;
                nextCatOpt.innerHTML = cat;
                categoryInput.appendChild(nextCatOpt);
            }
        });
    }
}

// Function for the event listener to submit the goal
const submitNewGoal = async (e) => {
    e.preventDefault();
    // Define Goal Form values from the DOM
    const goalName = goalNameFormInput.value;
    const logFrequency = goalFrequencyInput.value;
    const reminderTime = reminderFrequencyInput.value;
    let startDate = startDateInput.value;
    let endDate = endDateInput.value;
    const timePeriod = timePeriodInput.value;
    const metricLabel = quantityInput.value;
    const metricUnit = unitsInput.value;
    const categoryName = categoryInput.value;

    const formReady = ( goalName && (logFrequency != "Select Goal Frequency") && 
        (reminderTime != "Select Reminder Frequency") && startDate && endDate && 
        timePeriod && metricLabel && (metricUnit != "Select Completion Units") && 
        (categoryName != "Select Category") );
    console.log( goalName, logFrequency, reminderTime, startDate, endDate, timePeriod, metricLabel, metricUnit, categoryName );


    if (formReady) {
        /*  fetch POST request to create the new goal
            Needs the following variables from the body of the request:
            goalName,logFrequency,reminderTime,startDate,endDate,
            timePeriod,metricLabel,metricUnit,categoryName
        */
        console.log("Sending Data");
        startDate += ":00.000Z";
        endDate += ":00.000Z";
        const response = await fetch('/api/goals/user/goal', {
            method: 'POST',
            body: JSON.stringify({ goalName, logFrequency, reminderTime, startDate, endDate, timePeriod, metricLabel, metricUnit, categoryName }),
            headers: { 'Content-Type': 'application/json' },
        });
      
        if (response.ok) {
            response.json().then((res) => {
                console.log(res);
                location.href = '/';
            });
        }
    } else {
        console.log("Need to fill out all data to submit goal.");
        window.alert("You must fill out all fields to sumbit your goal.")
    }
}

// Adds the event listeners to each template button
[...templateButtons].forEach(function(but) {
    but.addEventListener('click', getGoalTemplateInfo);
});

// Adds the event listeners to the continue button
continueGoalButton.addEventListener('click', continueCreatingGoal);
goalNameInput.addEventListener('input',continueCreatingGoal);
finishGoalButton.addEventListener('click', submitNewGoal);
document.addEventListener('DOMContentLoaded', renderUserCategories);
submitNewCategoryButton.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();
});