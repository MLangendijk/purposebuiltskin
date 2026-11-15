import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/skin.css';
import '@/video/skin';
import '../site/site.css';
import './elements.css';
import { Elements } from './elements';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Elements />
  </StrictMode>
);
