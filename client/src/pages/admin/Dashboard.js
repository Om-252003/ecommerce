import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../context/ProductContext';
import axios from 'axios';

const Dashboard = () => {
  const { products } = useContext(ProductContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0
  });

  useEffect(() => {
    // In a real app, you would fetch these stats from your API
    // This is just a placeholder
    const fetchStats = async () => {
      try {
        // Simulating API calls for stats
        setStats({
          totalUsers: 42,
          totalOrders: 156
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Products</h2>
          <p className="text-3xl font-bold text-primary">{products.length}</p>
          <Link to="/admin/products" className="mt-4 text-sm text-primary hover:text-primary-dark font-medium inline-block">
            Manage Products →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Users</h2>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
          <span className="mt-4 text-sm text-gray-500 inline-block">
            Registered users
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Orders</h2>
          <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
          <span className="mt-4 text-sm text-gray-500 inline-block">
            Total orders
          </span>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/products/add"
            className="bg-primary text-white p-4 rounded-md hover:bg-primary-dark flex items-center justify-center"
          >
            <span>Add New Product</span>
          </Link>
          <Link
            to="/admin/products"
            className="bg-gray-100 text-gray-800 p-4 rounded-md hover:bg-gray-200 flex items-center justify-center"
          >
            <span>View All Products</span>
          </Link>
          <Link
            to="/products"
            className="bg-gray-100 text-gray-800 p-4 rounded-md hover:bg-gray-200 flex items-center justify-center"
          >
            <span>View Store Front</span>
          </Link>
          <button
            className="bg-gray-100 text-gray-800 p-4 rounded-md hover:bg-gray-200 flex items-center justify-center"
          >
            <span>Generate Reports</span>
          </button>
        </div>
      </div>
      
      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recently Added Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.slice(0, 5).map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.image || '/placeholder.svg?height=40&width=40'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category?.name || 'Uncategorized'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/admin/products/edit/${product._id}`} className="text-primary hover:text-primary-dark mr-4">
                      Edit
                    </Link>
                    <Link to={`/products/${product._id}`} className="text-gray-600 hover:text-gray-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
