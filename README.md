# Game Leaderboard Application

This repository contains a Game Leaderboard Application built using Node.js, Express, and MongoDB Atlas. The application allows you to manage contestants, games, and game participation. It also provides endpoints to retrieve leaderboards globally (aggregated by date) and for individual games.
below is a hosted link
https://gaming-leaderboard-1.onrender.com

## Features

- **Contestant Management:** Create, read, update, and delete contestants.
- **Game Management:** Start new games, update game details (including ending a game), and delete games.
- **Game Participation:** Add contestants to games, update their scores, and remove them from games.
- **Leaderboards:**
  - **Global Leaderboard:** Aggregate scores for all games on a specific date.
  - **Game Leaderboard:** Retrieve a sorted list of participants for a specific game based on their scores.
- **Error Handling:** Meaningful HTTP status codes and error messages for invalid operations.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (online)
- **ODM:** Mongoose
- **Containerization:** Docker, Docker Compose

## Installation

### Local Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/game-leaderboard.git
   cd game-leaderboard
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Application:**

   ```bash
   npm run dev
   ```

4. **Access the Application:**

   Open your browser and navigate to `http://localhost:3000` to view the application.

## API Endpoints

Below is a comprehensive list of all available endpoints for the Game Leaderboard Application, complete with sample requests and responses.

---

### Contestant Endpoints

1. **Create a New Contestant**

   - **Endpoint:** `POST /contestants`
   - **Description:** Creates a new contestant.
   - **Request Body Example:**
     {
     "name": "Alice Johnson",
     "email": "alice.johnson@example.com"
     }
   - **Response:** Returns a JSON object representing the newly created contestant, including a unique ID and timestamps.

2. **List All Contestants**

   - **Endpoint:** `GET /contestants`
   - **Description:** Retrieves a list of all contestants.
   - **Response:** Returns an array of contestant objects.

3. **Get a Specific Contestant**

   - **Endpoint:** `GET /contestants/:id`
   - **Description:** Fetches the details of a single contestant by their ID.
   - **Response:** Returns the contestant object for the provided ID.

4. **Update a Contestant**

   - **Endpoint:** `PUT /contestants/:id`
   - **Description:** Updates the details of an existing contestant.
   - **Request Body Example:**
     {
     "name": "Alice J. Johnson",
     "email": "alice.j.johnson@example.com"
     }
   - **Response:** Returns the updated contestant object.

5. **Delete a Contestant**
   - **Endpoint:** `DELETE /contestants/:id`
   - **Description:** Removes a contestant from the system.
   - **Response:** Returns a confirmation message upon successful deletion.

---

### Game Endpoints

1. **Create/Start a New Game**

   - **Endpoint:** `POST /games`
   - **Description:** Starts a new game. The game is set to "active" by default.
   - **Request Body Example:**
     {
     "name": "Game 1"
     }
   - **Response:** Returns the newly created game object with details such as name, status, and start time.

2. **List All Games**

   - **Endpoint:** `GET /games`
   - **Description:** Retrieves a list of all games.
   - **Response:** Returns an array of game objects.

3. **Get Game Details**

   - **Endpoint:** `GET /games/:id`
   - **Description:** Retrieves details for a specific game identified by its ID.
   - **Response:** Returns the game object including its name, status, start time, and (if applicable) end time.

4. **Update a Game**

   - **Endpoint:** `PUT /games/:id`
   - **Description:** Updates game details such as the game name or status (e.g., ending the game).
   - **Request Body Examples:**
     - To update the game name:
       {
       "name": "New Game Name"
       }
     - To mark a game as ended:
       {
       "status": "ended"
       }
   - **Response:** Returns the updated game object.

5. **Delete a Game**
   - **Endpoint:** `DELETE /games/:id`
   - **Description:** Deletes a game and all associated participation records.
   - **Response:** Returns a confirmation message upon successful deletion.

6. **Upvote a Game**
   - **Endpoint:** `POST /games/:id/upvote`
   - **Description:** Increases the upvote count for a specific game by 1.
   - **Response Example:**
     ```json
     {
       "message": "Game upvoted successfully",
       "game": {
         "id": "GAME_OBJECT_ID",
         "name": "Game Name",
         "upvotes": 231
       }
     }
     ```
   - **Error Response:** Returns a 404 status if the game is not found.
---

### Game Participation Endpoints

1. **Add a Contestant to a Game**

   - **Endpoint:** `POST /games/:id/participants`
   - **Description:** Adds a contestant to a specified active game.
   - **Request Body Example:**
     {
     "contestantId": "CONTESTANT_OBJECT_ID"
     }
   - **Response:** Returns the participation record, which includes the game and contestant IDs and an initial score (default is 0).

2. **Update a Contestant's Score in a Game**

   - **Endpoint:** `PATCH /games/:id/participants/:contestantId`
   - **Description:** Updates the score of a contestant in a game.
   - **Request Body Example:**
     {
     "score": 150
     }
   - **Response:** Returns the updated participation record with the new score and updated timestamp.

3. **Remove a Contestant from a Game**
   - **Endpoint:** `DELETE /games/:id/participants/:contestantId`
   - **Description:** Removes a contestant's participation from the specified game.
   - **Response:** Returns a confirmation message upon successful removal.

---

### Leaderboard Endpoints

1. **Global Leaderboard**

   - **Endpoint:** `GET /leaderboard/global?date=YYYY-MM-DD`
   - **Description:** Retrieves an aggregated leaderboard of all contestants across games that started on a specific date.
   - **Query Parameter:**
     - `date` – The date in `YYYY-MM-DD` format.
   - **Response Example:**
     [
     {
     "contestantId": "CONTESTANT_OBJECT_ID",
     "name": "Alice Johnson",
     "email": "alice.johnson@example.com",
     "totalScore": 150
     },
     {
     "contestantId": "ANOTHER_CONTESTANT_OBJECT_ID",
     "name": "Bob Smith",
     "email": "bob.smith@example.com",
     "totalScore": 100
     }
     ]

2. **Game-Specific Leaderboard**
   - **Endpoint:** `GET /leaderboard/game/:gameId`
   - **Description:** Retrieves the leaderboard for a specific game, with participants sorted in descending order by score.
   - **Response Example:**
     {
     "game": {
     "id": "GAME_OBJECT_ID",
     "name": "Game 1",
     "startTime": "2025-02-07T15:40:00.000Z",
     "endTime": "2025-02-07T15:50:00.000Z",
     "status": "ended"
     },
     "leaderboard": [
     {
     "contestantId": "CONTESTANT_OBJECT_ID",
     "name": "Alice Johnson",
     "email": "alice.johnson@example.com",
     "score": 150
     },
     {
     "contestantId": "ANOTHER_CONTESTANT_OBJECT_ID",
     "name": "Bob Smith",
     "email": "bob.smith@example.com",
     "score": 100
     }
     ]
     }

---

### Game Popularity
1. **Get Game Popularity Rankings**

   - **Endpoint:** `GET /popularity`
   - **Description:** Retrieves a ranked list of games based on multiple factors including unique players, current players, upvotes, session length, and total sessions.
   - **Response Example:**
     ```json
     [
       {
         "gameId": "GAME_OBJECT_ID",
         "name": "Popular Game",
         "uniquePlayersYesterday": 150,
         "currentPlayers": 45,
         "upvotes": 230,
         "longestSessionTime": 3600,
         "totalSessionsYesterday": 300,
         "popularityScore": 0.95
       },
       {
         "gameId": "ANOTHER_GAME_ID",
         "name": "Another Game",
         "uniquePlayersYesterday": 80,
         "currentPlayers": 20,
         "upvotes": 150,
         "longestSessionTime": 2400,
         "totalSessionsYesterday": 180,
         "popularityScore": 0.75
       }
     ]
     ```

---

I have also attached the postman collection file to test the endpoints.
