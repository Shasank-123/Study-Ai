/**
 * App.jsx
 *
 * Root component. Renders the sticky header and the Home page.
 */

import Home from './pages/Home'

export default function App() {
  return (
    <div className="app-shell">
      {/* Sticky header */}
      <header className="app-header">
        <div className="app-header__logo" aria-hidden="true">📚</div>
        <div>
          <p className="app-header__title">AI Study Assistant</p>
          <p className="app-header__subtitle">Grounded document Q&amp;A</p>
        </div>
      </header>

      {/* Main page */}
      <Home />
    </div>
  )
}
