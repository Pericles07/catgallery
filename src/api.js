const API_URL = "https://api.thecatapi.com/v1/images/search";


export async function fetchCats(limit = 8) {
  const API_KEY = import.meta.env.VITE_CAT_API_KEY;

  const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}`, {
    headers: {
      'x-api-key': API_KEY 
    }
  });
  
  return await response.json();
}