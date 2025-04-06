import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (err) {
      throw new Error('Failed to fetch product details');
    }
  };

  const updateProduct = async (id, productData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put(`/api/products/${id}`, productData, config);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update product');
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        categories, 
        loading, 
        error,
        fetchProduct,
        updateProduct,
        fetchProducts 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
