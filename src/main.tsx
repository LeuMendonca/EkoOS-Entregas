import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AutenticacaoContext'




createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <App/>
    </AuthProvider>
)