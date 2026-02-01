import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/security/AuthContext';
import { PasswordGate } from './components/security/PasswordGate';
import { TripProvider } from './context/TripContext';
import { TripDashboard } from './components/features/dashboard/TripDashboard';
import { TripEditorPage } from './components/features/editor/TripEditorPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <PasswordGate>
            <Routes>
              <Route path="/" element={<TripDashboard />} />
              <Route path="/trip/:tripId" element={<TripEditorPage />} />
            </Routes>
          </PasswordGate>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
