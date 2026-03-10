const QUOTE_API = 'https://dummyjson.com/quotes/random';
const IMAGE_BASE = 'https://picsum.photos/id/';

const [btn, spinner, statusEl, card, photo, quoteText, quoteAuthor] = [
  'btn', 'spinner', 'status', 'card', 'photo', 'quote-text', 'quote-author'
].map(id => document.getElementById(id));

if (!btn || !spinner || !statusEl || !card || !photo || !quoteText || !quoteAuthor) {
  throw new Error('Missing required DOM elements');
}

card.style.display = 'block';
card.classList.add('ready');

function fetchJSON(url) {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
    return response.json();
  });
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error('Image failed to load'));
    img.src = url;
  });
}

function randomImageUrl() {
  return `${IMAGE_BASE}${Math.floor(Math.random() * 100) + 1}/800/420`;
}

btn.addEventListener('click', () => {
  statusEl.textContent = '';
  card.classList.remove('ready');
  photo.classList.remove('loaded');
  btn.disabled = true;
  spinner.classList.add('active');

  const imageUrl = randomImageUrl();

  Promise.all([fetchJSON(QUOTE_API), loadImage(imageUrl)])
    .then(([quoteData, resolvedImgUrl]) => {
      if (!quoteData.quote || !quoteData.author) throw new Error('Unexpected quote shape');

      quoteText.textContent = quoteData.quote;
      quoteAuthor.textContent = `— ${quoteData.author}`;
      photo.src = resolvedImgUrl;
      photo.classList.add('loaded');
      card.classList.add('ready');
    })
    .catch(err => {
      statusEl.textContent = `Error: ${err.message}`;
    })
    .finally(() => {
      btn.disabled = false;
      spinner.classList.remove('active');
    });
});