import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';
import { Routes } from './routes';

export function App() {
  const { toast } = useToast();

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
            toast({ title: message, variant: 'destructive' });
            console.error(message);
          }
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          if (isAxiosError(error)) {
            const message = error.response?.data.message;
            toast({ title: message, variant: 'destructive' });
            console.error(message);
          }
        },
      }),
    });
  }, [toast]);

  return (
    <>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
