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
import {
  ExperimentCataloguePage,
  ExperimentDetailsPage,
  ExperimentLabPage,
} from './features/experiment-studio';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isFullViewportRoute =
    location.pathname.startsWith('/app/reader') ||
    location.pathname.startsWith('/app/village-builder');

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF9] text-[#352F2A]">
      {!isFullViewportRoute && <Navbar />}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/schedule" element={<DashboardPage />} />
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/explore" element={<ExplorePage />} />
          <Route path="/app/explore/topics/:topicId" element={<TopicDetailPage />} />
          <Route path="/app/library" element={<LibraryPage />} />
          <Route path="/app/books/:editionId" element={<BookDetailsPage />} />
          <Route path="/app/reader/:documentId" element={<ReaderPage />} />
          <Route path="/app/stem-lens" element={<StemLensPage />} />
          <Route path="/app/village-builder" element={<VillageBuilderPage />} />
          <Route path="/app/experiments" element={<ExperimentCataloguePage />} />
          <Route path="/app/experiments/:id" element={<ExperimentDetailsPage />} />
          <Route path="/app/experiments/:id/lab" element={<ExperimentLabPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isFullViewportRoute && <Footer />}
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
