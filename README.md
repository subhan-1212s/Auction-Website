# 🏆 Auction Website - Elite Global Marketplace

Smart Auction is a premium, full-stack MERN platform designed for elite collectors and sellers. It features real-time bidding, secure payment integrations, and a sophisticated user dashboard.

![Project Status](https://img.shields.io/badge/Status-Production--Ready-gold?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)

---

## ✨ Key Features

- **💎 Luxury UX/UI**: Vibrant aesthetics with glassmorphism, dark mode, and smooth micro-animations.
- **⚡ Real-Time Bidding**: Powered by Socket.io for instantaneous bid updates and auction-end triggers.
- **💳 Multi-Gateway Payments**: 
  - **Stripe**: For Credit/Debit Card and Net Banking.
  - **Paytm**: Full integration (Real & Mock modes).
  - **COD**: Cash on Delivery support with order confirmation flows.
- **📧 Automated Notifications**: NodeMailer-driven emails for auction wins and payment confirmations.
- **📦 Order Tracking**: Complete order management system with automated PDF invoice generation.
- **🤖 Smart AI Chatbot**: Integrated support for user queries and platform navigation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account
- Stripe & Paytm Developer Keys (Optional for local testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/subhan-1212s/Auction-Website.git
   cd Auction-Website
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   # Create a .env file based on the provided template
   npm run dev
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS, Framer Motion, Socket.io-client.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Security**: JWT Authentication, Bcrypt.
- **Utilities**: Nodemailer (Email), html2canvas/jspdf (Invoices).

---

## 🔒 Security Note
This project uses `.env` files to manage sensitive API keys. **Never** push your `.env` file to GitHub. A template has been provided for convenience.

---

## 📄 License
Licensed under the MIT License.

*Crafted with excellence by [subhan-1212s](https://github.com/subhan-1212s).*
