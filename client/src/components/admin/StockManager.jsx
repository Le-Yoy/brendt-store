'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';
import styles from './StockManager.module.css';

const StockManager = () => {
  const { showSuccess, showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockAlert, setStockAlert] = useState(10); // Low stock threshold

  // Fetch products with color details
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getProductsWithColorDetails();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
      product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  // Calculate stock statistics
  const stockStats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.colors.some(c => c.inStock && c.stock > 0)).length,
    lowStock: products.filter(p => 
      p.colors.some(c => c.inStock && c.stock > 0 && c.stock <= stockAlert)
    ).length,
    outOfStock: products.filter(p => p.colors.every(c => !c.inStock || c.stock === 0)).length,
    totalItems: products.reduce((total, product) => 
      total + product.colors.reduce((sum, color) => sum + (color.stock || 0), 0), 0
    )
  };

  // Update stock for a specific color
  const updateStock = async (productId, colorIndex, newStock) => {
    try {
      await adminService.updateColorStockNumber(productId, colorIndex, newStock);
      showSuccess('Stock mis à jour avec succès');
      fetchProducts(); // Refresh data
    } catch (error) {
      console.error('Error updating stock:', error);
      showError('Erreur lors de la mise à jour du stock');
    }
  };

  // Bulk update stocks
  const bulkUpdateStocks = async (updates) => {
    try {
      for (const update of updates) {
        await adminService.updateColorStockNumber(
          update.productId, 
          update.colorIndex, 
          update.stock
        );
      }
      showSuccess(`${updates.length} stocks mis à jour avec succès`);
      fetchProducts();
    } catch (error) {
      console.error('Error in bulk update:', error);
      showError('Erreur lors de la mise à jour groupée');
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }) || '0,00 MAD';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Gestion des stocks</h1>
        <p className={styles.pageDescription}>
          Surveillez et gérez les stocks de tous vos produits et leurs variantes
        </p>
      </div>

      {/* Stock Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stockStats.totalProducts}</div>
          <div className={styles.statLabel}>Produits totaux</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stockStats.totalItems}</div>
          <div className={styles.statLabel}>Articles totaux</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stockStats.inStock}</div>
          <div className={styles.statLabel}>En stock</div>
          <div className={styles.statColor} style={{backgroundColor: 'var(--color-success)'}}></div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stockStats.lowStock}</div>
          <div className={styles.statLabel}>Stock faible</div>
          <div className={styles.statColor} style={{backgroundColor: 'var(--color-warning)'}}></div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stockStats.outOfStock}</div>
          <div className={styles.statLabel}>Rupture</div>
          <div className={styles.statColor} style={{backgroundColor: 'var(--color-error)'}}></div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className={styles.filterSection}>
        <div className={styles.searchRow}>
          <input
            type="text"
            placeholder="Rechercher des produits..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className={styles.stockAlertControl}>
            <label>Seuil stock faible:</label>
            <input
              type="number"
              min="0"
              value={stockAlert}
              onChange={(e) => setStockAlert(parseInt(e.target.value) || 0)}
              className={styles.numberInput}
            />
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <table className={styles.stockTable}>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Couleurs & Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <ProductStockRow
                  key={product._id}
                  product={product}
                  stockAlert={stockAlert}
                  onUpdateStock={updateStock}
                  formatPrice={formatPrice}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Product Stock Row Component
const ProductStockRow = ({ product, stockAlert, onUpdateStock, formatPrice }) => {
  const [editingStock, setEditingStock] = useState({});
  const [tempStocks, setTempStocks] = useState({});

  const getStockStatus = (color) => {
    if (!color.inStock || color.stock === 0) return 'out-of-stock';
    if (color.stock <= stockAlert) return 'low-stock';
    return 'in-stock';
  };

  const handleStockEdit = (colorIndex, value) => {
    setTempStocks(prev => ({
      ...prev,
      [`${product._id}-${colorIndex}`]: parseInt(value) || 0
    }));
  };

  const handleStockSave = async (colorIndex) => {
    const key = `${product._id}-${colorIndex}`;
    const newStock = tempStocks[key];
    
    if (newStock !== undefined) {
      await onUpdateStock(product._id, colorIndex, newStock);
      setEditingStock(prev => ({...prev, [key]: false}));
      setTempStocks(prev => {
        const newTemp = {...prev};
        delete newTemp[key];
        return newTemp;
      });
    }
  };

  const handleStockCancel = (colorIndex) => {
    const key = `${product._id}-${colorIndex}`;
    setEditingStock(prev => ({...prev, [key]: false}));
    setTempStocks(prev => {
      const newTemp = {...prev};
      delete newTemp[key];
      return newTemp;
    });
  };

  const totalStock = product.colors.reduce((sum, color) => sum + (color.stock || 0), 0);
  const hasLowStock = product.colors.some(color => 
    color.inStock && color.stock > 0 && color.stock <= stockAlert
  );
  const hasOutOfStock = product.colors.some(color => !color.inStock || color.stock === 0);

  return (
    <tr className={styles.productRow}>
      <td className={styles.productCell}>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          <div className={styles.productMeta}>
            ID: {product._id.substr(-6)}
          </div>
        </div>
      </td>
      <td className={styles.categoryCell}>
        {product.categoryName}
      </td>
      <td className={styles.priceCell}>
        {formatPrice(product.price)}
      </td>
      <td className={styles.colorsCell}>
        <div className={styles.colorsList}>
          {product.colors.map((color, index) => {
            const key = `${product._id}-${index}`;
            const isEditing = editingStock[key];
            const tempStock = tempStocks[key];
            const stockStatus = getStockStatus(color);
            
            return (
              <div key={index} className={styles.colorStockItem}>
                <div className={styles.colorHeader}>
                  <span
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color.code }}
                  ></span>
                  <span className={styles.colorName}>{color.name}</span>
                  <span className={`${styles.stockBadge} ${styles[stockStatus]}`}>
                    {stockStatus === 'in-stock' ? 'En stock' : 
                     stockStatus === 'low-stock' ? 'Stock faible' : 'Rupture'}
                  </span>
                </div>
                <div className={styles.stockControls}>
                  {isEditing ? (
                    <div className={styles.stockEditControls}>
                      <input
                        type="number"
                        min="0"
                        value={tempStock !== undefined ? tempStock : color.stock || 0}
                        onChange={(e) => handleStockEdit(index, e.target.value)}
                        className={styles.stockInput}
                      />
                      <button
                        className={styles.saveButton}
                        onClick={() => handleStockSave(index)}
                      >
                        ✓
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => handleStockCancel(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.stockDisplay}>
                      <span className={styles.stockNumber}>{color.stock || 0}</span>
                      <button
                        className={styles.editButton}
                        onClick={() => setEditingStock(prev => ({...prev, [key]: true}))}
                      >
                        Modifier
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </td>
      <td className={styles.statusCell}>
        <div className={styles.stockSummary}>
          <div className={styles.totalStock}>Total: {totalStock}</div>
          {hasLowStock && <div className={styles.lowStockWarning}>Stock faible</div>}
          {hasOutOfStock && <div className={styles.outOfStockWarning}>Rupture partielle</div>}
        </div>
      </td>
      <td className={styles.actionsCell}>
        <button
          className={styles.actionButton}
          onClick={() => {
            // Implement quick restock functionality
            console.log('Quick restock for product:', product._id);
          }}
        >
          Réapprovisionner
        </button>
      </td>
    </tr>
  );
};

export default StockManager;