// Grab HTML Elements
const addGoalBtn = document.getElementById('add-goal-btn')
const goalNav = document.getElementById('goal-nav-list');
const goalsContainer = document.getElementById('goals-container');
let goalNavItems;

// Create dynamic nav bar
function createNav() {
  // TODO: Replace sample data with fetch command
  const categories = ['All', 'Financial', 'Health', 'Personal', 'Professional'];

  for (category of categories) {
    // Create new elements
    let liEl = document.createElement('li');
    let aEl = document.createElement('a');

    // Add text and attributes to elements
    liEl.classList = 'nav-item';
    aEl.classList = 'nav-link';
    aEl.textContent = category;

    // Append elements
    liEl.append(aEl);
    goalNav.append(liEl);
  }

  // Store nav items for later use
  goalNavItems = document.querySelectorAll('.nav-item');
}

async function displayGoals(category) {
  // Fetch goals by specific category
  if (category == 'All') {
    console.log('Display all goals');
    const data = await fetch('/api/goals/test2');
    console.log('-----');
    console.log(data.json());
    console.log('-----');
  } else {
    console.log(`Display only '${category}' goals`);
  }
}

createNav();

// Add event listener to nav 
goalNavItems.forEach(function(elem) {
  elem.addEventListener('click', function (e) {
    e.preventDefault();
    const category = e.target.textContent;
    console.log(`'${category}' was clicked`);
    displayGoals(category);
  })
})