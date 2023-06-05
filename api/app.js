// main.js

// Display image and description
function displayCard(imageUrl, description) {
  const imageElement = document.getElementById('image');
  const descriptionElement = document.getElementById('description');

  imageElement.src = imageUrl;
  descriptionElement.textContent = description;
}

// Fetch image data from the serverless function
async function fetchImageData() {
  const response = await fetch('/api');
  const data = await response.json();
  return data;
}

// Initialize the app
async function initApp() {
  try {
    const imageData = await fetchImageData();
    let currentIndex = 0;

    function loadNextCard() {
      if (currentIndex >= imageData.length) {
        alert('No more cards!');
        return;
      }

      const { url, description } = imageData[currentIndex];
      displayCard(url, description);
      currentIndex++;
    }

    loadNextCard();

    // Add event listeners to swipe buttons
    document.getElementById('like-button').addEventListener('click', () => handleSwipeAction(true));
    document.getElementById('dislike-button').addEventListener('click', () => handleSwipeAction(false));

    // Load the next card when a swipe action occurs
    document.getElementById('card').addEventListener('transitionend', loadNextCard);
  } catch (error) {
    console.error(error);
    alert('Failed to fetch image data');
  }
}

// Start the app
initApp();
