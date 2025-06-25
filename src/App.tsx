import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Ministry } from './pages/Ministry';
import { Music } from './pages/Music';
import { MusicUpload } from './pages/MusicUpload';
import { MyMusic } from './pages/MyMusic';
import { Register } from './pages/Register';
import { Services } from './pages/Services';
import { Success } from './pages/Success';
import { YouTube } from './pages/YouTube';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="ministry" element={<Ministry />} />
          <Route path="services" element={<Services />} />
          <Route path="music" element={<Music />} />
          <Route path="music/upload" element={<MusicUpload />} />
          <Route path="my-music" element={<MyMusic />} />
          <Route path="youtube" element={<YouTube />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="success" element={<Success />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;