import { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

const ProductFilter = () => {
  const { categories, updateFilters } = useContext(ProductContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
      
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price Range
          </label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="minPrice" className="sr-only">Minimum Price</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="Min"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="sr-only">Maximum Price</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Max"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Sort Filter */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <select
            id="sort"
            name="sort"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        
        {/* Reset Button */}
        <button
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md text-sm"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
