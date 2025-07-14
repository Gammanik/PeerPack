import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SearchCouriers from "./SearchCouriers.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <SearchCouriers/>
  </StrictMode>
)
