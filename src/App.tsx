import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import IssueDetailPage from "./pages/IssueDetailPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/repo/:owner/:repo/issue/:number" element={<IssueDetailPage />} />
      </Routes>

      <footer className="border-t border-surface-700/20 py-4 text-center text-[11px] text-slate-600">
        PR Radar — Open-source contribution scanner
      </footer>
    </div>
  );
}
