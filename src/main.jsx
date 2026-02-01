import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App.jsx";
import { AppProvider } from "./shared/context/AppContext.jsx";
import { UserProvider } from "./shared/context/UserContext.jsx";
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <AppProvider>
        <App/>
      </AppProvider>
    </UserProvider>
  </StrictMode>
)
