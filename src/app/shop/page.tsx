"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import { products, Product } from "@/data/products";
import { categories } from "@/data/categories";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard/ProductCard";
import QuickViewModal from "@/components/QuickViewModal/QuickViewModal";
import Button from "@/components/Button/Button";
import styles from "./shop.module.css";

function ShopContent() {
  const { searchQuery, setSearchQuery } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State parameters
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]); // empty = all
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [showInStock, setShowInStock] = useState<boolean>(true);
  const [showOutStock, setShowOutStock] = useState<boolean>(true);
  const [collectionFilter, setCollectionFilter] = useState<string[]>([]); // empty = all; values: 'best_sellers','new_arrivals'
  const [sortBy, setSortBy] = useState<string>("popular"); // 'popular', 'price_asc', 'price_desc', 'newest'
  
  // Mobile filter states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync category and search query from URL params on load/change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const filterParam = searchParams.get("filter");

    if (categoryParam) {
      // support comma-separated categories in URL
      setSelectedCategory(categoryParam.split(",").filter(Boolean));
    } else {
      setSelectedCategory([]);
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }

    if (filterParam) {
      setCollectionFilter(filterParam.split(",").filter(Boolean));
    } else {
      setCollectionFilter([]);
    }
  }, [searchParams, setSearchQuery]);

  // Filter products based on selections
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter (multi-select)
    if (selectedCategory.length > 0 && !selectedCategory.includes(product.category)) {
      return false;
    }

    // 2. Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(query);
      const matchDesc = product.description.toLowerCase().includes(query);
      const matchCat = product.category.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCat) {
        return false;
      }
    }

    // 3. Price Filter
    if (product.price > maxPrice) {
      return false;
    }

    // 4. Availability Filter
    if (!showInStock && (product.stockStatus === "in_stock" || product.stockStatus === "low_stock")) {
      return false;
    }
    if (!showOutStock && product.stockStatus === "out_of_stock") {
      return false;
    }

    // 5. Collection Filter (multi-select: at least one must match)
    if (collectionFilter.length > 0) {
      let collMatch = false;
      if (collectionFilter.includes("best_sellers") && product.isBestSeller) collMatch = true;
      if (collectionFilter.includes("new_arrivals") && product.isNewArrival) collMatch = true;
      if (!collMatch) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "newest":
        // New arrivals first, then sort by id
        if (a.isNewArrival && !b.isNewArrival) return -1;
        if (!a.isNewArrival && b.isNewArrival) return 1;
        return a.id.localeCompare(b.id);
      case "popular":
      default:
        // Sort by rating high-to-low, then by review count
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
    }
  });

  const handleResetFilters = () => {
    setSelectedCategory([]);
    setMaxPrice(100);
    setShowInStock(true);
    setShowOutStock(true);
    setCollectionFilter([]);
    setSearchQuery("");
    setSortBy("popular");
    router.push("/shop");
  };

  const handleRemoveCategory = (slug?: string) => {
    if (!slug) {
      setSelectedCategory([]);
    } else {
      setSelectedCategory((prev) => prev.filter((s) => s !== slug));
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`/shop?${params.toString()}`);
  };

  const handleRemoveSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/shop?${params.toString()}`);
  };

  const handleRemoveCollection = (col?: string) => {
    if (!col) {
      setCollectionFilter([]);
    } else {
      setCollectionFilter((prev) => prev.filter((c) => c !== col));
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ditvi Crochet Shop</h1>
        <p className={styles.subtitle}>
          Browse our beautiful, premium handmade crochet catalog. Each piece is crafted stitch by stitch with warmth and love.
        </p>

        {/* Active badges row */}
        {(selectedCategory.length > 0 || searchQuery || collectionFilter.length > 0 || maxPrice < 100) && (
          <div className={styles.activeFiltersRow}>
            {selectedCategory.length > 0 && (
              <>
                {selectedCategory.map((sc) => (
                  <span key={sc} className={styles.filterBadge}>
                    <CategoryOutlinedIcon fontSize="small" />
                    <span>{sc.replace("-", " ")}</span>
                    <button onClick={() => handleRemoveCategory(sc)} aria-label="Remove category filter"><CloseRoundedIcon fontSize="small" /></button>
                  </span>
                ))}
              </>
            )}
            {searchQuery && (
              <span className={styles.filterBadge}>
                <SearchOutlinedIcon fontSize="small" />
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <button onClick={handleRemoveSearch} aria-label="Remove search filter"><CloseRoundedIcon fontSize="small" /></button>
              </span>
            )}
            {collectionFilter.length > 0 && (
              <>
                {collectionFilter.map((cf) => (
                  <span key={cf} className={styles.filterBadge}>
                    <CollectionsBookmarkOutlinedIcon fontSize="small" />
                    <span>{cf.replace("_", " ")}</span>
                    <button onClick={() => handleRemoveCollection(cf)} aria-label="Remove collection filter"><CloseRoundedIcon fontSize="small" /></button>
                  </span>
                ))}
              </>
            )}
            {maxPrice < 100 && (
              <span className={styles.filterBadge}>
                <SellOutlinedIcon fontSize="small" />
                <span>₹{maxPrice}</span>
                <button onClick={() => setMaxPrice(100)} aria-label="Remove price filter"><CloseRoundedIcon fontSize="small" /></button>
              </span>
            )}
            <button onClick={handleResetFilters} className={styles.clearFilterBtn}>
              <FilterAltOffOutlinedIcon fontSize="small" />
              Clear All Filters
            </button>
          </div>
        )}
      </header>

      {/* Mobile filter trigger bar */}
      <div className={styles.mobileFilterBar}>
        <button
          className={styles.mobileFilterToggle}
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <TuneOutlinedIcon fontSize="small" /> Filter & Sort
        </button>
        {isMobileFilterOpen && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setIsMobileFilterOpen(false)}
          />
        )}
      </div>

      <div className={styles.layout}>
        {/* Filter Sidebar (Desktop and Mobile Drawer) */}
        <aside
          className={`${styles.sidebar} ${
            isMobileFilterOpen ? styles.sidebarOpen : ""
          }`}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className={styles.sidebarTitle}>Filters</h2>
            {isMobileFilterOpen && (
              <button
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--dark-text)" }}
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <CloseRoundedIcon fontSize="small" />
              </button>
            )}
          </div>

          {/* Categories group */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Categories</span>
            <div className={styles.categoryList}>
              <button
                className={`${styles.categoryBtn} ${
                  selectedCategory.length === 0 ? styles.categoryBtnActive : ""
                }`}
                onClick={() => {
                  setSelectedCategory([]);
                  setIsMobileFilterOpen(false);
                }}
              >
                <span className={styles.categoryCheckbox} aria-hidden="true">
                  {selectedCategory.length === 0 ? (
                    <CheckRoundedIcon fontSize="inherit" />
                  ) : (
                    <CheckBoxOutlineBlankRoundedIcon fontSize="inherit" />
                  )}
                </span>
                <span className={styles.categoryText}>All Categories</span>
                <span className={styles.categoryCount}>({products.length})</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug).length;
                const isSelected = selectedCategory.includes(cat.slug);
                return (
                  <button
                    key={cat.id}
                    className={`${styles.categoryBtn} ${
                      isSelected ? styles.categoryBtnActive : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory((prev) => {
                        if (prev.includes(cat.slug)) {
                          return prev.filter((s) => s !== cat.slug);
                        }
                        return [...prev, cat.slug];
                      });
                      setIsMobileFilterOpen(false);
                    }}
                  >
                    <span className={styles.categoryCheckbox} aria-hidden="true">
                      {isSelected ? (
                        <CheckRoundedIcon fontSize="inherit" />
                      ) : (
                        <CheckBoxOutlineBlankRoundedIcon fontSize="inherit" />
                      )}
                    </span>
                    <span className={styles.categoryText}>{cat.name}</span>
                    <span className={styles.categoryCount}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collection type group */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Collections</span>
            <div className={styles.categoryList}>
              <button
                className={`${styles.categoryBtn} ${
                  collectionFilter.length === 0 ? styles.categoryBtnActive : ""
                }`}
                onClick={() => setCollectionFilter([])}
              >
                All Products
              </button>
              <button
                className={`${styles.categoryBtn} ${
                  collectionFilter.includes("best_sellers") ? styles.categoryBtnActive : ""
                }`}
                onClick={() => {
                  setCollectionFilter((prev) => 
                    prev.includes("best_sellers") ? prev.filter((p) => p !== "best_sellers") : [...prev, "best_sellers"]
                  );
                }}
              >
                Best Sellers
              </button>
              <button
                className={`${styles.categoryBtn} ${
                  collectionFilter.includes("new_arrivals") ? styles.categoryBtnActive : ""
                }`}
                onClick={() => {
                  setCollectionFilter((prev) => 
                    prev.includes("new_arrivals") ? prev.filter((p) => p !== "new_arrivals") : [...prev, "new_arrivals"]
                  );
                }}
              >
                New Arrivals
              </button>
            </div>
          </div>

          {/* Price Range group */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Price: ₹{maxPrice}</span>
            <div className={styles.priceSliderContainer}>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className={styles.priceRangeInput}
              />
              <div className={styles.priceLabels}>
                <span>₹5</span>
                <span>₹100</span>
              </div>
            </div>
          </div>

          {/* Availability group */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Availability</span>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showInStock}
                onChange={(e) => setShowInStock(e.target.checked)}
                className={styles.checkboxInput}
              />
              In Stock / Low Stock
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showOutStock}
                onChange={(e) => setShowOutStock(e.target.checked)}
                className={styles.checkboxInput}
              />
              Out of Stock
            </label>
          </div>

          <Button
            variant="outline"
            onClick={handleResetFilters}
            fullWidth
            size="sm"
          >
            Reset Filters
          </Button>
        </aside>

        {/* Products section */}
        <main className={styles.mainCol}>
          <div className={styles.toolbar}>
            <span className={styles.productCount}>
              Showing <strong>{sortedProducts.length}</strong> products
            </span>
            <div className={styles.sortSelectWrapper}>
              <span className={styles.sortLabel}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="popular">Popularity (Best Match)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {sortedProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}><Inventory2OutlinedIcon fontSize="large" /></span>
              <h3 className={styles.emptyTitle}>No products found</h3>
              <p className={styles.emptyDesc}>
                We couldn't find any products that match your current search queries or filter choices.
              </p>
              <Button variant="primary" onClick={handleResetFilters}>
                View All Products
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading Ditvi Crochet catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
