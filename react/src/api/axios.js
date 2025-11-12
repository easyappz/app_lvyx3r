import axios from 'axios';

let openapiLoaded = false;
async function loadOpenAPIOnce() {
  if (openapiLoaded) return;
  try {
    const res = await fetch('/openapi.yml');
    const text = await res.text();
    window.__openapi = text;
  } catch (e) {
    console.warn('Failed to load openapi.yml', e);
  } finally {
    openapiLoaded = true;
  }
}

// Kick off load immediately
loadOpenAPIOnce();

const instance = axios.create({ baseURL: '/' });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
export { loadOpenAPIOnce };
