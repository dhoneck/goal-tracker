// Event listener to add a new post
const addGoalHandler = async (event) => {
    event.preventDefault();

    const goalName = document.querySelector('#goalName').value.trim();
    const user_id = localStorage.getItem('userId');
    if (goalName && user_id) {
        const datePosted = Date(Date.now());
        const response = await fetch(`templates`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            response.json().then((res) => console.log(res));
        }
    }
    else {
        alert('Please enter a Goal Name to continue');
    }
    
};

document
.querySelector('#continue-goal')
.addEventListener('click', addGoalHandler);