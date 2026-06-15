# SwiftCalc - High Precision AI Calculator

SwiftCalc ek modern, powerful aur intelligent calculator hai jo Next.js, Tailwind CSS aur Genkit AI ke saath banaya gaya hai. Ye sirf basic calculations hi nahi, balki AI ki madad se complex word problems aur currency conversions bhi handle kar sakta hai.
Live Demo - https://swift-calc-ui.vercel.app/

## ✨ Features

- **High Precision Calculation**: Standard aur Scientific modes complex expressions ke liye.
- **AI Word Problem Solver**: Natural language mein math problems likhein aur step-by-step solution payein.
- **Unit & Currency Converter**: 
    - Standard conversions (Length, Weight, Temperature).
    - AI-powered Currency conversion (USD, INR, EUR, etc.).
- **Calculation History**: Apni purani calculations ko track karein aur unhe wapas use karein.
- **Modern UI**: Glassmorphic design, dark mode support, aur responsive layout.
- **Keyboard Support**: Numbers aur operators ke liye direct keyboard entry.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (Gemini 2.5 Flash)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

1.  **Environment Setup**: `.env` file mein apni `GOOGLE_GENAI_API_KEY` add karein.
2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
3.  **Open Browser**: `http://localhost:9002` par jayein.

## 📁 Project Structure

- `src/app`: Next.js pages aur global styles.
- `src/components/calculator`: Calculator ke core components (Display, Keypad, AISolver).
- `src/ai/flows`: Genkit AI logic word problems aur currency ke liye.
- `src/lib`: Utility functions aur unit conversion logic.

---
Powered by Firebase Studio & GenAI.
