// Grab HTML Elements
const goalNav = document.getElementById('goal-nav-list');
const accordionContainer = document.getElementById('accordion');
const progressAmountInput = document.getElementById('progress-amount');
const progressDateInput = document.getElementById('progress-date');
const submitProgressBtn = document.getElementById('submit-progress-btn');
let currentCategory = 'All Goals'
let goalNavItems;

// Format Date
// function formatDate(date) {
//   formattedDate = `${date.getDay}, ,${date.getFullYear()}`
//   return formatedDate
// }

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
    if (category == 'All Goals') {
      btnEl.classList.add('active');
    }
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
  // Set current category for place saving purposes
  currentCategory = category;

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

      // Get goal items
      let categoryName = category.category_name;
      let goalName = goal.goal_name;
      let goalHistory = goal.goal_histories[0];
      let goalFrequency = goalHistory.log_frequency;
      let goalTimePeriod = goalHistory.time_period;
      let goalMetricLabel = goalHistory.metric.metric_label;
      let goalMetricUnit = goalHistory.metric.metric_unit;
      let goalMetricCombined = `${goalMetricLabel} (${goalMetricUnit})`
      let startDate = new Date(goalHistory.start_date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});;
      let endDate = new Date(goalHistory.end_date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
      let goalPeriods = goalHistory.goal_periods;

      let allProgress = [];
      let table =
        `
        <table class="table table-sm mt-3">
          <tr>
            <th>Date</th>
            <th>Amount (${goalMetricUnit})</th>
          </tr>
        `;
      let progressCount = 0;
      for (const period of goalPeriods) {
        for (const progress of period.progresses) {
          let amount = progress.progress_amount;
          let date = new Date(progress.update_date)
          date = date.toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
          table +=
            `
            <tr>
              <td>${date}</td>
              <td>${amount}</td>
            </tr>
            `;
            progressCount++;
        }
      }
      if (progressCount == 0) {
        table +=
            `
            <tr>
              <td>No progress entries found</td>
              <td></td>
            </tr>
            `;
      }
      table += `</table>`;

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
              ${goalName}
            </button>
          </h2>
          <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-mdb-parent="#accordion">
            <div class="accordion-body">
              <button class="add-progress-btn btn btn-primary btn-sm" data-mdb-toggle="modal" data-goal="${goal.id}" data-mdb-target="#createProgress">Add Progress</button>
              ${table}
              <pre class="mt-4">${categoryName} | ${goalTimePeriod} log(s) ${goalFrequency} @ ${goalMetricCombined} | ${startDate} through ${endDate}</pre>
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

// Submit progress
const submitProgress = async (event) => {
  console.log('Attempting to add progress');
  event.preventDefault();

  // Grab goal ID that was set on the submit button
  const goalId = event.target.dataset.goal;
  const progressAmount = progressAmountInput.value.trim();
  const progressDate = progressDateInput.value.trim();

  if (progressAmount && progressDate) {
      const response = await fetch('/api/goals/progress', {
          method: 'POST',
          body: JSON.stringify({ goalId, progressAmount, progressDate }),
          headers: { 'Content-Type': 'application/json' },
      });
  
      // Clear progress amount and date inputs
      progressAmountInput.value = '';
      progressDateInput.value = '';
      if (response.ok) {
          // Refresh page but stay on current category
          refreshPage(currentCategory);
          alert('Progress added successfully.');
      } else {
          alert('Progress could not be added.');
      }
  } else {
    alert('Progress could not be added. Data is missing.');
  }
};


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

      // Remove active class from nav items
      document.querySelectorAll('.nav-item button').forEach(function(navElem) {       
        navElem.classList.remove('active');
      });
      // Add active class from nav items
      e.target.classList.add('active');
      
      const category = e.target.textContent;
      console.log(`'${category}' was clicked`);
      displayGoals(category, userData);
    });
  });

  // Add event listener to pass data from button to button
  document.querySelectorAll('.add-progress-btn').forEach(function(btnElem) {
    btnElem.addEventListener('click', function (e) {
      e.preventDefault();
      submitProgressBtn.dataset.goal = e.target.dataset.goal;
    })
  });

  // Add event listener to submit progress button
  submitProgressBtn.addEventListener('click', submitProgress);
}

if (window.location.pathname == "/") {
  refreshPage('All Goals');
}