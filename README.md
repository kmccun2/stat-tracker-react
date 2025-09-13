# ⚾ Baseball Stat Tracker - Full Stack Application

A comprehensive baseball statistics tracking application with React frontend and
Node.js backend using SQLite database.

## 🏗️ **Project Structure**

```
stat-tracker-react/                 # Main frontend repository
├── src/                            # React application source
├── public/                         # Static assets
├── docs/                          # Project-wide documentation
│   ├── AUTH0_SETUP.md            # Auth0 configuration guide
│   └── INTEGRATION_GUIDE.md      # Backend integration guide
└── README.md                     # This file
```

## 🚀 **Quick Start**

### Full Stack Development (Recommended)

```bash
# From this directory (stat-tracker-react/)
npm run install:all       # Install all dependencies
npm run dev:fullstack     # Run both backend and frontend
```

### Individual Services

```bash
npm run dev              # Frontend only (port 5173)
npm run dev:backend      # Backend only (port 3001)
npm run dev:frontend     # Frontend only (explicit)
```

### Production

```bash
npm run build            # Build frontend
npm run start:fullstack  # Run both in production mode
```

## 📚 **Documentation**

- [Auth0 Setup Guide](docs/AUTH0_SETUP.md) - Complete authentication setup
- [Integration Guide](docs/INTEGRATION_GUIDE.md) - Backend integration
  instructions

## � **HIGH PRIORITY DEVELOPMENT PRINCIPLES**

### 🎯 **Core Tenets - NON-NEGOTIABLE**

1. **ALWAYS Prioritize Code Maintainability & Cleanliness**
   - Write self-documenting code with clear variable and function names
   - Maintain consistent code style across all components
   - Keep components small, focused, and single-responsibility
   - Use TypeScript if adding type safety in future phases
   - Follow React best practices (hooks, component composition)

2. **Alignment with Original Requirements - MANDATORY**
   - **BEFORE** implementing any new feature, verify it aligns with the original
     Grok conversation
   - **BEFORE** making architectural changes, ask clarifying questions
   - **BEFORE** deviating from the roadmap, discuss the business case
   - Reference the original requirements section for every decision

3. **Quality Gates - MUST PASS**
   - Code must be readable by junior developers
   - Components must be reusable and composable
   - No magic numbers or hardcoded values
   - Error handling for all user inputs and data operations
   - Responsive design tested on mobile/tablet/desktop

### ⚠️ **Decision Checkpoint Protocol**

**IF** any proposed change would:

- Alter the core data structure (players, assessments, goals)
- Change the user workflow from the original plan
- Introduce new dependencies not in the original tech stack
- Modify the assessment calculation logic
- Impact the export functionality

**THEN** STOP and ask clarifying questions:

1. How does this align with the original Grok requirements?
2. What problem are we solving that wasn't in the original scope?
3. Is this a Phase 1, 2, 3, or 4 feature according to our roadmap?
4. Does this maintain or improve code maintainability?

## �📋 Original Requirements (from Grok Conversation)

### Original Vision

A player development tracker for baseball coaches that allows inputting player
profiles, assessment data (e.g., exit velocities, sprint times), and custom
goals. The app generates visual reports showing progress over time, comparisons
to goals, and trends across categories (e.g., Hitting, Strength).

### Key Features from Original Plan

- **User Roles**: Coaches (authenticated users) can manage multiple players
- **Data Sources**: Assessment types and goals are managed via backend database
- **Core Workflow**:
  1. Add/edit players
  2. Set/customize goals
  3. Input assessment data
  4. View reports (charts, tables, exports)

### Original Tech Stack Suggestions

- **Frontend**: React.js with Material-UI or Tailwind for styling, Chart.js for
  visualizations
- **Backend**: Node.js with Express.js for API, JWT for authentication
- **Database**: PostgreSQL or MongoDB
- **Deployment**: Vercel/Netlify for frontend, Heroku/AWS for backend

## 🎯 Current Implementation Status

### ✅ **Phase 1 - MVP Complete**

We've successfully implemented a simplified version focusing on core
functionality:

**Tech Stack Chosen:**

- **Frontend**: React + Vite + React Bootstrap
- **Backend**: Node.js + Express + SQLite Database
- **Data Storage**: SQLite database with persistent storage
- **Authentication**: Auth0 integration
- **Styling**: React Bootstrap + Custom CSS
- **Navigation**: React Router

**Current Features:**

- ✅ Player listing with age calculation from DOB
- ✅ Individual player detail pages
- ✅ Assessment categories (Hitting, Throwing, Strength, Speed, Power, General)
- ✅ Goal calculation based on age and gender
- ✅ Real-time goal status (Met/Not Met/Not Entered)
- ✅ Input fields for assessment results with database persistence
- ✅ CSV export functionality (individual player or all players)
- ✅ Responsive design with professional UI
- ✅ Age-based goal ranges (12 or less, 13-14, 15-16, 17-18, 18+)
- ✅ **Header and Sidebar Layout** (as per original requirements)
- ✅ **Navigation Structure**: Players, Reports, Goals, Settings
- ✅ **Mobile-responsive** sidebar with collapsible navigation
- ✅ **Placeholder pages** for future features with phase indicators
- ✅ **Database persistence** with SQLite backend
- ✅ **Authentication system** with Auth0
- ✅ **Backend API integration** with full CRUD operations
- ✅ **Assessment type management** (create, edit, delete metrics)

### 📊 Data Structure

**Database Tables:**

- **Players**: Name, Gender, DOB (Excel serial format), with automatic age
  calculation
- **Assessment Types**: Assessment categories with sorting and formatting
- **Goals**: Age and gender-based performance targets
- **Assessment Results**: Player performance data with timestamps
- **Coaches**: Authentication and user management

### 🎨 UI/UX Design Implemented

**Player List Page:**

- Card-based layout with player information
- Age and gender indicators
- Responsive grid (4 columns on large screens)
- Search functionality ready for implementation

**Player Detail Page:**

- Professional player info card with badges
- Breadcrumb navigation
- Categorized assessment tables with icons:
  - 📊 General
  - 🏏 Hitting
  - ⚾ Throwing
  - 💪 Strength
  - 🏃 Speed
  - 💥 Power

**Assessment Tables:**

- Bootstrap striped, hover tables
- Color-coded status badges:
  - 🟢 Green "Goal Met"
  - 🔴 Red "Below Goal"
  - ⚪ Gray "Not Entered"
- Input fields with proper units
- Goal display with appropriate operators (≤, ≥, range)

## 🚀 How to Run

1. **Install Dependencies**:

   ```bash
   cd stat-tracker-react
   npm install
   ```

2. **Start the Full Stack Application**:

**Note**: npm start can be ran from either the front end or back end folder

```bash
npm start will run both the front end and back end
```

This command will start both the frontend and backend servers concurrently.

3. **Access App**: Open http://localhost:5173/

   **Note**: The app requires the backend server to be running on
   http://localhost:3001/

## 📁 Project Structure

```
stat-tracker-react/
├── public/
├── src/
│   ├── components/
│   │   ├── AssessmentTable.jsx
│   │   ├── ExportButton.jsx
│   │   ├── PlayerDetailPage.jsx
│   │   ├── PlayerListPage.jsx
│   │   ├── ReportsPage.jsx        # Phase 3 placeholder
│   │   ├── GoalsPage.jsx         # Phase 2 placeholder
│   │   └── SettingsPage.jsx      # Phase 2 placeholder
│   ├── layout/
│   │   └── AppLayout.jsx         # Header & Sidebar layout
│   ├── context/
│   │   └── DataContext.jsx
│   ├── services/
│   │   └── apiService.js         # Backend API integration
│   ├── App.tsx
│   ├── index.css
│   └── main.jsx
└── package.json
```

## 🎯 Future Enhancements (From Original Plan)

### Phase 2 - Authentication & Persistence

- [ ] User authentication (coaches)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Player-specific goal overrides
- [ ] Assessment history tracking with dates

### Phase 3 - Reporting & Analytics

- [ ] Chart.js integration for visual reports
- [ ] Progress tracking over time
- [ ] Trend analysis and improvements calculation
- [ ] Age-adjusted goal recalculation
- [ ] PDF export functionality

### Phase 4 - Advanced Features

- [ ] Bulk assessment entry
- [ ] Team management
- [ ] Mobile app optimization
- [ ] File upload for new CSV imports
- [ ] Notes and attachments for assessments

## 🔧 Business Logic

### Age Calculation

- Converts Excel serial dates to JavaScript dates
- Calculates current age in years
- Maps to appropriate age ranges for goal lookup

### Goal Resolution Logic

1. Calculate player's current age
2. Determine age range (12 or less, 13-14, 15-16, 17-18, 18+)
3. Look up goal based on assessment type, age range, and gender
4. Apply appropriate comparison logic:
   - For "LowIsGood" assessments (times): result ≤ goal
   - For "HighIsGood" assessments (distances, speeds): result ≥ goal
   - For range goals: min ≤ result ≤ max

### Assessment Categories

- **General**: Height, Weight
- **Hitting**: Exit velocities, Attack angles (various scenarios)
- **Throwing**: Velocities, Long toss, Pop time
- **Strength**: Squats, Deadlifts, Bench press, etc.
- **Speed**: Sprint times, Home-to-first, Stealing times
- **Power**: Jumps, Medicine ball throws

## 📈 Success Metrics

The current implementation successfully addresses the core requirements:

- ✅ Player management
- ✅ Assessment tracking
- ✅ Goal comparison
- ✅ Data export
- ✅ Professional UI/UX
- ✅ Responsive design

## 🔄 Development Workflow

1. **Stay True to Original Vision**: All changes should align with the original
   Grok conversation requirements
2. **Incremental Enhancement**: Build upon existing functionality rather than
   major rewrites
3. **Data-Driven**: Maintain compatibility with the CSV data structure
4. **User-Focused**: Prioritize coach and player usability

## 🏗️ **CODE QUALITY STANDARDS - ENFORCED**

### 📐 **Architecture Principles**

**Component Design:**

- Each component has a single, clear responsibility
- Props are well-defined and typed (prepare for TypeScript migration)
- No component should exceed 200 lines of code
- Extract custom hooks for complex state logic
- Use composition over inheritance

**File Organization:**

```

src/
├── components/ # Reusable UI components
├── pages/ # Route-level components (future)
├── hooks/ # Custom React hooks (future)
├── utils/ # Pure utility functions
├── context/ # React context providers
├── types/ # TypeScript definitions (future)
└── constants/ # Application constants

```

**Data Flow:**

- Context for global state only (players, assessments, goals)
- Local state for component-specific UI state
- Pure functions for all business logic calculations
- Immutable data updates (spread operators, not mutations)

### 🧹 **Code Cleanliness Checklist**

**Before Any Commit:**

- [ ] No console.log statements in production code
- [ ] All functions have clear, descriptive names
- [ ] No magic numbers (use named constants)
- [ ] Error boundaries for user-facing errors
- [ ] Loading states for all async operations
- [ ] Proper key props for all mapped components
- [ ] Consistent naming conventions (camelCase for JS, kebab-case for CSS)

**Component Quality:**

- [ ] Each component exports one primary function
- [ ] Props are destructured at the top of the component
- [ ] Early returns for error/loading states
- [ ] JSX is readable with proper indentation
- [ ] CSS classes follow BEM or consistent naming

**Business Logic Quality:**

- [ ] Age calculation is centralized and tested
- [ ] Goal resolution logic is pure and predictable
- [ ] Data transformations are in separate utility functions
- [ ] CSV parsing errors are handled gracefully

### 🔧 **Technical Debt Management**

**Refactoring Rules:**

1. **Never refactor and add features simultaneously**
2. **Test existing functionality before and after refactoring**
3. **Refactor in small, atomic commits with clear messages**
4. **Document any breaking changes or API modifications**

**Current Technical Debt (to address in order):**

1. **Type Safety**: Add TypeScript for better developer experience
2. **Testing**: Add unit tests for business logic functions
3. **State Management**: Consider Zustand/Redux for complex state (Phase 2+)
4. **Error Handling**: Centralized error boundary and user feedback
5. **Performance**: Memoization for expensive calculations (age, goals)

**Debt Approval Process:**

- Minor refactoring (under 50 lines): Proceed with documentation
- Major refactoring (over 50 lines): Document rationale and get approval
- Architecture changes: Must align with original requirements and phases

### 🎯 **Feature Development Protocol**

**Before Starting Any Feature:**

1. Check if it's in the original Grok requirements
2. Identify which phase it belongs to (1, 2, 3, or 4)
3. Ensure current phase is complete before moving to next
4. Write a brief design doc for complex features

**During Development:**

1. Start with the simplest working implementation
2. Add error handling and edge cases
3. Test on different screen sizes
4. Update this README if new patterns emerge

**After Implementation:**

1. Update the phase completion status
2. Document any new patterns or utilities
3. Check for any technical debt introduced
4. Verify original requirements are still met

## 📝 Notes

- Current implementation uses local memory for simplicity
- CSV files are loaded at startup and parsed client-side
- All assessment results are stored in browser memory (lost on refresh)
- Professional styling achieved with React Bootstrap
- Age calculation handles Excel serial date format correctly

---

**Reference**: Original requirements and conversation can be found at:
https://grok.com/share/bGVnYWN5_6ae7cebd-2898-4cec-aa5d-3e11ff8695dc

```

```
