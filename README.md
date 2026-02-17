# ⚖️ CourtVista — Legal Professional Discovery Platform

CourtVista is a centralized digital platform designed to help individuals find, compare, and book consultations with verified legal professionals across India.

## ✨ Features

- **Smart Search & Filters** — Search lawyers by practice area, location, experience, rating, languages, gender, and verification status
- **Detailed Lawyer Profiles** — View credentials, case statistics (total/pending), awards, reviews with star distribution
- **Side-by-Side Comparison** — Compare up to 3 lawyers across 10+ attributes
- **Consultation Booking** — Book consultations with preferred date/time slots and confirmation
- **Legal Q&A Forum** — Community-driven questions answered by verified lawyers
- **20+ Mock Profiles** — Realistic lawyer data across all practice areas and Indian cities

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Vanilla CSS with custom properties (design tokens) |
| Typography | Inter + Playfair Display (Google Fonts) |
| Data | Client-side mock data layer |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Azeem10101/CourtVista.git
cd CourtVista

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at **http://localhost:5173/**

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components (Navbar, Footer, SearchBar, etc.)
├── pages/          # Page components (Home, Search, LawyerProfile, Compare, etc.)
├── data/           # Mock lawyer data, Q&A, utility functions
├── App.jsx         # Router + global state
├── index.css       # Design system tokens & global styles
└── main.jsx        # Entry point
```

## 📸 Screenshots

### Home Page
Professional hero section with search, practice area browsing, and featured lawyers.

### Search & Discovery
Filter lawyers by 7 dimensions with sorting and pagination.

### Lawyer Profiles
Comprehensive profiles with case statistics, credentials, reviews, and booking.

## 👤 Author

**Azeem** — Sole author of this project.

## 📄 License

This project is for educational and demonstration purposes.
