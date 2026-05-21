# ⚽ Football Talent App

A full-stack web application for managing football talents, built with the MERN stack. Users can log in and perform full CRUD operations (Create, Read, Update, Delete) on player data.

***

## 🛠️ Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React.js            |
| Backend    | Node.js, Express.js |
| Database   | MongoDB + Mongoose  |

***

## ✨ Features

- 🔐 User Login / Authentication
- ➕ Add new football talents
- 📋 View all players
- ✏️ Edit player information
- 🗑️ Delete players

***

## 📁 Project Structure

```
football-talent-app/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       └── pages/
├── server/          # Node.js + Express backend
│   ├── models/
│   ├── routes/
│   └── controllers/
└── .env             # Environment variables
```

***

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhurkaa/football-talent-app.git
   cd football-talent-app
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**  
   Create a `.env` file inside the `server/` folder:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

5. **Run the backend**
   ```bash
   cd server
   npm start
   ```

6. **Run the frontend**
   ```bash
   cd client
   npm start
   ```

7. Open your browser and go to `http://localhost:3000`

***

## 🔗 API Endpoints

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| POST   | `/api/auth/login`   | Login user           |
| GET    | `/api/players`      | Get all players      |
| POST   | `/api/players`      | Add a new player     |
| PUT    | `/api/players/:id`  | Update a player      |
| DELETE | `/api/players/:id`  | Delete a player      |

***

## 👨‍💻 Author

**Dhurim Citaku**  
GitHub: [@dhurkaa](https://github.com/dhurkaa)
