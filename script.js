/* eslint-disable guard-for-in */
const imageContainer = document.querySelector('#image-container');
const loader = document.querySelector('#loader');

let isInitialLoad = true;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
const initCount = 5;
const apiKey = process.env.UNSPLASH_API_KEY;
let apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initCount}`;

function updateAPIURLWithNewCount(picCount) {
  apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}`;
}

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded += 1;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements for Links & Photos, add to DOM
function displayPhotos(arr) {
  imagesLoaded = 0;
  totalImages = arr.length;

  arr.forEach((photo) => {
    const {
      links: { html },
      urls: { regular },
      description,
    } = photo;

    // Create <a> to link to Unsplash
    const item = document.createElement('a');
    // item.setAttribute('href', html);
    // item.setAttribute('target', '_blank');
    setAttributes(item, {
      href: html,
      target: '_blank',
    });

    // Create <img> for photo
    const img = document.createElement('img');
    // img.setAttribute('src', regular);
    // img.setAttribute('alt', description);
    // img.setAttribute('title', description);
    setAttributes(img, {
      src: regular,
      alt: description || 'This pictures has no description!',
      title: description || 'This pictures has no description!',
    });

    // Event Listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);

    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos(url) {
  try {
    const response = await fetch(url);
    photosArray = await response.json();
    displayPhotos(photosArray);

    if (isInitialLoad) {
      updateAPIURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    console.log('Error fething photos:', error);
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos(apiURL);
  }
});

// On Load
getPhotos(apiURL);
