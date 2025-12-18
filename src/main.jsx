import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Flowbite } from 'flowbite-react'
import theme from './flowbite-theme.js'
import "./index.css"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Flowbite theme={{ theme }}>
        <App />
      </Flowbite>
  </StrictMode>,
)
