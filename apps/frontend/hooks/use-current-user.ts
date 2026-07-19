'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser({
      id: '1',
      name: 'Test user',
      email: 'test@example.com',
    });
    setLoading(false);
  }, []);
  return { user, loading };
}
