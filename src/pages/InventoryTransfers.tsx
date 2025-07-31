import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Package, Clock } from 'lucide-react';
import { useInventoryStore } from '../stores/inventoryStore';
import { useUserStore } from '../stores/userStore';
import { Button } from '../components/common/Button';
import { Ingredient } from '../types';

export const InventoryTransfers: React.FC = () => {
  const { 
    ingredients, 
    transfers, 
    isLoading, 
    fetchIngredients, 
    fetchTransfers, 
    createTransfer 
  } = useInventoryStore();
  
  const { user } = useUserStore();
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [transferQuantity, setTransferQuantity] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    fetchIngredients();
    fetchTransfers();
  }, [fetchIngredients, fetchTransfers]);

  const handleTransfer = async () => {
    if (!selectedIngredient || !transferQuantity || parseFloat(transferQuantity) <= 0) {
      alert('Please select an ingredient and enter a valid quantity');
      return;
    }

    const ingredient = ingredients.find(ing => ing.id === selectedIngredient);
    const quantity = parseFloat(transferQuantity);

    if (!ingredient) {
      alert('Ingredient not found');
      return;
    }

    if (quantity > ingredient.storeQuantity) {
      alert('Insufficient stock in store');
      return;
    }

    setIsTransferring(true);
    try {
      await createTransfer(selectedIngredient, quantity);
      setSelectedIngredient('');
      setTransferQuantity('');
      alert('Transfer completed successfully!');
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Transfer failed. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  const selectedIngredientData = ingredients.find(ing => ing.id === selectedIngredient);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Inventory Transfers</h1>
          <p className="text-amber-600">Transfer ingredients from store to kitchen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transfer Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              New Transfer
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Ingredient
                </label>
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                  className="w-full px-3 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                >
                  <option value="">Choose an ingredient...</option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name} (Store: {ingredient.storeQuantity} {ingredient.unit})
                    </option>
                  ))}
                </select>
              </div>

              {selectedIngredientData && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-800 mb-2">{selectedIngredientData.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Store Stock:</span>
                      <span className="ml-2 font-medium">
                        {selectedIngredientData.storeQuantity} {selectedIngredientData.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Kitchen Stock:</span>
                      <span className="ml-2 font-medium">
                        {selectedIngredientData.kitchenQuantity} {selectedIngredientData.unit}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Transfer
                  {selectedIngredientData && (
                    <span className="text-gray-500 ml-1">({selectedIngredientData.unit})</span>
                  )}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedIngredientData?.storeQuantity || undefined}
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(e.target.value)}
                  className="w-full px-3 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                  placeholder="Enter quantity"
                />
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={handleTransfer}
                disabled={!selectedIngredient || !transferQuantity}
                loading={isTransferring}
                className="bg-green-600 hover:bg-green-700"
              >
                <ArrowRightLeft className="h-5 w-5" />
                Transfer to Kitchen
              </Button>
            </div>
          </div>

          {/* Current Inventory */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Current Inventory
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <h3 className="font-medium text-gray-800 mb-2">{ingredient.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-blue-600 font-bold text-lg">
                        {ingredient.storeQuantity}
                      </div>
                      <div className="text-blue-500 text-xs">Store {ingredient.unit}</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-green-600 font-bold text-lg">
                        {ingredient.kitchenQuantity}
                      </div>
                      <div className="text-green-500 text-xs">Kitchen {ingredient.unit}</div>
                    </div>
                  </div>
                  {ingredient.storeQuantity <= ingredient.minThreshold && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      Low stock warning!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Transfers
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Ingredient</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Transferred By</th>
                  <th className="px-6 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {transfers.slice(0, 10).map((transfer) => (
                  <tr key={transfer.id} className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {transfer.ingredientName}
                    </td>
                    <td className="px-6 py-4">
                      {transfer.quantity} {transfer.unit}
                    </td>
                    <td className="px-6 py-4">{transfer.transferredBy}</td>
                    <td className="px-6 py-4">
                      {new Date(transfer.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {transfers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No transfers yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};