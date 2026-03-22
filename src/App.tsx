import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { HomePage } from './pages/HomePage';
import { SoftwareDev } from './pages/SoftwareDev';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { Login } from './pages/Login';
import { Ministry } from './pages/Ministry';
import { Music } from './pages/Music';
import { MusicUpload } from './pages/MusicUpload';
import { MyMusic } from './pages/MyMusic';
import { Register } from './pages/Register';
import { Services } from './pages/Services';
import { Success } from './pages/Success';
import { YouTube } from './pages/YouTube';
import { Dashboard } from './pages/Dashboard';
import { AuthCallback } from './pages/AuthCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/software-dev" element={<SoftwareDev />} />
        <Route path="/software-development" element={<SoftwareDev />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/youtube" element={<YouTube />} />
        <Route path="/music" element={<Music />} />
        <Route path="/ministry" element={<Ministry />} />
        <Route path="/" element={<Layout />}>
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="music/upload" element={<MusicUpload />} />
          <Route path="my-music" element={<MyMusic />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="success" element={<Success />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;