# MVP AI Scheduling & Learning Assistant

## Overview
This project is a **mobile AI scheduling and learning assistant** that helps users create flexible timetables, sync events with Google and apple Calendar, and recommend relevant learning resources (videos & definitions). The AI adapts based on user feedback to improve recommendations over time.

---

## 🚀 Tech Stack
### **Frontend (Mobile App)**
- **React Native (Expo)** – Cross-platform mobile development (Android & iOS)
- **React Native Paper** – UI components for React Native

### **Backend**
- **Firebase** – Since it's an mvp
- **Firebase Firestore** – Cloud database for storing user data
- **Firebase Authentication** – Secure authentication (email/password login)

### **APIs & Services**
- **Google Calendar API** – Scheduling and event syncing
- **YouTube Data API** – Fetching relevant learning videos
- **Wikipedia API** – Fetching definitions and explanations
- **Undecided LLM** – AI model for learning recommendations

<!-- ### **Hosting & Deployment**
- **Render/Vercel** – Free-tier backend hosting
- **Expo** – Mobile app development & testing -->

---

## 🛠️ Environment Setup
### **1️⃣ Prerequisites**
Make sure you have the following installed:
- **Node.js (LTS version)** – [Download](https://nodejs.org/)
- **Expo CLI** – `npm install -g expo-cli`
- **Firebase CLI** – `npm install -g firebase-tools`
- **Python (for AI Model - optional)** – [Download](https://www.python.org/)
<!-- - **Ngrok (for testing APIs locally)** – [Download](https://ngrok.com/) -->

### **2️⃣ Clone the Repository**
```sh
git clone https://github.com/najadams/skejulamvp.git
cd skejulamvp
```

### **3️⃣ Install Dependencies**
#### **Frontend (React Native)**
```sh
cd client
npm install
expo start
```
#### **Backend (Node.js + Express)**
```sh
cd server
npm install
npm start
```

---

## 🔑 API Configuration
Create a `.env` file in the backend directory and add:
```env
FIREBASE_API_KEY=your_firebase_api_key
GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id
YOUTUBE_API_KEY=your_youtube_api_key
WIKIPEDIA_API_URL=https://en.wikipedia.org/api/rest_v1/
```

---

## 📅 Features
✅ AI-powered **smart scheduling**
✅ **Google Calendar** event syncing
✅ **Personalized learning resources**
✅ **YouTube & Wikipedia API integration**
✅ **Firebase Authentication** (Email/Password login)

---

## 📌 Next Steps
- [ ] Implement AI-powered learning recommendations
- [ ] Optimize Firebase Firestore structure
- [ ] Improve UI/UX with animations
- [ ] Deploy backend to Render

---

## 🤝 Contributing
1. **Fork** the repo
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Commit changes**: `git commit -m "Added new feature"`
4. **Push to branch**: `git push origin feature-name`
5. **Open a Pull Request**

---

## 📝 License
This project is licensed under the **Bidams License**.
