// Define DOM elements that exist across all pages of the site (Navbar)
const addCategoryBtn = document.getElementById('add-category-btn');
const submitCategoryBtn = document.getElementById('submit-category-btn');
const addGoalBtn = document.getElementById('add-goal-btn');
const categoryNameInput = document.getElementById('category-name');

// Submit category
const submitCategory = async (event) => {
    console.log('Attempting to add a category');
    event.preventDefault();
  
    const categoryName = categoryNameInput.value.trim();
    
    if (categoryName) {
        const response = await fetch('/api/categories', {
            method: 'POST',
            body: JSON.stringify({ categoryName }),
            headers: { 'Content-Type': 'application/json' },
        });
    
        // Clear category name input
        categoryNameInput.value = '';
        if (response.ok) {
            refreshPage('All Goals');
        } else {
            alert('Category could not be added.');
        }
    }
};

  // Event listener to add a new goal
const addGoalHandler = async (e) => {
    e.preventDefault();
  
    const response = await fetch(`add-goal`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
    });
    
    if (response.ok) {
        window.location.href = '/add-goal';
    }
    else {
        alert('Button did not work');
    }
};

addGoalBtn
.addEventListener('click', addGoalHandler);
  
submitCategoryBtn
.addEventListener('click', submitCategory);