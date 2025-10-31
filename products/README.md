# 🛢️ Rumfields Enterprises - Product Database System

A simple, scalable product management system organized by folder structure for easy maintenance.

## 📁 Folder Structure

```
products/
├── database/
│   └── products.json                 # Main product database
├── scripts/
│   ├── product-manager.py           # Python management script
│   ├── product-manager.js           # JavaScript management script
│   └── quick-add.sh                 # Quick add script (optional)
├── passenger-vehicles/              # Category folder
│   ├── synthetic-semi-synthetic/    # Subcategory folder
│   │   ├── quartz-7000-10w40/      # Product folder
│   │   │   ├── main.jpg            # Product image
│   │   │   ├── gallery-1.jpg       # Additional images
│   │   │   ├── gallery-2.jpg
│   │   │   └── datasheet.pdf       # Technical datasheet
│   │   └── quartz-9000-5w40/
│   │       ├── main.jpg
│   │       └── datasheet.pdf
│   └── premier-synthetic/
│       └── quartz-ineo-mc3-5w30/
├── heavy-vehicles/
│   └── diesel-engine-oil/
└── ...
```

## 🚀 Quick Start

### Using Python Script

```bash
# Navigate to scripts folder
cd products/scripts

# Run interactive manager
python product-manager.py
```

### Using JavaScript/Node.js

```bash
# Install Node.js if not already installed
# Navigate to scripts folder
cd products/scripts

# Run the script
node product-manager.js
```

## 📝 Adding a New Product

### Method 1: Using Interactive Script (Easiest)

1. Run the Python script:
   ```bash
   python product-manager.py
   ```

2. Select option `2` (Add new product)

3. Enter the details:
   - Category ID: `passenger-vehicles`
   - Subcategory ID: `synthetic-semi-synthetic`
   - Product ID: `quartz-7000-10w40`
   - Product Name: `QUARTZ 7000 10W40`
   - Description: `High-performance semi-synthetic engine oil`
   - Viscosity: `10W40`
   - Specifications: `API SN, ACEA A3/B4`
   - In Stock: `y`
   - Featured: `y`

4. The script will:
   - Create the folder structure automatically
   - Add the product to the database
   - Show you where to place images and datasheets

### Method 2: Manual JSON Edit

1. Open `products/database/products.json`

2. Find the correct category and subcategory

3. Add your product to the `products` array:
   ```json
   {
     "id": "product-id",
     "name": "Product Name",
     "description": "Product description",
     "viscosity": "10W40",
     "specifications": ["API SN", "ACEA A3/B4"],
     "image": "products/category/subcategory/product-id/main.jpg",
     "datasheet": "products/category/subcategory/product-id/datasheet.pdf",
     "inStock": true,
     "featured": false
   }
   ```

4. Create the folder structure:
   ```
   products/category/subcategory/product-id/
   ```

5. Add your images and PDF datasheet to the folder

### Method 3: Using Code

```javascript
const ProductManager = require('./scripts/product-manager.js');
const manager = new ProductManager();

manager.addProduct('passenger-vehicles', 'synthetic-semi-synthetic', {
    id: 'quartz-7000-10w40',
    name: 'QUARTZ 7000 10W40',
    description: 'High-performance semi-synthetic engine oil',
    viscosity: '10W40',
    specifications: ['API SN', 'ACEA A3/B4'],
    inStock: true,
    featured: true
});
```

## 🗑️ Removing a Product

### Using Interactive Script

1. Run: `python product-manager.py`
2. Select option `3` (Remove product)
3. Enter category ID, subcategory ID, and product ID
4. Confirm deletion of folder (optional)

### Using Code

```javascript
manager.removeProduct('passenger-vehicles', 'synthetic-semi-synthetic', 'quartz-7000-10w40');
```

## ✏️ Updating a Product

### Using Interactive Script

1. Run: `python product-manager.py`
2. Select option `4` (Update product)
3. Enter the IDs and new values

### Using Code

```javascript
manager.updateProduct('passenger-vehicles', 'synthetic-semi-synthetic', 'quartz-7000-10w40', {
    inStock: false,
    description: 'Updated description'
});
```

## 🔍 Searching Products

### Using Interactive Script

1. Run: `python product-manager.py`
2. Select option `5` (Search products)
3. Enter search query (searches name and description)

### Using Code

```javascript
const results = manager.searchProducts('synthetic');
console.log(results);
```

## 📊 Product Categories

### 1. Passenger Vehicles
- Synthetic & Semi-Synthetic Engine Oil
- Premier Synthetic Engine Oil
- Mineral Engine Oil
- 4x4 Engine Oil
- Monograde Engine Oil

### 2. Heavy Vehicles
- Diesel Engine Oil
- Synthetic Diesel Engine Oil
- Specialized Diesel Engine Oil
- Low SAPS Diesel Oil
- Off-Road Equipment Oil
- Truck Differential Oil

### 3. Farming & Agriculture
- Tractor Engine Oil
- Universal Tractor Oil (STOU)
- Universal Tractor Transmission Oil (UTTO)

### 4. Gear, Transmission & Specialties
- Automatic Transmission Fluid (ATF)
- Manual Gear & Axle Oil
- Synthetic Gear Oil
- Brake Fluid

### 5. Motorcycle & Small Engine Oils
- 2-Stroke Oil

### 6. Industrial
- Hydraulic Oil
- Industrial GearBox Oil
- Compressor Oil
- Yellow Machine Fluids
- Turbine Oil
- Rockdrill Oil
- Heat Transfer Oil
- Transformer Oil
- Soluble Cutting Oil

### 7. Greases
- General Purpose Grease
- Yellow Machine & Earth Moving Grease
- Bearing Grease
- Specialized Grease

### 8. Coolants & Additives
- Coolant
- Degreaser

## 📸 Image Guidelines

### Main Product Image (`main.jpg`)
- **Size**: 800x800px minimum
- **Format**: JPG or PNG
- **Background**: White or transparent
- **Quality**: High resolution

### Gallery Images (`gallery-1.jpg`, `gallery-2.jpg`, etc.)
- Show product from different angles
- Include packaging/label details
- Show product in use (optional)

### Datasheet (`datasheet.pdf`)
- Technical specifications
- Safety data
- Application guidelines
- Compliance certifications

## 🔧 Advanced Features

### Export to CSV

```bash
python product-manager.py
# Select option 8
```

This creates a CSV file with all products for Excel/Google Sheets.

### Get Featured Products

```javascript
const featured = manager.getFeaturedProducts();
```

### Get Products by Category

```javascript
const heavyVehicleProducts = manager.getProductsByCategory('heavy-vehicles');
```

### Get In-Stock Products

```javascript
const inStock = manager.getInStockProducts();
```

## 🌐 Web Integration

### Loading Products in HTML/JavaScript

```javascript
// Fetch products database
fetch('products/database/products.json')
    .then(response => response.json())
    .then(data => {
        console.log('Products loaded:', data);
        displayProducts(data.categories);
    });
```

### Search Implementation

```javascript
function searchProducts(query) {
    fetch('products/database/products.json')
        .then(response => response.json())
        .then(data => {
            const results = [];
            data.categories.forEach(category => {
                category.subcategories.forEach(subcategory => {
                    subcategory.products.forEach(product => {
                        if (product.name.toLowerCase().includes(query.toLowerCase())) {
                            results.push(product);
                        }
                    });
                });
            });
            displaySearchResults(results);
        });
}
```

## 📋 Product Data Structure

```json
{
  "id": "unique-product-id",
  "name": "Product Display Name",
  "description": "Detailed product description",
  "viscosity": "10W40",
  "specifications": ["API SN", "ACEA A3/B4"],
  "image": "path/to/main.jpg",
  "datasheet": "path/to/datasheet.pdf",
  "inStock": true,
  "featured": false
}
```

### Required Fields
- `id`: Unique identifier (lowercase, hyphenated)
- `name`: Display name
- `description`: Product description

### Optional Fields
- `viscosity`: Oil viscosity grade
- `specifications`: Array of technical specs
- `image`: Path to main image
- `datasheet`: Path to PDF datasheet
- `inStock`: Boolean (default: true)
- `featured`: Boolean (default: false)

## 🎯 Best Practices

1. **Consistent Naming**
   - Use lowercase with hyphens for IDs
   - Example: `quartz-7000-10w40`

2. **Folder Organization**
   - Keep one product per folder
   - Include all related files in product folder

3. **Image Optimization**
   - Compress images before uploading
   - Use consistent dimensions
   - Name files descriptively

4. **Regular Backups**
   - Backup `products.json` regularly
   - Version control recommended (Git)

5. **Documentation**
   - Keep datasheets up to date
   - Include safety information
   - Update specifications when changed

## 🆘 Troubleshooting

### "Category not found"
- Check category ID spelling
- Verify category exists in database
- Use `list_products()` to see all categories

### "Product folder not created"
- Check file permissions
- Verify path is correct
- Run script with admin privileges if needed

### "Database not loading"
- Check JSON syntax (use JSON validator)
- Verify file path is correct
- Check file encoding (should be UTF-8)

## 📞 Support

For questions or issues:
- Check this README
- Review example products in database
- Contact IT support

## 🔄 Version History

- **v1.0.0** (2025-10-30): Initial release
  - Basic CRUD operations
  - Python and JavaScript managers
  - Category/subcategory structure
  - Search functionality

---

**Made with ❤️ for Rumfields Enterprises**
