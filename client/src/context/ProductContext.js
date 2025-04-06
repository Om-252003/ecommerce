import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  });

  // Fetch products with filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.sort) queryParams.append('sort', filters.sort);
      
      const res = await axios.get(`/api/products?${queryParams.toString()}`);
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    }
  };

  // Fetch single product
  const fetchProduct = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/products/${id}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
      setLoading(false);
      throw err;
    }
  };

  // Create product (admin only)
  const createProduct = async (productData, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const res = await axios.post('/api/products', productData, config);
      setProducts([...products, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
      throw err;
    }
  };

  // Update product (admin only)
  const updateProduct = async (id, productData, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const res = await axios.put(`/api/products/${id}`, productData, config);
      
      setProducts(products.map(product => 
        product._id === id ? res.data : product
      ));
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      throw err;
    }
  };

  // Delete product (admin only)
  const deleteProduct = async (id, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.delete(`/api/products/${id}`, config);
      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      throw err;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Fetch categories on initial render
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        filters,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        updateFilters
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
