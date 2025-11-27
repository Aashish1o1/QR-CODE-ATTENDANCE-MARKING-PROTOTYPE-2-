# QR-CODE-ATTENDANCE-MARKING-PROTOTYPE-2-
This repository is the second part of the QR Code Attendance System. The first repo provided the web dashboard and QR generator. This repo adds the mobile scanner app, allowing students to scan the QR code and submit attendance through the FastAPI backend, completing the full system.


QR Attendance Scanner App (React Native + Expo)
QR Attendance Scanner App

This is the mobile application for the QR Attendance System.
Built using React Native and Expo, it scans QR codes, autofills tokens, and submits attendance to the backend API.

A prebuilt APK is included for immediate use.

- Features

QR code scanning (CameraView)

Auto-read token system

Roll number input

Attendance submission via API

Offline queue support

Local roll number saving

Success & error screens

Clean modern UI

Works with any FastAPI backend deployment

- Project Structure
mobile_app/
│ App.tsx
│ package.json
│ babel.config.js
│ tsconfig.json
│
├── navigation/
├── screens/
├── utils/
├── components/
└── assets/

- Requirements

Node.js 18+

npm or yarn

Expo CLI

Android/iOS device (for testing)

Install Expo CLI:

npm install -g expo-cli

- Installation

Inside the mobile app folder:

npm install


This installs:

expo-camera

react-navigation

expo-haptics

AsyncStorage

TypeScript

All UI libraries

- Configure API URL

Open:

utils/api.ts


Replace:

const API_BASE_URL = "YOUR_BACKEND_URL";


With your locally running backend:

http://YOUR_LOCAL_IP:8000


Or your deployed backend:

https://yourapp.onrender.com

- Running the App

Start development server:

expo start


Scan the QR using the Expo Go app.

- Building APK

You can generate an installable APK using:

eas build -p android


Or classic Expo:

expo build:android


Expo will produce an APK download link.

- Included Files

Full React Native source

API utilities

Offline queue logic

UI components

Prebuilt APK file

Setup instructions

- License

Free for personal, educational, and academic use.
Commercial resale requires permission.
