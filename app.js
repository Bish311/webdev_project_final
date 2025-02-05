async function generatePlaylist() {
    const songType = document.getElementById('songType').value;
    const artist = document.getElementById('artist').value;
    const prompt = document.getElementById('prompt').value;

    // Send data to backend
    const response = await fetch('/generate-playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ songType, artist, prompt }),
    });

    const result = await response.json();
    if (result.success) {
      alert('Playlist generated successfully!');
      window.open(result.playlistUrl, '_blank'); // Open playlist in new tab
    } else {
      alert('Failed to generate playlist. Please try again.');
    }
  }