You are a senior full-stack engineer taking over my existing Multimodal AI project.

IMPORTANT:
Do NOT create a separate demo project.
Do NOT replace my existing multimodal functionality.
First inspect my entire existing project structure, frontend, backend, Python files, environment files, API routes, database configuration, and package files. Understand how everything currently works before modifying anything.

My goal is to turn my existing Multimodal AI project into a complete web application with authentication and PostgreSQL persistence.

CURRENT ARCHITECTURE GOAL:

Frontend:
React + responsive UI

Backend:
Python backend/API

Database:
PostgreSQL

Authentication:
Email/password + Google Sign-In

Authentication security:
JWT/access-token based authentication

Application:
My existing Multimodal AI functionality including chat, PDF/RAG, image, voice and other existing modules must continue working.

TARGET ARCHITECTURE:

React Frontend
↓
Backend REST API
↓
Authentication Service
↓
PostgreSQL
↓
Existing Multimodal AI services

1. Inspect every relevant project folder and file.
2. Identify:

   * frontend framework
   * backend framework
   * existing API endpoints
   * existing authentication code, if any
   * existing PostgreSQL configuration
   * existing .env files
   * existing AI API integrations
   * existing RAG/vector database implementation
   * existing upload/chat/image/voice routes
3. Do not duplicate functionality that already exists.
4. Before changing architecture, explain briefly what you found.

Create or update the environment configuration securely.

Use environment variables for all secrets.

The backend should have variables similar to:

DATABASE_URL=postgresql://USERNAME@HOST/DATABASE_NAME

JWT_SECRET_KEY=<strong-secret>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>

Also preserve and correctly configure my existing AI API keys.

IMPORTANT:

* Never hard-code passwords.
* Never hard-code API keys.
* Never expose backend secrets in React.
* Never put DATABASE_URL in frontend code.
* Add/update .gitignore so .env files are not committed.
* Create .env.example containing variable names but no real secrets.

If my current project uses a different environment-variable naming convention, preserve consistency where appropriate.

Connect the backend to PostgreSQL using a proper production-oriented database layer.

Create appropriate tables/models for at least:

users
sessions/tokens if required
chat_history
uploaded_files if required

Users should contain appropriate fields such as:

id
name
email
password_hash
google_id (nullable)
auth_provider
created_at
updated_at

Use UUID or another production-appropriate primary key.

IMPORTANT:
Passwords must NEVER be stored as plain text.

Use secure password hashing such as bcrypt/Argon2 depending on the existing backend ecosystem.

Create proper database migrations instead of manually creating tables every time the application starts.

Do not delete existing database data.

If tables already exist, inspect them before modifying the schema.

Implement a complete signup flow.

Frontend:

* name
* email
* password
* confirm password
* validation
* loading state
* useful error messages
* responsive design

Backend:

POST /auth/signup

Flow:

React
↓
POST /auth/signup
↓
Backend validates data
↓
Check whether email already exists
↓
Hash password
↓
Store user in PostgreSQL
↓
Generate authentication token
↓
Return safe user information + token
↓
Frontend stores authentication state securely

Never return password/password_hash to the frontend.

Implement:

POST /auth/login

Flow:

Email + password
↓
Backend
↓
Find user
↓
Verify password hash
↓
Generate JWT/access token
↓
Return authenticated user information
↓
Frontend updates authentication state

Handle:

* incorrect email
* incorrect password
* nonexistent account
* validation errors
* expired token
* server/database errors

Do not reveal unnecessary information that helps attackers enumerate accounts.

Implement Google authentication properly.

Use Google's official OAuth/OpenID Connect flow appropriate for a React frontend + Python backend architecture.

Do NOT put the Google client secret in React.

The backend must verify the Google identity/token before creating or logging in the user.

Expected flow:

React
↓
Google Sign-In
↓
Google identity/token
↓
Backend verification
↓
Find existing user by Google ID/email
↓
Create user if necessary
↓
Generate our application JWT/session
↓
React authenticated

If a user already registered using email/password with the same verified email, handle account linking safely rather than blindly creating duplicate accounts.

Create proper authentication middleware/dependencies.

Protected endpoints should require authentication.

For example:

GET /auth/me
POST /chat
POST /upload
POST /image
POST /voice
GET /chat/history

should be protected where appropriate.

The backend should identify the authenticated user from the token.

Do NOT trust a user_id supplied by the frontend when authorization can instead be determined from the authenticated token.

For example, chat history must belong to the authenticated user.

Create a professional responsive authentication interface.

Pages/components:

/login
/signup

Login:

* Email
* Password
* Login button
* Continue with Google
* Forgot password placeholder or implementation if practical
* Link to Signup

Signup:

* Name
* Email
* Password
* Confirm password
* Create Account
* Continue with Google
* Link to Login

Design requirements:

* modern AI application appearance
* responsive on desktop/tablet/mobile
* keyboard accessible
* proper form validation
* disabled/loading buttons while requests are running
* clear success/error messages
* no secrets exposed in frontend
* maintain the existing project's visual style where possible

After successful authentication:

User
↓
Login
↓
Dashboard/Home
↓
Multimodal AI interface

Unauthenticated users should not access protected application pages.

Implement a proper frontend auth guard/router mechanism.

If the JWT/session becomes invalid or expires:

→ clear authentication state
→ redirect user to login
→ show an appropriate message

Do not break my existing multimodal UI.

Modify my existing application so authenticated users have isolated data.

For example:

User A
├── chats
├── uploaded files
└── history

User B
├── chats
├── uploaded files
└── history

User A must NEVER be able to retrieve User B's private data.

Review my existing chat history, PDF/RAG, upload and vector database logic and modify it where necessary to associate data with authenticated users.

Do not unnecessarily rewrite my existing AI/RAG implementation.

Configure frontend API communication correctly.

Use an environment variable for the backend URL, for example:

VITE_API_URL=http://localhost:8000

The frontend must call:

${VITE_API_URL}/auth/login
${VITE_API_URL}/auth/signup
${VITE_API_URL}/auth/me

and the appropriate existing multimodal endpoints.

Do not hard-code localhost throughout the project.

Make the configuration easy to change for production.

Configure backend CORS correctly for local development.

Example development architecture:

Frontend:
http://localhost:5173

Backend:
http://localhost:8000

Allow only the required frontend origin.

Do NOT use unrestricted production CORS such as:

allow_origins=["*"]

when credentials/authentication are involved.

Make production CORS configurable through environment variables.

Create a reliable database startup/connection check.

Test:

Backend
↓
PostgreSQL
↓
Successful connection

If PostgreSQL is unavailable, show a clear backend error rather than crashing unpredictably.

Do not recreate the database on every application startup.

Test the following end-to-end:

1. Signup
2. Duplicate signup
3. Login
4. Wrong password
5. Google login
6. Get current user
7. Protected route without token
8. Protected route with valid token
9. Invalid/expired token
10. Logout/session cleanup if applicable
11. Chat request as authenticated user
12. Chat history isolation
13. File upload as authenticated user
14. PostgreSQL persistence

After authentication works, verify that my existing features still work:

* normal AI chat
* PDF upload
* RAG
* vector search
* image processing/generation
* voice features
* existing APIs
* existing frontend components

Do not remove working functionality simply to make authentication easier.

If any existing code is incompatible with the new architecture, refactor it carefully.

Implement clean error handling.

Frontend should never display raw Python stack traces.

Backend should log useful technical errors while returning safe user-facing messages.

Handle:

400
401
403
404
409
422
500

appropriately.

Before finishing, review the implementation for:

* plaintext passwords
* exposed API keys
* exposed Google client secret
* exposed database credentials
* insecure JWT secret
* missing authentication on protected routes
* missing authorization checks
* SQL injection
* unsafe CORS
* sensitive data in frontend
* user data leakage
* insecure file access
* token handling problems

Fix issues you find.

After implementation, install missing dependencies and run the complete application.

Give me the exact commands for:

1. PostgreSQL
2. Backend
3. Frontend

Example structure:

Terminal 1:
<database/service command if required>

Terminal 2:
<backend command>

Terminal 3:
<frontend command>

Then verify that:

Frontend loads successfully.
Backend API responds successfully.
PostgreSQL connection succeeds.
Signup works.
Login works.
Google login works or clearly identifies any Google Console configuration still required.
Protected routes work.
Existing multimodal functionality works.

Do not simply generate files and say "done."

Actually inspect, modify, install dependencies, run the application, and test the complete flow.

If something fails:

1. identify the root cause
2. fix it
3. rerun the affected component
4. verify again

Do not hide errors.

When finished, provide me:

1. Final project structure
2. Files created
3. Files modified
4. Database tables created/modified
5. Environment variables required
6. Dependencies installed
7. Exact commands to run the project
8. Local frontend URL
9. Local backend URL
10. Database connection status
11. Authentication test results
12. Existing multimodal feature test results
13. Any Google OAuth configuration I still need to perform manually
14. Any remaining warnings/errors

Most importantly:

KEEP MY EXISTING MULTIMODAL AI PROJECT WORKING.

The objective is not just to create a login page. The objective is to integrate authentication + PostgreSQL + JWT + Google Sign-In into my existing Multimodal AI application in a clean, secure, scalable architecture. and it can handle 1000 user at a time 
