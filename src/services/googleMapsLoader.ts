// Source: Google Maps Platform Official JS API Loader
// =========================================================================
// GOOGLE MAPS JAVASCRIPT API MODERN FUNCTIONAL LOADER
// Uses official @googlemaps/js-api-loader functional importLibrary()
// =========================================================================

import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { getGoogleMapsApiKey } from './googleRoutesService';

let optionsConfigured = false;
let loadPromise: Promise<typeof google.maps> | null = null;

export const loadGoogleMapsApi = async (): Promise<typeof google.maps> => {
  if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.Map) {
    return window.google.maps;
  }

  if (loadPromise) {
    return loadPromise;
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return Promise.reject(new Error('GOOGLE_MAPS_API_KEY_MISSING'));
  }

  loadPromise = (async () => {
    try {
      if (!optionsConfigured) {
        setOptions({
          key: apiKey,
          v: 'weekly'
        });
        optionsConfigured = true;
      }

      await importLibrary('maps');
      await importLibrary('geometry');
      await importLibrary('marker');

      return window.google.maps;
    } catch (err) {
      console.error('[Google Maps JS SDK Load Error]', err);
      loadPromise = null;
      throw err;
    }
  })();

  return loadPromise;
};
