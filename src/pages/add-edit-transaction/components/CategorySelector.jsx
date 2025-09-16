import React, { useState, useEffect } from 'react';
import { categoryService } from '../../../services/categoryService';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CategorySelector = ({ selectedCategory, onCategoryChange, transactionType, error }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Tag');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      setIsLoading(true);
      setFetchError(null);
      try {
        const { data, error } = await categoryService.getCategories(user.id, transactionType === 'transfer' ? null : transactionType);
        if (error) {
          throw error;
        }
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setFetchError('Failed to load categories.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [user, transactionType]);

  const availableIcons = [
    'Tag', 'Star', 'Heart', 'Coffee', 'Car', 'Home', 'Briefcase', 'Gift',
    'Music', 'Camera', 'Book', 'Gamepad2', 'Plane', 'Bike', 'Pizza', 'Shirt'
  ];

  const filteredCategories = categories?.filter(category =>
    category?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setIsModalOpen(false);
    setSearchTerm('');
  };

  const handleAddCategory = async () => {
    if (newCategoryName?.trim() && user) {
      try {
        const newCategoryData = {
          user_id: user.id,
          name: newCategoryName,
          icon: newCategoryIcon,
          color: 'text-gray-500', // Default color, can be expanded later
          category_type: transactionType === 'transfer' ? 'expense' : transactionType, // Categories are either income or expense
          is_active: true,
        };
        const { data, error } = await categoryService.createCategory(newCategoryData);
        if (error) {
          throw error;
        }
        onCategoryChange(data);
        setIsModalOpen(false);
        setNewCategoryName('');
        setNewCategoryIcon('Tag');
        // Re-fetch categories to update the list
        const { data: updatedCategories } = await categoryService.getCategories(user.id, transactionType === 'transfer' ? null : transactionType);
        setCategories(updatedCategories);
      } catch (err) {
        console.error('Failed to add category:', err);
        // Optionally show an error message to the user
      }
    }
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Category *
        </label>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`w-full flex items-center justify-between p-3 bg-input border border-border rounded-lg hover:bg-muted transition-colors ${
            error ? 'border-error' : ''
          }`}
        >
          {selectedCategory ? (
            <div className="flex items-center space-x-3">
              <Icon name={selectedCategory?.icon} size={20} className={selectedCategory?.color} />
              <span className="text-foreground">{selectedCategory?.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select a category</span>
          )}
          <Icon name="ChevronDown" size={20} className="text-muted-foreground" />
        </button>
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
      {/* Category Selection Modal */}
      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 bg-card border border-border rounded-lg shadow-elevated z-50 max-h-[80vh] overflow-hidden md:inset-x-auto md:w-96 md:left-1/2 md:-translate-y-1/2">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Select Category</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              <Input
                type="search"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto p-4">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-muted-foreground text-sm mt-2">Loading categories...</p>
                </div>
              ) : fetchError ? (
                <div className="text-center py-4 text-error text-sm">
                  {fetchError}
                </div>
              ) : filteredCategories?.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No categories found. Try adding one!
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCategories?.map((category) => (
                    <button
                      key={category?.id}
                      onClick={() => handleCategorySelect(category)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <Icon name={category?.icon} size={20} className={category?.color} />
                      <span className="text-foreground">{category?.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border">
              <div className="space-y-3">
                <Input
                  label="New Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e?.target?.value)}
                  placeholder="Enter category name"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Icon</label>
                  <div className="grid grid-cols-8 gap-2">
                    {availableIcons?.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setNewCategoryIcon(iconName)}
                        className={`p-2 rounded-md border transition-colors ${
                          newCategoryIcon === iconName
                            ? 'border-primary bg-primary/10' :'border-border hover:bg-muted'
                        }`}
                      >
                        <Icon name={iconName} size={16} />
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName?.trim()}
                  className="w-full"
                >
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CategorySelector;