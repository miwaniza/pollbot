// Airtable API configuration
const apiKey = process.env.AIRTABLE_APIKEY;
const baseId = process.env.AIRTABLE_BASEID;
const tableName = process.env.AIRTABLE_TABLEID;

// Fetch image data from Airtable
async function fetchImageData() {
  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${tableName}?api_key=${apiKey}`
  );
  const data = await response.json();
  return data.records;
}

// Display image and description
function displayCard(imageUrl, description) {
  const imageElement = document.getElementById('image');
  const descriptionElement = document.getElementById('description');

  imageElement.src = imageUrl;
  descriptionElement.textContent = description;
}

// Initialize the app
async function initApp() {
  const imageData = await fetchImageData();
  let currentIndex = 0;

  function loadNextCard() {
    if (currentIndex >= imageData.length) {
      alert('No more cards!');
      return;
    }

    const { url, description } = imageData[currentIndex].fields;
    displayCard(url, description);
    currentIndex++;
  }

  // Handle swipe actions (like/dislike)
  function handleSwipeAction(swipedRight) {
    // You can perform any action here based on the swipe direction (like/dislike)
    // For this example, we'll just log the action to the console.
    console.log(swipedRight ? 'Liked' : 'Disliked');

    // Save the swipe action to Airtable
    const ratingsTable = process.env.AIRTABLE_RATINGS_TABLEID;
    fetch(`https://api.airtable.com/v0/${baseId}/${ratingsTable}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      // Save the swipe action to Airtable
      body: JSON.stringify({
        records: [
          {
            fields: {
              // Save the image ID to Airtable
              image: [imageData[currentIndex - 1].id],
              // Save the swipe direction (like/dislike) to Airtable
              liked: swipedRight
            }
          }
        ]
      })
    });

  
    // Load the next card
    loadNextCard();
  }

  loadNextCard();

  // Add event listeners to swipe buttons
  document.getElementById('like-button').addEventListener('click', () =>
    handleSwipeAction(true)
  );
  document.getElementById('dislike-button').addEventListener('click', () =>
    handleSwipeAction(false)
  );
}

// Start the app
initApp();
