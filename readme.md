Here is the direct copy of the `README.md` for your project:

```markdown
# SIH Final Project

## Overview

This project is the final submission for the Smart India Hackathon (SIH). The application combines both frontend and backend components, utilizing several technologies like Node.js, Flask, MongoDB, Web3, Firebase, and more. The goal of the project is to provide a seamless experience for users through a web interface and a set of API endpoints.

## Project Structure

- **Backend**: The backend is a Node.js server (using Express) along with MongoDB for data storage and various integrations like Razorpay for payment processing, Twilio for SMS notifications, and Web3 for blockchain-related functionality. 
- **Frontend**: The frontend is a separate client-side application built with modern JavaScript frameworks. It communicates with the backend via API endpoints.
- **Flask Server**: A Flask-based server is included for Python-specific tasks or data processing.

### Directory Structure:

```
/sih_final
  ├── /backend                 # Node.js backend with Express
  ├── /client                  # React or similar frontend app
  ├── /flask_server             # Flask server (for Python tasks)
  ├── .env                     # Environment variables
  ├── package.json             # Node.js dependencies and scripts
  ├── README.md                # Project documentation
  └── /node_modules            # Installed node modules
```

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Firebase Admin, Nodemailer, Web3, Razorpay, Twilio
- **Frontend**: React.js or any frontend framework (to be set up inside the `/client` directory)
- **Python Flask**: Flask (for any Python-specific functionality)
- **Other Libraries**: Axios, bcrypt, socket.io, moment-timezone, haversine-distance, etc.
- **Deployment**: Docker, Nodemon (for development), Vite (for frontend bundling)

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/) (>=14.0.0)
- [Python](https://www.python.org/downloads/) (for Flask server)
- [MongoDB](https://www.mongodb.com/try/download/community) (for local database setup or use a cloud provider like MongoDB Atlas)
- [npm](https://www.npmjs.com/get-npm)
- [pip](https://pip.pypa.io/en/stable/)

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sih_final.git
cd sih_final
```

### 2. Backend Setup

The backend server is built using Node.js and Express. It uses MongoDB for data storage.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file in the `backend` directory (e.g., Firebase credentials, MongoDB connection string, Twilio API keys):
   ```bash
   touch .env
   ```

4. Start the backend server:
   ```bash
   npm run server
   ```

   This command will start the backend with `nodemon` (for automatic restarts).

### 3. Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install the frontend dependencies (make sure you are using `npm` or `yarn`):
   ```bash
   npm install
   ```

3. Run the frontend application:
   ```bash
   npm run dev
   ```

   The frontend will now be running on `http://localhost:3000`.

### 4. Flask Server Setup

1. Navigate to the `flask_server` directory:
   ```bash
   cd flask_server
   ```

2. Set up a virtual environment (recommended for Python projects):
   ```bash
   python -m venv venv
   source venv/bin/activate  # For MacOS/Linux
   venv\Scripts\activate     # For Windows
   ```

3. Install Flask and any other required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python flask_server.py
   ```

   The Flask server will be accessible at `http://localhost:5000`.

## Available Scripts

In the root of the project, there are a few scripts you can run via `npm`:

- **Start backend and frontend in parallel**:
  ```bash
  npm run test
  ```

  This will run both the server and frontend in parallel using `npm-run-all`.

- **Run backend server only**:
  ```bash
  npm run server
  ```

- **Run frontend server only**:
  ```bash
  npm run frontend
  ```

## Environment Variables

You should have the following environment variables set in your `.env` file for both the backend and Flask server:

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your_jwt_secret
FIREBASE_KEY_PATH=path_to_firebase_key
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
RAZORPAY_KEY=your_razorpay_key
```

### Flask Server (.env)

```env
FLASK_ENV=development
FLASK_APP=flask_server.py
```

## Running the Application

After setting up the backend, frontend, and Flask server, you can run the application by starting both servers. Open two terminals:

1. In the first terminal, run the backend server:
   ```bash
   npm run server
   ```

2. In the second terminal, navigate to the frontend directory and run the frontend server:
   ```bash
   npm run frontend
   ```

Now, both the backend and frontend will be live. You can interact with the full application by visiting the frontend in your browser (usually at `http://localhost:3000`) and the backend APIs at `http://localhost:5000` (or whichever port you've set).

## License

This project is licensed under the ISC License.

## Acknowledgements

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Flask](https://flask.palletsprojects.com/)
- [Twilio](https://www.twilio.com/)
- [Razorpay](https://razorpay.com/)
- [Web3](https://web3js.readthedocs.io/)
```