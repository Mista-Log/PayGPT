import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./routes/index";
import ChatPage from "./routes/chat";
import DocsPage from "./routes/docs";
import InsightsPage from "./routes/insights";
import InvoicesPage from "./routes/invoices";
import LoginPage from "./routes/login";
import PaymentsPage from "./routes/payments";
import PricingPage from "./routes/pricing";
import SignupPage from "./routes/signup";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/invoices" element={<InvoicesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
