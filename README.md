# Cafe's Little Helper (CLH) - UniSZA e-Job Platform

## Complete System Documentation

A comprehensive campus-specific part-time job matching platform connecting Universiti Sultan Zainal Abidin (UniSZA) students with local employers (cafes, canteens, restaurants) for part-time employment opportunities.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Feature Specifications](#feature-specifications)
4. [Detailed Workflows](#detailed-workflows)
5. [Data Models](#data-models)
6. [Page & Component Documentation](#page--component-documentation)
7. [Technical Architecture](#technical-architecture)
8. [Setup & Deployment](#setup--deployment)
9. [API Reference](#api-reference)

---

## System Overview

### Purpose

CLH addresses the gap between campus employers and students seeking part-time income by providing a centralized platform that streamlines the recruitment process for part-time positions within the university campus vicinity. The platform serves as a bridge connecting three main user groups: students looking for flexible work opportunities, local businesses seeking reliable part-time workers, and administrators who oversee platform operations.

The system is designed with a mobile-first approach, recognizing that university students primarily access services through their smartphones. This design philosophy ensures that all core functionalities are fully accessible and optimized for mobile devices, with a responsive layout that adapts to larger screens for desktop users.

### Core Objectives

The platform aims to achieve several key objectives that contribute to its overall value proposition. First, it provides students with easy access to legitimate part-time job opportunities within their campus vicinity, reducing the time and effort required to find suitable employment. Second, it offers employers a streamlined process for posting job vacancies, reviewing applications, and managing their part-time workforce. Third, it creates a transparent and accountable system where both parties can build reputations through ratings and reviews.

The offline-first architecture ensures that users can access critical information even without an active internet connection, which is particularly important in areas of the campus with intermittent connectivity. This approach also improves the overall user experience by reducing load times and providing a more responsive interface.

---

## User Roles & Permissions

### Role Hierarchy

The system implements a role-based access control (RBAC) model with five distinct user roles, each serving a specific purpose within the platform ecosystem. Understanding these roles is essential for comprehending how the system operates and how different users interact with its features.

#### 1. OWNER (System Owner)

The OWNER role represents the highest level of access within the system, reserved for the primary administrator or development team lead. This role has complete control over all aspects of the platform, including user management, system configuration, data operations, and content oversight.

**Capabilities:**
- Full CRUD (Create, Read, Update, Delete) access to all users
- Database backup and restore operations
- Batch user import for bulk user creation
- System-wide configuration changes
- Access to all admin features including User DB management
- View all analytics and metrics across the platform

**Typical Use Cases:**
- Initial system setup and configuration
- Managing administrative accounts
- Performing system-wide data operations
- Emergency data recovery and backup operations

#### 2. ADMIN (Administrator)

The ADMIN role is designed for day-to-day system management operations. While having broad access to system features, this role does not have the ability to create or modify other administrative accounts or access the User DB section reserved for OWNER.

**Capabilities:**
- View and manage all users on the platform
- Monitor system metrics and analytics
- Perform backup operations
- Access content management features
- View academic project documentation
- Monitor platform health and performance

**Typical Use Cases:**
- Daily platform monitoring
- User support and issue resolution
- Generating system reports
- Overseeing platform operations

#### 3. EMPLOYER (Business Owner)

The EMPLOYER role represents the business side of the platform, consisting of cafe owners, restaurant managers, and other local employers who need part-time workers. This role provides access to job posting, applicant management, and rating features.

**Capabilities:**
- Create, edit, and manage job postings
- View and search student profiles (Talent Search)
- Review and respond to job applications
- Rate students after job completion
- Manage company profile and business information
- Direct communication via WhatsApp integration
- View job performance metrics

**Typical Use Cases:**
- Posting new job opportunities
- Reviewing student applications
- Managing hired workers
- Building reputation through ratings

#### 4. JOB_SEEKER (Student)

The JOB_SEEKER role represents students seeking part-time employment opportunities. This is the most numerous user group on the platform and the primary consumer of job listing features.

**Capabilities:**
- Browse and search available jobs
- Apply for jobs with one-click process
- Manage profile including skills, bio, and experience
- Set and manage availability schedule
- Track application status
- Rate employers after job completion
- Update personal information

**Typical Use Cases:**
- Finding suitable part-time work
- Managing job applications
- Showcasing skills and experience
- Communicating availability to employers

#### 5. GUEST (Unauthenticated User)

The GUEST role represents unauthenticated visitors who have limited access to the platform. This role exists to provide a preview of the platform while protecting sensitive user data.

**Capabilities:**
- View landing page
- Access authentication pages (login/signup)
- View basic platform information

**Typical Use Cases:**
- Exploring platform features before registration
- Learning about the platform
- Initiating the signup process

### Role Comparison Matrix

| Feature | OWNER | ADMIN | EMPLOYER | JOB_SEEKER | GUEST |
|---------|-------|-------|----------|------------|-------|
| User Management | Full | Limited | None | Own Profile | None |
| Job Posting | None | None | Full | Apply Only | None |
| View All Jobs | Yes | Yes | Yes | Yes | No |
| Apply to Jobs | No | No | No | Yes | No |
| Talent Search | No | Directory | Full | No | No |
| Ratings | View All | View All | Rate Students | Rate Employers | No |
| Backup/Restore | Full | Backup | None | None | None |
| Analytics | Full | Full | Own Jobs | Own Apps | None |

---

## Feature Specifications

### Student (Job Seeker) Features

#### Browse & Search Jobs

The job browsing feature provides students with multiple ways to discover relevant part-time opportunities. The system implements a sophisticated search and filtering mechanism that allows users to quickly find jobs matching their preferences, skills, and availability.

**Search Capabilities:**
- Full-text search across job titles, employer names, locations, and descriptions
- Real-time search suggestions based on recent searches and job content
- Search history tracking for quick access to previous queries
- Intelligent query parsing for natural language searches

**Filter Options:**
- Location filtering (Kantin FIK, Cafe Siswi, Kantin Baru, etc.)
- Job type categorization
- Salary range filtering
- Preferred gender requirements
- Availability matching based on student schedule

**View Modes:**
- Grid view for visual job comparison
- List view for quick scanning
- Sort by date, relevance, or payment rate
- Save favorite jobs for later

**Key Features:**
- Jobs display with key information at a glance (title, employer, payment, location)
- Visual indicators for application status
- Quick apply functionality without leaving the job list
- Job detail modal with full information

#### Apply for Jobs

The application process is designed to be frictionless while ensuring all necessary information is collected. The system implements a confirmation workflow to prevent accidental applications.

**Application Workflow:**
1. Student clicks on a job to view details
2. Job detail modal displays full job information
3. Student clicks "Apply Now" button
4. Confirmation modal appears with job summary
5. Student confirms the application
6. System creates application record with PENDING status
7. Success notification displayed
8. Job card updates to show "Applied" status

**Application Tracking:**
- Real-time status updates
- Status badges (Pending, Approved, Rejected, Completed)
- Application history with all past applications
- Ability to view employer profile from application

#### Availability Calendar

The availability calendar is a core feature that helps students communicate their work availability to potential employers. This feature is essential for employers when reviewing applications and scheduling workers.

**Calendar Features:**
- Interactive 7-day × 14-hour grid (6 AM - 8 PM)
- Drag-to-select functionality for quick availability setting
- Three availability states:
  - **Available (Green)** - Ready to work
  - **Maybe (Amber)** - Potentially available
  - **Busy (Red)** - Not available
- Auto-save functionality
- Visual legend for easy understanding
- Weekly view with clear day/hour organization

**Availability Status:**
- Profile-level status toggle (Available/Hidden)
- Quick toggle from dashboard home
- Visual indicators on student profile cards
- Color-coded display in employer views

#### Profile Management

Students can build comprehensive profiles that showcase their qualifications to potential employers. The profile serves as a resume within the platform.

**Profile Components:**
- **Personal Information**: Name, contact details, email
- **Academic Information**: Major, year of study, gender
- **Skills**: Tag-based skill selection with custom options
- **Bio**: Brief professional description
- **Experience**: Detailed work experience section
- **Availability Status**: Current work availability state

**Profile Features:**
- Photo upload or auto-generated avatar
- Skills showcase with visual tags
- Experience display with formatting
- Rating summary (average rating, total reviews)
- Quick edit functionality

#### Application Tracking

The application tracking system provides students with visibility into their job applications and their outcomes.

**Tracking Features:**
- Status-based organization (Pending, Approved, Rejected, Completed)
- Visual status badges with color coding
- Timestamps for all application events
- Employer information display
- Job details integration

#### Rating System

After completing jobs, students can rate their employers, contributing to the platform's reputation system.

**Rating Features:**
- 5-star rating system
- Optional written feedback
- One-time rating submission per completed job
- Cumulative rating calculation
- Employer profile rating display

### Employer Features

#### Post Job Vacancies

The job posting feature allows employers to create detailed job listings that attract suitable candidates.

**Job Creation Fields:**
- Job Title
- Job Description (detailed responsibilities)
- Location
- Payment Information (rate/hour)
- Schedule/Working Hours
- Preferred Gender
- Requirements (bullet points)
- Contact WhatsApp number

**Job Management:**
- Create new job postings
- Edit existing job postings
- Close or archive jobs
- View job performance metrics
- Duplicate existing jobs

#### Manage Applicants

The applicant management system provides employers with tools to review and respond to student applications.

**Application Review:**
- View all applications for each job
- Filter by application status
- Click to view student full profile
- View student availability calendar
- See student's skills and experience

**Actions:**
- Approve applications (changes status to APPROVED)
- Reject applications (changes status to REJECTED)
- Contact students via WhatsApp
- View student job history
- Rate students after job completion

#### Talent Search

The talent search feature allows employers to browse and discover students based on various criteria.

**Search Capabilities:**
- Search by name, skills, or major
- Filter by skill categories
- Filter by availability status
- Filter by rating range
- View unlimited students (no pagination limit)

**Talent Cards:**
- Expandable card design
- Quick stats (skills count, jobs done, applications)
- Bio preview
- One-click profile view
- Direct WhatsApp contact

#### Company Profile

Employers can manage their business profile to attract quality applicants.

**Profile Components:**
- Company Name
- Business Type
- Bio/Description
- Location
- Average Rating display
- Total Ratings count

#### Rating System

Employers can rate students after job completion, contributing to the platform's reputation system.

**Rating Features:**
- 5-star rating with visual feedback
- Written feedback submission
- Rating visible on student profile
- Affects student's average rating

### Administrator Features

#### User Management

Administrators have comprehensive user management capabilities.

**User Operations:**
- View all users by role
- Search and filter users
- View user profiles
- Edit user information
- Deactivate/reactivate users
- Export user lists

#### System Analytics

The analytics dashboard provides insights into platform health and usage.

**Metrics Available:**
- Total users by role
- Active jobs count
- Application statistics
- Storage usage
- System health status
- Backup status

#### Database Backup

Backup features ensure data safety and enable recovery operations.

**Backup Operations:**
- Export backup to JSON file
- Import backup from file
- Paste content restore
- Confirmation prompts
- Automatic system reload

#### Content Management

Administrative content features support platform operations.

**Features:**
- Academic project documentation viewer
- UML diagram support (PlantUML)
- Chapter navigation (4 chapters)
- Bilingual content display

---

## Detailed Workflows

### Authentication Workflows

#### 1. User Registration (Signup) Workflow

The registration workflow guides new users through the process of creating an account on the platform. This workflow is optimized for both speed and data accuracy.

**Preconditions:**
- User is not authenticated (GUEST role)
- User has access to the signup page

**Workflow Steps:**

```
Step 1: Access Signup Page
    ↓
    User navigates to AuthPage.tsx and clicks "Sign Up" tab
    or directly accesses SignupPage.tsx
    ↓
    Step 2: Select Role
    ↓
    User selects either "Student" or "Employer" role
    (This selection determines available fields and signup flow)
    ↓
    Step 3: Enter Personal Information
    ↓
    User fills in required fields:
    - Username (unique, 3-20 characters)
    - Password (minimum 6 characters)
    - First Name
    - Last Name
    - Phone Number (with country code)
    - Email (optional, for password recovery)
    ↓
    Step 4: Role-Specific Information
    ↓
    IF Student:
        - Major (from dropdown or custom entry)
        - Year of Study (1-5)
        - Gender (Male/Female)
        - Skills selection
    ↓
    IF Employer:
        - Company Name
        - Business Type
        - Company Bio
    ↓
    Step 5: Form Validation
    ↓
    System validates all inputs:
    - Username uniqueness check
    - Email format validation
    - Password strength requirements
    - Required field completion
    ↓
    Step 6: Create Account
    ↓
    System creates new user record:
    - Generates unique user ID
    - Hashes password
    - Sets role-based profile fields
    - Stores in localStorage
    ↓
    Step 7: Auto-Login
    ↓
    System automatically logs user in:
    - Creates session in localStorage
    - Stores current user reference
    - Sets language preference (default: English)
    ↓
    Step 8: WhatsApp Notification (Students Only)
    ↓
    System sends notification to admin via WhatsApp:
    - Message format: "New student registered: [Name] - [Major]"
    - Sent to configured admin WhatsApp number
    ↓
    Step 9: Redirect to Dashboard
    ↓
    User redirected to appropriate dashboard:
    - Students → JobSeekerDashboard
    - Employers → EmployerDashboard
    ↓
    Step 10: Welcome Toast
    ↓
    System displays success notification:
    - "Welcome to CLH!"
    - Initial profile setup prompts if incomplete
```

**Alternative Flows:**
- If validation fails, display specific error messages
- If username exists, suggest alternatives
- If signup fails, show error and allow retry

**Postconditions:**
- User is authenticated with appropriate role
- User session stored in localStorage
- Profile may be incomplete (marked for setup)

---

#### 2. User Login Workflow

The login workflow authenticates existing users and redirects them to their appropriate dashboard.

**Preconditions:**
- User has an existing account
- User is not currently authenticated

**Workflow Steps:**

```
Step 1: Access Login Page
    ↓
    User navigates to AuthPage.tsx or LoginPage.tsx
    System displays login form
    ↓
    Step 2: Enter Credentials
    ↓
    User fills in:
    - Username
    - Password
    (Optionally: "Remember me" checkbox)
    ↓
    Step 3: Form Submission
    ↓
    User clicks "Login" button
    System validates non-empty fields
    ↓
    Step 4: Credential Validation
    ↓
    System searches localStorage for matching user:
    - Finds user by username
    - Verifies password against stored hash
    ↓
    Step 5: Handle Success/Failure
    ↓
    IF credentials valid:
        → Step 6: Session Creation
    ELSE:
        → Step 7: Show Error
    ↓
    Step 6: Session Creation
    ↓
    System creates session:
    - Stores user object in currentUser state
    - Sets session timestamp
    - Loads user preferences (language, etc.)
    - Updates navigation state
    ↓
    Step 7: Dashboard Redirect
    ↓
    System routes based on role:
    - OWNER → AdminDashboard
    - ADMIN → AdminDashboard
    - EMPLOYER → EmployerDashboard
    - JOB_SEEKER → JobSeekerDashboard
    ↓
    Step 8: Display Success
    ↓
    System shows welcome message:
    - "Welcome back, [Name]!"
    - Updates navigation to authenticated state
```

**Error Handling:**
- Invalid username: "User not found"
- Invalid password: "Incorrect password"
- Account inactive: "Account is deactivated"
- Network error: "Connection failed, please try again"

---

#### 3. User Logout Workflow

The logout workflow ends the user session and returns the application to the unauthenticated state.

**Preconditions:**
- User is currently authenticated
- User has access to logout functionality

**Workflow Steps:**

```
Step 1: Initiate Logout
    ↓
    User clicks logout button (Profile Settings or Navbar)
    System confirms logout intent
    ↓
    Step 2: Clear Session
    ↓
    System performs cleanup:
    - Removes currentUser from state
    - Clears session storage
    - Resets application state
    ↓
    Step 3: Redirect to Landing
    ↓
    System redirects to LandingPage.tsx
    Navigation updates to show unauthenticated state
    ↓
    Step 4: Display Message
    ↓
    System shows logout confirmation:
    - "You have been logged out"
    - "Come back soon!"
```

---

### Job Management Workflows

#### 4. Post New Job Workflow

This workflow guides employers through the process of creating a new job posting.

**Preconditions:**
- User is authenticated as EMPLOYER
- User has business profile completed
- User is on EmployerDashboard → My Jobs tab

**Workflow Steps:**

```
Step 1: Open Job Form
    ↓
    User clicks "+ Tambah Kerja" button
    System displays job creation form
    ↓
    Step 2: Enter Job Details
    ↓
    User fills in job information:
    
    REQUIRED FIELDS:
    - Job Title (e.g., "Pembantu Kitchen", "Barista")
    - Job Description (detailed responsibilities and requirements)
    
    OPTIONAL FIELDS:
    - Location (e.g., "Kantin FIK", "Cafe Siswi")
    - Payment Info (e.g., "RM8/sejam", "RM50/day")
    - Schedule (e.g., "Isnin - Jumaat, 9AM - 5PM")
    - Requirements (comma-separated or list)
    - Contact WhatsApp
    ↓
    Step 3: Real-time Validation
    ↓
    System validates inputs as user types:
    - Title minimum length
    - Description minimum length
    - Required field indicators
    ↓
    Step 4: Submit Job
    ↓
    User clicks "Siarkan Sekarang" button
    System performs final validation
    ↓
    Step 5: Create Job Record
    ↓
    System generates job object:
    - Unique job ID (timestamp-based)
    - Sets employer ID and name
    - Defaults status to AVAILABLE
    - Sets createdAt timestamp
    - Stores in localStorage
    ↓
    Step 6: Update UI
    ↓
    System performs updates:
    - Closes job form
    - Refreshes job list
    - Displays new job in list
    - Updates job count statistics
    ↓
    Step 7: Success Notification
    ↓
    System shows success message:
    - "Job posted successfully!"
    - Toast notification with checkmark
```

**Postconditions:**
- Job is created and visible to students
- Job appears in employer job list
- Job is included in job search results

---

#### 5. Job Search & Discovery Workflow (Students)

This workflow describes how students find and discover job opportunities.

**Preconditions:**
- User is authenticated as JOB_SEEKER
- User is on JobSeekerDashboard → Find Jobs tab

**Workflow Steps:**

```
Step 1: Access Find Jobs Page
    ↓
    User navigates to Find Jobs tab
    System displays job search interface
    ↓
    Step 2: Search for Jobs
    ↓
    User can search by:
    - Typing in search bar
    - Clicking filter buttons
    - Selecting location chips
    
    Search examples:
    - "Barista" → finds jobs with "Barista" in title/description
    - "Kantin FIK" → filters by location
    - "Morning" → finds morning shift jobs
    ↓
    Step 3: Apply Filters
    ↓
    User can apply multiple filters:
    - Location filter (Kantin FIK, Cafe, Kantin Baru)
    - Salary range
    - Gender requirements
    
    Filters combine with AND logic
    ↓
    Step 4: Browse Results
    ↓
    System displays filtered jobs:
    - Grid view: visual cards with key info
    - List view: compact rows for quick scanning
    - Shows job count
    - Indicates if user has applied
    ↓
    Step 5: View Job Details
    ↓
    User clicks a job card
    System opens job detail modal:
    - Full job description
    - Requirements list
    - Schedule information
    - Contact details
    - Employer information
    ↓
    Step 6: Apply or Save
    ↓
    User actions:
    - "Mohon Sekarang" → Application Workflow
    - Job saved to favorites (if feature available)
    - Share job via WhatsApp
```

**Search Algorithm:**
1. Filter by status = AVAILABLE
2. Apply text search (title, employer, location, description)
3. Apply gender filter (if specified and user has gender set)
4. Apply advanced filters (location, job type, salary)
5. Sort by date (newest first)
6. Display results with applied status indicator

---

#### 6. Apply for Job Workflow

This workflow details the complete job application process from initiation to completion.

**Preconditions:**
- User is authenticated as JOB_SEEKER
- User has viewed job details
- User has not already applied to this job
- Job status is AVAILABLE

**Workflow Steps:**

```
Step 1: Initiate Application
    ↓
    User clicks "Mohon Sekarang" button on job card
    or "Apply" button in job detail modal
    ↓
    Step 2: Show Confirmation Modal
    ↓
    System displays confirmation dialog:
    - Shows job title and employer
    - Shows brief job summary
    - Confirms application intent
    - Displays "Apply" and "Cancel" buttons
    ↓
    Step 3: Confirm Application
    ↓
    User clicks "Apply" button
    System begins application creation
    ↓
    Step 4: Create Application Record
    ↓
    System generates application object:
    - Unique application ID
    - Links to job ID and student ID
    - Sets status to PENDING
    - Sets createdAt timestamp
    - Stores in localStorage
    ↓
    Step 5: Update Application List
    ↓
    System updates UI:
    - Job card updates to show "Dihantar" (Sent)
    - Application added to Applications tab
    - Application count updates
    ↓
    Step 6: Success Notification
    ↓
    System displays success toast:
    - "Application Sent Successfully!"
    - "Waiting for employer response"
    - Auto-hides after 3 seconds
    ↓
    Step 7: Employer Notification
    ↓
    Employer dashboard updates:
    - Pending applications count increases
    - New application appears in Applicants tab
    - Employer can now review application
```

**Application States:**
1. **PENDING** (Initial state) - Awaiting employer review
2. **APPROVED** - Employer accepted the application
3. **REJECTED** - Employer declined the application
4. **COMPLETED** - Job finished, both parties can rate

**Postconditions:**
- Application is recorded with PENDING status
- Job is marked as applied for this student
- Employer can now view and respond to application
- Student can track status in Applications tab

---

#### 7. Employer Review Application Workflow

This workflow describes how employers review and respond to student applications.

**Preconditions:**
- User is authenticated as EMPLOYER
- Job has at least one PENDING application
- User is on EmployerDashboard → Applicants tab or My Jobs tab

**Workflow Steps:**

```
Step 1: View Applications
    ↓
    User navigates to Applicants tab
    System displays all applications for user's jobs
    ↓
    Step 2: Select Application
    ↓
    User clicks on an application
    System highlights selected application
    ↓
    Step 3: View Student Profile
    ↓
    User clicks student name or avatar
    System opens StudentProfileDetail modal:
    - Personal information
    - Skills and experience
    - Availability calendar
    - Bio and description
    - Rating history
    - Previous job applications
    ↓
    Step 4: Evaluate Application
    ↓
    Employer reviews student:
    - Matches job requirements?
    - Available during work hours?
    - Has necessary skills?
    - Good rating history?
    ↓
    Step 5: Take Action
    ↓
    Employer clicks "Approve" or "Reject" button
    ↓
    Step 6: Process Decision
    ↓
    IF Approve:
        System updates application status to APPROVED
        Student receives notification (on next login)
        Job applicant count updates
        ↓
    IF Reject:
        System updates application status to REJECTED
        Student receives notification (on next login)
        Application moves to rejected section
    ↓
    Step 7: Display Result
    ↓
    System shows action confirmation:
    - "Application approved"
    - "Application rejected"
    - Toast notification
    - List updates to reflect change
```

**Employer Actions:**
- **Approve**: Accepts student for the position, status becomes APPROVED
- **Reject**: Declines the application, status becomes REJECTED
- **Contact**: Opens WhatsApp to message student directly
- **View Profile**: Opens full student profile for detailed review

---

#### 8. Complete Job & Rate Student Workflow

This workflow describes how employers mark jobs as complete and rate student workers.

**Preconditions:**
- User is authenticated as EMPLOYER
- Job has at least one APPROVED application
- Job is currently active (status = AVAILABLE)
- Work period has ended

**Workflow Steps:**

```
Step 1: Mark Job Complete
    ↓
    User clicks "Selesai" (Complete) button on job card
    System validates job can be completed:
    - Must have at least one APPROVED application
    - Application status must be APPROVED
    ↓
    Step 2: Verify Completion
    ↓
    IF job can be completed:
        System marks job as COMPLETED status
        ↓
    ELSE:
        System shows error:
        - "No approved applications found"
        - Cannot complete job without approved worker
    ↓
    Step 3: Rate Student
    ↓
    User clicks "Nilaikan" (Rate) button
    System opens RatingModal:
    - Shows student information
    - Displays 5-star rating selector
    - Provides feedback text area
    ↓
    Step 4: Submit Rating
    ↓
    User selects rating (1-5 stars)
    User optionally enters feedback
    User clicks "Submit" button
    ↓
    Step 5: Process Rating
    ↓
    System updates application:
    - Sets employerRating to selected value
    - Sets employerFeedback to feedback text
    - Sets ratedAt to current timestamp
    - Calculates student's new average rating
    ↓
    Step 6: Update Statistics
    ↓
    System recalculates student metrics:
    - Updates averageRating
    - Increments totalRatings
    - Updates job history
    ↓
    Step 7: Confirm Success
    ↓
    System displays confirmation:
    - "Rating submitted successfully"
    - Toast notification
    - Student profile updates with new rating
```

**Rating Impact:**
- Student average rating = (sum of all ratings) / (total ratings)
- Each new rating recalculates the average
- Higher ratings improve job prospects
- Low ratings may affect future applications

---

### Availability Management Workflows

#### 9. Set Availability Workflow

This workflow describes how students manage their weekly availability schedule.

**Preconditions:**
- User is authenticated as JOB_SEEKER
- User is on JobSeekerDashboard or Profile section
- User has access to Availability Calendar

**Workflow Steps:**

```
Step 1: Open Availability Calendar
    ↓
    User navigates to Availability section
    System displays interactive calendar:
    - 7 columns (Sunday - Saturday)
    - 14 rows (6 AM - 8 PM)
    - Current availability shown with colors
    ↓
    Step 2: Select Time Slots
    ↓
    User can select slots using:
    - Click on individual slot
    - Drag across multiple slots
    - Click and drag for range selection
    ↓
    Step 3: Set Slot Status
    ↓
    User clicks on selected slot to cycle through states:
    1. AVAILABLE (Green) - Ready to work
    2. MAYBE (Amber) - Potentially available
    3. BUSY (Red) - Not available
    4. EMPTY (Gray) - Clear selection
    ↓
    Step 4: Auto-Save
    ↓
    System auto-saves changes:
    - Updates user profile in localStorage
    - No explicit save button needed
    - Visual feedback on save
    ↓
    Step 5: Update Dashboard
    ↓
    System updates dashboard display:
    - Availability stats on home screen
    - Status indicator on profile cards
    - Color-coded schedule view
    ↓
    Step 6: Profile Status Toggle
    ↓
    User can also toggle overall status:
    - Available (green indicator)
    - Hidden (gray indicator, hides from searches)
    
    This is separate from schedule availability
```

**Availability Display to Employers:**
- Employers see green dots on student profile cards
- Full calendar available in student detail view
- Color-coded slots for quick assessment
- Stats summary (available hours, maybe hours, busy hours)

---

#### 10. View Student Availability Workflow (Employers)

This workflow describes how employers view student availability when reviewing applications.

**Preconditions:**
- User is authenticated as EMPLOYER
- User is viewing a student's profile
- Student has set their availability

**Workflow Steps:**

```
Step 1: Open Student Profile
    ↓
    User clicks on student in:
    - Applicants list
    - Talent search results
    - Application detail view
    ↓
    Step 2: Navigate to Availability Section
    ↓
    User clicks "Availability" tab in profile
    System displays weekly calendar
    ↓
    Step 3: Review Availability
    ↓
    User analyzes student schedule:
    - Green slots = Available for work
    - Amber slots = Maybe available
    - Red slots = Not available
    - Empty slots = Not set
    ↓
    Step 4: Check Stats
    ↓
    System displays summary:
    - Total available hours
    - Maybe hours count
    - Busy hours count
    - Color-coded stat cards
    ↓
    Step 5: Make Decision
    ↓
    Employer evaluates student:
    - Matches job schedule requirements?
    - Enough available hours?
    - Consistent availability?
    ↓
    Step 6: Take Action
    ↓
    Employer returns to application:
    - Approve if schedule compatible
    - Reject if schedule conflicts
    - Contact student to discuss
```

---

### Profile Management Workflows

#### 11. Update Profile Workflow

This workflow describes how users update their profile information.

**Preconditions:**
- User is authenticated
- User is on Profile Settings page

**Workflow Steps:**

```
Step 1: Open Profile Settings
    ↓
    User clicks Profile tab or Settings
    System displays ProfileSettings component
    ↓
    Step 2: Edit Personal Info
    ↓
    User can edit:
    - First Name
    - Last Name
    - Phone Number
    - Email
    - Avatar (upload or generate)
    ↓
    Step 3: Edit Role-Specific Info
    ↓
    IF Student:
        - Major
        - Year
        - Gender
        - Skills (add/remove)
        - Bio
        - Experience
    ↓
    IF Employer:
        - Company Name
        - Business Type
        - Bio
    ↓
    Step 4: Save Changes
    ↓
    User clicks save or changes auto-save:
    - System validates inputs
    - Updates user object in state
    - Persists to localStorage
    ↓
    Step 5: Confirm Success
    ↓
    System shows success message:
    - "Profile updated successfully"
    - Toast notification
    - UI reflects new information
```

**Auto-Save Features:**
- Availability calendar auto-saves on each change
- Profile changes may require explicit save
- Language preference auto-saves immediately

---

#### 12. Change Password Workflow

This workflow describes how users change their password.

**Preconditions:**
- User is authenticated
- User is on Profile Settings → Account section

**Workflow Steps:**

```
Step 1: Open Password Change
    ↓
    User navigates to Account settings
    Locates "Change Password" section
    ↓
    Step 2: Enter Credentials
    ↓
    User fills in:
    - Current Password
    - New Password (minimum 6 characters)
    - Confirm New Password
    ↓
    Step 3: Validate
    ↓
    System validates:
    - Current password matches stored hash
    - New password meets requirements
    - Confirmation matches new password
    ↓
    Step 4: Update Password
    ↓
    System:
    - Hashes new password
    - Updates user record in localStorage
    - Maintains current session
    ↓
    Step 5: Confirm Success
    ↓
    System displays:
    - "Password changed successfully"
    - "Please remember your new password"
```

---

### Admin & System Workflows

#### 13. Backup Workflow

This workflow describes how administrators create and manage system backups.

**Preconditions:**
- User is authenticated as ADMIN or OWNER
- User is on AdminDashboard → Metrics or Maintenance tab

**Workflow Steps:**

```
Step 1: Initiate Backup
    ↓
    User clicks "Export Backup" or "Backup Segera"
    System prepares export data:
    - Collects all users
    - Collects all jobs
    - Collects all applications
    - Formats as JSON
    ↓
    Step 2: Generate File
    ↓
    System creates downloadable file:
    - Filename: clh-backup-[timestamp].json
    - Contains all platform data
    - Includes metadata (export date, version)
    ↓
    Step 3: Download
    ↓
    Browser prompts file download:
    - User can save file locally
    - File ready for backup storage
    ↓
    Step 4: Verify
    ↓
    System confirms export:
    - "Backup exported successfully"
    - Shows file size and record counts
```

**Backup Contents:**
- All user accounts and profiles
- All job postings
- All applications and ratings
- System configuration
- Export timestamp

---

#### 14. Restore Workflow

This workflow describes how administrators restore data from a backup file.

**Preconditions:**
- User is authenticated as OWNER
- User has a valid backup JSON file
- User is on AdminDashboard → Maintenance tab

**Workflow Steps:**

```
Step 1: Open Restore
    ↓
    User clicks "Restore" or "Import Data"
    System displays restore options:
    - Upload JSON file
    - Paste JSON content
    ↓
Step 2: Provide Backup Data
    ↓
    User either:
    - Selects file to upload
    - Pastes JSON content in text area
    ↓
    Step 3: Validate Backup
    ↓
    System validates:
    - Valid JSON format
    - Contains required fields
    - Compatible data structure
    ↓
    Step 4: Show Confirmation
    ↓
    System displays warning:
    - "This will replace all current data"
    - Shows backup summary (record counts)
    - "Are you sure?" prompt
    ↓
    Step 5: Confirm Restore
    ↓
    User clicks "Restore" or "Import"
    System processes import:
    - Validates data integrity
    - Clears current data (optional)
    - Imports all records
    - Updates localStorage
    ↓
    Step 6: Reload System
    ↓
    System:
    - Reloads all data
    - Refreshes UI components
    - Shows success message
    ↓
    Step 7: Verify
    ↓
    Administrator checks:
    - Data restored correctly
    - Users intact
    - Jobs restored
    - Applications restored
```

**Restore Options:**
- **Full Restore**: Replace all current data with backup
- **Merge**: Add backup data to existing (for new users only)

---

#### 15. Batch Import Workflow

This workflow describes how OWNER users can import multiple users at once.

**Preconditions:**
- User is authenticated as OWNER
- User has prepared user data file
- User is on AdminDashboard → Maintenance tab

**Workflow Steps:**

```
Step 1: Prepare Data
    ↓
    Administrator creates CSV/JSON with users:
    - username, password, role
    - firstName, lastName
    - phoneNumber, email
    - role-specific fields
    ↓
    Step 2: Open Import
    ↓
    User clicks "Batch Import"
    System displays import form
    ↓
    Step 3: Upload Data
    ↓
    User uploads file or pastes content
    System parses data
    ↓
    Step 4: Preview
    ↓
    System shows preview:
    - Number of users to import
    - Sample records
    - Any validation errors
    ↓
    Step 5: Import
    ↓
    User confirms import
    System processes users:
    - Generates unique IDs
    - Hashes passwords
    - Creates user records
    - Handles duplicates
    ↓
    Step 6: Report
    ↓
    System shows import summary:
    - Total imported
    - Failed records
    - Duplicate records skipped
```

**Use Cases:**
- Initial platform population
- Importing test users
- Bulk user creation for demos

---

### Communication Workflows

#### 16. WhatsApp Contact Workflow

This workflow describes how users can contact each other via WhatsApp.

**Preconditions:**
- Target user has phone number configured
- Caller has WhatsApp installed
- Caller is viewing target's contact information

**Workflow Steps:**

```
Step 1: Locate Contact Button
    ↓
    User sees WhatsApp button on:
    - Student profile card
    - Job detail (employer contact)
    - Application detail
    ↓
    Step 2: Click WhatsApp
    ↓
    User clicks WhatsApp icon/button
    System prepares WhatsApp link:
    - Formats phone number (removes non-digits)
    - Pre-fills message (optional)
    ↓
    Step 3: Open WhatsApp
    ↓
    System redirects to WhatsApp:
    - Opens WhatsApp Web or App
    - Creates new chat with number
    - Pre-fills message if provided
    ↓
    Step 4: Send Message
    ↓
    User types and sends message:
    - Direct communication with employer/student
    - Questions about job
    - Coordinate interview
    - Discuss details
```

**Phone Number Formatting:**
- Input: "+6-012-345-6789"
- Processing: Remove all non-digits
- Output: "60123456789"
- WhatsApp URL: https://wa.me/60123456789

---

#### 17. Notification Workflow

This workflow describes how the system handles notifications to users.

**Preconditions:**
- Event occurs that requires notification
- User is not currently viewing the relevant page

**Notification Types:**

```
1. SIGNUP NOTIFICATION (Students Only)
   Trigger: New student registration
   Action: Send WhatsApp to admin
   Content: "New student registered: [Name] - [Major]"
   
2. APPLICATION STATUS NOTIFICATION
   Trigger: Application status changes
   Action: Display on next login
   Content: "Your application for [Job] has been [Approved/Rejected]"
   
3. RATING NOTIFICATION
   Trigger: New rating received
   Action: Display in notifications
   Content: "You received a [X]-star rating from [Employer]"
   
4. TOAST NOTIFICATIONS
   Trigger: User actions
   Action: Display temporary toast
   Examples:
   - "Application sent successfully"
   - "Profile updated"
   - "Job posted successfully"
   - "Rating submitted"
```

**Toast Notification Behavior:**
- Appears at bottom of screen
- Auto-dismisses after 3 seconds
- Click to dismiss manually
- Multiple toasts stack vertically
- Color-coded by type (success, error, info)

---

### Rating & Review Workflows

#### 18. Rate Employer Workflow (Students)

This workflow describes how students rate employers after job completion.

**Preconditions:**
- User is authenticated as JOB_SEEKER
- User has at least one COMPLETED application
- User has not yet rated the employer for that job

**Workflow Steps:**

```
Step 1: Navigate to Applications
    ↓
    User clicks Applications tab
    System displays application list
    ↓
    Step 2: Find Completed Job
    ↓
    User locates COMPLETED application
    System shows "Rate" option
    ↓
    Step 3: Open Rating Modal
    ↓
    User clicks "Rate" button
    System opens RatingModal:
    - Shows employer information
    - Displays 5-star selector
    - Provides feedback text area
    ↓
    Step 4: Select Rating
    ↓
    User clicks stars to rate:
    - 1 star = Poor
    - 5 stars = Excellent
    - Hover shows current selection
    ↓
    Step 5: Add Feedback
    ↓
    User optionally enters written feedback:
    - Description of work experience
    - Comments about employer
    - Tips for future students
    ↓
    Step 6: Submit
    ↓
    User clicks submit button
    System processes rating:
    - Updates application record
    - Calculates employer new average
    - Updates employer profile
    ↓
    Step 7: Confirm
    ↓
    System displays:
    - "Rating submitted successfully"
    - Updated employer rating shown
    - Toast notification
```

**Rating Calculation:**
- Employer average = (sum of all ratings) / (total ratings)
- Minimum 1 rating required for average display
- Updated immediately after each new rating

---

#### 19. View Ratings Workflow

This workflow describes how users view ratings on the platform.

**Preconditions:**
- User has access to view ratings (all authenticated users)

**Workflow Steps:**

```
FOR STUDENTS:
    ↓
    Student views own profile
    System displays:
    - Average rating (e.g., 4.5)
    - Total ratings count (e.g., 12 reviews)
    - Breakdown by star level
    ↓
    Student views employer profile
    System displays:
    - Employer average rating
    - Total ratings count
    - Recent review excerpts
    ↓
FOR EMPLOYERS:
    ↓
    Employer views own profile
    System displays:
    - Average rating
    - Total ratings
    - Recent feedback
    
    Employer views student profile
    System displays:
    - Student average rating
    - Total ratings
    - Past employer feedback
```

**Rating Display:**
- Star icons (filled for rated, outlined for unrated)
- Numeric average (e.g., "4.5")
- Total count (e.g., "12 reviews")
- Optional: individual rating details

---

## Data Models

### User Model

The User model represents all users of the platform, regardless of role.

```typescript
interface User {
  id: string;                    // Unique identifier (UUID or timestamp-based)
  username: string;              // Unique login identifier (3-20 chars)
  password?: string;             // Hashed password (never stored in plain text)
  role: UserRole;                // Role from enum: OWNER, ADMIN, EMPLOYER, JOB_SEEKER, GUEST
  firstName: string;             // User's first name
  lastName?: string;             // User's last name (optional)
  phoneNumber?: string;          // Contact number with country code
  email?: string;                // Email address (optional, for recovery)
  avatar?: string;               // URL to avatar image (optional)
  employerProfile?: EmployerProfile;  // Populated if role === EMPLOYER
  profile?: JobSeekerProfile;         // Populated if role === JOB_SEEKER
  language?: 'en' | 'ms';        // Preferred language (default: 'en')
  createdAt?: string;            // ISO timestamp of account creation
}
```

### EmployerProfile Model

Additional profile data for employer users.

```typescript
interface EmployerProfile {
  companyName: string;           // Business name
  businessType?: string;         // Type of business (cafe, restaurant, canteen)
  bio?: string;                  // Business description
  averageRating?: number;        // Average rating from students (1-5)
  totalRatings?: number;         // Number of ratings received
  location?: string;             // Business location on campus
}
```

### JobSeekerProfile Model

Additional profile data for student users.

```typescript
interface JobSeekerProfile {
  major?: string;                // Field of study
  year?: number;                 // Year of study (1-5)
  skills?: string[];             // Array of skill tags
  experience?: string;           // Work experience description
  bio?: string;                  // Personal introduction
  status?: AvailabilityStatus;   // DRAFT, AVAILABLE, UNAVAILABLE
  hourlyAvailability?: Record<string, Record<string, SlotState>>;
                                  // Weekly schedule: day → hour → status
  averageRating?: number;        // Average rating from employers (1-5)
  totalRatings?: number;         // Number of ratings received
  gender?: Gender;               // MALE, FEMALE (for job requirements)
}
```

### JobPost Model

Represents a job vacancy posted by an employer.

```typescript
interface JobPost {
  id: string;                    // Unique job identifier
  employerId: string;            // Reference to User.id
  employerName?: string;         // Denormalized employer name for display
  title: string;                 // Job title/position
  description: string;           // Full job description
  status: JobStatus;             // DRAFT, AVAILABLE, CLOSED, PENDING_DELETE
  createdAt?: string;            // ISO timestamp
  location?: string;             // Work location (e.g., "Kantin FIK")
  startDate?: string;            // Job start date (ISO)
  endDate?: string;              // Job end date (ISO)
  schedule?: string;             // Working hours description
  paymentInfo?: string;          // Payment rate (e.g., "RM8/hour")
  contactWhatsapp?: string;      // Contact number for applications
  preferredGender?: JobGenderType;  // MALE, FEMALE, OPEN
  requirements?: string[];       // Array of job requirements
}
```

### Application Model

Represents a student's application to a job.

```typescript
interface Application {
  id: string;                    // Unique application identifier
  jobId: string;                 // Reference to JobPost.id
  seekerId: string;              // Reference to User.id
  employerId?: string;           // Reference to JobPost.employerId
  status: ApplicationStatus;     // PENDING, APPROVED, REJECTED, COMPLETED
  employerRating?: number;       // Rating given by employer (1-5)
  employerFeedback?: string;     // Written feedback from employer
  studentRating?: number;        // Rating given by student (1-5)
  studentFeedback?: string;      // Written feedback from student
  ratedAt?: string;              // ISO timestamp of rating submission
  createdAt?: string;            // ISO timestamp of application
}
```

### Enums Reference

```typescript
enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  EMPLOYER = 'EMPLOYER',
  JOB_SEEKER = 'JOB_SEEKER',
  GUEST = 'GUEST'
}

enum AvailabilityStatus {
  DRAFT = 'DRAFT',
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

enum JobStatus {
  DRAFT = 'DRAFT',
  AVAILABLE = 'AVAILABLE',
  CLOSED = 'CLOSED',
  PENDING_DELETE = 'PENDING_DELETE'
}

enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

enum JobGenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OPEN = 'OPEN'
}

enum SlotState {
  AVAILABLE = 'AVAILABLE',
  MAYBE = 'MAYBE',
  BUSY = 'BUSY',
  EMPTY = 'EMPTY'
}
```

---

## Page & Component Documentation

### Authentication Pages

#### AuthPage.tsx

The unified authentication page that provides both login and signup functionality in a single component.

**Features:**
- Tab-based navigation between Login and Signup
- Language switcher in header
- Responsive design for mobile and desktop
- Role selection during signup
- WhatsApp notification on student signup
- Password visibility toggle

**State Management:**
- Current tab (login/signup)
- Form data for both forms
- Validation errors
- Loading states

**Components:**
- Login form (username, password)
- Signup form (role selector, personal info)
- Language toggle
- Error display
- Loading spinner

---

#### LoginPage.tsx

Standalone login page for direct access to authentication.

**Features:**
- Username/password fields
- Password visibility toggle
- Link to signup page
- Error handling and display
- Loading state during submission

---

#### SignupPage.tsx

Role-based registration page with different fields for students and employers.

**Features:**
- Role selection (Student/Employer)
- Dynamic form fields based on role
- Form validation
- Account creation
- Auto-login on success

**Student Fields:**
- Username, Password
- First Name, Last Name
- Phone Number, Email
- Major, Year, Gender
- Skills selection

**Employer Fields:**
- Username, Password
- First Name, Last Name
- Phone Number, Email
- Company Name
- Business Type, Bio

---

### Dashboard Pages

#### JobSeekerDashboard.tsx

Main student interface with four navigation tabs.

**Tab Structure:**
1. **Home** - Welcome message, profile status toggle, quick stats, recent applications
2. **Find Jobs** - Job search, filters, grid/list view, job cards, apply functionality
3. **Applications** - Pending and approved applications with status badges
4. **Profile** - ProfileSettings component integration

**Key Components:**
- Bottom navigation bar
- SearchBar component
- ViewToggle component
- Job cards (grid/list modes)
- Application tracking list
- Status toggle switches

**State:**
- Active tab
- Job search query
- View mode (grid/list)
- Filters (location, status, etc.)
- Selected job for detail view
- Selected employer for profile view

---

#### EmployerDashboard.tsx

Main employer interface with bottom navigation.

**Tab Structure:**
1. **Dashboard** - Welcome, business info, active jobs, pending applicants, talent search
2. **My Jobs** - Job listing, create job form, complete job, rate student
3. **Applicants** - All applicants with approve/reject functionality
4. **Profile** - ProfileSettings component integration

**Key Components:**
- Bottom navigation bar
- Job creation form
- Applicant list with actions
- Talent search with expand/collapse cards
- Rating modal
- Student profile detail modal

**State:**
- Active tab
- Sub-tabs (myjobs/applicants)
- Job form visibility
- Selected job/application
- Selected student
- Talent search query and filters
- Expanded talent cards

---

#### AdminDashboard.tsx

Administrative interface with sidebar navigation.

**Sidebar Sections:**
1. **Metrics** - System statistics, health monitoring, storage footprint, backup system
2. **Directory** - User listing by role, search/filter, profile viewing
3. **Jobs** - All jobs overview, job management
4. **Maintenance** - System restore, batch import, data export
5. **User DB** - Full user database management (Owner only)

**Key Components:**
- Sidebar navigation
- Statistics cards
- User data table
- Backup/restore interface
- Import/export controls

---

#### ProjectInfo.tsx

Academic documentation viewer for project information.

**Features:**
- Chapter navigation (4 chapters)
- Bilingual content
- UML diagram viewer
- PlantUML support
- Responsive layout

---

### Component Pages

#### ProfileSettings.tsx

Unified profile management component used by all dashboard pages.

**Sections:**
1. **Personal Info** - Name, contact, email, avatar
2. **Skills & Bio** (Students) - Major, skills, experience, bio
3. **Company Info** (Employers) - Company name, business type, bio
4. **Account** - Password change, language settings, logout

**Features:**
- Real-time validation
- Auto-save for some fields
- Avatar upload or generation
- Skills tag management
- Language preference toggle

---

#### AvailabilityCalendar.tsx

Interactive weekly schedule component.

**Features:**
- 7 days × 14 hours grid (6 AM - 8 PM)
- Drag-to-select functionality
- Three availability states (Available, Maybe, Busy)
- Auto-save to profile
- Visual legend
- Stats summary
- Read-only mode for employer viewing

**Interactions:**
- Click to cycle through states
- Drag to select multiple slots
- Double-click to clear slot
- Visual feedback on hover and select

---

#### StudentProfileDetail.tsx

Full-page student profile viewer for employers.

**Sections:**
1. **Profile** - Personal info, bio, skills, experience, contact
2. **Availability** - Weekly schedule calendar
3. **History** - All completed jobs with ratings

**Features:**
- Expandable sections
- Availability visualization
- Job history with ratings
- WhatsApp contact button
- Performance overview stats

---

#### RatingModal.tsx

Rating submission modal used by both employers and students.

**Features:**
- 5-star rating selector
- Written feedback textarea
- Submit/Cancel buttons
- Validation (at least 1 star required)
- Loading state during submission

**Modes:**
- Employer rating student
- Student rating employer

---

#### UserProfileDetail.tsx

General user profile viewer for non-student users.

**Usage:**
- View employer profiles
- View admin profiles
- View other students (non-employer context)

**Features:**
- Profile information display
- Company/business info
- Contact options
- Rating display

---

#### SearchBar.tsx

Reusable search component with suggestions and filters.

**Features:**
- Text input with placeholder
- Search suggestions dropdown
- Filter controls (optional)
- Recent searches tracking
- Clear button
- Keyboard navigation

---

#### ViewToggle.tsx

Grid/list view toggle component.

**Features:**
- Toggle between grid and list views
- Visual icon indicators
- Persistent preference (localStorage)
- Smooth transition animations

---

#### BottomNav.tsx

Mobile bottom navigation component.

**Features:**
- Fixed position at bottom
- Icon + label navigation items
- Active state highlighting
- Responsive design
- Smooth animations

**Navigation Items (Students):**
- Dashboard | Find Jobs | Applications | Profile

**Navigation Items (Employers):**
- Dashboard | My Jobs | Applicants | Profile

---

#### GuidelineModal.tsx

User guidelines modal with platform rules and tips.

**Features:**
- Modal dialog display
- Guidelines content
- Language support
- Dismiss button
- Trigger from dashboard

---

## Technical Architecture

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework with component-based architecture |
| **TypeScript** | 5.6.3 | Type safety and improved developer experience |
| **Vite** | 6.0.0 | Fast build tool and development server |
| **Tailwind CSS** | 4.0 | Utility-first styling framework |
| **@supabase/supabase-js** | Latest | Backend client (optional, for Supabase) |
| **vite-plugin-pwa** | Latest | Progressive Web App support |

### Architecture Patterns

**Component-Based Architecture:**
- All UI elements are reusable React components
- Pages composed of smaller components
- Props-based data flow
- State lifted to appropriate levels

**Offline-First Design:**
- localStorage for primary data persistence
- Supabase as optional backend enhancement
- PWA support for native app experience
- Graceful degradation when offline

**State Management:**
- React useState for local state
- React useEffect for side effects
- Context API for global state (if needed)
- localStorage for persistence

**Data Flow:**
1. User actions trigger state updates
2. State changes persist to localStorage
3. UI components re-render with new data
4. Supabase sync (if configured)

### Data Persistence

**localStorage Keys:**
- `users` - Array of all users
- `jobs` - Array of all job postings
- `applications` - Array of all applications
- `currentUser` - Currently authenticated user
- `ej_lang` - Selected language ('en' or 'ms')
- `recentSearches` - Recent job search queries
- `viewPreferences` - UI preference settings

**Data Format:**
```javascript
// Users storage
localStorage.setItem('users', JSON.stringify(users))

// Jobs storage  
localStorage.setItem('jobs', JSON.stringify(jobs))

// Applications storage
localStorage.setItem('applications', JSON.stringify(applications))

// Current session
localStorage.setItem('currentUser', JSON.stringify(user))
```

### PWA Configuration

**Service Worker Features:**
- Offline support
- Asset caching
- Install prompt
- Push notifications (future)

**Manifest:**
- App name: CLH-UniSZA
- Short name: CLH
- Theme color: Purple
- Icons: Generated from configuration
- Display mode: standalone

### Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile-First Approach:**
- Base styles for mobile
- Media queries for larger screens
- Bottom navigation for mobile
- Sidebar navigation for desktop

---

## Setup & Deployment

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js) or yarn
- Modern web browser with JavaScript enabled

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CLH-UniSZA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

### PWA Build

```bash
npm run build:pwa
```

This generates the service worker and manifest for offline capability.

---

## API Reference

### Authentication Service

```typescript
// services/auth.ts

interface LoginCredentials {
  username: string;
  password: string;
}

interface SignupData {
  username: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  // Role-specific fields...
}

function login(credentials: LoginCredentials): Promise<User>;
function signup(data: SignupData): Promise<User>;
function logout(): void;
function getCurrentUser(): User | null;
function isAuthenticated(): boolean;
```

### Database Service

```typescript
// src/services/supabase.ts

// Job Operations
function listJobs(): Promise<JobPost[]>;
function getJob(id: string): Promise<JobPost | null>;
function createJob(job: JobPost): Promise<JobPost>;
function updateJob(job: JobPost): Promise<JobPost>;
function deleteJob(id: string): Promise<void>;

// User Operations
function listUsers(): Promise<User[]>;
function getUser(id: string): Promise<User | null>;
function getUserByUsername(username: string): Promise<User | null>;
function createUser(user: User): Promise<User>;
function updateUser(user: User): Promise<User>;

// Application Operations
function listApplications(): Promise<Application[]>;
function getApplication(id: string): Promise<Application | null>;
function createApplication(application: Application): Promise<Application>;
function updateApplication(application: Application): Promise<Application>;

// Utility Operations
function canEmployerComplete(jobId: string): Promise<boolean>;
function markJobCompleted(jobId: string): Promise<void>;
```

### Storage Service

```typescript
// src/services/storage.ts

function saveData(key: string, data: any): void;
function loadData(key: string): any;
function removeData(key: string): void;
function exportData(): object;
function importData(data: object): void;
function clearAllData(): void;
```

---

## Demo Credentials

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| **Owner** | owner | password | Full system access |
| **Admin** | admin | password | Administrative access |
| **Employer** | employer1 | password | Cafe owner account |
| **Student** | student1 | password | Student account |
| **Student** | student2 | password | Alternative student |

---

## Internationalization

The app supports English (en) and Malay (ms) languages.

### Supported Strings (316+)
- Navigation labels
- Button text
- Error messages
- Success notifications
- User prompts
- Profile fields
- Job details

### Language Persistence
- Stored in localStorage (`ej_lang`)
- Persists across sessions
- Custom event triggers UI updates

### Adding New Translations
Edit `translations.ts` file:
```typescript
export const translations = {
  ms: { /* Malay translations */ },
  en: { /* English translations */ }
};
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is part of an academic coursework for Human Machine Interaction (HMI).

---

## Acknowledgments

- Universiti Sultan Zainal Abidin (UniSZA)
- All student testers and feedback providers
- Open source community

---

## Contact

For questions or support, please contact:
- **Email:** luqmanlixe98@gmail.com
- **Repository:** https://github.com/anomalyco/CLH-UniSZA

---

*Last Updated: January 2026*
*Version: 1.0.0*
