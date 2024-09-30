# Social Media App

This project is a TypeScript-based GraphQL API application built using the NestJS framework. It serves as a backend for a social media application, providing functionalities such as user authentication, post creation, commenting, and more.

## Features

- **User Authentication**: Secure user authentication using JWT.
- **GraphQL API**: Efficient data fetching and manipulation using GraphQL.
- **Modular Architecture**: Organized code structure with separate modules for users, posts, and comments.
- **MongoDB Integration**: Data storage using MongoDB.
- **Password Hashing**: Secure password storage using bcrypt.
- **Follow System**: Users can follow each other.
- **GraphQL Playground**: Interactive GraphQL Playground for testing queries and mutations.

## Setup

### Prerequisites

- Node.js (>= 20.x)

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```properties
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Installation

#### 1. Clone the repository:

```bash
git clone https://github.com/yourusername/socialmediaapp.git
cd socialmediaapp
```

#### 2. Install dependencies:

```bash
npm install
```

#### 3. Run the application in development mode:

```bash
npm run start:dev
```
