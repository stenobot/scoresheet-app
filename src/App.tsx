import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Scoresheet from './components/Scoresheet';
import Start from './components/Start';
import Settings from './components/Settings';

function App() {

  return (
        <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route 
          path="/settings" 
          element={
            <Settings />} />
        <Route 
          path="/scoresheet" 
          element={
            <Scoresheet />} />
      </Routes>
    </Router>
  );
}

export default App;
