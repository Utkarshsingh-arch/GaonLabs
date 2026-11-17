import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WelcomePage } from './pages/WelcomePage';
import { SignupPage } from './pages/SignupPage';
import { SigninPage } from './pages/SigninPage';
import { DashboardPage } from './pages/DashboardPage';
import { StemLensPage } from './pages/StemLensPage';
import { VillageBuilderPage } from './pages/VillageBuilderPage';
import { LibraryPage } from './pages/LibraryPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { ReaderPage } from './pages/ReaderPage';
import { ExplorePage } from './pages/ExplorePage';
import { TopicDetailPage } from './pages/TopicDetailPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isReaderRoute = location.pathname.startsWith('/app/reader');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {!isReaderRoute && <Navbar />}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/explore" element={<ExplorePage />} />
          <Route path="/app/explore/topics/:topicId" element={<TopicDetailPage />} />
          <Route path="/app/library" element={<LibraryPage />} />
          <Route path="/app/books/:editionId" element={<BookDetailsPage />} />
          <Route path="/app/reader/:documentId" element={<ReaderPage />} />
          <Route path="/app/stem-lens" element={<StemLensPage />} />
          <Route path="/app/village-builder" element={<VillageBuilderPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isReaderRoute && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
