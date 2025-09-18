import AppRoutes from './pages/AppRoutes';
import { AuthProvider } from './auth';
import { BrowserRouter } from 'react-router-dom';

export default function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
