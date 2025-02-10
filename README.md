# Audio Architect - AI Music Curator

Audio Architect is a web application that leverages AI to generate personalized music playlists based on user preferences for genre, artist inspiration, and mood. By integrating with the Gemini Pro model and the YouTube API, it crafts unique playlists tailored to individual tastes.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Rate Limiting](#rate-limiting)
- [CORS Configuration](#cors-configuration)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Features

- **Personalized Playlist Generation:** Creates playlists based on user-specified genre, artist, and mood.
- **AI-Powered Recommendations:** Utilizes the Gemini Pro model to generate creative playlist names and song recommendations.
- **YouTube Integration:** Searches YouTube for official music videos to populate the playlist.
- **Theme Toggle:** Offers light and dark theme options for user preference.
- **Responsive Design:** Provides a seamless experience across various devices.
- **Error Handling:** Displays user-friendly error messages for common issues.

## Technologies Used

- **Frontend:**
  - HTML
  - CSS
  - JavaScript
- **Backend:**
  - Node.js
  - Express.js
  - Axios
  - CORS
  - Dotenv
  - Express-Rate-Limit
- **APIs:**
  - Gemini Pro API
  - YouTube API

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Bish311/webdev_project_final.git
    cd webdev_project_final
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    - Create a `.env` file in the root directory.
    - Add your API keys:

    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    YT_API_KEY=YOUR_YOUTUBE_API_KEY
    PORT=3000 # Optional: Change the port if needed
    ```

4.  **Run the server:**

    ```bash
    npm start
    ```

    The server will start at `http://localhost:3000`.

5.  **Open the frontend:**

    Open `index.html` in your browser (usually `http://localhost:5500` if using Live Server).

## Usage

1.  **Enter your preferences:**
    - Specify a music genre.
    - Provide an artist for inspiration.
    - Describe your desired mood.
2.  **Click "Create My Playlist":**
    - The application will generate a playlist based on your inputs.
3.  **Enjoy your playlist:**
    - A new tab will open with a YouTube playlist tailored to your preferences.

## API Endpoints

- `POST /generate-playlist`
  - Description: Generates a playlist based on the provided genre, artist, and mood.
  - Request Body:

    ```json
    {
      "genre": "pop",
      "artist": "Taylor Swift",
      "mood": "upbeat"
    }
    ```

  - Response:

    ```json
    {
      "playlistName": "My Custom Mix",
      "playlistUrl": "https://www.youtube.com/watch_videos?video_ids=VIDEO_ID1,VIDEO_ID2&title=My%20Custom%20Mix",
      "songCount": 10
    }
    ```

## Rate Limiting

- The API is rate-limited to 100 requests per 15 minutes to ensure fair usage and prevent abuse.

## CORS Configuration

- The server is configured with CORS to allow requests from specific origins:
  - `http://localhost:5500`
  - `http://127.0.0.1:5500`
- You can modify the `allowedOrigins` array in `server.js` to include additional origins if needed.

## Error Handling

- The application provides user-friendly error messages for common issues, such as:
  - Missing input fields
  - API request failures
  - No valid YouTube videos found
- Error messages are displayed on the frontend and logged to the console for debugging.

## Environment Variables

- `GEMINI_API_KEY`: Your API key for the Gemini Pro model.
- `YT_API_KEY`: Your API key for the YouTube API.
- `PORT`: The port on which the server will run (default: 3000).

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.

## Acknowledgements

- This project was inspired by the desire to create personalized music experiences using AI.
- Special thanks to the developers of the Gemini Pro model and the YouTube API for providing the tools to make this project possible.
