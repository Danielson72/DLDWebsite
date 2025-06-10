import { useState, useEffect } from 'react';

export default function useAdminFlag(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // In development, check environment variable
    if (import.meta.env.DEV) {
      setIsAdmin(import.meta.env.VITE_ENABLE_ADMIN === 'on');
    } else {
      // In production, always false for security
      setIsAdmin(false);
    }
  }, []);

  return isAdmin;
}