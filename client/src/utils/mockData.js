// src/utils/mockData.js

/**
 * Mock data utility for development and fallback purposes
 */
const mockData = {
  // Mock categories
  categories: [
    {
      category: 'chaussures',
      categoryName: 'Chaussures',
      count: 28,
      subcategories: [
        { subcategory: 'mocassins', subcategoryName: 'Mocassins', count: 8 },
        { subcategory: 'derbies', subcategoryName: 'Derbies', count: 6 },
        { subcategory: 'boots', subcategoryName: 'Boots', count: 7 },
        { subcategory: 'baskets', subcategoryName: 'Baskets', count: 7 }
      ]
    },
    {
      category: 'accessoires',
      categoryName: 'Accessoires',
      count: 15,
      subcategories: [
        { subcategory: 'ceintures', subcategoryName: 'Ceintures', count: 5 },
        { subcategory: 'chaussettes', subcategoryName: 'Chaussettes', count: 6 },
        { subcategory: 'gants', subcategoryName: 'Gants', count: 4 }
      ]
    },
    {
      category: 'entretien',
      categoryName: 'Entretien',
      count: 8,
      subcategories: [
        { subcategory: 'cirages', subcategoryName: 'Cirages', count: 4 },
        { subcategory: 'brosses', subcategoryName: 'Brosses', count: 2 },
        { subcategory: 'embauchoirs', subcategoryName: 'Embauchoirs', count: 2 }
      ]
    }
  ],
  
  // Mock products
  products: [
    {
      _id: '1',
      name: 'Mocassin Alban',
      price: 595,
      category: 'chaussures',
      categoryName: 'Chaussures',
      subcategory: 'mocassins',
      subcategoryName: 'Mocassins',
      description: 'Mocassin élégant en cuir de veau pleine fleur avec finition à la main.',
      details: [
        'Cuir de veau pleine fleur',
        'Doublure en cuir de chèvre',
        'Semelle en cuir avec patine',
        'Fabriqué en Italie'
      ],
      colors: [
        {
          name: 'Noir',
          code: '#000000',
          images: ['/assets/images/products/brendt-new/Homme/Chaussures/Mocassins/Alban/Noir/1.jpg', '/assets/images/products/brendt-new/Homme/Chaussures/Mocassins/Alban/Noir/2.jpg']
        },
        {
          name: 'Cognac',
          code: '#8B4513',
          images: ['/assets/images/products/brendt-new/Homme/Chaussures/Mocassins/Alban/Cognac/1.jpg', '/assets/images/products/brendt-new/Homme/Chaussures/Mocassins/Alban/Cognac/2.jpg']
        }
      ],
      sizes: [
        { name: '40', eu: '40', uk: '6', us: '7', available: true },
        { name: '41', eu: '41', uk: '7', us: '8', available: true },
        { name: '42', eu: '42', uk: '8', us: '9', available: true },
        { name: '43', eu: '43', uk: '9', us: '10', available: true },
        { name: '44', eu: '44', uk: '10', us: '11', available: false },
        { name: '45', eu: '45', uk: '11', us: '12', available: true }
      ],
      isNewArrival: true,
      isBestseller: false
    },
    {
      _id: '2',
      name: 'Derby Bardi',
      price: 675,
      category: 'chaussures',
      categoryName: 'Chaussures',
      subcategory: 'derbies',
      subcategoryName: 'Derbies',
      description: 'Derby élégant en cuir box-calf avec couture Goodyear.',
      details: [
        'Cuir box-calf',
        'Doublure en cuir de veau',
        'Construction Goodyear',
        'Fabriqué en Angleterre'
      ],
      colors: [
        {
          name: 'Noir',
          code: '#000000',
          images: ['/assets/images/products/brendt-new/Homme/Chaussures/Derbies/Bardi/Noir/1.jpg', '/assets/images/products/brendt-new/Homme/Chaussures/Derbies/Bardi/Noir/2.jpg']
        },
        {
          name: 'Bordeaux',
          code: '#800020',
          images: ['/assets/images/products/brendt-new/Homme/Chaussures/Derbies/Bardi/Bordeaux/1.jpg', '/assets/images/products/brendt-new/Homme/Chaussures/Derbies/Bardi/Bordeaux/2.jpg']
        }
      ],
      sizes: [
        { name: '40', eu: '40', uk: '6', us: '7', available: true },
        { name: '41', eu: '41', uk: '7', us: '8', available: true },
        { name: '42', eu: '42', uk: '8', us: '9', available: true },
        { name: '43', eu: '43', uk: '9', us: '10', available: true },
        { name: '44', eu: '44', uk: '10', us: '11', available: true },
        { name: '45', eu: '45', uk: '11', us: '12', available: false }
      ],
      isNewArrival: false,
      isBestseller: true
    },
    {
      _id: '3',
      name: 'Chelsea Boot Carlisle',
      price: 750,
      category: 'chaussures',
      categoryName: 'Chaussures',
      subcategory: 'boots',
      subcategoryName: 'Boots',
      description: 'Chelsea boot en cuir velours avec élastiques latéraux.',
      details: [
        'Cuir velours (suede)',
        'Doublure en cuir',
        'Semelle en caoutchouc naturel',
        'Fabriqué en Italie'
      ],
      colors: [
        {
          name: 'Taupe',
          code: '#483C32',
          images: ['/assets/images/products/brendt-new/Homme/Chaussures/Boots/Carlisle/Taupe/1.jpg', '/assets/images/products/brendt-new/Homme/Chaussures/Boots/Carlisle/Taupe/2.jpg']
        },
        {
          name: 'Marine',
          code: '#000080',
          images: ['/assets/images/products/brendt-new/Homme/Chaussures/Boots/Carlisle/Marine/1.jpg', '/assets/images/products/brendt-new/Homme/Chaussures/Boots/Carlisle/Marine/2.jpg']
        }
      ],
      sizes: [
        { name: '40', eu: '40', uk: '6', us: '7', available: false },
        { name: '41', eu: '41', uk: '7', us: '8', available: true },
        { name: '42', eu: '42', uk: '8', us: '9', available: true },
        { name: '43', eu: '43', uk: '9', us: '10', available: true },
        { name: '44', eu: '44', uk: '10', us: '11', available: true },
        { name: '45', eu: '45', uk: '11', us: '12', available: true }
      ],
      isNewArrival: true,
      isBestseller: true
    },
    {
      _id: '4',
      name: 'Basket Laurent',
      price: 495,
      category: 'chaussures',
      categoryName: 'Chaussures',
      subcategory: 'baskets',
      subcategoryName: 'Baskets',
      description: 'Basket minimaliste en cuir pleine fleur avec semelle en gomme.',
      details: [
        'Cuir pleine fleur',
        'Doublure en cuir',
        'Semelle en gomme',
        'Fabriqué en Italie'
      ],
      colors: [
        {
          name: 'Blanc',
          code: '#FFFFFF',
          images: ['/assets/images/products/brendt-new/Homme/Chaussures/Baskets/Laurent/Blanc/1.jpg', '/assets/images/products/brendt-new/Homme/Chaussures/Baskets/Laurent/Blanc/2.jpg']
        },
        {
          name: 'Noir',
          code: '#000000',
          images: ['/assets/images/products/brendt-new/Homme/Chaussures/Baskets/Laurent/Noir/1.jpg', '/assets/images/products/brendt-new/Homme/Chaussures/Baskets/Laurent/Noir/2.jpg']
        }
      ],
      sizes: [
        { name: '40', eu: '40', uk: '6', us: '7', available: true },
        { name: '41', eu: '41', uk: '7', us: '8', available: true },
        { name: '42', eu: '42', uk: '8', us: '9', available: true },
        { name: '43', eu: '43', uk: '9', us: '10', available: true },
        { name: '44', eu: '44', uk: '10', us: '11', available: false },
        { name: '45', eu: '45', uk: '11', us: '12', available: false }
      ],
      isNewArrival: false,
      isBestseller: false
    },
    {
      _id: '5',
      name: 'Ceinture Francisco',
      price: 295,
      category: 'accessoires',
      categoryName: 'Accessoires',
      subcategory: 'ceintures',
      subcategoryName: 'Ceintures',
      description: 'Ceinture en cuir de veau tannage végétal avec boucle en laiton plaqué palladium.',
      details: [
        'Cuir de veau tannage végétal',
        'Boucle en laiton plaqué palladium',
        'Largeur 3.2 cm',
        'Fabriqué en Italie'
      ],
      colors: [
        {
          name: 'Noir',
          code: '#000000',
          images: ['/assets/images/products/brendt-new/Homme/Accessoires/Ceintures/Francisco/Noir/1.jpg', '/assets/images/products/brendt-new/Homme/Accessoires/Ceintures/Francisco/Noir/2.jpg']
        },
        {
          name: 'Marron',
          code: '#654321',
          images: ['/assets/images/products/brendt-new/Homme/Accessoires/Ceintures/Francisco/Marron/1.jpg', '/assets/images/products/brendt-new/Homme/Accessoires/Ceintures/Francisco/Marron/2.jpg']
        }
      ],
      sizes: [
        { name: '90', eu: '90', uk: '36', us: '36', available: true },
        { name: '95', eu: '95', uk: '38', us: '38', available: true },
        { name: '100', eu: '100', uk: '40', us: '40', available: true },
        { name: '105', eu: '105', uk: '42', us: '42', available: true },
        { name: '110', eu: '110', uk: '44', us: '44', available: false }
      ],
      isNewArrival: true,
      isBestseller: false
    },
    {
      _id: '6',
      name: 'Cirage Premium',
      price: 45,
      category: 'entretien',
      categoryName: 'Entretien',
      subcategory: 'cirages',
      subcategoryName: 'Cirages',
      description: 'Cirage premium à base de cires naturelles pour l\'entretien des chaussures en cuir.',
      details: [
        'Cires naturelles',
        'Sans solvants',
        'Contenance: 50ml',
        'Fabriqué en France'
      ],
      colors: [
        {
          name: 'Noir',
          code: '#000000',
          images: ['/assets/images/products/brendt-new/Homme/Entretien/Cirages/Premium/Noir/1.jpg', '/assets/images/products/brendt-new/Homme/Entretien/Cirages/Premium/Noir/2.jpg']
        },
        {
          name: 'Marron Foncé',
          code: '#5C4033',
          images: ['/assets/images/products/brendt-new/Homme/Entretien/Cirages/Premium/MarronFonce/1.jpg', '/assets/images/products/brendt-new/Homme/Entretien/Cirages/Premium/MarronFonce/2.jpg']
        },
        {
          name: 'Cognac',
          code: '#8B4513',
          images: ['/assets/images/products/brendt-new/Homme/Entretien/Cirages/Premium/Cognac/1.jpg', '/assets/images/products/brendt-new/Homme/Entretien/Cirages/Premium/Cognac/2.jpg']
        }
      ],
      sizes: [
        { name: 'Unique', eu: 'Unique', uk: 'Unique', us: 'Unique', available: true }
      ],
      isNewArrival: false,
      isBestseller: true
    }
  ],
  
  /**
   * Get all categories
   * @returns {Array} Array of category objects
   */
  getCategories() {
    return this.categories;
  },
  
  /**
   * Get a product by ID
   * @param {string} id - Product ID
   * @returns {Object|null} Product object or null if not found
   */
  getProductById(id) {
    return this.products.find(product => product._id === id) || null;
  },
  
  /**
   * Get filtered products with pagination
   * @param {Object} options - Filter options
   * @returns {Object} Object with data array and pagination info
   */
  getProducts(options = {}) {
    const {
      category,
      subcategory,
      sort = 'newest',
      page = 1,
      limit = 12,
      search
    } = options;
    
    // Apply filters
    let filteredProducts = [...this.products];
    
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (subcategory) {
      filteredProducts = filteredProducts.filter(product => product.subcategory === subcategory);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        // For mock data, we'll just use the default order
        // In real data this would sort by createdAt date
        break;
    }
    
    // Calculate pagination
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Paginate results
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      data: paginatedProducts,
      totalProducts,
      totalPages,
      currentPage: page,
      limit
    };
  },
  
  /**
   * Get related products
   * @param {string} productId - Product ID to exclude
   * @param {string} category - Category to find related products from
   * @param {number} limit - Number of related products to return
   * @returns {Array} Array of related product objects
   */
  getRelatedProducts(productId, category, limit = 4) {
    let relatedProducts = this.products.filter(product => 
      product._id !== productId && 
      (category ? product.category === category : true)
    );
    
    // Shuffle array for random selection
    relatedProducts = relatedProducts.sort(() => 0.5 - Math.random());
    
    // Return limited number of products
    return relatedProducts.slice(0, limit);
  }
};

export default mockData;