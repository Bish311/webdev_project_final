require('dotenv').config();


const express = require('express');
const cors = require('cors'); 
const axios = require('axios');
const app = express();

app.use(express.json()); 


app.use(cors({
    origin: 'http://localhost:3000' 
  }));


console.log('Checking environment variables:');
console.log('GEMINI_API_KEY exists?', !!process.env.GEMINI_API_KEY);
console.log('YT_API_KEY exists?', !!process.env.YT_API_KEY);


app.get('/test-apis', async (req, res) => {
  const testResults = {
    gemini: false,
    youtube: false,
  };

  try {
    // Test Gemini API
    const geminiTest = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: "Say 'TEST SUCCESSFUL' exactly" }],
          },
        ],
      }
    );
    testResults.gemini =
      geminiTest.data.candidates?.[0]?.content?.parts?.[0]?.text ===
      'TEST SUCCESSFUL';
  } catch (geminiError) {
    console.error(
      'Gemini Test Error:',
      geminiError.response?.data || geminiError.message
    );
  }

  try {
    // Test YouTube API
    const ytTest = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id: 'dQw4w9WgXcQ', // Never Gonna Give You Up
        key: process.env.YT_API_KEY,
      },
    });
    testResults.youtube = ytTest.data.items?.length > 0;
  } catch (ytError) {
    console.error(
      'YouTube Test Error:',
      ytError.response?.data || ytError.message
    );
  }

  res.json({
    status: 'API Tests Completed',
    results: testResults,
    environment: {
      node_env: process.env.NODE_ENV,
      port: process.env.PORT,
    },
  });
});

// Original playlist endpoint with enhanced logging
app.post('/generate-playlist', async (req, res) => {
  console.log('Received request:', req.body);

  try {
    const { genre, artist, mood } = req.body;

    // Gemini API Call
    console.log('Making Gemini API request...');
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate 10 specific song recommendations in this format only: "Artist - Song Title". 
            Parameters: ${genre ? 'Genre: ' + genre : ''} 
            ${artist ? 'Similar to artist: ' + artist : ''} 
            ${mood ? 'Mood: ' + mood : ''}`,
              },
            ],
          },
        ],
      }
    );

    console.log('Gemini Response:', geminiResponse.data);

    if (!geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid Gemini response structure');
    }

    const generatedText =
      geminiResponse.data.candidates[0].content.parts[0].text;
    console.log('Generated Text:', generatedText);

    const songs = parseSongs(generatedText);
    console.log('Parsed Songs:', songs);

    // YouTube API Calls
    console.log('Starting YouTube searches...');
    const videoIds = await Promise.all(
      songs.map(async (song, index) => {
        try {
          const ytResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
              params: {
                q: song,
                part: 'snippet',
                type: 'video',
                maxResults: 1,
                key: process.env.YT_API_KEY,
              },
            }
          );

          if (!ytResponse.data.items?.[0]?.id?.videoId) {
            console.error(`YouTube search failed for: ${song}`);
            return null;
          }

          return ytResponse.data.items[0].id.videoId;
        } catch (error) {
          console.error(`Error searching for ${song}:`, error.message);
          return null;
        }
      })
    );

    console.log('Video IDs:', videoIds);

    const validVideoIds = videoIds.filter((id) => id);
    if (validVideoIds.length === 0) {
      throw new Error('No valid YouTube videos found');
    }

    const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${validVideoIds.join(
      ','
    )}`;
    console.log('Generated Playlist URL:', playlistUrl);

    res.json({ playlistUrl });
  } catch (error) {
    console.error('Error Stack:', error.stack);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

function parseSongs(content) {
  return content
    .split('\n')
    .filter((line) => line.match(/^\d+\.\s+.+-\s+.+/))
    .map((line) => line.replace(/^\d+\.\s+/, '').trim());
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test API endpoints at http://localhost:${PORT}/test-apis`);
});
