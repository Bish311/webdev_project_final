require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Middleware
app.use(express.json());
app.use(limiter);

// CORS Configuration
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.post('/generate-playlist', async (req, res) => {
    try {
        const { genre, artist, mood } = req.body;
        
        // Enhanced Gemini prompt
        const prompt = `Provide 10 song recommendations:
1. ${artist ? `5 tracks by ${artist}` : "5 popular ${genre} songs"}
2. 5 similar ${genre || ""} songs
3. Mood: ${mood || "current vibe"}
Format: "Artist - Song Title"
Example:
Artist - Song Title
...`;

        // Get songs from Gemini
        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: prompt }] }] }
        );
        
        // Parse response
        const generatedText = geminiResponse.data.candidates[0].content.parts[0].text;
        console.log('Raw LLM Response:\n', generatedText);

        const songs = generatedText.split('\n')
            .map(line => line.trim())
            .filter(line => line.match(/^.+\s-\s.+$/))
            .slice(0, 10);

        console.log('Parsed Songs:', songs);

        // YouTube search with enhanced query
        const videoIds = await Promise.all(songs.map(async (song, index) => {
            try {
                const ytResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        q: `${song} official music video`,
                        part: 'snippet',
                        type: 'video',
                        videoCategoryId: 10,
                        maxResults: 3,
                        key: process.env.YT_API_KEY
                    }
                });

                // Find first valid video (non-cover, non-live)
                const validVideo = ytResponse.data.items.find(item => {
                    const title = item.snippet.title.toLowerCase();
                    return !title.includes('cover') && 
                           !title.includes('live') && 
                           item.id.videoId;
                });

                const videoId = validVideo?.id?.videoId || ytResponse.data.items[0]?.id?.videoId;
                console.log(`Song ${index + 1}: ${song} => ${videoId || 'Not found'}`);
                return videoId;
            } catch (error) {
                console.error(`Search failed for: ${song}`, error.message);
                return null;
            }
        }));

        // Filter valid IDs
        const validVideoIds = videoIds.filter(id => id);
        console.log('Final Video IDs:', validVideoIds);

        if (validVideoIds.length === 0) {
            throw new Error('No valid YouTube videos found for these songs');
        }

        res.json({
            playlistUrl: `https://www.youtube.com/watch_videos?video_ids=${validVideoIds.join(',')}`,
            songCount: validVideoIds.length
        });

    } catch (error) {
        console.error('Error Stack:', error.stack);
        res.status(500).json({
            error: error.message,
            suggestions: ['Try different search terms', 'Check artist name spelling']
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));