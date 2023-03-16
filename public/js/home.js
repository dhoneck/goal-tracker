// Grab HTML Elements
const addCategoryBtn = document.getElementById('add-category-btn');
const addGoalBtn = document.getElementById('add-goal-btn');
const goalNav = document.getElementById('goal-nav-list');
const goalsContainer = document.getElementById('goals-container');
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
  console.log('Creating a nav bar containing user categories');
  // Add 'All Goals' to beginning of categories to insert it at front of nav bar
  categories.unshift('All Goals');

  // Create and append HTML for the nav bar
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

  // Store nav items for later use (event listeners)
  goalNavItems = document.querySelectorAll('.nav-item');
}

// Displays goals based on category name
async function displayGoals(category) {
  // TODO: Display goals based on category
  console.log(`Display goals for category '${category}'`)
}

// Refreshes user data, nav bar, and goals
async function refreshPage() {
  let userData = await getData()
  const categoryArr = getCategories(userData);
  createNav(categoryArr);
  displayGoals('All Goals');

  // Add event listener to nav 
  goalNavItems.forEach(function(elem) {
    elem.addEventListener('click', function (e) {
      e.preventDefault();
      const category = e.target.textContent;
      console.log(`'${category}' was clicked`);
      displayGoals(category);
    });
  });
}

refreshPage();

