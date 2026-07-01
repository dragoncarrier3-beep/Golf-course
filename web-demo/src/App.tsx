import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { HomeScreen } from './screens/HomeScreen';
import { CourseInfoScreen } from './screens/CourseInfoScreen';
import { ScoresScreen } from './screens/ScoresScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AmenitiesScreen } from './screens/AmenitiesScreen';
import { NotesScreen } from './screens/NotesScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { ConfirmationScreen } from './screens/ConfirmationScreen';
import { ReviewsListScreen } from './screens/ReviewsListScreen';
import './styles/app.css';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-root">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/review/course-info" element={<CourseInfoScreen />} />
            <Route path="/review/scores" element={<ScoresScreen />} />
            <Route path="/review/profile" element={<ProfileScreen />} />
            <Route path="/review/amenities" element={<AmenitiesScreen />} />
            <Route path="/review/notes" element={<NotesScreen />} />
            <Route path="/review/summary" element={<SummaryScreen />} />
            <Route path="/review/confirmation" element={<ConfirmationScreen />} />
            <Route path="/reviews" element={<ReviewsListScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
