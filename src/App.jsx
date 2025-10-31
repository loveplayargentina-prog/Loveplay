import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feed from './pages/Feed';
import ConfigPage from './pages/ConfigPage';
import UploadPage from './pages/UploadPage';
import Profile from './pages/Profile';
import CreatorStats from './pages/CreatorStats';
import LoginRegister from './pages/LoginRegister';
import BottomMenu from './components/BottomMenu';

function App() {
  return (
    <Router>
      <div style={{ paddingBottom:'70px' }}>
        <Routes>
          <Route path='/' element={<LoginRegister />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/profile/:nombre' element={<Profile />} />
          <Route path='/stats' element={<CreatorStats />} />
<Route path='/config' element={<ConfigPage />} />
<Route path='/upload' element={<UploadPage />} />
        </Routes>
        <BottomMenu />
      </div>
    </Router>
  );
}

export default App;
