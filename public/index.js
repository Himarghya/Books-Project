const books = window.__BOOKS__ || [];

const grid = document.getElementById('grid');
const searchInput = document.getElementById('search');
const tabs = document.querySelectorAll('.guide-tab');
const overlay = document.getElementById('bookOverlay');
const ovCover = document.getElementById('ovCover');
const ovCoverBlank = document.getElementById('ovCoverBlank');
const ovTitle = document.getElementById('ovTitle');
const ovAuthor = document.getElementById('ovAuthor');
const ovNote = document.getElementById('ovNote');
const ovRating = document.getElementById('ovRating');
const ovDate = document.getElementById('ovDate');
const ovIsbn = document.getElementById('ovIsbn');
const ovIsbnField = document.getElementById('ovIsbnField');

let currentSort = 'recent';
let booksById = {};

function stampFor(rating){
  return '&#9679;'.repeat(rating) + '&#9675;'.repeat(5 - rating);
}

const API = "https://covers.openlibrary.org/b/isbn";

function formatDate(raw){
  if(!raw) return 'Undated';
  const d = new Date(raw);
  if(isNaN(d.getTime())) return 'Undated';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function sortBooks(list, mode){
  const copy = [...list];
  if(mode === 'recent') copy.sort((a,b) => new Date(b.date) - new Date(a.date));
  if(mode === 'rating') copy.sort((a,b) => b.rating - a.rating);
  if(mode === 'title') copy.sort((a,b) => a.title.localeCompare(b.title));
  return copy;
}

function renderGrid(){
  const query = searchInput.value.trim().toLowerCase();
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
  );
  const sorted = sortBooks(filtered, currentSort);

  booksById = {};

  grid.innerHTML = sorted.map((b, i) => {
    const id = `bk-${i}`;
    booksById[id] = b;
    const coverSrc = b.cover || (b.isbn ? `${API}/${b.isbn}-M.jpg` : '');
    const coverTag = coverSrc
      ? `<img class="card-cover" src="${coverSrc}" alt="Cover of ${b.title}" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="card-cover card-cover--blank" aria-hidden="true">No cover</div>`;
    return `
    <article class="card" tabindex="0" data-id="${id}">
      ${coverTag}
      <div class="card-body">
        <h2 class="card-title">${b.title}</h2>
        <p class="card-author">${b.author}</p>
        <p class="card-note">${b.note}</p>
        <div class="card-meta">
          <span class="stamp" title="${b.rating} of 5">${stampFor(b.rating)}</span>
          <span class="card-date">${formatDate(b.date)}</span>
        </div>
      </div>
    </article>
  `;
  }).join('') || `<p style="color:var(--paper-dim); font-family:var(--mono); font-size:13px;">No books match that search.</p>`;
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-pressed', 'false'));
    tab.setAttribute('aria-pressed', 'true');
    currentSort = tab.dataset.sort;
    renderGrid();
  });
});

searchInput.addEventListener('input', renderGrid);

function showOverlay(book){
  const coverSrc = book.cover || (book.isbn ? `${API}/${book.isbn}-L.jpg` : '');
  if(coverSrc){
    ovCover.src = coverSrc;
    ovCover.alt = `Cover of ${book.title}`;
    ovCover.style.display = '';
    ovCoverBlank.style.display = 'none';
  } else {
    ovCover.style.display = 'none';
    ovCoverBlank.style.display = '';
  }
  ovTitle.textContent = book.title;
  ovAuthor.textContent = book.author;
  ovNote.textContent = book.note;
  ovRating.innerHTML = stampFor(book.rating);
  ovRating.title = `${book.rating} of 5`;
  ovDate.textContent = formatDate(book.date);
  if(book.isbn){
    ovIsbn.textContent = book.isbn;
    ovIsbnField.style.display = '';
  } else {
    ovIsbnField.style.display = 'none';
  }
  overlay.classList.add('is-visible');
  overlay.setAttribute('aria-hidden', 'false');
}

function hideOverlay(){
  overlay.classList.remove('is-visible');
  overlay.setAttribute('aria-hidden', 'true');
}

grid.addEventListener('mouseover', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;
  const book = booksById[card.dataset.id];
  if(book) showOverlay(book);
});

grid.addEventListener('mouseout', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;

  if(card.contains(e.relatedTarget)) return;
  hideOverlay();
});

grid.addEventListener('focusin', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;
  const book = booksById[card.dataset.id];
  if(book) showOverlay(book);
});
//App get into information in those file and thus focusing out the files into various databases
grid.addEventListener('focusout', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;
  if(card.contains(e.relatedTarget)) return;
  hideOverlay();
});

renderGrid();