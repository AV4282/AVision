import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AuthProvider from './auth'
import ThemeProvider from './theme'
import PrivacyPolicy from './PrivacyPolicy'
import './index.css'
import './privacy-policy.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      {/^\/privacy\/?$/.test(window.location.pathname) ? (
        <PrivacyPolicy />
      ) : (
        <AuthProvider>
          <App />
        </AuthProvider>
      )}
    </ThemeProvider>
  </React.StrictMode>,
)
