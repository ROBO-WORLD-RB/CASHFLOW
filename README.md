# BudgetUp 💰

**Smart Financial Management for Ghana**

BudgetUp is a comprehensive financial management application designed specifically for Ghanaian users, featuring AI-powered savings suggestions, group savings capabilities, and intuitive budget tracking tools.

## ✨ Features

### 📊 **Income & Expense Tracking**
- Real-time tracking of income and expenses
- Categorized transaction management
- Visual balance overview with deficit warnings

### 🤖 **AI Financial Advisor**
- Personalized savings recommendations powered by Google's Generative AI
- Smart financial insights based on your spending patterns
- Contextual advice for better financial decisions

### 🎯 **Personal Savings Goals**
- Set and track individual savings targets
- Progress monitoring with visual indicators
- Flexible goal management with date ranges

### 👥 **Group Savings**
- Collaborative savings goals with friends and family
- Multi-participant contribution tracking
- Shared financial objectives management

### 📝 **Budget Planner**
- Monthly budget creation and management
- Category-wise budget allocation
- Spending vs. budget comparison

### 📈 **Visual Reports**
- Comprehensive financial charts and graphs
- Spending pattern analysis
- Progress tracking visualizations

### 🌍 **Ghana-Focused Features**
- Ghana Cedi (GHS) currency support
- Local financial context and advice
- Culturally relevant savings strategies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ROBO-WORLD-RB/CASHFLOW.git
   cd CASHFLOW
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Google AI API key and other required environment variables.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **AI Integration**: Google Generative AI (Gemini)
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── ui/                # Reusable UI components
│   └── budgetup/          # Feature-specific components
├── ai/                    # AI integration and flows
├── lib/                   # Utility functions and helpers
└── types/                 # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with the following variables:

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### AI Features
The application uses Google's Generative AI for providing personalized financial advice. Make sure to:
1. Get a Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your environment variables
3. The AI advisor will provide contextual savings suggestions based on user data

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- AI powered by [Google Generative AI](https://ai.google.dev/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/ROBO-WORLD-RB/CASHFLOW/issues) page
2. Create a new issue if your question isn't already answered
3. Provide as much detail as possible when reporting bugs

---

**Made with ❤️ for the Ghanaian community**
