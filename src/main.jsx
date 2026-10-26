import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DEMO_MODE } from './supabase'

function DemoBanner() {
  return (
    <div style={{ background: "#6b8e5a", color: "#fff", fontSize: 12, textAlign: "center", padding: "8px 12px" }}>
      Démo avec des données fictives — rien n'est enregistré.{" "}
      <a href="https://github.com/adrienrabillat/coach-de-poche" style={{ color: "#fff" }}>Voir le code</a>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {DEMO_MODE && <DemoBanner />}
    <App />
  </React.StrictMode>
)
