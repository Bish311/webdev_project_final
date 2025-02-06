document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const toggle = document.getElementById('toggle');
    const body = document.body;
  
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    toggle.checked = savedTheme === 'dark';
  
    toggle.addEventListener('change', () => {
      const theme = toggle.checked ? 'dark' : 'light';
      body.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  });
  
  async function generatePlaylist() {
    const genre = document.getElementById('genre').value;
    const artist = document.getElementById('artist').value;
    const mood = document.getElementById('mood').value;
  
    if (!genre && !artist && !mood) {
      showError('Please fill in at least one field');
      return;
    }
  
    const btn = document.querySelector('.generate-btn');
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');
  
    try {
      btn.disabled = true;
      btnText.style.visibility = 'hidden';
      spinner.style.display = 'block';
  


      const response = await fetch('http://localhost:3000/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genre,
          artist,
          mood
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.playlistUrl) {
        window.open(data.playlistUrl, '_blank');
      } else {
        showError('Failed to generate playlist. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('An error occurred. Please try again later.');
    } finally {
      btn.disabled = false;
      btnText.style.visibility = 'visible';
      spinner.style.display = 'none';
    }
  
    // console.log('Generate Playlist button clicked');
    // console.log('Genre:', genre, 'Artist:', artist, 'Mood:', mood);
  }
  
  function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(errorEl, document.querySelector('.form-container'));
    
    setTimeout(() => errorEl.remove(), 5000);
  }