import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource-variable/jost/wght.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import './site.css';
import { Site } from './site';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Site />
  </StrictMode>
);
