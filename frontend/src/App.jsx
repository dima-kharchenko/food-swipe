import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import page_routes from './Pages/page_routes';
import ProtectedRoute from './Components/ProtectedRoute';


function App() {
  return (
    <>
    <Router>
        <Routes>
        {page_routes.map(({ path, page: Page, protected: isProtected }, index) => {
            return (
                <Route
                    key={index}
                    path={path}
                    element={isProtected ? <ProtectedRoute><Page /></ProtectedRoute> : <Page />} //TEST
                />
            );
        })}
        </Routes>
    </Router>
    </>
  )
}

export default App
