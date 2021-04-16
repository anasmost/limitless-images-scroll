// DOM Elements
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
// State Vars
let readyToFetch = false;
let photosLoaded = 0;
let totalPhotos = 0;
let photos = null;
let imageLeastCount = 5;
// UX Vars
const loadingDurationLimit = 2000; //milliseconds
let loadingStartDate = null;
// Unsplash API Params
const imageCount = imageLeastCount;
const apiKey = 'uu0Vs8X5-ft7BLUFtqLlSZphmzXqkKXgQfedDt0Sci4';
const apiUrl = `https://api.unsplash.com/photos/?client_id=${apiKey}&per_page=${imageCount}`;

// Featuring Functions
async function getPhotos() {
  try {
    loader.hidden = false;
    const res = await fetch(apiUrl);
    photos = await res.json();
    displayPhotos();
  } catch (err) {
    console.log(err);
  }
}
function displayPhotos() {
  totalPhotos = photos.length;
  photos.forEach(photo => {
    // Create <a> to link to Unsplash
    const a = document.createElement('a');
    setAttributes(a, {
      href: photo.links.html,
      target: '_blank'
    });
    a.style.position = 'relative';
    // Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // Add event listeners for first <img> DOMContentLoaded
    if (photosLoaded == 0) {
      img.addEventListener('DOMContentLoaded', loadingStarted);
    }
    // Add event listener to signal photos loaded
    img.addEventListener('load', photoLoaded);
    // Create <p> description for photo
    const p = document.createElement('p');
    p.textContent = photo.alt_description;
    // Put <img> & <p> inside <a>, then insert them inside imageContainer element
    a.append(img, p);
    imageContainer.appendChild(a);
    img.parentElement;
  });
}
function photoLoaded(e) {
  photosLoaded++;
  if (photosLoaded === totalPhotos) {
    loader.hidden = true;
    photosLoaded = 0;
    readyToFetch = true;
    adjustImageCount();
  }
  e.target.removeEventListener('load', photoLoaded);
}
function loadingStarted() {
  loadingStartDate = date.now();
  e.target.removeEventListener('DOMContentLoaded', loadingStarted);
}
// Helper Functions
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}
/* Event Listeners */
// Check scrolling position relatively to the page bottom
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY > document.body.offsetHeight - 1000 && readyToFetch) {
    getPhotos();
    readyToFetch = false;
  }
});
/* UX Functions */
// Adapt imageCount to the coresponding loading duration
function adjustImageCount() {
  const loadingDuration = Date.now() - loadingStartDate;
  if (loadingDuration < loadingDurationLimit) {
    imageCount *= 2;
  } else if (imageCount != imageLeastCount) {
    imageCount /= 2;
  }
  console.log(imageCount);
}

// On Load
getPhotos();