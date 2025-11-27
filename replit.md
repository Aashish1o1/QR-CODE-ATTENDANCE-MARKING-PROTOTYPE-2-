# Attendance Scanner

## Overview

Attendance Scanner is a React Native mobile application built with Expo that streamlines the attendance marking process for students. The app allows students to scan QR codes displayed by instructors, automatically extracts attendance tokens, and enables quick submission with their roll number. The application is designed as a single-purpose utility tool with offline-first capabilities, focusing on simplicity and efficiency.

## Recent Changes (November 24, 2025)

### API Integration
- Implemented real API client connecting to FastAPI backend at https://comeon-dl9k.onrender.com/
- POST /scan endpoint with application/x-www-form-urlencoded format
- Proper error handling and response parsing from HTML responses

### Offline Functionality
- Roll number persistence using AsyncStorage (auto-fills on subsequent uses)
- Offline queue system that saves failed submissions locally
- Automatic retry mechanism on app focus that processes queued submissions
- Fixed critical bug: Pending records now upgrade to "present" status after successful retry

### Attendance Tracking
- Local attendance history storage with timestamps and status tracking
- History screen with FlatList display, pull-to-refresh, and empty states
- Statistics dashboard showing attendance rate, present count, pending count, and total records
- Status badges differentiate between "present" (successful) and "pending" (offline) records

### Navigation Enhancement
- Bottom tab navigation with three tabs: Scanner, History, Stats
- Modal overlays (Success, Error, Help) display over tab navigator
- Proper safe area insets for tab bar integration

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- React Native 0.81.5 with Expo 54
- Navigation: React Navigation v7 (Native Stack + Bottom Tabs)
- State Management: React hooks and local component state
- Animations: React Native Reanimated 4.1
- Styling: StyleSheet API with centralized theme system

**Design Pattern**
The application follows a component-based architecture with functional components and hooks. The codebase emphasizes reusability through themed components (`ThemedText`, `ThemedView`) and shared layout components (`ScreenScrollView`, `ScreenKeyboardAwareScrollView`).

**Navigation Structure**
- Root: Stack Navigator (MainTabs + modal screens)
- MainTabs: Bottom Tab Navigator with three tabs
  - ScannerTab: Camera scanning and form submission
  - History: Attendance history with status badges
  - Stats: Dashboard with attendance statistics
- Modal screens (Success, Error, Help) overlay tabs with transparent presentation

**Theming System**
Centralized theme constants in `/constants/theme.ts` support automatic light/dark mode with:
- Colors for both schemes
- Spacing constants (xs, sm, md, lg, xl)
- Typography styles (h1-h4, body, small, link)
- Border radius values

### Core Features

**QR Code Scanning**
- Uses `expo-camera` with barcode scanning capabilities
- Auto-fills token field when QR code is detected
- Animated scanning frame with corner indicators
- Camera permission handling with graceful fallbacks

**Offline-First Design**
- Local queue system for failed submissions using AsyncStorage
- Automatic retry mechanism via `processOfflineQueue()` triggered on screen focus
- Attendance records stored locally with "pending" or "present" status
- Pending records automatically upgrade to "present" after successful retry
- Background sync when network becomes available

**Data Persistence**
All user data is stored locally using AsyncStorage:
- Roll number (cached after first entry)
- Offline submission queue
- Attendance history with timestamps

**User Feedback**
- Modal overlays for success/error states with animations
- Haptic feedback on important interactions
- Loading states during API calls
- Help screen with step-by-step instructions

### Screen Architecture

**Scanner Screen (Primary)**
- Upper 60%: Full-screen camera view with overlay
- Lower 40%: Form card with auto-filled token and roll number input
- Single-column layout optimized for one-handed use
- Keyboard-aware scrolling for form inputs

**History Screen**
- FlatList of past attendance records
- Pull-to-refresh functionality
- Visual status badges (present/pending)
- Date grouping with formatted timestamps

**Stats Screen**
- Aggregated attendance statistics
- Cards showing total records, present count, pending count, attendance rate
- Refresh capability to recalculate from local data

### Error Handling

**Error Boundary**
Global error boundary wraps the entire app to catch React rendering errors. In development mode, displays detailed error information with stack traces. In production, shows user-friendly error message with restart option.

**Network Error Handling**
API failures are gracefully handled by:
1. Storing submission in offline queue
2. Creating "pending" attendance record locally
3. Showing appropriate user feedback
4. Attempting retry on next app focus

## External Dependencies

### Third-Party Services

**Backend API**
- Base URL: `https://comeon-dl9k.onrender.com`
- Endpoint: POST `/scan`
- Content-Type: `application/x-www-form-urlencoded`
- Parameters: `student_id`, `token`
- Response: HTML page (parsed for success indicators and student name)

**Note**: The backend is a FastAPI application (Python) that generates QR codes with attendance tokens and validates student submissions. The app parses HTML responses to determine success/failure.

### Key Libraries

**Expo Ecosystem**
- `expo-camera`: QR code scanning and camera access
- `expo-haptics`: Tactile feedback
- `expo-status-bar`: Status bar styling
- `expo-splash-screen`: App launch screen
- `expo-blur`: iOS blur effects for headers

**React Navigation**
- `@react-navigation/native`: Core navigation
- `@react-navigation/native-stack`: Stack-based navigation
- `@react-navigation/bottom-tabs`: Tab bar interface

**UI & Interactions**
- `react-native-reanimated`: Performant animations
- `react-native-gesture-handler`: Touch gesture handling
- `react-native-keyboard-controller`: Keyboard behavior management
- `react-native-safe-area-context`: Safe area insets
- `@expo/vector-icons`: Icon library (Feather icons)

**Data Persistence**
- `@react-native-async-storage/async-storage`: Key-value storage for offline data, roll numbers, and attendance history

### Development Tools

- TypeScript for type safety
- Babel with module resolver for path aliases (`@/`)
- ESLint with Expo and Prettier configurations
- Support for iOS, Android, and Web platforms