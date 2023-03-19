// Grab HTML Elements
// const addCategoryBtn = document.getElementById('add-category-btn');
// const categoryNameInput = document.getElementById('category-name');
// const submitCategoryBtn = document.getElementById('submit-category-btn');
// const addGoalBtn = document.getElementById('add-goal-btn');
const goalNav = document.getElementById('goal-nav-list');
const accordionContainer = document.getElementById('accordion');
let goalNavItems;

// Fetches and returns user data
async function getData() {
  const response = await fetch('/api/goals/user/categories');
  const data = await response.json();
  if (response.status == 200) {
    console.log('User data successfully grabbed');
  } else {
    console.log('Error retrieving user data');
  }
  console.log(data);
  return await data;
}

// Returns an array containing a user's categories
function getCategories(userData) {
  console.log('Grabbing user categories');
  let categories = [];
  
  // Return empty array if no userData
  if (!userData) {
    console.log('No user categories found');
    return categories;
  }

  // Add category names to array
  for (const category of userData) {
    console.log(`Adding the category ${category.category}`);
    categories.push(category.category_name);
  }
  console.log('Category array:');
  console.log(categories);
  return categories;
}

// Create dynamic nav bar
function createNav(categories) {
  // Reset goal nav
  goalNav.innerHTML = '';
  console.log('Creating a nav bar containing user categories');
  // Add 'All Goals' to beginning of categories to insert it at front of nav bar
  categories.unshift('All Goals');

  // Create and append HTML for the nav bar
  for (category of categories) {
    // Create new elements
    let liEl = document.createElement('li');
    let btnEl = document.createElement('button');

    // Add text and attributes to elements
    liEl.classList = 'nav-item';
    btnEl.classList = 'btn btn-outline-secondary ms-2';
    btnEl.type = 'Button'
    btnEl.setAttribute('data-mdb-ripple-color', 'dark')
    btnEl.textContent = category;

    // Append elements
    liEl.append(btnEl);
    goalNav.append(liEl);
  }

  // Store nav items for later use (event listeners)
  goalNavItems = document.querySelectorAll('.nav-item');
}

// Displays goals based on category name
async function displayGoals(category, userData) {
  // Reset accordion container
  accordionContainer.innerHTML = '';
  console.log(`Display goals for category '${category}'`);
  
  // Filter which categories to display
  let filteredCategories;
  if (category == 'All Goals') {
    filteredCategories = userData;
  } else {
    filteredCategories = [ userData.find(element => element.category_name == category) ];
  }
  console.log(filteredCategories);
  
  // Use index to make unique IDs
  let index = 0
  // Go through each category
  for (const category of filteredCategories) {
    console.log('Category:');
    console.log(category);
    // Loop through each goal
    for (const goal of category.goals) {
      console.log('Goal:');
      console.log(goal);
      // Insert goal items into accordion
      let accordionTemplate =
        `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${index}">
            <button
              class="accordion-button collapsed"
              type="button"
              data-mdb-toggle="collapse"
              data-mdb-target="#collapse${index}"
              aria-expanded="false"
              aria-controls="collapse${index}"
            >
              ${goal.goal_name}
            </button>
          </h2>
          <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-mdb-parent="#accordion">
            <div class="accordion-body">
              Some Cool Graphics Go Here
            </div>
          </div>
        </div>
        `
      index++;
      // Add accordion to container
      accordionContainer.innerHTML += accordionTemplate;
    }
  }
  // Add message if no goals have been added
  if (index == 0) {
    accordionContainer.innerHTML = '<p class="text-center">No goals for this category.</p>';
  }
}

// Refreshes user data, nav bar, and goals
async function refreshPage(goalCategory) {
  let userData = await getData()
  const categoryArr = getCategories(userData);
  createNav(categoryArr);
  displayGoals(goalCategory, userData);

  // Add event listener to nav 
  goalNavItems.forEach(function(elem) {
    elem.addEventListener('click', function (e) {
      e.preventDefault();
      const category = e.target.textContent;
      console.log(`'${category}' was clicked`);
      displayGoals(category, userData);
    });
  });
}

if (window.location.pathname == "/") {
  refreshPage('All Goals');
}