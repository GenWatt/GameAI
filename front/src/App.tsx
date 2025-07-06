import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './app/routes';
import { ThemeProvider } from './components/theme-provider'
import { RouterProvider } from "react-router";
import { queryClient } from './shared/api/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from './components/ui/sonner';

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>

      <Toaster />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App
