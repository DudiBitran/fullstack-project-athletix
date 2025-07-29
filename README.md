# AthletiX - Fullstack Fitness Platform

A comprehensive fitness platform that connects trainers with clients, providing workout programs, exercise management, and progress tracking.

## Table of Contents
- [Project Overview](#project-overview)
- [Backend Documentation](#backend-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)

## Project Overview

AthletiX is a fullstack fitness platform built with Node.js/Express backend and React frontend. The platform supports three user roles:
- **Admin**: Platform management, user oversight, content moderation
- **Trainer**: Program creation, client management, exercise library
- **User**: Workout tracking, progress monitoring, trainer assignment

## Backend Documentation

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Joi
- **Logging**: Custom file logger

### Project Structure
```
backend/
├── app.js                 # Main application entry point
├── middleware/            # Custom middleware
│   ├── auth.js           # JWT authentication
│   ├── role.js           # Role-based access control
│   ├── fileUpload.js     # File upload handling
│   └── imageUpload.js    # Image upload middleware
├── model/                # Database models
│   ├── user.js           # User model
│   ├── trainer.js        # Trainer profile model
│   ├── program.js        # Workout program model
│   ├── exercise.js       # Exercise model
│   ├── workoutStatus.js  # Workout tracking model
│   └── trainerDeleteRequest.js # Delete request model
├── routes/               # API routes
│   ├── auth/             # Authentication routes
│   ├── admin/            # Admin management routes
│   ├── trainer/          # Trainer-specific routes
│   ├── user/             # User-specific routes
│   ├── exercise/         # Exercise management
│   ├── program/          # Program management
│   └── workoutStatus/    # Workout tracking
├── utils/                # Utility functions
│   └── mailer.js         # Email service
└── fileLogger/           # Logging system
```

### API Endpoints

#### Authentication Routes (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile
- `PUT /auth/change-password` - Change password
- `POST /auth/upload-image` - Upload profile image
- `DELETE /auth/remove-image` - Remove profile image

#### Admin Routes (`/users/admin`)

**User Management:**
- `GET /users/admin/get-all-users` - Get all users
- `GET /users/admin/trainers` - Get all trainers
- `PUT /users/admin/:id` - Update user details
- `DELETE /users/admin/:id` - Delete user (regular users only)

**Trainer Management:**
- `POST /users/admin/trainer` - Create new trainer
- `DELETE /users/admin/trainer-direct/:id` - Delete trainer directly (without delete request)
- `DELETE /users/admin/trainer/:id` - Handle trainer delete requests (approve/reject)
- `GET /users/admin/trainer-delete-requests` - Get all delete requests

**Content Management:**
- `GET /admin/program` - Get all programs
- `PUT /admin/program/:id` - Update program
- `GET /exercise/` - Get all exercises
- `PUT /exercise/:id` - Update exercise

#### Trainer Routes (`/users/trainers`)

**Client Management:**
- `GET /users/trainers/me/clients` - Get assigned clients
- `GET /users/trainers/available-clients` - Get available clients
- `POST /users/trainers/:id/assign` - Assign client to trainer
- `DELETE /users/trainers/:id/unassign` - Unassign client from trainer

**Account Management:**
- `POST /users/trainers/me/delete-request` - Request account deletion

#### User Routes (`/users`)

**Program Management:**
- `GET /users/me/programs` - Get assigned programs
- `GET /users/me/programs/:id` - Get specific program details

**Progress Tracking:**
- `GET /users/me/workout-statuses` - Get workout statuses
- `POST /users/me/workout-status` - Mark workout status
- `GET /users/me/analytics/progress` - Get progress analytics
- `GET /users/me/analytics/all-time` - Get all-time progress
- `GET /users/me/analytics/weekly` - Get weekly activity

#### Program Routes (`/program`)

**Program Management:**
- `POST /program` - Create new program
- `GET /program/me` - Get trainer's programs
- `GET /program/:id` - Get program details
- `PUT /program/:id` - Update program
- `DELETE /program/:id` - Delete program

**Client Assignment:**
- `POST /program/:id/assign/:userId` - Assign client to program
- `DELETE /program/:id/unassign/:userId` - Unassign client from program

**Exercise Management:**
- `POST /program/:id/day/:day/exercises` - Add exercises to day
- `DELETE /program/:id/day/:day/exercises` - Remove exercises from day

#### Exercise Routes (`/exercise`)

**Exercise Management:**
- `POST /exercise` - Create new exercise
- `GET /exercise/me` - Get trainer's exercises
- `GET /exercise/:id` - Get exercise details
- `PUT /exercise/:id` - Update exercise
- `DELETE /exercise/:id` - Delete exercise

#### Workout Status Routes (`/workout-status`)

**Status Management:**
- `GET /workout-status/me` - Get user's workout statuses
- `POST /workout-status` - Create workout status
- `PUT /workout-status/:id` - Update workout status

### Database Models

#### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['admin', 'trainer', 'user']),
  image: String,
  assignedTrainerId: ObjectId (ref: 'User'),
  programs: [ObjectId] (ref: 'Program'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Trainer Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  specialization: String,
  experience: Number,
  bio: String,
  clients: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Program Model
```javascript
{
  name: String,
  description: String,
  trainer: ObjectId (ref: 'User'),
  days: {
    monday: [ObjectId] (ref: 'Exercise'),
    tuesday: [ObjectId] (ref: 'Exercise'),
    // ... other days
  },
  assignedUsers: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Exercise Model
```javascript
{
  name: String,
  description: String,
  muscleGroup: String,
  difficulty: String,
  instructions: String,
  image: String,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

#### WorkoutStatus Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  programId: ObjectId (ref: 'Program'),
  date: Date,
  completed: Boolean,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Middleware

#### Authentication Middleware (`auth.js`)
- Validates JWT tokens
- Attaches user to request object
- Handles token expiration

#### Role Middleware (`role.js`)
- Enforces role-based access control
- Supports multiple roles per route
- Validates user permissions

#### File Upload Middleware
- Handles image uploads
- Validates file types and sizes
- Stores files in designated directories

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Joi
- File upload security
- CORS configuration
- Rate limiting (configurable)

---

## Frontend Documentation

### Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Custom CSS with responsive design
- **Form Handling**: Formik with Joi validation
- **File Upload**: React Dropzone
- **Icons**: React Icons
- **Carousel**: React Slick

### Project Structure
```
frontend/
├── public/               # Static assets
│   ├── images/          # Image assets
│   └── AthletiX-Logo.png
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Shared components
│   │   ├── navbar.jsx   # Navigation component
│   │   └── footer.jsx   # Footer component
│   ├── context/         # React contexts
│   │   ├── auth.context.jsx
│   │   └── trainerSearchFilter.context.jsx
│   ├── pages/           # Page components
│   │   ├── adminDashboard/  # Admin pages
│   │   ├── trainerDashboard/ # Trainer pages
│   │   ├── userDashboard/   # User pages
│   │   └── auth/        # Authentication pages
│   ├── services/        # API services
│   │   ├── httpService.js
│   │   ├── userService.js
│   │   ├── trainerService.js
│   │   └── adminService.js
│   ├── style/           # CSS stylesheets
│   │   ├── adminDash/   # Admin styles
│   │   ├── trainerDash/ # Trainer styles
│   │   └── userDashboard/ # User styles
│   ├── App.jsx          # Main app component
│   └── main.jsx         # App entry point
└── vite.config.js       # Vite configuration
```

### Key Components

#### Authentication Components
- **Login Form**: User authentication with validation
- **Register Form**: User registration with role selection
- **Forgot Password**: Password reset functionality
- **Reset Password**: New password setup

#### Admin Dashboard Components
- **AdminPanel**: Main admin interface
- **AllUsersTable**: User management with search/filter
- **AllPrograms**: Program oversight
- **AllExercises**: Exercise library management
- **CreateTrainer**: Trainer account creation
- **TrainerDeleteRequests**: Delete request management
- **UserDetails**: Detailed user information
- **EditUser**: User profile editing

#### Trainer Dashboard Components
- **MyPrograms**: Program management interface
- **CreateProgram**: Program creation wizard
- **MyExercises**: Exercise library
- **CreateExercise**: Exercise creation
- **MyClients**: Client management
- **AvailableClients**: Client assignment
- **ClientAnalytics**: Client progress tracking
- **ProgramView**: Program details and editing

#### User Dashboard Components
- **MyProgram**: Assigned program display
- **UserProgramDetails**: Detailed program view
- **UserProfileSettings**: Profile management
- **Progress Tracking**: Workout status management

#### Common Components
- **ConfirmationModal**: Reusable confirmation dialogs
- **ExerciseCard**: Exercise display component
- **ProgramCard**: Program display component
- **ImageUploader**: File upload component
- **Input**: Reusable form inputs
- **Logo**: Brand logo component

### Services Layer

#### HTTP Service (`httpService.js`)
- Axios configuration
- Request/response interceptors
- JWT token management
- Error handling

#### User Service (`userService.js`)
- Authentication operations
- Profile management
- Password operations
- Progress tracking

#### Trainer Service (`trainerService.js`)
- Program management
- Exercise management
- Client management
- Analytics

#### Admin Service (`adminService.js`)
- User management
- Content oversight
- Trainer operations
- System administration

### State Management

#### Auth Context (`auth.context.jsx`)
- User authentication state
- Token management
- Role-based access
- Service integration

#### Trainer Search Filter Context
- Client search functionality
- Filter state management

### Styling System

#### CSS Architecture
- Component-specific stylesheets
- Responsive design
- CSS custom properties for theming
- Modular structure

#### Key Style Categories
- **Admin Dashboard**: Professional admin interface
- **Trainer Dashboard**: Functional trainer tools
- **User Dashboard**: Clean user experience
- **Authentication**: Modern auth forms
- **Common**: Shared components and utilities

### Features by User Role

#### Admin Features
- **User Management**: View, edit, delete users
- **Trainer Management**: Create, manage, delete trainers
- **Content Oversight**: Monitor programs and exercises
- **Delete Requests**: Handle trainer deletion requests
- **System Analytics**: Platform usage insights

#### Trainer Features
- **Program Creation**: Build custom workout programs
- **Exercise Library**: Create and manage exercises
- **Client Management**: Assign and manage clients
- **Progress Tracking**: Monitor client progress
- **Analytics**: Client performance insights

#### User Features
- **Program Access**: View assigned programs
- **Workout Tracking**: Mark workout completion
- **Progress Monitoring**: Track fitness progress
- **Profile Management**: Update personal information
- **Analytics**: Personal fitness insights

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Flexible layouts
- Touch-friendly interfaces

### Performance Optimizations
- Code splitting with React Router
- Lazy loading of components
- Optimized image handling
- Efficient state management
- Minimal re-renders

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with required environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `config.json` with API configuration:
   ```json
   {
     "apiUrl": "http://localhost:3000"
   }
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup
1. Ensure MongoDB is running
2. Create database named `athletix`
3. Collections will be created automatically

## Features

### Core Features
- **Multi-role Authentication**: Admin, Trainer, User roles
- **Program Management**: Create and manage workout programs
- **Exercise Library**: Comprehensive exercise database
- **Client Assignment**: Trainer-client relationships
- **Progress Tracking**: Workout completion and analytics
- **File Upload**: Profile images and exercise images
- **Email Notifications**: Password reset and account updates

### Advanced Features
- **Real-time Analytics**: Progress tracking and insights
- **Role-based Access Control**: Secure permission system
- **Responsive Design**: Mobile and desktop optimization
- **Search and Filter**: Advanced data filtering
- **Pagination**: Efficient data loading
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Multer**: File upload handling
- **Nodemailer**: Email service
- **Joi**: Data validation
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Formik**: Form management
- **React Icons**: Icon library
- **React Dropzone**: File upload
- **CSS3**: Styling
- **Responsive Design**: Mobile-first approach

### Development Tools
- **ESLint**: Code linting
- **Git**: Version control
- **npm**: Package management
- **Postman/Insomnia**: API testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository. 