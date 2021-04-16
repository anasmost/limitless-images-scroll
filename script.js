// DOM Elements
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
// State Vars
let readyToFetch = false;
let photosLoaded = 0;
let totalPhotos = 0;
let photos = null;
// UX Vars
const chunk = 5;
const loadingDurationLimit = 2000; //milliseconds
let loadingStartDate = null;
// Unsplash API Params
let imageCount = chunk;
const apiKey = 'uu0Vs8X5-ft7BLUFtqLlSZphmzXqkKXgQfedDt0Sci4';
const apiUrl = `https://api.unsplash.com/photos/?client_id=${apiKey}`;
// Featuring Functions
async function getPhotos() {
  const apiUrlAdjusted = `${apiUrl}&per_page=${imageCount}`;
  try {
    loader.hidden = false;
    const res = await fetch(apiUrlAdjusted);
    photos = await res.json();
    displayPhotos();
  } catch (err) {
    console.log(err);
  }
}
function displayPhotos() {
  totalPhotos = photos.length;
  photos.forEach((photo, idx) => {
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
    if (idx == 0) {
      img.addEventListener('DOMNodeInserted', loadingStarted);
    }
    // Add event listener to signal photos loaded
    img.addEventListener('load', photoLoaded);
    // Put <img> & <p> inside <a>, then insert them inside imageContainer element
    a.appendChild(img);
    imageContainer.appendChild(a);
  });
}
function photoLoaded(e) {
  photosLoaded++;
  // Create <p> description for photo
  const p = document.createElement('p');
  p.textContent = e.target.getAttribute('title');
  e.target.parentElement.appendChild(p);
  if (photosLoaded === totalPhotos) {
    loader.hidden = true;
    photosLoaded = 0;
    readyToFetch = true;
    adjustImageCount();
  }
  e.target.removeEventListener('load', photoLoaded);
}
function loadingStarted(e) {
  loadingStartDate = Date.now();
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
    imageCount += chunk;
  } else if (imageCount != chunk) {
    imageCount -= chunk;
  }
}

// On Load
getPhotos();