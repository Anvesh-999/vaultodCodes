function filterVideos(category, button) {
  let items = document.querySelectorAll('.portfolio-item');
  items.forEach(item => {
    if (category === 'all' || item.classList.contains(category)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  document.querySelectorAll('.filter-buttons button').forEach(btn => {
    btn.classList.remove('active');
  });
  button.classList.add('active');
}

function openVideo(src) {
  const lightbox = document.getElementById('lightbox');
  const video = document.getElementById('lightboxVideo');
  video.src = src;
  lightbox.style.display = 'flex';
}

function closeVideo() {
  const lightbox = document.getElementById('lightbox');
  const video = document.getElementById('lightboxVideo');
  video.pause();
  video.src = '';
  lightbox.style.display = 'none';
}