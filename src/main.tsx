import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { setupMockServer } from './mocks/msw.ts'

if (process.env.COMMIT_HASH) console.info(`Running ${process.env.COMMIT_HASH}`)

await setupMockServer()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
