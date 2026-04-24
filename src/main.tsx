import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { treeService } from './services/tree'

// 開発用: ブラウザのコンソールからtreeServiceにアクセスできるようにする
if (import.meta.env.DEV) {
  (window as any).treeService = treeService;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

