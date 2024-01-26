import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { Routes } from './routes';
import { isAxiosError } from 'axios';
import { useMemo } from 'react';
import { useToast } from './components/ui/use-toast';

export function App() {
  const { toast } = useToast();
  // const navigate = useNavigate();

  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
      queryCache: new QueryCache({
        onError: (error) => {
          if (isAxiosError(error)) {
            const message = error.response?.data.message;
            toast({title: message});
            console.error(message);
          }
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          if (isAxiosError(error)) {
            const message = error.response?.data.message;
            toast({title: message});
            console.error(message);
          }
        },
      }),
    });
  }, [toast]);

  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
