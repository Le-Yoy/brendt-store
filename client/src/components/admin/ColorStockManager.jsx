'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';
import Modal from './Modal';
import styles from './ColorStockManager.module.css';

const ColorStockManager = () => {
  const { showSuccess, showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, in-stock, out-of-stock
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, edit-stock, edit-price

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

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    // Stock filter
    let matchesStock = true;
    if (stockFilter === 'in-stock') {
      matchesStock = product.colors.some(color => color.inStock);
    } else if (stockFilter === 'out-of-stock') {
      matchesStock = product.colors.some(color => !color.inStock);
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  // Handle quick stock toggle
  const handleQuickStockToggle = async (productId, colorIndex, currentStock) => {
    try {
      await adminService.updateColorStock(productId, colorIndex, !currentStock);
      showSuccess('Stock mis à jour avec succès');
      fetchProducts(); // Refresh data
    } catch (error) {
      console.error('Error updating stock:', error);
      showError('Erreur lors de la mise à jour du stock');
    }
  };

  // Open modals
  const openStockModal = (product) => {
    setSelectedProduct(product);
    setModalMode('edit-stock');
    setIsModalOpen(true);
  };

  const openPriceModal = (product) => {
    setSelectedProduct(product);
    setModalMode('edit-price');
    setIsModalOpen(true);
  };

  const openViewModal = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setIsModalOpen(true);
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
        <h1 className={styles.pageTitle}>Gestion des stocks et prix</h1>
        <p className={styles.pageDescription}>
          Gérez les stocks et prix des variantes de couleur
        </p>
      </div>

      {/* Filters */}
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

          <select
            className={styles.filterSelect}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">Tout le stock</option>
            <option value="in-stock">En stock</option>
            <option value="out-of-stock">Rupture de stock</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className={styles.productsGrid}>
        {loading ? (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Aucun produit trouvé</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickStockToggle={handleQuickStockToggle}
              onOpenStockModal={openStockModal}
              onOpenPriceModal={openPriceModal}
              onOpenViewModal={openViewModal}
              formatPrice={formatPrice}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {isModalOpen && selectedProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            modalMode === 'edit-stock' 
              ? `Gestion des stocks - ${selectedProduct.name}`
              : modalMode === 'edit-price'
              ? `Gestion des prix - ${selectedProduct.name}`
              : `Détails du produit - ${selectedProduct.name}`
          }
          size="large"
        >
          {modalMode === 'edit-stock' && (
            <StockEditModal
              product={selectedProduct}
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => {
                fetchProducts();
                setIsModalOpen(false);
              }}
            />
          )}
          {modalMode === 'edit-price' && (
            <PriceEditModal
              product={selectedProduct}
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => {
                fetchProducts();
                setIsModalOpen(false);
              }}
            />
          )}
          {modalMode === 'view' && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ 
  product, 
  onQuickStockToggle, 
  onOpenStockModal, 
  onOpenPriceModal, 
  onOpenViewModal,
  formatPrice 
}) => (
  <div className={styles.productCard}>
    <div className={styles.productHeader}>
      <h3 className={styles.productName}>{product.name}</h3>
      <div className={styles.productInfo}>
        <span className={styles.productCategory}>{product.categoryName}</span>
        <span className={styles.productPrice}>{formatPrice(product.price)}</span>
      </div>
    </div>

    <div className={styles.colorsGrid}>
      {product.colors.map((color, index) => (
        <div key={index} className={styles.colorItem}>
          <div className={styles.colorHeader}>
            <div className={styles.colorInfo}>
              <span 
                className={styles.colorSwatch}
                style={{ backgroundColor: color.code }}
              ></span>
              <span className={styles.colorName}>{color.name}</span>
            </div>
            <button
              className={`${styles.stockToggle} ${
                color.inStock ? styles.inStock : styles.outOfStock
              }`}
              onClick={() => onQuickStockToggle(product._id, index, color.inStock)}
            >
              {color.inStock ? 'En stock' : 'Rupture'}
            </button>
          </div>
          
          <div className={styles.colorDetails}>
            <span className={styles.stockNumber}>
              Stock: {color.stock || 0}
            </span>
            <span className={styles.colorPrice}>
              {formatPrice(color.effectivePrice)}
              {color.price && <span className={styles.customPrice}>*</span>}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className={styles.cardActions}>
      <button
        className={styles.actionButton}
        onClick={() => onOpenViewModal(product)}
      >
        Voir détails
      </button>
      <button
        className={styles.actionButton}
        onClick={() => onOpenStockModal(product)}
      >
        Gérer stock
      </button>
      <button
        className={styles.actionButton}
        onClick={() => onOpenPriceModal(product)}
      >
        Gérer prix
      </button>
    </div>
  </div>
);

// Stock Edit Modal Component
const StockEditModal = ({ product, onClose, onSuccess }) => {
  const { showSuccess, showError } = useNotification();
  const [stockValues, setStockValues] = useState(
    product.colors.map(color => ({
      stock: color.stock || 0,
      inStock: color.inStock !== false
    }))
  );
  const [loading, setLoading] = useState(false);

  const handleStockChange = (index, value) => {
    const newStockValues = [...stockValues];
    newStockValues[index].stock = Math.max(0, parseInt(value) || 0);
    newStockValues[index].inStock = newStockValues[index].stock > 0;
    setStockValues(newStockValues);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < stockValues.length; i++) {
        await adminService.updateColorStockNumber(
          product._id,
          i,
          stockValues[i].stock
        );
      }
      showSuccess('Stocks mis à jour avec succès');
      onSuccess();
    } catch (error) {
      console.error('Error updating stocks:', error);
      showError('Erreur lors de la mise à jour des stocks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.stockEditGrid}>
        {product.colors.map((color, index) => (
          <div key={index} className={styles.stockEditItem}>
            <div className={styles.colorDisplay}>
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: color.code }}
              ></span>
              <span className={styles.colorName}>{color.name}</span>
            </div>
            <div className={styles.stockInput}>
              <label>Stock actuel:</label>
              <input
                type="number"
                min="0"
                value={stockValues[index].stock}
                onChange={(e) => handleStockChange(index, e.target.value)}
                className={styles.numberInput}
              />
            </div>
            <div className={styles.stockStatus}>
              Statut: {stockValues[index].inStock ? 
                <span className={styles.inStockText}>En stock</span> : 
                <span className={styles.outOfStockText}>Rupture</span>
              }
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.modalActions}>
        <button
          className={styles.cancelButton}
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </button>
        <button
          className={styles.saveButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
};

// Price Edit Modal Component
const PriceEditModal = ({ product, onClose, onSuccess }) => {
  const { showSuccess, showError } = useNotification();
  const [priceValues, setPriceValues] = useState(
    product.colors.map(color => ({
      customPrice: color.price || '',
      useCustomPrice: !!color.price
    }))
  );
  const [loading, setLoading] = useState(false);

  const handlePriceChange = (index, value, useCustom) => {
    const newPriceValues = [...priceValues];
    if (useCustom !== undefined) {
      newPriceValues[index].useCustomPrice = useCustom;
      if (!useCustom) {
        newPriceValues[index].customPrice = '';
      }
    } else {
      newPriceValues[index].customPrice = value;
    }
    setPriceValues(newPriceValues);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < priceValues.length; i++) {
        const priceValue = priceValues[i].useCustomPrice 
          ? parseFloat(priceValues[i].customPrice) || null
          : null;
          
        await adminService.updateColorPrice(product._id, i, priceValue);
      }
      showSuccess('Prix mis à jour avec succès');
      onSuccess();
    } catch (error) {
      console.error('Error updating prices:', error);
      showError('Erreur lors de la mise à jour des prix');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }) || '0,00 MAD';
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.priceInfo}>
        <p>Prix principal du produit: <strong>{formatPrice(product.price)}</strong></p>
        <p className={styles.infoText}>
          Définissez des prix personnalisés pour chaque couleur ou utilisez le prix principal.
        </p>
      </div>

      <div className={styles.priceEditGrid}>
        {product.colors.map((color, index) => (
          <div key={index} className={styles.priceEditItem}>
            <div className={styles.colorDisplay}>
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: color.code }}
              ></span>
              <span className={styles.colorName}>{color.name}</span>
            </div>
            
            <div className={styles.priceToggle}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={priceValues[index].useCustomPrice}
                  onChange={(e) => handlePriceChange(index, '', e.target.checked)}
                />
                Utiliser un prix personnalisé
              </label>
            </div>

            <div className={styles.priceInput}>
              <label>Prix:</label>
              {priceValues[index].useCustomPrice ? (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Prix personnalisé"
                  value={priceValues[index].customPrice}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  className={styles.numberInput}
                />
              ) : (
                <span className={styles.defaultPrice}>
                  {formatPrice(product.price)} (Prix principal)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.modalActions}>
        <button
          className={styles.cancelButton}
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </button>
        <button
          className={styles.saveButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
};

// Product Detail Modal Component
const ProductDetailModal = ({ product, onClose }) => {
  const formatPrice = (price) => {
    return price?.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }) || '0,00 MAD';
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.productDetails}>
        <div className={styles.basicInfo}>
          <h3>Informations générales</h3>
          <div className={styles.infoGrid}>
            <div>
              <label>Nom:</label>
              <span>{product.name}</span>
            </div>
            <div>
              <label>Catégorie:</label>
              <span>{product.categoryName}</span>
            </div>
            <div>
              <label>Prix principal:</label>
              <span>{formatPrice(product.price)}</span>
            </div>
            <div>
              <label>En stock:</label>
              <span>{product.inStock ? 'Oui' : 'Non'}</span>
            </div>
          </div>
        </div>

        <div className={styles.colorDetails}>
          <h3>Détails des couleurs</h3>
          <div className={styles.colorDetailGrid}>
            {product.colors.map((color, index) => (
              <div key={index} className={styles.colorDetailCard}>
                <div className={styles.colorHeader}>
                  <span
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color.code }}
                  ></span>
                  <span className={styles.colorName}>{color.name}</span>
                </div>
                <div className={styles.colorInfo}>
                  <div>Stock: {color.stock || 0}</div>
                  <div>Prix: {formatPrice(color.effectivePrice)}</div>
                  <div>
                    Statut: {color.inStock ? 
                      <span className={styles.inStockText}>En stock</span> : 
                      <span className={styles.outOfStockText}>Rupture</span>
                    }
                  </div>
                  {color.price && (
                    <div className={styles.customPriceNote}>
                      * Prix personnalisé
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.modalActions}>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ColorStockManager;