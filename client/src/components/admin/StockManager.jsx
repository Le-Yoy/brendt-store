'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';

const StockManager = () => {
  const { showSuccess, showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockAlert, setStockAlert] = useState(10); // Low stock threshold

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);

  const stockStats = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.colors.some((c) => c.inStock && c.stock > 0)).length,
    lowStock: products.filter((p) => p.colors.some((c) => c.inStock && c.stock > 0 && c.stock <= stockAlert)).length,
    outOfStock: products.filter((p) => p.colors.every((c) => !c.inStock || c.stock === 0)).length,
    totalItems: products.reduce((total, product) => total + product.colors.reduce((sum, color) => sum + (color.stock || 0), 0), 0),
  };

  const updateStock = async (productId, colorIndex, newStock) => {
    try {
      await adminService.updateColorStockNumber(productId, colorIndex, newStock);
      showSuccess('Stock mis à jour avec succès');
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
      showError('Erreur lors de la mise à jour du stock');
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Inventaire</h1>
        <p className="adm-page-sub">Surveillez et ajustez le stock de chaque variante de couleur.</p>
      </div>

      {/* Stats */}
      <div className="adm-stats-grid">
        <div className="adm-stat">
          <div className="adm-stat-label">Produits</div>
          <div className="adm-stat-value">{stockStats.totalProducts}</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-label">Articles en stock</div>
          <div className="adm-stat-value">{stockStats.totalItems}</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-label">Stock faible</div>
          <div className="adm-stat-value">{stockStats.lowStock}</div>
          <div className="adm-stat-desc">≤ {stockAlert} unités</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-label">En rupture</div>
          <div className="adm-stat-value">{stockStats.outOfStock}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="adm-toolbar">
        <input
          type="text"
          className="adm-input"
          placeholder="Rechercher un produit…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="adm-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <div className="adm-row" style={{ gap: '.4rem' }}>
          <span className="adm-label" style={{ margin: 0 }}>Seuil stock faible</span>
          <input
            type="number"
            min="0"
            className="adm-input"
            style={{ width: 80 }}
            value={stockAlert}
            onChange={(e) => setStockAlert(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="adm-spinner" />
      ) : filteredProducts.length === 0 ? (
        <div className="adm-card"><div className="adm-empty"><div className="adm-empty-title">Aucun produit</div>Aucun produit ne correspond à votre recherche.</div></div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Couleurs &amp; stock</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <ProductStockRow key={product._id} product={product} stockAlert={stockAlert} onUpdateStock={updateStock} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const formatPrice = (price) =>
  typeof price === 'number'
    ? `${price.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} DH`
    : '—';

const ProductStockRow = ({ product, stockAlert, onUpdateStock }) => {
  const [editing, setEditing] = useState({});
  const [tempStocks, setTempStocks] = useState({});

  const statusOf = (color) => {
    if (!color.inStock || color.stock === 0) return { cls: 'adm-badge--danger', label: 'Rupture' };
    if (color.stock <= stockAlert) return { cls: 'adm-badge--warn', label: 'Faible' };
    return { cls: 'adm-badge--ok', label: 'En stock' };
  };

  const startEdit = (index, current) => {
    const key = `${product._id}-${index}`;
    setTempStocks((p) => ({ ...p, [key]: current ?? 0 }));
    setEditing((p) => ({ ...p, [key]: true }));
  };

  const save = async (index) => {
    const key = `${product._id}-${index}`;
    const newStock = tempStocks[key];
    if (newStock !== undefined) {
      await onUpdateStock(product._id, index, newStock);
      setEditing((p) => ({ ...p, [key]: false }));
    }
  };

  const cancel = (index) => {
    const key = `${product._id}-${index}`;
    setEditing((p) => ({ ...p, [key]: false }));
  };

  const totalStock = product.colors.reduce((sum, color) => sum + (color.stock || 0), 0);

  return (
    <tr>
      <td>
        <div className="adm-cell-strong">{product.name}</div>
        <div className="adm-cell-muted" style={{ fontSize: '.78rem' }}>ID: {product._id.substr(-6)}</div>
      </td>
      <td className="adm-cell-muted">{product.categoryName || product.category || '—'}</td>
      <td className="adm-cell-muted">{formatPrice(product.price)}</td>
      <td>
        <div className="adm-stack" style={{ gap: '.5rem' }}>
          {product.colors.map((color, index) => {
            const key = `${product._id}-${index}`;
            const isEditing = editing[key];
            const status = statusOf(color);
            return (
              <div key={index} className="adm-row" style={{ justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap' }}>
                <div className="adm-row" style={{ gap: '.5rem', minWidth: 0 }}>
                  <span className="adm-swatch" style={{ backgroundColor: color.code }} />
                  <span style={{ fontSize: '.85rem' }}>{color.name}</span>
                  <span className={`adm-badge ${status.cls}`}>{status.label}</span>
                </div>
                {isEditing ? (
                  <div className="adm-row" style={{ gap: '.35rem' }}>
                    <input
                      type="number"
                      min="0"
                      className="adm-input"
                      style={{ width: 76 }}
                      value={tempStocks[key] ?? 0}
                      onChange={(e) => setTempStocks((p) => ({ ...p, [key]: parseInt(e.target.value) || 0 }))}
                    />
                    <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={() => save(index)}>Enregistrer</button>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => cancel(index)}>Annuler</button>
                  </div>
                ) : (
                  <div className="adm-row" style={{ gap: '.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '.85rem', minWidth: 24, textAlign: 'right' }}>{color.stock || 0}</span>
                    <button className="adm-btn adm-btn--sm" onClick={() => startEdit(index, color.stock)}>Modifier</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </td>
      <td className="adm-cell-strong">{totalStock}</td>
    </tr>
  );
};

export default StockManager;
