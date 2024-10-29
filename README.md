# IT Support Assistant

This project is an IT Support Assistant chatbot built using Express.js for the backend and React for the frontend. The assistant uses OpenAI's API to provide IT support and can trigger Slack automations for IT-related tasks.

## Project Structure

. ├── client/ │ ├── public/ │ │ ├── index.html │ │ ├── manifest.json │ │ └── robots.txt │ ├── src/ │ │ ├── components/ │ │ │ └── ChatWindow.js │ │ ├── App.js │ │ ├── Axios.js │ │ ├── index.css │ │ ├── index.js │ │ ├── reportWebVitals.js │ │ └── setupTests.js │ ├── .env │ ├── .env.sample │ ├── .gitignore │ ├── package.json │ ├── README.md │ └── tailwind.config.js ├── routes/ │ ├── api.js ├── .env ├── .env.sample ├── .gitignore ├── package.json ├── server.js └── README.md

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API Key
- Slack API Token

## Getting Started

### Backend Setup

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install backend dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   SLACK_TOKEN=your_slack_token
   ASSISTANT_ID=your_assistant_id
   PORT=5000
   ```

4. Start the backend server:

   ```sh
   npm run dev
   ```

   The backend server will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. Navigate to the directory:

   ```sh
   cd client
   ```

2. Install frontend dependencies:

   ```sh
   npm install
   ```

3. Create a file in the directory and add your environment variables:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:

   ```sh
   npm start
   ```

   The frontend server will run on [http://localhost:3000](http://localhost:3000).

## Available Scripts

### Backend

- [`npm start`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fwaheedahmed%2FDesktop%2FWork%2Fit-chatbot-be%2Fclient%2FREADME.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A8%2C%22character%22%3A5%7D%7D%5D%2C%22230909bd-af38-4214-b66b-76be1c6fc64b%22%5D "Go to definition"): Start the backend server.
- `npm run dev`: Start the backend server with nodemon for development.

### Frontend

- [`npm start`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fwaheedahmed%2FDesktop%2FWork%2Fit-chatbot-be%2Fclient%2FREADME.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A8%2C%22character%22%3A5%7D%7D%5D%2C%22230909bd-af38-4214-b66b-76be1c6fc64b%22%5D "Go to definition"): Start the frontend development server.
- [`npm run build`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fwaheedahmed%2FDesktop%2FWork%2Fit-chatbot-be%2Fclient%2FREADME.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A21%2C%22character%22%3A5%7D%7D%5D%2C%22230909bd-af38-4214-b66b-76be1c6fc64b%22%5D "Go to definition"): Build the frontend for production.
- [`npm test`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fwaheedahmed%2FDesktop%2FWork%2Fit-chatbot-be%2Fclient%2FREADME.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A16%2C%22character%22%3A5%7D%7D%5D%2C%22230909bd-af38-4214-b66b-76be1c6fc64b%22%5D "Go to definition"): Launch the test runner in interactive watch mode.
- [`npm run eject`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fwaheedahmed%2FDesktop%2FWork%2Fit-chatbot-be%2Fclient%2FREADME.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A31%2C%22character%22%3A5%7D%7D%5D%2C%22230909bd-af38-4214-b66b-76be1c6fc64b%22%5D "Go to definition"): Eject the Create React App configuration.

## API Endpoints

### Backend

- `POST /createAssistant`: Create a new IT Support Assistant.
- `POST /updateAssistant`: Update the IT Support Assistant.
- `GET /api/chat/create`: Create a new chat thread.
- `POST /api/chat`: Send a message to the chat thread.

## License

This project is licensed under the ISC License.
