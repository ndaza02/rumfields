# 🚀 Quick Start Guide - Product Database

## 📦 What You Have

A complete product management system with:
- ✅ JSON database (`products/database/products.json`)
- ✅ Python management script
- ✅ JavaScript management script  
- ✅ Web catalog page (`products.html`)
- ✅ Organized folder structure

## ⚡ Quick Actions

### Add a Product (Easiest Way)

**Windows:**
1. Double-click `products/scripts/quick-add-product.bat`
2. Select option `2` (Add new product)
3. Fill in the details
4. Done! ✅

**Mac/Linux:**
```bash
cd products/scripts
python3 product-manager.py
```

### View All Products

**Option 1: Web Browser**
- Open `products.html` in your browser
- Search and filter products visually

**Option 2: Command Line**
```bash
cd products/scripts
python product-manager.py
# Select option 1
```

### Search for a Product

**Web:** 
- Open `products.html`
- Type in search box
- Results appear instantly

**Command Line:**
```bash
python product-manager.py
# Select option 5
# Enter search term
```

## 📁 Folder Structure Explained

```
products/
├── passenger-vehicles/          ← Category folder
│   └── synthetic-semi-synthetic/  ← Subcategory folder
│       └── quartz-7000-10w40/     ← Product folder
│           ├── main.jpg           ← Product image
│           └── datasheet.pdf      ← Technical specs
```

**Rule:** `Category > Subcategory > Product > Files`

## 🎯 Common Tasks

### 1. Add New Product

```bash
# Run script
python product-manager.py

# Choose option 2
# Enter:
Category ID: passenger-vehicles
Subcategory ID: synthetic-semi-synthetic
Product ID: new-product-name
Name: New Product Name
Description: Product description
Viscosity: 10W40
Specifications: API SN, ACEA A3/B4
In Stock: y
Featured: n
```

**Result:** 
- Product added to database ✅
- Folder created automatically ✅
- Ready for images/datasheet ✅

### 2. Remove Product

```bash
python product-manager.py
# Option 3
# Enter category, subcategory, and product IDs
```

### 3. Update Product Info

```bash
python product-manager.py
# Option 4
# Enter IDs and new values
```

### 4. Export to Excel

```bash
python product-manager.py
# Option 8
# Opens products_export.csv
```

## 🖼️ Adding Images

1. Find your product folder:
   ```
   products/category-name/subcategory-name/product-id/
   ```

2. Add images:
   - `main.jpg` - Main product image (required)
   - `gallery-1.jpg` - Additional image (optional)
   - `gallery-2.jpg` - Additional image (optional)

3. Add datasheet:
   - `datasheet.pdf` - Technical specifications

**Image Tips:**
- Size: 800x800px minimum
- Format: JPG or PNG
- Background: White preferred
- Quality: High resolution

## 🔍 Category IDs Reference

Use these IDs when adding products:

| Category | ID |
|----------|-----|
| Passenger Vehicles | `passenger-vehicles` |
| Heavy Vehicles | `heavy-vehicles` |
| Farming & Agriculture | `farming-agriculture` |
| Gear & Transmission | `gear-transmission` |
| Motorcycle Oils | `motorcycle-oils` |
| Industrial | `industrial` |
| Greases | `greases` |
| Coolants & Additives | `coolants-additives` |

## 🌐 Using on Website

The `products.html` page automatically:
- ✅ Loads all products from database
- ✅ Provides search functionality
- ✅ Filters by category
- ✅ Shows product details
- ✅ Links to datasheets

**To update website:**
1. Add/edit products using script
2. Refresh `products.html` in browser
3. Changes appear automatically!

## 💡 Pro Tips

1. **Consistent Naming**
   - Product IDs: lowercase-with-hyphens
   - Example: `quartz-7000-10w40`

2. **Organize Images**
   - Keep all product files in product folder
   - Use descriptive names

3. **Regular Backups**
   - Backup `products.json` weekly
   - Keep in cloud storage

4. **Batch Operations**
   - Use CSV export for bulk edits
   - Import back using script

## ❓ Troubleshooting

**"Python not found"**
- Install Python from python.org
- Add to system PATH

**"Database not loading"**
- Check `products.json` syntax
- Use JSON validator online

**"Product not showing on website"**
- Clear browser cache
- Check product `inStock: true`
- Verify JSON syntax

## 📞 Need Help?

1. Check `README.md` for detailed docs
2. Review example products in database
3. Contact IT support

## ✅ Checklist for New Products

- [ ] Run product-manager script
- [ ] Add product details
- [ ] Create product folder
- [ ] Add main.jpg image
- [ ] Add datasheet.pdf
- [ ] Test on products.html
- [ ] Verify search works
- [ ] Backup database

---

**That's it! You're ready to manage products like a pro! 🚀**
