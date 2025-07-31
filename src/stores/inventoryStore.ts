import { create } from 'zustand';
import { Ingredient, Transfer } from '../types';
import { apiService } from '../services/api';

interface InventoryState {
  ingredients: Ingredient[];
  transfers: Transfer[];
  isLoading: boolean;
  error: string | null;
  
  fetchIngredients: () => Promise<void>;
  fetchTransfers: () => Promise<void>;
  createTransfer: (ingredientId: string, quantity: number) => Promise<void>;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => Promise<void>;
  createIngredient: (ingredient: Partial<Ingredient>) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  ingredients: [],
  transfers: [],
  isLoading: false,
  error: null,

  fetchIngredients: async () => {
    set({ isLoading: true, error: null });
    try {
      const ingredients = await apiService.getIngredients();
      set({ ingredients, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch ingredients',
        isLoading: false 
      });
    }
  },

  fetchTransfers: async () => {
    set({ isLoading: true, error: null });
    try {
      const transfers = await apiService.getTransfers();
      set({ transfers, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch transfers',
        isLoading: false 
      });
    }
  },

  createTransfer: async (ingredientId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const ingredient = get().ingredients.find(ing => ing.id === ingredientId);
      if (!ingredient) throw new Error('Ingredient not found');

      const transfer = await apiService.createTransfer({
        ingredientId,
        quantity,
        ingredientName: ingredient.name,
        unit: ingredient.unit,
      });

      set(state => ({
        transfers: [transfer, ...state.transfers],
        ingredients: state.ingredients.map(ing =>
          ing.id === ingredientId
            ? {
                ...ing,
                storeQuantity: Math.max(0, ing.storeQuantity - quantity),
                kitchenQuantity: ing.kitchenQuantity + quantity
              }
            : ing
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create transfer',
        isLoading: false 
      });
      throw error;
    }
  },

  updateIngredient: async (id: string, updates: Partial<Ingredient>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedIngredient = await apiService.updateIngredient(id, updates);
      set(state => ({
        ingredients: state.ingredients.map(ing =>
          ing.id === id ? { ...ing, ...updatedIngredient } : ing
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update ingredient',
        isLoading: false 
      });
      throw error;
    }
  },

  createIngredient: async (ingredient: Partial<Ingredient>) => {
    set({ isLoading: true, error: null });
    try {
      const newIngredient = await apiService.createIngredient(ingredient);
      set(state => ({
        ingredients: [...state.ingredients, newIngredient],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create ingredient',
        isLoading: false 
      });
      throw error;
    }
  },
}));