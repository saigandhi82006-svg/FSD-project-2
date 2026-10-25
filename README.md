# Alumni Network Directory — Full MERN Stack Application

> **Connect · Mentor · Grow**  
> A professional full-stack web platform connecting current college students with alumni for structured mentorship, placement preparation, career opportunities, internships, and campus networking. Designed for Indian colleges and universities.

---

## 1. Problem Statement & Objectives

In many higher education institutions across India (NITs, IITs, state engineering colleges, and universities), valuable alumni networks remain fragmented across disparate messaging groups, personal LinkedIn profiles, and ad-hoc spreadsheets. Current students frequently struggle to identify verified alumni in their dream companies, obtain guidance for placement preparation (DSA, technical interviews, resume reviews), or find genuine off-campus internship referrals.

### Core Objectives:
1. **Centralized Directory**: Provide an indexed, multi-faceted searchable registry of institutional graduates filtered by department, passing year, company, and location.
2. **Structured Mentorship**: Replace arbitrary messaging with a formal request-response workflow covering placement prep, mock interviews, higher studies, and GATE prep.
3. **Verified Career Board**: Enable alumni to post job openings and internships with institutional administrative moderation before public distribution.
4. **Campus Engagement**: Facilitate alumni homecoming meets, virtual webinars, and tech talks with registration controls and secure meeting links.
5. **Administrative Governance**: Equip college authorities with role-based moderation, alumni degree verification, and analytics charts.

---

## 2. User Roles & Capabilities

| Feature / Permission | Student | Alumni | Administrator |
| :--- | :---: | :---: | :---: |
| Search & Filter Alumni Directory | ✅ | ✅ | ✅ |
| View Public Alumni Profiles | ✅ | ✅ | ✅ |
| Send Mentorship Requests | ✅ | ❌ | ❌ |
| Accept / Decline Mentorship Requests | ❌ | ✅ | ✅ |
| Browse Approved Jobs & Internships | ✅ | ✅ | ✅ |
| Bookmark Career Opportunities | ✅ | ✅ | ✅ |
| Post New Job / Internship Openings | ❌ | ✅ (Pending Review) | ✅ (Direct Approved) |
| Register for Campus Events | ✅ | ✅ | ✅ |
| Create / Moderate College Events | ❌ | ✅ | ✅ |
| In-App Notification Stream | ✅ | ✅ | ✅ |
| Verify Alumni Profiles | ❌ | ❌ | ✅ |
| Moderate Job Postings | ❌ | ❌ | ✅ |
| Deactivate / Manage User Accounts | ❌ | ❌ | ✅ |
| Platform Analytics & Growth Charts | ❌ | ❌ | ✅ |

---

## 3. Technology Stack

### Frontend:
* **React.js 19**: Modern component hierarchy with functional components and hooks.
* **JavaScript (ES6+)**: Clean, modern ES module syntax throughout.
* **Vite 8**: Ultra-fast development server with HMR and optimized production bundling.
* **Tailwind CSS 4**: Custom styling aligned with the institution design system.
* **React Router DOM 7**: Declarative client routing with protected and role-restricted guards.
* **Axios**: Configured client with credentialed sessions, interceptors, and error shaping.
* **React Context API**: Global authentication, session persistence, and user authorization.
* **Lucide React**: Clean, accessible iconography.
* **Recharts 3**: Responsive SVG-based departmental and graduation analytics charts.
* **React Hot Toast**: Polished user feedback toasts for asynchronous operations.

### Backend:
* **Node.js (v24+) & Express.js 5**: Robust REST API architecture with separated routes, controllers, middleware, and models.
* **Mongoose ODM 9**: Schemas, compound indexes, references, and validation constraints.
* **JWT (JSON Web Tokens)**: Secure token generation stored in HttpOnly cookies and Bearer headers.
* **bcryptjs**: Salted cryptographic password hashing.
* **Multer**: Controlled image upload handling with mime-type checking and 5MB size limits.
* **Helmet**: Essential HTTP security headers.
* **express-rate-limit**: Abuse prevention on authentication endpoints.

### Database:
* **MongoDB**: Document database with MongoDB Atlas support for production hosting.

---

## 4. Design System & Visual Identity

The platform adheres to an executive EdTech design specification:
* **Primary Navy**: `#173B6C`
* **Primary Blue**: `#2563EB`
* **Accent Saffron**: `#F59E0B`
* **Page Background**: `#F5F7FB`
* **Card Surfaces**: `#FFFFFF`
* **Main Text**: `#172033`
* **Secondary Text**: `#64748B`
* **Success**: `#16A34A`
* **Error**: `#DC2626`

---

## 5. Application Architecture & Directory Structure

```
Empty2Earn/
├── api/
│   └── index.js                 # Unified Vercel serverless / Vite dev handler
├── public/
│   ├── favicon.svg              # Platform icon
│   └── uploads/                 # Local directory for uploaded user avatars
├── server/
│   ├── app.js                   # Express application setup & middleware pipeline
│   ├── server.js                # Standalone HTTP server listener (Render/Local)
│   ├── config/
│   │   └── db.js                # MongoDB connection logic & diagnostics
│   ├── controllers/
│   │   ├── adminController.js   # Analytics, alumni verification, moderation
│   │   ├── alumniController.js  # Directory search, faceted filters, sorting
│   │   ├── authController.js    # Register, login, logout, me, change password
│   │   ├── contactController.js # Public inquiry handling & persistence
│   │   ├── eventController.js   # Event lifecycle & attendee registration
│   │   ├── jobController.js     # Opportunity feed, posting, bookmarking
│   │   ├── mentorshipController.js # Mentorship request workflow
│   │   ├── notificationController.js # Persistent in-app notifications
│   │   └── userController.js    # Profile management and avatar upload
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication & session validator
│   │   ├── errorHandler.js      # Centralized error formatter
│   │   ├── rateLimiter.js       # Rate limiting security
│   │   ├── roles.js             # Role-Based Access Control (RBAC)
│   │   └── upload.js            # Multer avatar upload middleware
│   ├── models/
│   │   ├── Bookmark.js          # Saved opportunities schema
│   │   ├── ContactMessage.js    # Inquiries schema
│   │   ├── Event.js             # Campus & virtual events schema
│   │   ├── EventRegistration.js # Unique event attendee mapping
│   │   ├── Job.js               # Career opportunity schema
│   │   ├── MentorshipRequest.js # Student-Alumnus request schema
│   │   ├── Notification.js      # In-app notifications schema
│   │   ├── User.js              # User schema with RBAC and academic fields
│   │   └── index.js             # Models export hub
│   └── services/
│       └── seedService.js       # Comprehensive development seed data
├── src/
│   ├── api/
│   │   └── client.js            # Configured Axios client with interceptors
│   ├── components/
│   │   ├── AlumniCard.jsx       # Alumni directory card
│   │   ├── DemoCredentialsBanner.jsx # 1-click test fill for demo accounts
│   │   ├── EmptyState.jsx       # Reusable empty state view
│   │   ├── EventCard.jsx        # Event card with meeting unlock
│   │   ├── Footer.jsx           # Platform footer
│   │   ├── JobCard.jsx          # Opportunity card with bookmarking
│   │   ├── LoadingSkeleton.jsx  # Shimmer skeleton loader
│   │   ├── MentorshipModal.jsx  # Structured mentorship request modal
│   │   ├── Navbar.jsx           # Global responsive navigation header
│   │   ├── ProtectedRoute.jsx   # Route guard for authenticated users
│   │   ├── RoleRoute.jsx        # Route guard checking permitted roles
│   │   ├── Sidebar.jsx          # Responsive dashboard navigation drawer
│   │   └── StatCard.jsx         # Metric card with icons
│   ├── context/
│   │   └── AuthContext.jsx      # React Context for auth state & persistence
│   ├── pages/
│   │   ├── AboutPage.jsx        # Mission, roles, and architecture
│   │   ├── AdminDashboard.jsx   # Recharts analytics, verification queue
│   │   ├── AlumniDashboard.jsx  # Incoming requests, job postings
│   │   ├── AlumniDirectoryPage.jsx # Multi-filter searchable directory
│   │   ├── AlumniProfilePage.jsx# Detailed career & mentorship profile
│   │   ├── ContactPage.jsx      # Contact form with backend validation
│   │   ├── EventsPage.jsx       # College events board & registration
│   │   ├── JobsPage.jsx         # Careers & internships board
│   │   ├── LandingPage.jsx      # Public landing page with live dynamic feeds
│   │   ├── LoginPage.jsx        # Login page with demo switcher
│   │   ├── MentorshipPage.jsx   # Sent & received requests manager
│   │   ├── NotFoundPage.jsx     # 404 handler
│   │   ├── RegisterPage.jsx     # 3-step registration wizard
│   │   ├── SettingsPage.jsx     # Profile edit, avatar upload, password reset
│   │   └── StudentDashboard.jsx # Personalized student hub
│   ├── App.jsx                  # Main routing tree
│   ├── index.css                # Tailwind design system configuration
│   └── main.jsx                 # React root bootstrap
├── tests/
│   ├── auth_and_rbac.test.js    # Password hashing, JWT, and RBAC tests
│   └── business_logic.test.js   # Mentorship, capacity, and role rules tests
├── .env.example                 # Environment variables specification
├── index.html                   # HTML entry point with Inter font
├── package.json                 # Dependencies and scripts
├── vercel.json                  # Vercel deployment & rewrite configuration
└── vite.config.js               # Vite config with integrated dev API handler
```

---

## 6. Installation & Setup Instructions

### Prerequisites:
* **Node.js**: v18.0.0 or higher (v20+ / v24+ recommended)
* **npm**: v9.0.0 or higher
* **MongoDB**: A free MongoDB Atlas cluster URL or local MongoDB instance

### Step 1: Clone and Install Dependencies
```powershell
# Open terminal in project root
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```powershell
Copy-Item .env.example .env
```
Open `.env` and set your credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/alumni_directory?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
ADMIN_SEED_PASSWORD=Admin@123456
VITE_API_BASE_URL=/api
```

> **Note on MongoDB Atlas Setup:**
> 1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
> 2. Under **Database Access**, create a user (e.g. `alumni_admin`) with password.
> 3. Under **Network Access**, add IP Address `0.0.0.0/0` (allow access from anywhere).
> 4. Click **Connect** > **Drivers** > copy connection string into `MONGODB_URI`.

---

## 7. Running the Application

### Option A: Full-Stack Dev Mode (Recommended)
Run the Vite development server. It automatically mounts both the React frontend and Express backend handlers via Vite dev middleware:
```powershell
npm run dev
```
Open `http://localhost:5173` in your browser.

### Option B: Standalone Node/Express Server
To run the dedicated backend server on port 5000:
```powershell
npm run server
```

---

## 8. Database Seed Script & Demo Credentials

To seed your MongoDB database with realistic Indian college alumni (Microsoft, Google, Meta, TCS, Infosys), students, verified jobs, events, and mentorship requests:

```powershell
npm run seed
```

### Safe Sample Demo Credentials:
The login page features a **1-Click Quick Demo Account Switcher** for instantaneous evaluation:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@college.edu` | `Admin@123456` | Dean of Alumni Affairs (Full Moderation & Verification Access) |
| **Alumni** | `priya.sharma@microsoft.com` | `Alumni@123` | Software Engineer at Microsoft, Bengaluru (Mentorship Open) |
| **Student** | `rohan.student@college.edu` | `Student@123` | 3rd Year B.Tech CSE (Active Placement Mentee) |

---

## 9. Running Automated Tests

Run the backend test suite:
```powershell
npm test
```
**Tests Covered:**
* Password hashing with bcrypt salt rounds
* JWT token signing, verification, and tamper detection
* RBAC route middleware (`restrictTo('ADMIN')` blocks students with HTTP 403)
* Unauthenticated request interception (HTTP 401)
* Privilege escalation prevention (public registration cannot create `ADMIN`)
* Mentorship business rules (prohibits self-request, prevents duplicate pending requests)
* Event registration capacity limits and deadline expiry enforcement

---

## 10. REST API Specification

### Authentication & Account:
* `POST /api/auth/register` — Student or alumni registration
* `POST /api/auth/login` — Sign in and issue JWT cookie/token
* `POST /api/auth/logout` — Clear session cookie
* `GET  /api/auth/me` — Retrieve active session profile
* `POST /api/auth/change-password` — Change password with current password verification

### Alumni Directory:
* `GET  /api/alumni` — Paginated directory with search (name, company, skill), filters (department, batch, city, mentorship), and sorting
* `GET  /api/alumni/:id` — Alumnus profile details with career journey and posted jobs

### Mentorship Workflow:
* `POST  /api/mentorship` — Submit mentorship request to an alumnus
* `GET   /api/mentorship/sent` — Student's sent mentorship requests
* `GET   /api/mentorship/received` — Alumnus's incoming requests
* `PATCH /api/mentorship/:id/status` — Alumnus accepts or declines request
* `PATCH /api/mentorship/:id/cancel` — Student cancels pending request

### Jobs & Internships:
* `GET    /api/jobs` — Browse approved opportunities with filter & search
* `GET    /api/jobs/:id` — Opportunity detail view
* `POST   /api/jobs` — Post opportunity (Alumni: pending; Admin: approved)
* `PATCH  /api/jobs/:id` — Update job post (Owner / Admin)
* `DELETE /api/jobs/:id` — Remove job post
* `GET    /api/jobs/me` — Alumnus's posted jobs
* `POST   /api/jobs/:id/bookmark` — Toggle save job to bookmarks
* `GET    /api/jobs/saved` — List saved opportunities

### College Events:
* `GET    /api/events` — Upcoming & past events list
* `GET    /api/events/:id` — Event details (reveals meeting URL if registered)
* `POST   /api/events` — Create event (Alumni / Admin)
* `PATCH  /api/events/:id` — Update event
* `DELETE /api/events/:id` — Delete event
* `POST   /api/events/:id/register` — Register for event (enforces deadline & capacity)
* `DELETE /api/events/:id/register` — Cancel registration
* `GET    /api/events/me/registrations` — User registered events

### Notifications:
* `GET   /api/notifications` — Notification stream with unread count
* `PATCH /api/notifications/:id/read` — Mark notification as read
* `PATCH /api/notifications/read-all` — Mark all notifications as read

### Admin Governance (Restricted to `ADMIN`):
* `GET   /api/admin/dashboard` — Platform overview counts & distribution charts
* `GET   /api/admin/users` — User management with search and role filters
* `PATCH /api/admin/users/:id/status` — Deactivate / activate user account
* `PATCH /api/admin/alumni/:id/verification` — Verify or reject alumni profile
* `PATCH /api/admin/jobs/:id/moderation` — Approve or reject submitted job posts
* `GET   /api/admin/contact-messages` — View public contact inquiries
* `PATCH /api/admin/contact-messages/:id` — Update inquiry status

---

## 11. Production Build & Deployment

### Production Build:
```powershell
npm run build
```
Generates production assets in `dist/`.

### Deploying to Vercel (Frontend & Serverless API):
1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. The included `vercel.json` automatically routes `/api/*` to `api/index.js` and all other routes to `dist/index.html` for single-page React Router execution.
4. Set Environment Variables in Vercel Project Settings:
   * `MONGODB_URI`
   * `JWT_SECRET`
   * `NODE_ENV=production`

### Deploying to Render (Standalone Express Web Service):
1. Create a new **Web Service** on [Render](https://render.com).
2. Set Build Command: `npm install && npm run build`
3. Set Start Command: `npm start`
4. Configure Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `PORT=10000`, `NODE_ENV=production`.

---

## 12. Troubleshooting & FAQ

* **MongoDB Connection Warning**:  
  Ensure `MONGODB_URI` is populated in your `.env` file. If using Atlas, ensure that your IP is whitelisted (`0.0.0.0/0`) in Atlas Network Access.
* **CORS Errors in Production**:  
  Verify `FRONTEND_URL` in backend environment matches your deployed frontend domain (e.g. `https://your-app.vercel.app`).
* **Avatar Uploads on Ephemeral Platforms**:  
  Local disk storage in `public/uploads` is ideal for development. For permanent cloud storage on ephemeral serverless platforms (Vercel/Render free tiers), connect AWS S3 or Cloudinary.

---

## 13. License & Academic Attribution
Developed as a Full Stack Development (FSD) Capstone Project for Indian Colleges & Universities. Open source for academic learning.
