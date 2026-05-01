# ✦ FarewellPass 2026

<div align="center">
  <img src="src/assets/logo.png" width="120" height="120" alt="FarewellPass Logo">
  <h3>MVGR College of Engineering · Farewell Event Management</h3>
  <p>A premium, secure, and futuristic entry & food pass management system.</p>
</div>

---

## 🚀 Tech Stack

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Appwrite](https://img.shields.io/badge/Appwrite-%23FD366E.svg?style=for-the-badge&logo=appwrite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-Icons-purple?style=for-the-badge)

---

## ✨ Key Features

- 🔐 **Secure QR Generation**: Uses HMAC-SHA256 cryptographic signatures to prevent tampering. QR codes appear as gibberish if scanned with standard apps.
- 📸 **Real-time Scanning**: Integrated scanner for Class Representatives (CRs) to verify student entry.
- 🍽️ **Sequential Flow**: Dual-stage verification—Entry Check-in first, then Food Coupon collection.
- 📊 **Live Dashboard**: Real-time tracking of attendance stats (Total Registered, Checked In, Food Collected).
- 🎨 **Premium UI**: Modern Glassmorphism design with an "Obsidian & Ultra-Violet" theme and smooth animations.
- 📱 **Fully Responsive**: Optimized for both Desktop management and Mobile field scanning.

---

## 🛠️ Quick Setup

### 1. Clone & Install
```bash
git clone https://github.com/Aswinsaipalakonda/Farewell-Pass.git
cd Farewell-Pass
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APPWRITE_PROJECT_ID="your_project_id"
VITE_APPWRITE_ENDPOINT="your_endpoint"
VITE_DB_ID="your_db_id"
VITE_STUDENTS_COL="students"
VITE_QR_SECRET="your_secret_key_for_qr"
VITE_EVENT_KEY="FAREWELL2026"
APPWRITE_API_KEY="your_api_key_with_database_permissions"
```

### 3. Automated Database Setup
We've included a script to automatically build your Appwrite backend (Collections, Attributes, and Test Data).
```bash
node scripts/setup-db.js
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📂 Project Structure

```text
├── scripts/          # Automation & DB setup scripts
├── src/
│   ├── assets/       # Brand assets & logos
│   ├── components/   # UI & Feature components (Dashboard, Scan, etc.)
│   ├── hooks/        # Custom React hooks (Auth, Stats, Students)
│   ├── lib/          # Core logic (Appwrite, QR Cryptography)
│   ├── pages/        # Application views
│   └── types/        # TypeScript interfaces
└── public/           # Static assets & icons
```

---

## 🤝 Support
Developed for **MVGR College of Engineering**. For issues or feature requests, please contact the admin team.

<div align="center">
  <p>Created with 💜 for the Class of 2026</p>
</div>
