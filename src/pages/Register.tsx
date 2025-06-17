import { PageHero } from '../components/PageHero';
import { RegistrationForm } from '../components/auth/RegistrationForm';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/music');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-black">
      <PageHero title="Join the Lion's Den" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative">
          <RegistrationForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            isModal={false}
          />
        </div>
      </div>
    </div>
  );
}