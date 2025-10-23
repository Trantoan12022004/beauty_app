import { create } from "zustand";

interface PhotoState {
  originalUri: string | null; // Ảnh gốc (từ Selfie)
  photoUri: string | null;    // Ảnh hiện tại (có thể đã crop)
  setOriginalUri: (uri: string | null) => void;
  setPhotoUri: (uri: string | null) => void;
}

export const usePhotoStore = create<PhotoState>((set) => ({
  originalUri: null,
  photoUri: null,
  setOriginalUri: (uri) => set({ originalUri: uri, photoUri: uri }),
  setPhotoUri: (uri) => set({ photoUri: uri }),
}));
