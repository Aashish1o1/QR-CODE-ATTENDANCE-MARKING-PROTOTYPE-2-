# QR Attendance Scanner - Design Guidelines

## Project Overview
A focused Android attendance app that streamlines the check-in process: students scan a QR code displayed by the instructor, the token is automatically extracted and filled, then students simply enter their roll number to mark attendance.

## Architecture Decisions

### Authentication
**No Authentication Required**
- This is a utility app for quick attendance marking
- No user accounts or persistent login needed
- Students use their roll number as identification
- Data flows directly to the backend attendance system

### Navigation Architecture
**Stack-Only Navigation**
- This is a single-purpose, linear flow app
- Primary screen: QR Scanner with embedded form
- Modal screens for success/error states
- Navigation stack:
  1. Scanner Screen (root)
  2. Success Modal (overlay)
  3. Error Modal (overlay)

## Screen Specifications

### 1. Scanner Screen (Root)
**Purpose:** Scan QR code and submit attendance

**Layout:**
- **Header:** Custom header with transparent background
  - App title: "Attendance Scanner"
  - Right button: Help icon (shows instructions modal)
  - No search bar
- **Main Content:** Non-scrollable full-screen layout
  - **Camera View Zone** (upper 60% of screen)
    - Full-width camera preview
    - Scanning frame overlay with animated corners
    - Centered "Scan QR Code" instruction text (white, semi-transparent background)
  - **Form Zone** (lower 40% of screen, rounded top corners)
    - White background card with elevation
    - Auto-filled token field (read-only, with checkmark icon when populated)
    - Roll number input field (large, focused, with number keyboard)
    - Submit button (full-width, prominent)
- **Safe Area Insets:**
  - Top: insets.top + Spacing.xl
  - Bottom: insets.bottom + Spacing.xl
  - Sides: Spacing.lg

**Components:**
- Camera preview with QR detection
- Animated scanning frame (4 corner markers that pulse)
- Text input (roll number) with Material Design styling
- Disabled text field (token display)
- Primary action button (Submit Attendance)
- Status indicator (shows token validity with timer)

**Interaction Flow:**
1. Camera auto-activates on screen load
2. When QR detected → haptic feedback + token autofills
3. User enters roll number → Submit button activates
4. On submit → loading state → success/error modal

### 2. Success Modal
**Purpose:** Confirm successful attendance marking

**Layout:**
- Centered modal (80% screen width)
- Green checkmark icon (large, animated entrance)
- Success message: "Attendance Marked!"
- Student name display (if returned from API)
- Timestamp
- "Done" button to dismiss

### 3. Error Modal
**Purpose:** Display submission errors

**Layout:**
- Centered modal (80% screen width)
- Red alert icon
- Error message (dynamic based on error type)
- Suggested action text
- "Try Again" button (dismisses modal, returns to scanner)

### 4. Help Modal (Instructional)
**Purpose:** Guide first-time users

**Layout:**
- Full-screen modal with close button
- Step-by-step instructions with illustrations:
  1. "Scan the QR code displayed by your instructor"
  2. "Token will auto-fill"
  3. "Enter your roll number"
  4. "Tap submit"

## Design System

### Color Palette
**Primary Colors:**
- Primary: #1976D2 (Material Blue)
- Primary Dark: #1565C0
- Accent: #4CAF50 (Success Green)
- Error: #F44336 (Material Red)
- Warning: #FF9800 (Amber)

**Neutral Colors:**
- Background: #FAFAFA
- Surface: #FFFFFF
- Text Primary: #212121
- Text Secondary: #757575
- Divider: #BDBDBD

**Camera Overlay:**
- Scanning Frame: #FFFFFF with 80% opacity
- Background Dim: #000000 with 40% opacity

### Typography
**Font Family:** Roboto (Material Design standard)

**Text Styles:**
- App Title: 20px, Medium, Text Primary
- Section Heading: 16px, Medium, Text Primary
- Body: 14px, Regular, Text Primary
- Label: 12px, Medium, Text Secondary
- Button Text: 14px, Medium, Uppercase
- Input Text: 16px, Regular, Text Primary
- Helper Text: 12px, Regular, Text Secondary

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Component Specifications

**Input Fields:**
- Height: 56px (Material standard)
- Border radius: 4px
- Border: 1px solid Divider (default), Primary (focused), Error (error state)
- Padding: 16px horizontal
- Label: Floating label animation
- Feedback: Immediate validation with helper text below field

**Primary Button (Submit):**
- Height: 48px
- Border radius: 4px
- Background: Primary color
- Text: White, uppercase, 14px Medium
- Elevation: 2dp
- Ripple effect on press
- Disabled state: 38% opacity
- Full width with 16px horizontal margins

**Scanning Frame:**
- Square or rectangular overlay in camera view
- 4 corner markers (L-shaped, 20px length, 3px thick)
- Animated pulse: corners glow every 1.5s
- White color with 80% opacity

**Status Indicator (Token Timer):**
- Small chip component below token field
- Shows remaining time for token validity
- Green background when valid (> 60s remaining)
- Amber when expiring (< 60s remaining)
- Red when expired
- Format: "Valid for: 4:32"

**Visual Feedback:**
- All touchable components use Material ripple effect
- Haptic feedback on QR scan success
- Haptic feedback on successful submission
- Floating action button for help (if needed) uses elevation:
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2

### Icons
- Use Material Design Icons from @expo/vector-icons
- Help: "help-circle-outline"
- Success: "check-circle"
- Error: "alert-circle"
- Token valid: "check"
- Camera: "camera"

### Critical Assets
**None required** - This app uses system icons and camera functionality. The QR code is provided by the instructor's system (external).

### Accessibility
- Camera permission request with clear explanation
- High contrast scanning frame for visibility
- Large tap targets (minimum 48x48dp)
- Roll number field auto-focused after token scanned
- Error messages clearly communicated with color + text + icon
- VoiceOver/TalkBack support for all interactive elements
- Support for system font scaling

### Interaction Design
- **Auto-focus behavior:** When token autofills, keyboard auto-opens for roll number input
- **Real-time validation:** Roll number validated on input (format: alphanumeric, required)
- **Submission states:** Button shows loading spinner during API call
- **Network error handling:** Show retry option with offline indicator
- **Token expiry:** Visual countdown timer updates every second
- **Scan feedback:** Subtle vibration + visual confirmation when QR detected