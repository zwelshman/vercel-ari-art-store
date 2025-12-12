import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GenerationParams, ArtStyle } from "@/types";

interface GenerationState {
  prompt: string;
  negativePrompt: string;
  style: ArtStyle;
  width: number;
  height: number;
  steps: number;
  guidance: number;
  seed: number | null;
  numImages: number;
  isGenerating: boolean;
  generatedImages: string[];
  history: GenerationParams[];
}

interface GenerationActions {
  setPrompt: (prompt: string) => void;
  setNegativePrompt: (negativePrompt: string) => void;
  setStyle: (style: ArtStyle) => void;
  setDimensions: (width: number, height: number) => void;
  setSteps: (steps: number) => void;
  setGuidance: (guidance: number) => void;
  setSeed: (seed: number | null) => void;
  setNumImages: (num: number) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGeneratedImages: (images: string[]) => void;
  addToHistory: (params: GenerationParams) => void;
  reset: () => void;
}

const initialState: GenerationState = {
  prompt: "",
  negativePrompt: "",
  style: "none",
  width: 1024,
  height: 1024,
  steps: 30,
  guidance: 7.5,
  seed: null,
  numImages: 1,
  isGenerating: false,
  generatedImages: [],
  history: [],
};

export const useGenerationStore = create<GenerationState & GenerationActions>()(
  persist(
    (set) => ({
      ...initialState,
      setPrompt: (prompt) => set({ prompt }),
      setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
      setStyle: (style) => set({ style }),
      setDimensions: (width, height) => set({ width, height }),
      setSteps: (steps) => set({ steps }),
      setGuidance: (guidance) => set({ guidance }),
      setSeed: (seed) => set({ seed }),
      setNumImages: (numImages) => set({ numImages }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setGeneratedImages: (generatedImages) => set({ generatedImages }),
      addToHistory: (params) =>
        set((state) => ({
          history: [params, ...state.history.slice(0, 49)],
        })),
      reset: () => set(initialState),
    }),
    {
      name: "generation-store",
      partialize: (state) => ({
        history: state.history,
        style: state.style,
        steps: state.steps,
        guidance: state.guidance,
      }),
    }
  )
);

// Cart Store
interface CartItem {
  artworkId: string;
  title: string;
  imageUrl: string;
  price: number;
  licenseType: string;
  quantity: number;
  printSize?: string;
  printMaterial?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (artworkId: string) => void;
  updateQuantity: (artworkId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) =>
              i.artworkId === item.artworkId &&
              i.licenseType === item.licenseType &&
              i.printSize === item.printSize
          );
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.artworkId === item.artworkId &&
                i.licenseType === item.licenseType
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (artworkId) =>
        set((state) => ({
          items: state.items.filter((i) => i.artworkId !== artworkId),
        })),
      updateQuantity: (artworkId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.artworkId === artworkId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      getTotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-store",
    }
  )
);

// UI Store
interface UIState {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  modalOpen: string | null;
}

interface UIActions {
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarOpen: true,
      modalOpen: null,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      openModal: (modalId) => set({ modalOpen: modalId }),
      closeModal: () => set({ modalOpen: null }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
