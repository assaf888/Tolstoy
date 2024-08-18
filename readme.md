# URL Metadata Fetcher

## Overview

This project is a full-stack application that allows users to submit a list of URLs and retrieve metadata (title, description, and image) for each URL. The application consists of a React frontend and a Node.js backend.

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Running the Application](#running-the-application)
3. [Testing the Application](#testing-the-application)

## Setup Instructions

1. Prerequisites
Node.js (version 14.x or later)
npm (comes with Node.js)
Git (optional, for cloning the repository)
2. Clone the Repository


```
git clone https://github.com/assaf888/Tolstoy.git
cd Tolstoy
```

3. Install Dependencies
Backend:

```
cd server
npm install
```

Frontend:

```
cd ../client
npm install
```

4. Configure Environment Variables

Create the .env File:
In the server directory, create a file named .env to store environment-specific variables, in this case the port that the backend will run on.

```
PORT=3001
```

In the client directory, create a file named .env to store environment-specific variables, in this case, URL of our backend service.

```
REACT_APP_BACKEND_URL=http://localhost:3001/api/fetch-metadata
```

## Running the Application

1. Start the Backend Server
From the server directory, run:
```
npm start
```

This will start the Node.js server on the desired port, default is http://localhost:3001

2. Start the Frontend Server
From the client directory, run:

```
npm start
```
This will start the React application on http://localhost:3000.

3. Access the Application
Open your browser and navigate to http://localhost:3000. You should see the form where you can enter URLs and retrieve their metadata.

## Testing the Application
1. Running Backend Tests
From the server directory, run:

```
npm test
```
This will execute the Jest test suites for the backend.

2. Running Frontend Tests
From the client directory, run:

```
npm test
```

This will execute the Jest test suites for the React components.

