import { create } from "zustand";

interface FavoriteStore {
  favoriteIds: string[]; // Favorilenen etkinliklerin ID listesi
  setFavorites: (ids: string[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => boolean; // Toggle işlemi ve yeni durumu döndürür
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favoriteIds: [],
  
  setFavorites: (ids) => set({ favoriteIds: ids }),
  
  addFavorite: (id) => set((state) => {
    // Zaten varsa ekleme
    if (state.favoriteIds.includes(id)) return state;
    return { favoriteIds: [...state.favoriteIds, id] };
  }),
  
  removeFavorite: (id) => set((state) => ({ 
    favoriteIds: state.favoriteIds.filter((favId) => favId !== id) 
  })),

  toggleFavorite: (id) => {
    const state = get();
    const isFavorite = state.favoriteIds.includes(id);
    
    if (isFavorite) {
      state.removeFavorite(id);
      return false; // Artık favori değil
    } else {
      state.addFavorite(id);
      return true; // Artık favori
    }
  }
}));