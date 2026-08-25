# 📚 The Card Catalog

> **A vintage-inspired digital library for keeping track of the books you've read.**

**The Card Catalog** is a full-stack personal book logger and digital library catalog inspired by the tactile charm of traditional library card drawers.

Users can create an account, securely log in, record books they've completed, assign star ratings, write personal reflections, and search through their personal catalog.

---

## ✨ Features

* 📖 **Personal Book Logging**
  Record books along with their title, author, ISBN, completion date, rating, and notes.

* ⭐ **Star Ratings**
  Rate completed books from **1 to 5 stars**.

* 📝 **Personal Reflections**
  Save notes, thoughts, key takeaways, and memorable quotes for each book.

* 🔎 **Dynamic Search**
  Quickly filter your catalog by book title or author.

* ↕️ **Library Sorting**
  Organize books by:

  * Most Recent
  * Top Rated
  * A–Z Alphabetical

* 🔐 **User Authentication**
  Users can register and log in securely using password hashing and Passport.js authentication.

* 👤 **Isolated User Accounts**
  Each user can maintain their own personal reading catalog.

* 📇 **Interactive Book Cards**
  Expand individual book records in an overlay to view complete book details and reflections.

* 🎨 **Vintage Library UI**
  Inspired by classic library card catalogs with typography and visual elements designed to recreate the feeling of a traditional library.

---

## 🛠️ Tech Stack

### Backend

* **Node.js** — JavaScript runtime
* **Express.js v5** — Web application framework
* **Passport.js** — Authentication
* **Passport-Local** — Username/password authentication strategy
* **bcrypt** — Password hashing
* **express-session** — Session management
* **body-parser** — Request body parsing
* **dotenv** — Environment variable management

### Database

* **PostgreSQL**
* **node-postgres (`pg`)**

### Frontend

* **EJS** — Server-side templating
* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**

### Fonts

The interface uses:

* **Special Elite**
* **Source Serif 4**
* **IBM Plex Mono**

---

## 📋 Requirements & Prerequisites

Before running the project, make sure you have the following installed:

| Requirement | Version                         |
| ----------- | ------------------------------- |
| Node.js     | v18.0.0+                        |
| npm         | v9.0.0+                         |
| PostgreSQL  | v14.0+                          |
| Web Browser | Modern HTML5-compatible browser |

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/books-project.git
cd books-project
```

> Replace `YOUR-USERNAME` with your GitHub username.

---

## 2. Install Dependencies

Run:

```bash
npm install
```

This installs all dependencies defined in `package.json`.

---

## 3. Configure Environment Variables

Create a `.env` file in the root directory of the project:

```text
books-project/
├── .env
├── server.js
├── package.json
└── ...
```

Add your PostgreSQL credentials and session secret:

```env
DataBase_User="postgres"
DataBase_host="localhost"
DataBase_password="YOUR_POSTGRES_PASSWORD"
DataBase_data="Books"
DataBase_port=5432

Session_Secret="YOUR_SUPER_SECRET_SESSION_KEY"
```

### 🔒 Important

Never commit your `.env` file to GitHub.

Make sure `.gitignore` contains:

```gitignore
node_modules/
.env
```

---

# 🗄️ Database Setup

The application uses PostgreSQL and requires a database named **Books**.

## 1. Create the Database

Open PostgreSQL/pgAdmin/psql and run:

```sql
CREATE DATABASE "Books";
```

Connect to the newly created `Books` database.

---

## 2. Create the Users Table

Run:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255),
    username VARCHAR(100)
);
```

The `users` table stores authentication and account information.

---

## 3. Create the Books Table

Run:

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    date DATE,
    note TEXT
);
```

The `books` table stores the information associated with each cataloged book.

---

## 🌱 Optional Sample Data

You can populate the catalog with some sample books:

```sql
INSERT INTO books
(title, author, isbn, rating, date, note)
VALUES
(
    'Sapiens',
    'Yuval Noah Harari',
    '9780062316097',
    5,
    '2026-06-02',
    'The section on shared myths reframed how I think about money, nations, and religion.'
),
(
    'Atomic Habits',
    'James Clear',
    '9780735211292',
    4,
    '2026-05-14',
    'Habit stacking is the one idea I still use daily: attach the new habit to an existing one.'
),
(
    'Deep Work',
    'Cal Newport',
    '9781455586691',
    4,
    '2026-04-30',
    'Convinced me to block two hours a day with no Slack, no email, no tabs.'
);
```

---

# ▶️ Running the Application

Make sure PostgreSQL is running and your `.env` file is configured correctly.

Start the application with:

```bash
npm start
```

The server should start on:

```text
http://localhost:3000
```

Open the URL in your browser.

---

# 🔐 Authentication Flow

The Card Catalog uses **Passport.js** and **bcrypt** for authentication.

The authentication flow works approximately like this:

```text
User
  │
  ▼
Registration
  │
  ▼
Password
  │
  ▼
bcrypt hashing
  │
  ▼
PostgreSQL users table
  │
  ▼
Login
  │
  ▼
Passport Local Strategy
  │
  ▼
Session Created
  │
  ▼
Protected Catalog
```

Passwords are stored as hashed values rather than plain-text passwords.

---

# 🏗️ Architecture

The overall application architecture is:

```text
                         ┌─────────────────────┐
                         │   Client / Browser   │
                         └──────────┬──────────┘
                                    │
                              HTTP Requests
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────┐
│                 Node.js / Express Server                │
│                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
│  │   Middleware │──▶│  Passport.js │──▶│   Routes   │  │
│  │              │   │ Authentication│  │            │  │
│  └──────────────┘   └──────────────┘   └─────┬──────┘  │
│                                               │         │
└───────────────────────────────────────────────┼─────────┘
                                                │
                                                ▼
                                     ┌──────────────────┐
                                     │   PostgreSQL DB  │
                                     │                  │
                                     │  ┌────────────┐  │
                                     │  │   users    │  │
                                     │  ├────────────┤  │
                                     │  │   books    │  │
                                     │  └────────────┘  │
                                     └──────────────────┘
```

---

# 🔗 Available Endpoints

| Method | Endpoint    | Access       | Description                      |
| ------ | ----------- | ------------ | -------------------------------- |
| `GET`  | `/`         | Public       | Displays the landing page        |
| `GET`  | `/register` | Public       | Displays the registration form   |
| `POST` | `/register` | Public       | Creates a new user               |
| `GET`  | `/login`    | Public       | Displays the login form          |
| `POST` | `/login`    | Public       | Authenticates a user             |
| `GET`  | `/Home`     | 🔒 Protected | Displays the user's book catalog |
| `GET`  | `/post`     | 🔒 Protected | Displays the new-book form       |
| `POST` | `/books`    | 🔒 Protected | Saves a new book to PostgreSQL   |

---

# 📁 Project Structure

```text
books-project/
│
├── .gitignore
├── .env
├── package.json
├── package-lock.json
├── server.js
│
├── views/
│   ├── landing.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── post.ejs
│
└── public/
    ├── index.css
    ├── landing.css
    └── index.js
```

### File Overview

| File           | Purpose                                                              |
| -------------- | -------------------------------------------------------------------- |
| `server.js`    | Main Express server, database connection, authentication, and routes |
| `landing.ejs`  | Landing page                                                         |
| `index.ejs`    | Main book catalog                                                    |
| `login.ejs`    | Login page                                                           |
| `register.ejs` | Registration page                                                    |
| `post.ejs`     | Add-book form                                                        |
| `index.css`    | Catalog styling                                                      |
| `landing.css`  | Landing page styling                                                 |
| `index.js`     | Search, sorting, and interactive catalog functionality               |
| `.env`         | Local database and session configuration                             |

---

# 📚 How It Works

### 1. Register

A new user creates an account using their email, username, name, and password.

The password is hashed with **bcrypt** before being stored in PostgreSQL.

### 2. Login

The user submits their credentials.

Passport Local verifies the credentials and creates an authenticated session.

### 3. Access the Catalog

Authenticated users can access:

```text
/Home
```

Their catalog can contain information such as:

```text
Title
Author
ISBN
Rating
Completion Date
Personal Notes
```

### 4. Add a Book

Users can submit a new book through:

```text
/post
```

The data is then submitted to:

```text
POST /books
```

and stored in PostgreSQL.

### 5. Search & Sort

The catalog provides client-side functionality for quickly finding books and organizing them according to:

* 🔎 Title / Author
* ⭐ Highest Rating
* 🕒 Most Recent
* 🔤 Alphabetical Order

---

# 🎨 Design

The interface is inspired by traditional library card catalogs.

The visual design incorporates:

* 📇 Library card drawer aesthetics
* 📜 Paper/card-inspired elements
* ✒️ Typewriter-style typography
* 📚 Book catalog organization
* 🖥️ Modern responsive web layout

The goal is to combine the **nostalgia of physical libraries** with the convenience of a digital reading tracker.

---

# 🔒 Security

The application follows several security practices:

* Passwords are hashed using **bcrypt**
* Authentication is handled through **Passport.js**
* User sessions are managed using **express-session**
* Database credentials are stored in `.env`
* `.env` should never be committed to version control
* Protected routes require authentication

> **Note:** For production deployment, additional security measures such as secure cookies, HTTPS, CSRF protection, rate limiting, and stronger database/user authorization constraints should also be considered.

---

# 📦 Main Dependencies

The project is built using the following packages:

```text
express
ejs
pg
passport
passport-local
bcrypt
express-session
body-parser
dotenv
```

---

# 🧪 Local Development

After making changes to the source code, restart the server:

```bash
npm start
```

Then visit:

```text
http://localhost:3000
```

Make sure PostgreSQL is running before starting the application.

---

# 🚧 Future Improvements

Potential improvements for future versions include:

* 🖼️ Book cover images
* 📚 Goodreads/Open Library API integration
* 📊 Reading statistics and dashboards
* 📅 Reading goals
* 🏷️ Genres and custom tags
* 🔖 Favorite books
* 📱 Improved mobile experience
* 🌙 Dark mode
* 📤 Export catalog to CSV/PDF
* 🔄 Edit and delete book entries
* 👥 Social reading features
* ☁️ Cloud deployment
* 🔑 Password reset functionality

---

# 👨‍💻 Author

**Himu**

Built with ❤️, Node.js, PostgreSQL, and a love for books.

---

# 📄 License

This project is licensed under the **ISC License**.
