const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getFreeModels = async () => {
  try {
    const response = await fetch(`${apiUrl}/free-models`);
    return response.json();
  } catch (error) {
    console.log('Error fetching free models:', error);
  }
};

export const api = { getFreeModels };
