'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';
import Modal from './Modal';
import styles from './ProductPriceManager.module.css';

const ProductPriceManager = () => {
  const { showSuccess, showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all'); // all, custom-prices, standard-prices
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit'); // edit, history

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
    // Search filter
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    // Price filter
    let matchesPrice = true;
    if (priceFilter === 'custom-prices') {
      matchesPrice = product.colors.some(color => color.price);
    } else if (priceFilter === 'standard-prices') {
      matchesPrice = product.colors.every(color => !color.price);
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  // Calculate price statistics
  const priceStats = {
    totalProducts: products.length,
    withCustomPrices: products.filter(p => p.colors.some(c => c.price)).length,
    standardPrices: products.filter(p => p.colors.every(c => !c.price)).length,
    avgPrice: products.length > 0 
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
      : 0,
    maxPrice: products.length > 0 
      ? Math.max(...products.map(p => p.price)) 
      : 0,
    minPrice: products.length > 0 
      ? Math.min(...products.map(p => p.price)) 
      : 0
  };

  // Handle quick price operations
  const handleQuickPriceUpdate = async (productId, newPrice) => {
    try {
      await adminService.updateProduct(productId, { price: newPrice });
      showSuccess('Prix principal mis à jour avec succès');
      fetchProducts();
    } catch (error) {
      console.error('Error updating price:', error);
      showError('Erreur lors de la mise à jour du prix');
    }
  };

  const openPriceModal = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
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
        <h1 className={styles.pageTitle}>Gestion des prix</h1>
        <p className={styles.pageDescription}>
          Gérez les prix principaux et les prix personnalisés des variantes de couleur
        </p>
      </div>

      {/* Price Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{priceStats.totalProducts}</div>
          <div className={styles.statLabel}>Produits totaux</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{priceStats.withCustomPrices}</div>
          <div className={styles.statLabel}>Avec prix personnalisés</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{priceStats.standardPrices}</div>
          <div className={styles.statLabel}>Prix standards</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatPrice(priceStats.avgPrice)}</div>
          <div className={styles.statLabel}>Prix moyen</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatPrice(priceStats.minPrice)} - {formatPrice(priceStats.maxPrice)}</div>
          <div className={styles.statLabel}>Fourchette de prix</div>
        </div>
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
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">Tous les prix</option>
            <option value="custom-prices">Avec prix personnalisés</option>
            <option value="standard-prices">Prix standards uniquement</option>
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
            <ProductPriceCard
              key={product._id}
              product={product}
              onQuickPriceUpdate={handleQuickPriceUpdate}
              onOpenModal={openPriceModal}
              formatPrice={formatPrice}
            />
          ))
        )}
      </div>

      {/* Price Edit Modal */}
      {isModalOpen && selectedProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Gestion des prix - ${selectedProduct.name}`}
          size="large"
        >
          <PriceEditModal
            product={selectedProduct}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              fetchProducts();
              setIsModalOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

// Product Price Card Component
const ProductPriceCard = ({ product, onQuickPriceUpdate, onOpenModal, formatPrice }) => {
  const [editingPrice, setEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(product.price);

  const hasCustomPrices = product.colors.some(color => color.price);
  const customPriceCount = product.colors.filter(color => color.price).length;

  const handlePriceSave = async () => {
    if (tempPrice !== product.price && tempPrice > 0) {
      await onQuickPriceUpdate(product._id, tempPrice);
    }
    setEditingPrice(false);
  };

  const handlePriceCancel = () => {
    setTempPrice(product.price);
    setEditingPrice(false);
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productHeader}>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productInfo}>
          <span className={styles.productCategory}>{product.categoryName}</span>
          {hasCustomPrices && (
            <span className={styles.customPriceIndicator}>
              {customPriceCount} prix personnalisé{customPriceCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className={styles.priceSection}>
        <div className={styles.mainPrice}>
          <label>Prix principal:</label>
          {editingPrice ? (
            <div className={styles.priceEditControls}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tempPrice}
                onChange={(e) => setTempPrice(parseFloat(e.target.value) || 0)}
                className={styles.priceInput}
              />
              <button
                className={styles.saveButton}
                onClick={handlePriceSave}
              >
                ✓
              </button>
              <button
                className={styles.cancelButton}
                onClick={handlePriceCancel}
              >
                ✕
              </button>
            </div>
          ) : (
            <div className={styles.priceDisplay}>
              <span className={styles.priceValue}>{formatPrice(product.price)}</span>
              <button
                className={styles.editButton}
                onClick={() => setEditingPrice(true)}
              >
                Modifier
              </button>
            </div>
          )}
        </div>

        <div className={styles.colorPrices}>
          <h4>Prix par couleur:</h4>
          <div className={styles.colorPricesList}>
            {product.colors.map((color, index) => (
              <div key={index} className={styles.colorPriceItem}>
                <div className={styles.colorInfo}>
                  <span
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color.code }}
                  ></span>
                  <span className={styles.colorName}>{color.name}</span>
                </div>
                <div className={styles.colorPrice}>
                  {color.price ? (
                    <>
                      <span className={styles.customPrice}>{formatPrice(color.price)}</span>
                      <span className={styles.customBadge}>Personnalisé</span>
                    </>
                  ) : (
                    <span className={styles.defaultPrice}>{formatPrice(product.price)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button
          className={styles.actionButton}
          onClick={() => onOpenModal(product)}
        >
          Gérer tous les prix
        </button>
      </div>
    </div>
  );
};

// Price Edit Modal Component
const PriceEditModal = ({ product, onClose, onSuccess }) => {
  const { showSuccess, showError } = useNotification();
  const [mainPrice, setMainPrice] = useState(product.price);
  const [colorPrices, setColorPrices] = useState(
    product.colors.map(color => ({
      customPrice: color.price || '',
      useCustomPrice: !!color.price
    }))
  );
  const [loading, setLoading] = useState(false);

  const handleMainPriceChange = (value) => {
    setMainPrice(parseFloat(value) || 0);
  };

  const handleColorPriceChange = (index, value, useCustom) => {
    const newColorPrices = [...colorPrices];
    if (useCustom !== undefined) {
      newColorPrices[index].useCustomPrice = useCustom;
      if (!useCustom) {
        newColorPrices[index].customPrice = '';
      }
    } else {
      newColorPrices[index].customPrice = value;
    }
    setColorPrices(newColorPrices);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Update main product price
      await adminService.updateProduct(product._id, { price: mainPrice });

      // Update color prices
      for (let i = 0; i < colorPrices.length; i++) {
        const priceValue = colorPrices[i].useCustomPrice 
          ? parseFloat(colorPrices[i].customPrice) || null
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
      {/* Main Price Section */}
      <div className={styles.mainPriceSection}>
        <h3>Prix principal du produit</h3>
        <div className={styles.mainPriceInput}>
          <label>Prix de base:</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={mainPrice}
            onChange={(e) => handleMainPriceChange(e.target.value)}
            className={styles.priceInput}
          />
          <span className={styles.pricePreview}>= {formatPrice(mainPrice)}</span>
        </div>
        <p className={styles.infoText}>
          Ce prix sera utilisé pour toutes les couleurs qui n'ont pas de prix personnalisé.
        </p>
      </div>

      {/* Color Prices Section */}
      <div className={styles.colorPricesSection}>
        <h3>Prix par couleur</h3>
        <div className={styles.colorPricesGrid}>
          {product.colors.map((color, index) => (
            <div key={index} className={styles.colorPriceEditItem}>
              <div className={styles.colorHeader}>
                <span
                  className={styles.colorSwatch}
                  style={{ backgroundColor: color.code }}
                ></span>
                <span className={styles.colorName}>{color.name}</span>
              </div>
              
              <div className={styles.priceOptions}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`price-${index}`}
                    checked={!colorPrices[index].useCustomPrice}
                    onChange={() => handleColorPriceChange(index, '', false)}
                  />
                  Utiliser le prix principal ({formatPrice(mainPrice)})
                </label>
                
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`price-${index}`}
                    checked={colorPrices[index].useCustomPrice}
                    onChange={() => handleColorPriceChange(index, '', true)}
                  />
                  Prix personnalisé
                </label>
              </div>

              {colorPrices[index].useCustomPrice && (
                <div className={styles.customPriceInput}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Prix personnalisé"
                    value={colorPrices[index].customPrice}
                    onChange={(e) => handleColorPriceChange(index, e.target.value)}
                    className={styles.priceInput}
                  />
                  <span className={styles.pricePreview}>
                    = {formatPrice(parseFloat(colorPrices[index].customPrice) || 0)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
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
          {loading ? 'Sauvegarde...' : 'Sauvegarder tous les prix'}
        </button>
      </div>
    </div>
  );
};

export default ProductPriceManager;