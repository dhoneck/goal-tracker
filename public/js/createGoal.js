// Define DOM elements we will need later
const goalNameInput = document.querySelector('#goalName');
const templateButtons = document.querySelectorAll('.goal-template');
const continueGoalButton = document.querySelector('#continue-goal');

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
    if (response.ok) {
        response.json().then((res) => {
            console.log(res);
            goalNameInput.className = 'form-control active';
            goalNameInput.value = res.goals[0].goal_name;
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
        continueGoalButton.setAttribute("data-mdb-target", "#continueGoalForm")
    } 
    else {
        document.getElementById('continue-goal').disabled = true;
        continueGoalButton.setAttribute("data-mdb-target", "#staticBackdrop")
    }
}

// Adds the event listeners to each template button
[...templateButtons].forEach(function(but) {
    but.addEventListener('click', getGoalTemplateInfo);
});

// Adds the event listeners to the continue button
continueGoalButton.addEventListener('click', continueCreatingGoal);
goalNameInput.addEventListener('input',continueCreatingGoal);