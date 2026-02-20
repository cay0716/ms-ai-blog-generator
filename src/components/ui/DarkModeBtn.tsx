'use client';

import { Moon, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DarkModeBtn () {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(prev => !prev)}
      className=""
    >
      {dark ? ( <Moon className='transition duration-300 hover:scale-110'/> ) : (<SunMedium  className='transition duration-300 hover:scale-110'/>)}
    </button>
  );
}
