'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
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

  // Table columns definition
  const columns = [
    {
      id: 'image',
      header: 'Image',
      accessor: (product) => product.image || product.variants?.[0]?.color?.images?.[0] || '',
      sortable: false,
      width: '80px',
      cell: (product) => {
        const imageUrl = product.image || 
          product.variants?.[0]?.color?.images?.[0] || 
          '/assets/images/placeholder.jpg';
          
        return (
          <div style={{width: '48px', height: '64px', position: 'relative', minWidth: '48px'}}>
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              style={{objectFit: 'cover'}}
              className="rounded"
              onError={(e) => {
                e.target.src = '/assets/images/placeholder.jpg';
              }}
            />
          </div>
        );
      }
    },
    {
      id: 'name',
      header: 'Nom',
      accessor: (product) => product.name || 'N/A',
      sortable: true
    },
    {
      id: 'price',
      header: 'Prix',
      accessor: (product) => product.price || 0,
      sortable: true,
      cell: (product) => {
        const hasCustomPrices = product.colors && product.colors.some(color => color.price);
        return (
          <div>
            <span className="font-medium">{product.price?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
            {hasCustomPrices && (
              <span className="ml-2 text-xs text-accent bg-accent bg-opacity-10 px-1 rounded">
                Prix personnalisés
              </span>
            )}
          </div>
        );
      }
    },
    {
      id: 'category',
      header: 'Catégorie',
      accessor: (product) => product.category || 'N/A',
      sortable: true
    },
    {
      id: 'colors',
      header: 'Couleurs',
      accessor: (product) => (product.colors ? product.colors.length : 0),
      sortable: true,
      cell: (product) => {
        if (!product.colors || product.colors.length === 0) return '0';
        
        const inStockColors = product.colors.filter(color => color.inStock !== false);
        const outOfStockColors = product.colors.filter(color => color.inStock === false);
        
        return (
          <div className="flex items-center space-x-1">
            <span className="text-green-600 font-medium">{inStockColors.length}</span>
            {outOfStockColors.length > 0 && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-red-600">{outOfStockColors.length}</span>
              </>
            )}
            <span className="text-gray-500 text-xs ml-1">couleurs</span>
          </div>
        );
      }
    },
    {
      id: 'inventory',
      header: 'Stock',
      accessor: (product) => {
        let total = 0;
        if (product.colors && Array.isArray(product.colors)) {
          product.colors.forEach(color => {
            total += color.stock || 0;
          });
        }
        return total;
      },
      sortable: true,
      cell: (product) => {
        let total = 0;
        if (product.colors && Array.isArray(product.colors)) {
          product.colors.forEach(color => {
            total += color.stock || 0;
          });
        }
        
        return (
          <span className={`font-medium ${total <= 10 ? 'text-red-600' : total <= 20 ? 'text-yellow-600' : 'text-green-600'}`}>
            {total}
          </span>
        );
      }
    },
    {
      id: 'featured',
      header: 'En vedette',
      accessor: (product) => product.featured || false,
      sortable: true,
      cell: (product) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.featured 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {product.featured ? 'Oui' : 'Non'}
        </span>
      )
    }
  ];

  // Table actions
  const actions = [
    {
      name: 'Voir',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: (product) => handleViewProduct(product)
    },
    {
      name: 'Modifier',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: (product) => handleEditProduct(product)
    },
    {
      name: 'Gérer prix',
      className: 'text-accent hover:text-accent-dark',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      onClick: (product) => handleManagePrice(product)
    },
    {
      name: 'Supprimer',
      className: 'text-red-600 hover:text-red-800',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: (product) => handleDeleteProduct(product)
    },
    {
      name: 'Gérer l\'inventaire',
      className: 'text-blue-600 hover:text-blue-800',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      onClick: (product) => handleInventoryProduct(product)
    }
  ];

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

  // Render product details for view mode
  const renderProductDetails = () => {
    if (!currentProduct) return null;
    
    return (
      <div className="space-y-6">
        {/* Product Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Informations Générales</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-2">
                <span className="font-medium text-gray-500">Nom:</span>
                <span className="ml-2 text-gray-900">{currentProduct.name}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-500">Prix principal:</span>
                <span className="ml-2 text-gray-900">{currentProduct.price?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-500">Catégorie:</span>
                <span className="ml-2 text-gray-900">{currentProduct.category || 'N/A'}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-500">Sous-catégorie:</span>
                <span className="ml-2 text-gray-900">{currentProduct.subcategory || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">En vedette:</span>
                <span className="ml-2 text-gray-900">{currentProduct.featured ? 'Oui' : 'Non'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <div className="bg-gray-50 p-4 rounded-md h-full">
              <p className="text-gray-700">{currentProduct.description || 'Aucune description disponible.'}</p>
            </div>
          </div>
        </div>
        
        {/* Product Colors with Stock and Price Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Couleurs et Stock</h3>
          {currentProduct.colors && currentProduct.colors.length > 0 ? (
            <div className="space-y-4">
              {currentProduct.colors.map((color, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: color.code || '#000000' }}></div>
                      <span className="font-medium">{color.name || 'Couleur inconnue'}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Prix:</span>
                        <div className="font-medium">
                          {color.price ? (
                            <>
                              <span className="text-accent">{color.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
                              <span className="text-xs text-gray-500 ml-1">(Personnalisé)</span>
                            </>
                          ) : (
                            <span>{currentProduct.price?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Stock:</span>
                        <div className={`font-medium ${
                          (color.stock || 0) <= 10 ? 'text-red-600' : 
                          (color.stock || 0) <= 20 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {color.stock || 0} unités
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Statut:</span>
                        <div className={`font-medium ${color.inStock !== false ? 'text-green-600' : 'text-red-600'}`}>
                          {color.inStock !== false ? 'En stock' : 'Rupture'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {color.images && color.images.length > 0 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {color.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="w-16 h-20 relative flex-shrink-0">
                          <Image
                            src={img}
                            alt={`${currentProduct.name} - ${color.name} - ${imgIdx + 1}`}
                            fill
                            className="object-cover rounded"
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
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500">Aucune couleur disponible.</p>
            </div>
          )}
        </div>
        {/* Product Sizes */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tailles disponibles</h3>
          {currentProduct.sizes && currentProduct.sizes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentProduct.sizes.map((size, sizeIdx) => (
                <div key={sizeIdx} className="border border-gray-200 rounded-md p-3">
                  <div className="text-sm font-medium">{size.name}</div>
                  <div className="text-xs text-gray-500">EU: {size.eu}</div>
                  <div className="text-xs text-gray-500">UK: {size.uk}</div>
                  <div className="text-xs text-gray-500">US: {size.us}</div>
                  <div className={`text-xs font-medium mt-1 ${size.available ? 'text-green-600' : 'text-red-600'}`}>
                    {size.available ? 'Disponible' : 'Indisponible'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500">Aucune taille disponible.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Gestion des produits</h1>
            <p className="text-gray-500">Gérez le catalogue de produits BRENDT</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setViewMode('table')}
              >
                Table
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'price-manager' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setViewMode('price-manager')}
              >
                Gestion des prix
              </button>
            </div>
            
            <button
              className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-md transition-colors duration-200"
              style={{ 
                backgroundColor: 'var(--color-accent)', 
                ':hover': { backgroundColor: 'var(--color-accent-dark)' } 
              }}
              onClick={handleAddProduct}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter un produit
              </div>
            </button>
          </div>
        </div>

        {/* Render based on view mode */}
        {viewMode === 'table' ? (
          <DataTable
            columns={columns}
            data={products}
            actions={actions}
            isLoading={loading}
            emptyMessage="Aucun produit trouvé"
          />
        ) : (
          <ProductPriceManager />
        )}
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create' 
            ? 'Ajouter un produit' 
            : modalMode === 'edit' 
              ? 'Modifier un produit' 
              : modalMode === 'price-manager'
                ? `Gestion des prix - ${currentProduct?.name}`
                : 'Détails du produit'
        }
        size={modalMode === 'price-manager' ? 'large' : 'xlarge'}
        footer={
          modalMode !== 'view' && modalMode !== 'price-manager' && (
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark"
                onClick={handleSubmit}
                style={{ 
                  backgroundColor: 'var(--color-accent)', 
                  ':hover': { backgroundColor: 'var(--color-accent-dark)' } 
                }}
              >
                {modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
              </button>
            </div>
          )
        }
      >
        {modalMode === 'view' ? (
          renderProductDetails()
        ) : modalMode === 'price-manager' ? (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Prix du produit: {currentProduct?.name}</h3>
              <p className="text-gray-500">Gérez le prix principal et les prix personnalisés par couleur</p>
            </div>
            <ProductPriceManager selectedProduct={currentProduct} />
          </div>
        ) : (
          /* Existing form JSX continues here - no changes needed */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de Base</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom du Produit
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                    style={{ '--tw-ring-color': 'var(--color-accent)' }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Prix (DH)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                    style={{ '--tw-ring-color': 'var(--color-accent)' }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                    style={{ '--tw-ring-color': 'var(--color-accent)' }}
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
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                    Sous-catégorie
                  </label>
                  <input
                    type="text"
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                    style={{ '--tw-ring-color': 'var(--color-accent)' }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                    style={{ '--tw-ring-color': 'var(--color-accent)' }}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                      style={{ '--tw-ring-color': 'var(--color-accent)' }}
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Produit en vedette (affiché sur la page d'accueil)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants Section - Complete Implementation */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Variantes</h3>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-accent bg-accent-light bg-opacity-10 hover:bg-opacity-20"
                  onClick={addVariant}
                  style={{ color: 'var(--color-accent)' }}
                >
                  <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter une variante
                </button>
              </div>

              {formData.variants.map((variant, variantIndex) => (
                <div key={variantIndex} className="mb-8 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-800">Variante {variantIndex + 1}</h4>
                    {formData.variants.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeVariant(variantIndex)}
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Color Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom de la couleur
                      </label>
                      <input
                        type="text"
                        value={variant.color.name}
                        onChange={(e) => handleColorChange(variantIndex, 'name', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                        style={{ '--tw-ring-color': 'var(--color-accent)' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Code couleur
                      </label>
                      <div className="mt-1 flex space-x-2 items-center">
                        <input
                          type="color"
                          value={variant.color.code}
                          onChange={(e) => handleColorChange(variantIndex, 'code', e.target.value)}
                          className="h-8 w-8 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={variant.color.code}
                          onChange={(e) => handleColorChange(variantIndex, 'code', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                          style={{ '--tw-ring-color': 'var(--color-accent)' }}
                          pattern="^#[0-9A-Fa-f]{6}$"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images for this color */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images (URLs)
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {variant.color.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="flex space-x-2 items-center">
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const newImages = [...variant.color.images];
                              newImages[imgIndex] = e.target.value;
                              handleColorChange(variantIndex, 'images', newImages);
                            }}
                            className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                            style={{ '--tw-ring-color': 'var(--color-accent)' }}
                            placeholder="https://example.com/image.jpg"
                          />
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => {
                              const newImages = [...variant.color.images];
                              newImages.splice(imgIndex, 1);
                              handleColorChange(variantIndex, 'images', newImages);
                            }}
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                        style={{ '--tw-ring-color': 'var(--color-accent)' }}
                        onClick={() => {
                          const newImages = [...variant.color.images, ''];
                          handleColorChange(variantIndex, 'images', newImages);
                        }}
                      >
                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Ajouter une image
                      </button>
                    </div>
                  </div>

                  {/* Sizes for this variant */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-sm text-gray-700">Tailles disponibles</h5>
                      <button
                        type="button"
                        className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => addSize(variantIndex)}
                      >
                        <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Ajouter une taille
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {variant.sizes.map((size, sizeIndex) => (
                        <div key={sizeIndex} className="border border-gray-200 rounded-md p-3 relative">
                          {variant.sizes.length > 1 && (
                            <button
                              type="button"
                              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                              onClick={() => removeSize(variantIndex, sizeIndex)}
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700">
                                Nom
                              </label>
                              <input
                                type="text"
                                value={size.name}
                                onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'name', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-accent focus:border-accent"
                                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700">
                                EU
                              </label>
                              <input
                                type="number"
                                value={size.eu}
                                onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'eu', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-accent focus:border-accent"
                                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                                min="0"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700">
                                UK
                              </label>
                              <input
                                type="number"
                                value={size.uk}
                                onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'uk', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-accent focus:border-accent"
                                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                                min="0"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700">
                                US
                              </label>
                              <input
                                type="number"
                                value={size.us}
                                onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'us', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-accent focus:border-accent"
                                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                                min="0"
                                required
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-medium text-gray-700">
                                Stock disponible
                              </label>
                              <input
                                type="number"
                                value={size.inventory}
                                onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'inventory', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-accent focus:border-accent"
                                style={{ '--tw-ring-color': 'var(--color-accent)' }}
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
          </form>
        )}
      </Modal>
    </AdminLayout>
  );
}