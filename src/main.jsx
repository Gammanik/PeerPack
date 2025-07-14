import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SearchCouriers from "./SearchCouriers.jsx";
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <SearchCouriers/>
  </StrictMode>
)
