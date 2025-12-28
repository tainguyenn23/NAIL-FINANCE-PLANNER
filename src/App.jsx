import { FinanceProvider } from './context/FinanceContext.jsx';
import Dashboard from './components/layout/Dashboard.jsx';
function App() {
  return (
    <>
      <FinanceProvider>
        <Dashboard />
      </FinanceProvider>
    </>
  )
}

export default App
