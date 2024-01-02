import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@app/frontend-admin/components/Auth/AuthProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes } from './routes';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient();

export function App() {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
