# Tournament Management Frontend

Welcome to the **Tournament Management Frontend** project! This is a modern, responsive, and highly interactive web application designed to handle tournament operations, manage user dashboards, and provide a seamless experience for participants and organizers.

## 📖 Project Overview

The **Tournament Management Frontend** is a robust Next.js application built with the App Router. It serves as the user-facing interface for managing tournaments, offering dedicated layouts for authentication, public pages, and secure user dashboards. The project emphasizes a clean, component-driven architecture, persistent state management, and a premium user experience with smooth animations and interactive UI elements.

## ✨ Feature List

- **User Authentication**: Secure login and registration flows with a dedicated authentication layout.
- **Interactive Dashboard**: A comprehensive dashboard for users and admins to manage their tournament activities, profiles, and statistics.
- **Payment Integration**: Seamless and secure payment processing integrated with **Stripe**.
- **Dynamic Tournaments**: Discover, view, and interact with various tournaments and "Proving Camp" modules.
- **Form Handling**: Robust and accessible form validation using React Hook Form.
- **Responsive Design**: Fully mobile-responsive layouts tailored with Tailwind CSS.
- **Animations & Micro-interactions**: Engaging UI animations powered by Framer Motion and Lottie.
- **State Management**: Centralized application state using Redux Toolkit with `redux-persist` for retaining data across sessions.
- **Toast Notifications**: Elegant and responsive user feedback using Sonner and SweetAlert2.

## 🛠️ Technologies Used (What I Use in This Project)

This project leverages a modern web development stack to ensure high performance and maintainability:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & shadcn-inspired UI components
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [redux-persist](https://github.com/rt2zz/redux-persist)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/)
- **Payments**: [Stripe](https://stripe.com/) (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [dotLottie](https://lottiefiles.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) (Icons), [Swiper](https://swiperjs.com/) (Carousels)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) & [SweetAlert2](https://sweetalert2.github.io/)

## 🚀 How to Run Locally

Follow these steps to set up and run the project on your local machine:

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) installed on your system.

### 2. Clone the Repository

```bash
git clone <your-repository-url>
cd tournament-management-frontend
```

### 3. Install Dependencies

Open your terminal in the project root and run:

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory (you can use the provided `example.env` as a reference if available) and add the necessary environment variables:

```env
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_PORT=5000
NEXT_PUBLIC_BASE_URL=https://api.yourproductiondomain.com/api
NEXT_PUBLIC_DEV_BASE_URL=http://localhost:5000/api
# Add your Stripe public key if needed
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 5. Start the Development Server

Run the following command to start the app in development mode:

```bash
npm run dev
```

### 6. View the Application

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) (or the port specified in your `.env` file) to see the application running.

---

### Quality Checks & Building

- To run linting: `npm run lint`
- To build for production: `npm run build`
- To start the production server: `npm run start`

## 📄 License

This project is open-source and available under the MIT License.
