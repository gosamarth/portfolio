import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// console lore — the first easter egg is that there are easter eggs
console.log(
  '%cSAMARTH BUILDS.%c\nTwo worlds. Five trials. One hidden word.\nThe DOM remembers what the page forgets.',
  'color:#6ee7ff;font-size:20px;font-weight:bold;font-family:monospace',
  'color:#8b8fa3;font-family:monospace;font-size:12px',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
