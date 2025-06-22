
import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('wifi-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (locationId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId];
      
      localStorage.setItem('wifi-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (locationId: number) => favorites.includes(locationId);

  return { favorites, toggleFavorite, isFavorite };
}
