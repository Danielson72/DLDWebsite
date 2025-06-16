import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { Library } from './pages/Library';
import { Ministry } from './pages/Ministry';
import { Music } from './pages/Music';
import { MusicUpload } from './pages/MusicUpload';
import { Services } from './pages/Services';
import { YouTube } from './pages/YouTube';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="music" element={<Music />} />
          <Route path="music/upload" element={<MusicUpload />} />
          <Route path="library" element={<Library />} />
          <Route path="ministry" element={<Ministry />} />
          <Route path="services" element={<Services />} />
          <Route path="youtube" element={<YouTube />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;