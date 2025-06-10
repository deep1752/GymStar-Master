'use client';

import { useEffect } from 'react';

export default function ScriptLoader() {
  useEffect(() => {
    const loadScript = (src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };

    loadScript('https://code.jquery.com/jquery-3.4.1.min.js');
    loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js');
    loadScript('/lib/easing/easing.min.js');
    loadScript('/lib/waypoints/waypoints.min.js');
    loadScript('/lib/counterup/counterup.min.js');
    loadScript('/lib/owlcarousel/owl.carousel.min.js');
  }, []);

  return null;
}
