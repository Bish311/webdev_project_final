document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
    const body = document.body;
  
    // Theme Management
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    toggle.checked = savedTheme === 'dark';
  
    toggle.addEventListener('change', () => {
      const theme = toggle.checked ? 'dark' : 'light';
      body.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  
    // Input Animations
    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('active');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('active');
        }
      });
    });
  });
  
  async function generatePlaylist() {
    const btn = document.querySelector('.generate-btn');
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');
  
    btn.disabled = true;
    btnText.style.opacity = '0.5';
    spinner.style.display = 'block';
  
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Replace with actual API call
      const playlistUrl = 'https://youtube.com/playlist?list=...';
      alert('Playlist generated successfully!');
      window.open(playlistUrl, '_blank');
    } catch (error) {
      alert('Error generating playlist: ' + error.message);
    } finally {
      btn.disabled = false;
      btnText.style.opacity = '1';
      spinner.style.display = 'none';
    }
  }