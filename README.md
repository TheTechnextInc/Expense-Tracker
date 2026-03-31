# SpendWise - Expense Tracker & Budget Management System

A modern, full-featured expense tracking and budget management application built with Next.js 15, React 19, and Tailwind CSS.

## Features

### Expense Management
- **Add Expenses**: Record expenditures with amount, category, description, and date
- **Edit Expenses**: Modify existing expense entries inline
- **Delete Expenses**: Remove expenses with confirmation
- **Search & Filter**: Find expenses by description or filter by category
- **Sort Options**: Sort by date (newest/oldest) or amount (highest/lowest)

### Budget Management
- **Monthly Budgets**: Set budget goals for each spending category
- **Progress Tracking**: Visual progress bars showing budget utilization
- **Status Indicators**: Color-coded status (green/amber/red) based on spending
- **Inline Editing**: Quick edit and delete budget goals

### Analytics & Visualization
- **Dashboard Overview**: At-a-glance view of total spent, budget, and remaining balance
- **Category Breakdown**: Donut chart showing spending distribution by category
- **Budget vs Actual**: Horizontal bar chart comparing budgeted vs actual spending
- **Daily Spending**: Cumulative area chart tracking daily expenditures
- **Monthly Trends**: 6-month trend analysis with bar chart visualization
- **Month-over-Month**: Percentage change indicators for key metrics

### Alerts & Notifications
- **Budget Warnings**: Alert banners when spending reaches 80% of budget
- **Over Budget Alerts**: Critical warnings when budget is exceeded
- **Toast Notifications**: Feedback for all user actions (add, edit, delete)

### User Experience
- **Responsive Design**: Fully functional on desktop, tablet, and mobile
- **Dark Theme**: Modern fintech aesthetic with dark mode
- **Sidebar Navigation**: Persistent sidebar on desktop, hamburger menu on mobile
- **Month Selector**: Navigate between months to view historical data

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner
- **State Management**: Custom store with useSyncExternalStore

## Project Structure

```
├── app/
│   ├── globals.css          # Theme tokens and global styles
│   ├── layout.tsx           # Root layout with fonts and metadata
│   └── page.tsx             # Main application page
├── components/
│   ├── analytics-view.tsx   # Analytics charts and insights
│   ├── app-shell.tsx        # Application shell with sidebar
│   ├── budget-alerts.tsx    # Budget warning banners
│   ├── budget-manager.tsx   # Budget CRUD interface
│   ├── dashboard-view.tsx   # Dashboard overview
│   ├── expense-form.tsx     # Add/edit expense dialog
│   ├── expense-list.tsx     # Expense list with filters
│   ├── month-selector.tsx   # Month navigation
│   ├── spending-chart.tsx   # Category breakdown donut chart
│   └── stat-cards.tsx       # KPI stat cards
├── lib/
│   ├── store.ts             # State management and data layer
│   └── utils.ts             # Utility functions
└── components/ui/           # shadcn/ui components
```

## Data Model

### Expense
```typescript
interface Expense {
  id: string
  amount: number
  category: Category
  description: string
  date: string // ISO date string
  createdAt: string
}
```

### Budget
```typescript
interface Budget {
  id: string
  category: Category
  amount: number
  month: string // Format: "YYYY-MM"
}
```

### Categories
- Housing (rent, mortgage, repairs)
- Food (groceries, dining out)
- Transport (fuel, public transit, maintenance)
- Entertainment (movies, games, subscriptions)
- Shopping (clothing, electronics, home goods)
- Health (medical, pharmacy, fitness)
- Utilities (electricity, water, internet)
- Education (courses, books, supplies)
- Other (miscellaneous expenses)

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding an Expense
1. Click the "Add Expense" button in the header
2. Fill in the amount, select a category, add a description
3. Choose the date and click "Add Expense"

### Setting a Budget
1. Navigate to the "Budgets" tab
2. Select a category and enter the budget amount
3. Click "Set Budget" to save

### Viewing Analytics
1. Navigate to the "Analytics" tab
2. Use the sub-tabs to switch between different chart views
3. Use the month selector to view historical data

## License

MIT
