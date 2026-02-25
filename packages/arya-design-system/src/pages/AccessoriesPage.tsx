import '../styles/global.css';

// Product data - matching Apple's actual accessories page
const products = [
  {
    id: 1,
    name: 'AirPods Pro 3',
    price: '$249.00',
    badge: 'Free Engraving',
    image: '/images/products/airpods-pro-3-hero-select-202509.png',
    color: '#f5f5f7',
    new: true,
    description: 'MagSafe Charging Case (USB‑C)',
    rating: 4.5,
    reviewCount: 12847,
    colors: ['White']
  },
  {
    id: 2,
    name: 'AirPods 4 with Active Noise Cancellation',
    price: '$179.00',
    badge: 'Free Engraving',
    image: '/images/products/airpods-4-anc-select-202409.png',
    color: '#f5f5f7',
    new: true,
    description: 'Lightning Charging Case',
    rating: 4.8,
    reviewCount: 8234,
    colors: ['White']
  },
  {
    id: 3,
    name: 'AirPods Max',
    price: '$549.00',
    badge: 'Free Engraving',
    image: '/images/products/airpods-max-select-202409-midnight.png',
    color: '#f5f5f7',
    new: false,
    description: null,
    rating: 4.7,
    reviewCount: 15692,
    colors: ['Midnight', 'Silver', 'Space Gray', 'Pink', 'Green']
  },
  {
    id: 4,
    name: 'AirPods Pro (2nd generation) Silicone Ear Tips - XS (2 pairs)',
    price: '$7.99',
    badge: null,
    image: null,
    color: '#e8e8ed',
    new: false,
    description: null,
    rating: 4.6,
    reviewCount: 342,
    colors: null
  },
  {
    id: 5,
    name: 'Belkin SOUNDFORM Nano Wireless Earbuds for Kids',
    price: '$49.95',
    badge: null,
    image: null,
    color: '#ffc4dd',
    new: true,
    description: 'Volume limited to protect hearing',
    rating: 4.4,
    reviewCount: 876,
    colors: ['Pink', 'Blue']
  },
  {
    id: 6,
    name: 'Incase AirPods Pro Case with Woolenex',
    price: '$29.95',
    badge: null,
    image: null,
    color: '#3a3a3c',
    new: false,
    description: 'Premium protection with Woolenex fabric',
    rating: 4.3,
    reviewCount: 234,
    colors: ['Black', 'Pink']
  }
];

const navItems = ['Store', 'Mac', 'iPad', 'iPhone', 'Watch', 'AirPods', 'TV & Home', 'Entertainment', 'Accessories', 'Support'];

function AccessoriesPage() {
  return (
    <>
      {/* Apple Navigation Bar */}
      <nav className="apple-nav">
        <div className="nav-content">
          <a href="/" className="nav-logo">
            <svg height="44" viewBox="0 0 14 44" width="14" xmlns="http://www.w3.org/2000/svg">
              <path d="m13.0729 17.6825a3.61 3.61 0 0 0 -1.7248 3.0365 3.5132 3.5132 0 0 0 2.1379 3.2223 8.394 8.394 0 0 1 -1.0948 2.2618c-.6816.9812-1.3943 1.9623-2.4787 1.9623s-1.3633-.63-2.613-.63c-1.2187 0-1.6525.6507-2.644.6507s-1.6834-.9089-2.4787-2.0243a9.7842 9.7842 0 0 1 -1.6628-5.2776c0-3.0984 2.014-4.7405 3.9969-4.7405 1.0535 0 1.9314.6817 2.5924.6817.63 0 1.6112-.7127 2.8092-.7127a3.7579 3.7579 0 0 1 3.1604 1.5802zm-3.7284-2.8918a3.5615 3.5615 0 0 0 .8469-2.22 1.5353 1.5353 0 0 0 -.031-.32 3.5686 3.5686 0 0 0 -2.3445 1.2084 3.4629 3.4629 0 0 0 -.8779 2.1585 1.419 1.419 0 0 0 .031.2892 1.19 1.19 0 0 0 .2169.0207 3.0935 3.0935 0 0 0 2.1586-1.1368z" fill="#fff"/>
            </svg>
          </a>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item}>
                {item === 'Support' ? (
                  <a href="/registration" className="nav-link">{item}</a>
                ) : item === 'Accessories' ? (
                  <a href="/" className="nav-link">{item}</a>
                ) : (
                  <a href="#" className="nav-link">{item}</a>
                )}
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <button className="nav-icon-btn">
              <svg height="44" viewBox="0 0 15 44" width="15" xmlns="http://www.w3.org/2000/svg">
                <path d="m14.298 27.202-3.87-3.87c-.701.573-1.57.97-2.507 1.124v-2.136c.827-.18 1.581-.585 2.161-1.165.58-.58.985-1.334 1.165-2.161h2.136c-.154.937-.551 1.806-1.124 2.507l3.87 3.87zm-6.377-5.061v-2.136h-2.136v2.136zm-3.12 0h2.136v-2.136h-2.136z" fill="#fff"/>
              </svg>
            </button>
            <button className="nav-icon-btn">
              <svg height="44" viewBox="0 0 14 44" width="14" xmlns="http://www.w3.org/2000/svg">
                <path d="m11.3535 16.0283h-1.0205a3.4229 3.4229 0 0 0 -3.333-2.9648 3.4229 3.4229 0 0 0 -3.333 2.9648h-1.0205a.6.6 0 0 0 -.6.6v7.37a.6.6 0 0 0 .6.6h8.707a.6.6 0 0 0 .6-.6v-7.37a.6.6 0 0 0 -.6-.6zm-4.3535-1.8652a2.3169 2.3169 0 0 1 2.2349 1.8652h-4.4698a2.3169 2.3169 0 0 1 2.2349-1.8652zm5.37 11.6369h-10.74v-8.37h10.74z" fill="#fff"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="page-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="#">AirPods</a> <span className="breadcrumb-separator">›</span> <span>Accessories</span>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">AirPods Accessories</h1>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filters-container">
            <button className="filter-dropdown">
              <span>Category</span>
              <svg width="10" height="6" viewBox="0 0 10 6">
                <path fill="#1d1d1f" d="m0 0 5 6 5-6z"/>
              </svg>
            </button>
            <button className="filter-dropdown">
              <span>Compatibility</span>
              <svg width="10" height="6" viewBox="0 0 10 6">
                <path fill="#1d1d1f" d="m0 0 5 6 5-6z"/>
              </svg>
            </button>
            <button className="filter-dropdown">
              <span>Brand</span>
              <svg width="10" height="6" viewBox="0 0 10 6">
                <path fill="#1d1d1f" d="m0 0 5 6 5-6z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-wrapper">
          {/* Product Grid */}
          <main className="main-content">
            <div className="results-header">
              <span className="results-count">{products.length} items</span>
            </div>

            <div className="as-pinwheel">
              {products.map((product) => (
                <div key={product.id} className="as-pinwheel-tile">
                  <div className="as-util-relatedlink">
                    <div className="as-pinwheel-tilehero">
                      <div 
                        className="as-pinwheel-tileheroimage"
                        style={!product.image ? { backgroundColor: product.color } : {}}
                      >
                        {product.image && (
                          <img src={product.image} alt={product.name} className="product-img" />
                        )}
                      </div>
                    </div>

                    <div className="as-pinwheel-colorsection">
                      {product.colors && product.colors.length > 0 && (
                        <div className="color-options">
                          {product.colors.map((colorName, index) => (
                            <span key={index} className="color-dot" title={colorName}></span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="as-pinwheel-infosection">
                      <div className="as-pinwheel-tileheader">
                        {product.badge && (
                          <div className="violator-wrapper">
                            <span className="violator-frameless badge">{product.badge}</span>
                          </div>
                        )}
                        {product.new && !product.badge && (
                          <div className="violator-wrapper">
                            <span className="violator-frameless badge badge-new">New</span>
                          </div>
                        )}
                      </div>

                      <h3 className="as-pinwheel-tiletitle">
                        <a href="#" className="as-pinwheel-tilelink">{product.name}</a>
                      </h3>

                      {product.description && (
                        <p className="as-pinwheel-description">{product.description}</p>
                      )}

                      <div className="as-pinwheel-info">
                        <div className="as-pinwheel-price">
                          <span className="as-pinwheel-pricecurrent">{product.price}</span>
                        </div>
                        
                        {product.rating && (
                          <div className="as-pinwheel-rating">
                            <div className="rating-stars">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="rating-count">({product.reviewCount.toLocaleString()})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="apple-footer">
        <div className="footer-content">
          <div className="footer-links">
            <div className="footer-column">
              <h4>Shop and Learn</h4>
              <ul>
                <li><a href="#">Store</a></li>
                <li><a href="#">Mac</a></li>
                <li><a href="#">iPad</a></li>
                <li><a href="#">iPhone</a></li>
                <li><a href="#">Watch</a></li>
                <li><a href="#">AirPods</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li><a href="#">Apple Music</a></li>
                <li><a href="#">Apple TV+</a></li>
                <li><a href="#">Apple Fitness+</a></li>
                <li><a href="#">iCloud</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Apple Store</h4>
              <ul>
                <li><a href="#">Find a Store</a></li>
                <li><a href="#">Genius Bar</a></li>
                <li><a href="#">Today at Apple</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>More ways to shop: <a href="#">Find an Apple Store</a> or <a href="#">other retailer</a> near you. Or call 1-800-MY-APPLE.</p>
            <p className="footer-legal">Copyright © 2026 Apple Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default AccessoriesPage;
