/**
 * Product Database Manager - JavaScript Version
 * For web integration and Node.js usage
 */

const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor(basePath = null) {
        this.basePath = basePath || path.join(__dirname, '..');
        this.dbPath = path.join(this.basePath, 'database', 'products.json');
        this.loadDatabase();
    }

    loadDatabase() {
        try {
            const data = fs.readFileSync(this.dbPath, 'utf8');
            this.db = JSON.parse(data);
            console.log('✅ Database loaded successfully');
        } catch (error) {
            console.error('❌ Error loading database:', error.message);
            this.db = { categories: [], metadata: {} };
        }
    }

    saveDatabase() {
        // Update metadata
        this.db.metadata.lastUpdated = new Date().toISOString().split('T')[0];
        this.db.metadata.totalProducts = this.countTotalProducts();
        this.db.metadata.totalCategories = this.db.categories.length;

        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2), 'utf8');
            console.log('✅ Database saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving database:', error.message);
            return false;
        }
    }

    countTotalProducts() {
        let total = 0;
        this.db.categories.forEach(category => {
            category.subcategories?.forEach(subcategory => {
                total += subcategory.products?.length || 0;
            });
        });
        return total;
    }

    addProduct(categoryId, subcategoryId, productData) {
        const category = this.findCategory(categoryId);
        if (!category) {
            console.error(`❌ Category '${categoryId}' not found`);
            return false;
        }

        const subcategory = this.findSubcategory(category, subcategoryId);
        if (!subcategory) {
            console.error(`❌ Subcategory '${subcategoryId}' not found`);
            return false;
        }

        // Create product folder
        const productFolder = path.join(this.basePath, categoryId, subcategoryId, productData.id);
        if (!fs.existsSync(productFolder)) {
            fs.mkdirSync(productFolder, { recursive: true });
        }

        // Set default paths
        if (!productData.image) {
            productData.image = `products/${categoryId}/${subcategoryId}/${productData.id}/main.jpg`;
        }
        if (!productData.datasheet) {
            productData.datasheet = `products/${categoryId}/${subcategoryId}/${productData.id}/datasheet.pdf`;
        }

        // Add product
        if (!subcategory.products) {
            subcategory.products = [];
        }
        subcategory.products.push(productData);

        this.saveDatabase();
        console.log(`✅ Product '${productData.name}' added successfully`);
        console.log(`📁 Product folder: ${productFolder}`);
        return true;
    }

    removeProduct(categoryId, subcategoryId, productId) {
        const category = this.findCategory(categoryId);
        if (!category) return false;

        const subcategory = this.findSubcategory(category, subcategoryId);
        if (!subcategory) return false;

        const productIndex = subcategory.products?.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            console.error(`❌ Product '${productId}' not found`);
            return false;
        }

        const product = subcategory.products[productIndex];
        subcategory.products.splice(productIndex, 1);

        this.saveDatabase();
        console.log(`✅ Product '${product.name}' removed successfully`);
        return true;
    }

    updateProduct(categoryId, subcategoryId, productId, updates) {
        const category = this.findCategory(categoryId);
        if (!category) return false;

        const subcategory = this.findSubcategory(category, subcategoryId);
        if (!subcategory) return false;

        const product = subcategory.products?.find(p => p.id === productId);
        if (!product) {
            console.error(`❌ Product '${productId}' not found`);
            return false;
        }

        Object.assign(product, updates);
        this.saveDatabase();
        console.log(`✅ Product '${product.name}' updated successfully`);
        return true;
    }

    searchProducts(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        this.db.categories.forEach(category => {
            category.subcategories?.forEach(subcategory => {
                subcategory.products?.forEach(product => {
                    if (product.name.toLowerCase().includes(lowerQuery) ||
                        product.description?.toLowerCase().includes(lowerQuery)) {
                        results.push({
                            category: category.name,
                            subcategory: subcategory.name,
                            product: product
                        });
                    }
                });
            });
        });

        return results;
    }

    findCategory(categoryId) {
        return this.db.categories.find(c => c.id === categoryId);
    }

    findSubcategory(category, subcategoryId) {
        return category.subcategories?.find(s => s.id === subcategoryId);
    }

    getAllProducts() {
        const products = [];
        this.db.categories.forEach(category => {
            category.subcategories?.forEach(subcategory => {
                subcategory.products?.forEach(product => {
                    products.push({
                        ...product,
                        categoryId: category.id,
                        categoryName: category.name,
                        subcategoryId: subcategory.id,
                        subcategoryName: subcategory.name
                    });
                });
            });
        });
        return products;
    }

    getProductsByCategory(categoryId) {
        const category = this.findCategory(categoryId);
        if (!category) return [];

        const products = [];
        category.subcategories?.forEach(subcategory => {
            subcategory.products?.forEach(product => {
                products.push({
                    ...product,
                    subcategoryId: subcategory.id,
                    subcategoryName: subcategory.name
                });
            });
        });
        return products;
    }

    getFeaturedProducts() {
        return this.getAllProducts().filter(p => p.featured);
    }

    getInStockProducts() {
        return this.getAllProducts().filter(p => p.inStock);
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductManager;
}

// Example usage
if (require.main === module) {
    const manager = new ProductManager();
    
    console.log('\n📊 Database Statistics:');
    console.log(`Total Categories: ${manager.db.categories.length}`);
    console.log(`Total Products: ${manager.countTotalProducts()}`);
    console.log(`Featured Products: ${manager.getFeaturedProducts().length}`);
    console.log(`In Stock Products: ${manager.getInStockProducts().length}`);
}
