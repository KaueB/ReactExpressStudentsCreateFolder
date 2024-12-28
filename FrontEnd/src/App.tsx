import { useContext } from 'react';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Router from './router';
import Loading from './components/Loading';
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <AuthProvider>
      <AppReload />
    </AuthProvider>
  );
}
// tive que separar pois, AuthProvider é um cotexto, e nao posso usar um contexto dentro de um texto aparentemente.
function AppReload() {
  const { reload } = useContext(AuthContext);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {reload ? <Router /> : <Loading />}
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
