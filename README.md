# Frontend Documentation

This is the frontend application for managing employees and attendance. To get started, follow the steps below.

## Prerequisites

Ensure that you have the following installed:
- Node.js (>=14.x.x)
- npm (>=6.x.x)

## Setup and Running the Application

1. Clone the repository to your local machine:
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

The frontend will be available at `http://localhost:3000`.

## Backend

Ensure the backend is running before starting the frontend.

1. The backend should be running at `http://localhost:3000` (or another port if configured differently).
2. Follow the [backend README](backend/README.md) to set up and run the backend.

## Authentication

You can login using the following credentials:

- **Admin**:  
    - Email: `admin@gmail.com`  
    - Password: `123456`

- **Employee**:  
    - Email: `employee@gmail.com`  
    - Password: `123456`

To log in, navigate to the login page and use the provided credentials.

## Notes

- Make sure that the backend server is running and the API is accessible before you start the frontend application.
- The frontend will interact with the backend for authentication and data handling. If the backend isn't running, you won't be able to access the features.

## Offline / Mock Mode ⚠️

You can run the frontend without a backend using the built-in mock services.

- Start dev server in offline mode:
```bash
npm run dev:offline
```

When running this way the app uses local mock services (stored in `src/mocks/`) and persists mock state in `localStorage`. Use it to develop UI without the backend.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
