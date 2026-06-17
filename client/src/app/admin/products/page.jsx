'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';
import ProductPriceManager from '@/components/admin/ProductPriceManager';
import Image from 'next/image';

export default function AdminProductsPage() {
  const { showSuccess, showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view', 'price-manager'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'price-manager'
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    variants: [],
    featured: false
  });

  // Fetch products data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getProducts();
      setProducts(response.data || []);
    } catch (error) {
      showError('Erreur lors du chargement des produits', {
        title: 'Erreur de données'
      });
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (product.name || '').toLowerCase().includes(term) ||
      (product.category || '').toLowerCase().includes(term)
    );
  });

  // Helpers for presentation
  const getProductImage = (product) =>
    product.image ||
    product.variants?.[0]?.color?.images?.[0] ||
    '/assets/images/placeholder.jpg';

  const getTotalStock = (product) => {
    let total = 0;
    if (product.colors && Array.isArray(product.colors)) {
      product.colors.forEach((color) => {
        total += color.stock || 0;
      });
    }
    return total;
  };

  const stockBadgeClass = (total) =>
    total <= 10 ? 'adm-badge--danger' : total <= 20 ? 'adm-badge--warn' : 'adm-badge--ok';

  // Modal handlers
  const handleAddProduct = () => {
    setModalMode('create');
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      variants: [{
        color: {
          name: 'Noir',
          code: '#000000',
          images: []
        },
        sizes: [{
          name: '40',
          eu: 40,
          uk: 6,
          us: 7,
          inventory: 10
        }]
      }],
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setModalMode('view');
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      variants: product.variants || [{
        color: {
          name: 'Noir',
          code: '#000000',
          images: []
        },
        sizes: [{
          name: '40',
          eu: 40,
          uk: 6,
          us: 7,
          inventory: 10
        }]
      }],
      featured: product.featured || false
    });
    setIsModalOpen(true);
  };

  const handleManagePrice = (product) => {
    setModalMode('price-manager');
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${product.name || 'ce produit'} ?`)) {
      try {
        await adminService.deleteProduct(product._id);
        showSuccess(`Le produit ${product.name || ''} a été supprimé avec succès`);
        fetchProducts(); // Refresh the list
      } catch (error) {
        showError('Erreur lors de la suppression du produit', {
          title: 'Échec de la suppression'
        });
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleInventoryProduct = (product) => {
    // Redirect to inventory page with product filter
    window.location.href = `/admin/inventory?product=${product._id}`;
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleColorChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        color: {
          ...updatedVariants[index].color,
          [field]: value
        }
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      const updatedSizes = [...updatedVariants[variantIndex].sizes];

      updatedSizes[sizeIndex] = {
        ...updatedSizes[sizeIndex],
        [field]: field === 'inventory' || field === 'eu' || field === 'uk' || field === 'us'
          ? parseInt(value) || 0
          : value
      };

      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        sizes: updatedSizes
      };

      return { ...prev, variants: updatedVariants };
    });
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: {
            name: '',
            code: '#000000',
            images: []
          },
          sizes: [{
            name: '40',
            eu: 40,
            uk: 6,
            us: 7,
            inventory: 10
          }]
        }
      ]
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants.splice(index, 1);
      return { ...prev, variants: updatedVariants };
    });
  };

  const addSize = (variantIndex) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        sizes: [
          ...updatedVariants[variantIndex].sizes,
          {
            name: '',
            eu: 0,
            uk: 0,
            us: 0,
            inventory: 0
          }
        ]
      };
      return { ...prev, variants: updatedVariants };
    });
  };

  const removeSize = (variantIndex, sizeIndex) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      const updatedSizes = [...updatedVariants[variantIndex].sizes];
      updatedSizes.splice(sizeIndex, 1);

      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        sizes: updatedSizes
      };

      return { ...prev, variants: updatedVariants };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'create') {
        // Create new product
        await adminService.createProduct(formData);
        showSuccess('Produit créé avec succès');
      } else {
        // Update existing product
        await adminService.updateProduct(currentProduct._id, formData);
        showSuccess('Produit mis à jour avec succès');
      }

      setIsModalOpen(false);
      fetchProducts(); // Refresh the list
    } catch (error) {
      showError(
        modalMode === 'create'
          ? 'Erreur lors de la création du produit'
          : 'Erreur lors de la mise à jour du produit',
        { title: 'Erreur' }
      );
      console.error('Error saving product:', error);
    }
  };

  const modalTitle =
    modalMode === 'create'
      ? 'Ajouter un produit'
      : modalMode === 'edit'
        ? 'Modifier un produit'
        : modalMode === 'price-manager'
          ? `Gestion des prix - ${currentProduct?.name || ''}`
          : 'Détails du produit';

  // Render product details for view mode
  const renderProductDetails = () => {
    if (!currentProduct) return null;

    return (
      <div className="adm-stack" style={{ gap: '1.5rem' }}>
        {/* Product Basic Info */}
        <div className="adm-grid-2">
          <div>
            <h3 className="adm-card-title">Informations Générales</h3>
            <div
              className="adm-stack"
              style={{
                gap: '.5rem',
                background: 'var(--adm-surface-2)',
                padding: '1rem',
                borderRadius: 'var(--adm-radius-sm)'
              }}
            >
              <div>
                <span style={{ fontWeight: 600, color: 'var(--adm-text-muted)' }}>Nom:</span>
                <span style={{ marginLeft: '.5rem', color: 'var(--adm-text)' }}>{currentProduct.name}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--adm-text-muted)' }}>Prix principal:</span>
                <span style={{ marginLeft: '.5rem', color: 'var(--adm-text)' }}>
                  {currentProduct.price?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--adm-text-muted)' }}>Catégorie:</span>
                <span style={{ marginLeft: '.5rem', color: 'var(--adm-text)' }}>{currentProduct.category || 'N/A'}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--adm-text-muted)' }}>Sous-catégorie:</span>
                <span style={{ marginLeft: '.5rem', color: 'var(--adm-text)' }}>{currentProduct.subcategory || 'N/A'}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--adm-text-muted)' }}>En vedette:</span>
                <span style={{ marginLeft: '.5rem', color: 'var(--adm-text)' }}>{currentProduct.featured ? 'Oui' : 'Non'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="adm-card-title">Description</h3>
            <div
              style={{
                background: 'var(--adm-surface-2)',
                padding: '1rem',
                borderRadius: 'var(--adm-radius-sm)',
                height: '100%'
              }}
            >
              <p style={{ color: 'var(--adm-text-muted)', margin: 0 }}>
                {currentProduct.description || 'Aucune description disponible.'}
              </p>
            </div>
          </div>
        </div>

        {/* Product Colors with Stock and Price Info */}
        <div>
          <h3 className="adm-card-title">Couleurs et Stock</h3>
          {currentProduct.colors && currentProduct.colors.length > 0 ? (
            <div className="adm-stack" style={{ gap: '1rem' }}>
              {currentProduct.colors.map((color, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--adm-surface-2)',
                    padding: '1rem',
                    borderRadius: 'var(--adm-radius-sm)'
                  }}
                >
                  <div className="adm-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '.75rem' }}>
                    <div className="adm-row" style={{ gap: '.5rem' }}>
                      <span className="adm-swatch" style={{ backgroundColor: color.code || '#000000' }} />
                      <span style={{ fontWeight: 600 }}>{color.name || 'Couleur inconnue'}</span>
                    </div>
                    <div className="adm-row" style={{ gap: '1.25rem', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '.78rem', color: 'var(--adm-text-faint)' }}>Prix:</span>
                        <div style={{ fontWeight: 600 }}>
                          {color.price ? (
                            <>
                              <span style={{ color: 'var(--adm-text)' }}>
                                {color.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                              </span>
                              <span style={{ fontSize: '.72rem', color: 'var(--adm-text-faint)', marginLeft: '.25rem' }}>(Personnalisé)</span>
                            </>
                          ) : (
                            <span>{currentProduct.price?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '.78rem', color: 'var(--adm-text-faint)' }}>Stock:</span>
                        <div style={{ fontWeight: 600 }}>{color.stock || 0} unités</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '.78rem', color: 'var(--adm-text-faint)' }}>Statut:</span>
                        <div>
                          <span className={`adm-badge ${color.inStock !== false ? 'adm-badge--ok' : 'adm-badge--danger'}`}>
                            {color.inStock !== false ? 'En stock' : 'Rupture'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {color.images && color.images.length > 0 && (
                    <div className="adm-row" style={{ gap: '.5rem', overflowX: 'auto', paddingBottom: '.5rem' }}>
                      {color.images.map((img, imgIdx) => (
                        <div key={imgIdx} style={{ width: 64, height: 80, position: 'relative', flex: '0 0 auto' }}>
                          <Image
                            src={img}
                            alt={`${currentProduct.name} - ${color.name} - ${imgIdx + 1}`}
                            fill
                            style={{ objectFit: 'cover', borderRadius: 'var(--adm-radius-sm)' }}
                            onError={(e) => {
                              e.target.src = '/assets/images/placeholder.jpg';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--adm-surface-2)', padding: '1rem', borderRadius: 'var(--adm-radius-sm)' }}>
              <p style={{ color: 'var(--adm-text-faint)', margin: 0 }}>Aucune couleur disponible.</p>
            </div>
          )}
        </div>

        {/* Product Sizes */}
        <div>
          <h3 className="adm-card-title">Tailles disponibles</h3>
          {currentProduct.sizes && currentProduct.sizes.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
              {currentProduct.sizes.map((size, sizeIdx) => (
                <div
                  key={sizeIdx}
                  style={{ border: '1px solid var(--adm-border)', borderRadius: 'var(--adm-radius-sm)', padding: '.75rem' }}
                >
                  <div style={{ fontSize: '.85rem', fontWeight: 600 }}>{size.name}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--adm-text-faint)' }}>EU: {size.eu}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--adm-text-faint)' }}>UK: {size.uk}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--adm-text-faint)' }}>US: {size.us}</div>
                  <div style={{ marginTop: '.35rem' }}>
                    <span className={`adm-badge ${size.available ? 'adm-badge--ok' : 'adm-badge--danger'}`}>
                      {size.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--adm-surface-2)', padding: '1rem', borderRadius: 'var(--adm-radius-sm)' }}>
              <p style={{ color: 'var(--adm-text-faint)', margin: 0 }}>Aucune taille disponible.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="adm-stack" style={{ gap: '1.5rem' }}>
      {/* Basic Information */}
      <div>
        <h3 className="adm-card-title">Informations de Base</h3>
        <div className="adm-grid-2">
          <div className="adm-field">
            <label htmlFor="name" className="adm-label">Nom du Produit</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="adm-input"
              required
            />
          </div>
          <div className="adm-field">
            <label htmlFor="price" className="adm-label">Prix (DH)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="adm-input"
              required
            />
          </div>
          <div className="adm-field">
            <label htmlFor="category" className="adm-label">Catégorie</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="adm-select"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name || category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="adm-field">
            <label htmlFor="subcategory" className="adm-label">Sous-catégorie</label>
            <input
              type="text"
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="adm-input"
            />
          </div>
          <div className="adm-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="description" className="adm-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="adm-textarea"
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="featured" className="adm-row" style={{ gap: '.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <span style={{ fontSize: '.9rem', color: 'var(--adm-text)' }}>
                Produit en vedette (affiché sur la page d'accueil)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div>
        <div className="adm-row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 className="adm-card-title" style={{ margin: 0 }}>Variantes</h3>
          <button type="button" className="adm-btn adm-btn--sm" onClick={addVariant}>
            + Ajouter une variante
          </button>
        </div>

        <div className="adm-stack" style={{ gap: '1.25rem' }}>
          {formData.variants.map((variant, variantIndex) => (
            <div
              key={variantIndex}
              style={{ border: '1px solid var(--adm-border)', borderRadius: 'var(--adm-radius-sm)', padding: '1rem' }}
            >
              <div className="adm-row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 600, margin: 0, color: 'var(--adm-text)' }}>Variante {variantIndex + 1}</h4>
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    className="adm-btn adm-btn--danger adm-btn--sm"
                    onClick={() => removeVariant(variantIndex)}
                  >
                    Supprimer
                  </button>
                )}
              </div>

              {/* Color Information */}
              <div className="adm-grid-2" style={{ marginBottom: '1rem' }}>
                <div className="adm-field">
                  <label className="adm-label">Nom de la couleur</label>
                  <input
                    type="text"
                    value={variant.color.name}
                    onChange={(e) => handleColorChange(variantIndex, 'name', e.target.value)}
                    className="adm-input"
                    required
                  />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Code couleur</label>
                  <div className="adm-row" style={{ gap: '.5rem' }}>
                    <input
                      type="color"
                      value={variant.color.code}
                      onChange={(e) => handleColorChange(variantIndex, 'code', e.target.value)}
                      style={{ height: 38, width: 44, border: '1px solid var(--adm-border)', borderRadius: 'var(--adm-radius-sm)', cursor: 'pointer', padding: 0 }}
                    />
                    <input
                      type="text"
                      value={variant.color.code}
                      onChange={(e) => handleColorChange(variantIndex, 'code', e.target.value)}
                      className="adm-input"
                      style={{ flex: 1 }}
                      pattern="^#[0-9A-Fa-f]{6}$"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              {/* Images for this color */}
              <div className="adm-field" style={{ marginBottom: '1rem' }}>
                <label className="adm-label">Images (URLs)</label>
                <div className="adm-stack" style={{ gap: '.5rem' }}>
                  {variant.color.images.map((img, imgIndex) => (
                    <div key={imgIndex} className="adm-row" style={{ gap: '.5rem' }}>
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...variant.color.images];
                          newImages[imgIndex] = e.target.value;
                          handleColorChange(variantIndex, 'images', newImages);
                        }}
                        className="adm-input"
                        style={{ flex: 1 }}
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        className="adm-btn adm-btn--ghost adm-btn--sm"
                        onClick={() => {
                          const newImages = [...variant.color.images];
                          newImages.splice(imgIndex, 1);
                          handleColorChange(variantIndex, 'images', newImages);
                        }}
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="adm-btn adm-btn--ghost adm-btn--sm"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => {
                      const newImages = [...variant.color.images, ''];
                      handleColorChange(variantIndex, 'images', newImages);
                    }}
                  >
                    + Ajouter une image
                  </button>
                </div>
              </div>

              {/* Sizes for this variant */}
              <div>
                <div className="adm-row" style={{ justifyContent: 'space-between', marginBottom: '.5rem' }}>
                  <h5 style={{ fontWeight: 600, fontSize: '.85rem', margin: 0, color: 'var(--adm-text-muted)' }}>Tailles disponibles</h5>
                  <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => addSize(variantIndex)}>
                    + Ajouter une taille
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {variant.sizes.map((size, sizeIndex) => (
                    <div
                      key={sizeIndex}
                      style={{ border: '1px solid var(--adm-border)', borderRadius: 'var(--adm-radius-sm)', padding: '.75rem', position: 'relative' }}
                    >
                      {variant.sizes.length > 1 && (
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost adm-btn--sm"
                          style={{ position: 'absolute', top: '.4rem', right: '.4rem' }}
                          onClick={() => removeSize(variantIndex, sizeIndex)}
                        >
                          ✕
                        </button>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
                        <div className="adm-field">
                          <label className="adm-label">Nom</label>
                          <input
                            type="text"
                            value={size.name}
                            onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'name', e.target.value)}
                            className="adm-input"
                            required
                          />
                        </div>
                        <div className="adm-field">
                          <label className="adm-label">EU</label>
                          <input
                            type="number"
                            value={size.eu}
                            onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'eu', e.target.value)}
                            className="adm-input"
                            min="0"
                            required
                          />
                        </div>
                        <div className="adm-field">
                          <label className="adm-label">UK</label>
                          <input
                            type="number"
                            value={size.uk}
                            onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'uk', e.target.value)}
                            className="adm-input"
                            min="0"
                            required
                          />
                        </div>
                        <div className="adm-field">
                          <label className="adm-label">US</label>
                          <input
                            type="number"
                            value={size.us}
                            onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'us', e.target.value)}
                            className="adm-input"
                            min="0"
                            required
                          />
                        </div>
                        <div className="adm-field" style={{ gridColumn: '1 / -1' }}>
                          <label className="adm-label">Stock disponible</label>
                          <input
                            type="number"
                            value={size.inventory}
                            onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'inventory', e.target.value)}
                            className="adm-input"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );

  return (
    <AdminLayout>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Gestion des produits</h1>
        <p className="adm-page-sub">Gérez le catalogue de produits BRENDT</p>
      </div>

      {/* Toolbar: view toggle, search, add */}
      <div className="adm-toolbar">
        <div className="adm-row" style={{ gap: '.35rem', background: 'var(--adm-surface-2)', borderRadius: 'var(--adm-radius-sm)', padding: '.25rem' }}>
          <button
            className={`adm-btn adm-btn--sm ${viewMode === 'table' ? 'adm-btn--primary' : 'adm-btn--ghost'}`}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
          <button
            className={`adm-btn adm-btn--sm ${viewMode === 'price-manager' ? 'adm-btn--primary' : 'adm-btn--ghost'}`}
            onClick={() => setViewMode('price-manager')}
          >
            Gestion des prix
          </button>
        </div>

        {viewMode === 'table' && (
          <input
            type="text"
            className="adm-input"
            placeholder="Rechercher un produit…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        <div className="adm-toolbar-spacer" />

        <button className="adm-btn adm-btn--primary" onClick={handleAddProduct}>
          + Ajouter un produit
        </button>
      </div>

      {/* Render based on view mode */}
      {viewMode === 'table' ? (
        loading ? (
          <div className="adm-spinner" />
        ) : filteredProducts.length === 0 ? (
          <div className="adm-card">
            <div className="adm-empty">
              <div className="adm-empty-title">Aucun produit trouvé</div>
              Aucun produit ne correspond à votre recherche.
            </div>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Catégorie</th>
                  <th>Couleurs</th>
                  <th>Stock</th>
                  <th>En vedette</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const hasCustomPrices = product.colors && product.colors.some((color) => color.price);
                  const inStockColors = product.colors ? product.colors.filter((c) => c.inStock !== false) : [];
                  const outOfStockColors = product.colors ? product.colors.filter((c) => c.inStock === false) : [];
                  const totalStock = getTotalStock(product);
                  return (
                    <tr key={product._id}>
                      <td>
                        <div style={{ width: 48, height: 64, position: 'relative', minWidth: 48 }}>
                          <Image
                            src={getProductImage(product)}
                            alt={product.name || ''}
                            fill
                            style={{ objectFit: 'cover', borderRadius: 'var(--adm-radius-sm)' }}
                            onError={(e) => {
                              e.target.src = '/assets/images/placeholder.jpg';
                            }}
                          />
                        </div>
                      </td>
                      <td className="adm-cell-strong">{product.name || 'N/A'}</td>
                      <td className="adm-cell-muted">
                        <span>{product.price?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
                        {hasCustomPrices && (
                          <span className="adm-badge adm-badge--muted" style={{ marginLeft: '.4rem' }}>
                            Prix personnalisés
                          </span>
                        )}
                      </td>
                      <td className="adm-cell-muted">{product.category || 'N/A'}</td>
                      <td className="adm-cell-muted">
                        {!product.colors || product.colors.length === 0 ? (
                          '0'
                        ) : (
                          <span className="adm-row" style={{ gap: '.3rem', display: 'inline-flex' }}>
                            <span style={{ fontWeight: 600, color: 'var(--adm-text)' }}>{inStockColors.length}</span>
                            {outOfStockColors.length > 0 && (
                              <>
                                <span style={{ color: 'var(--adm-text-faint)' }}>/</span>
                                <span style={{ color: 'var(--adm-text-muted)' }}>{outOfStockColors.length}</span>
                              </>
                            )}
                            <span style={{ fontSize: '.78rem', color: 'var(--adm-text-faint)' }}>couleurs</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`adm-badge ${stockBadgeClass(totalStock)}`}>{totalStock}</span>
                      </td>
                      <td>
                        <span className={`adm-badge ${product.featured ? 'adm-badge--ok' : 'adm-badge--muted'}`}>
                          {product.featured ? 'Oui' : 'Non'}
                        </span>
                      </td>
                      <td>
                        <div className="adm-row" style={{ gap: '.35rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => handleViewProduct(product)}>Voir</button>
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => handleEditProduct(product)}>Modifier</button>
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => handleManagePrice(product)}>Gérer prix</button>
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => handleInventoryProduct(product)}>Inventaire</button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => handleDeleteProduct(product)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <ProductPriceManager />
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(16,16,18,.45)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '2rem 1rem',
            zIndex: 1000,
            overflowY: 'auto'
          }}
        >
          <div
            className="adm-card adm-card-pad"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 880, maxHeight: '90vh', overflow: 'auto' }}
          >
            <div className="adm-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <h2 className="adm-card-title" style={{ margin: 0 }}>{modalTitle}</h2>
              <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            {modalMode === 'view' ? (
              renderProductDetails()
            ) : modalMode === 'price-manager' ? (
              <div>
                <div className="adm-mb-lg">
                  <h3 className="adm-card-title">Prix du produit: {currentProduct?.name}</h3>
                  <p className="adm-page-sub" style={{ margin: 0 }}>
                    Gérez le prix principal et les prix personnalisés par couleur
                  </p>
                </div>
                <ProductPriceManager selectedProduct={currentProduct} />
              </div>
            ) : (
              renderForm()
            )}

            {modalMode !== 'view' && modalMode !== 'price-manager' && (
              <div className="adm-row" style={{ justifyContent: 'flex-end', gap: '.5rem', marginTop: '1.5rem' }}>
                <button className="adm-btn adm-btn--ghost" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
                <button className="adm-btn adm-btn--primary" onClick={handleSubmit}>
                  {modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
