#!/usr/bin/env python3
"""
Product Database Manager for Rumfields Enterprises
Easy-to-use script for adding, removing, and managing products
"""

import json
import os
import shutil
from datetime import datetime
from pathlib import Path

class ProductManager:
    def __init__(self, base_path=None):
        if base_path is None:
            self.base_path = Path(__file__).parent.parent
        else:
            self.base_path = Path(base_path)
        
        self.db_path = self.base_path / 'database' / 'products.json'
        self.products_folder = self.base_path
        self.load_database()
    
    def load_database(self):
        """Load the products database"""
        try:
            with open(self.db_path, 'r', encoding='utf-8') as f:
                self.db = json.load(f)
            print(f"✅ Database loaded successfully")
        except FileNotFoundError:
            print(f"❌ Database not found at {self.db_path}")
            self.db = {"categories": [], "metadata": {}}
    
    def save_database(self):
        """Save the products database"""
        # Update metadata
        self.db['metadata']['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
        self.db['metadata']['totalProducts'] = self.count_total_products()
        self.db['metadata']['totalCategories'] = len(self.db['categories'])
        
        with open(self.db_path, 'w', encoding='utf-8') as f:
            json.dump(self.db, f, indent=2, ensure_ascii=False)
        print(f"✅ Database saved successfully")
    
    def count_total_products(self):
        """Count total products in database"""
        total = 0
        for category in self.db['categories']:
            for subcategory in category.get('subcategories', []):
                total += len(subcategory.get('products', []))
        return total
    
    def add_product(self, category_id, subcategory_id, product_data):
        """
        Add a new product to the database
        
        Args:
            category_id: ID of the category (e.g., 'passenger-vehicles')
            subcategory_id: ID of the subcategory (e.g., 'synthetic-semi-synthetic')
            product_data: Dictionary containing product information
        """
        # Find category
        category = self.find_category(category_id)
        if not category:
            print(f"❌ Category '{category_id}' not found")
            return False
        
        # Find subcategory
        subcategory = self.find_subcategory(category, subcategory_id)
        if not subcategory:
            print(f"❌ Subcategory '{subcategory_id}' not found")
            return False
        
        # Create product folder structure
        product_folder = self.products_folder / category_id / subcategory_id / product_data['id']
        product_folder.mkdir(parents=True, exist_ok=True)
        
        # Set default image path
        if 'image' not in product_data:
            product_data['image'] = f"products/{category_id}/{subcategory_id}/{product_data['id']}/main.jpg"
        
        # Set default datasheet path
        if 'datasheet' not in product_data:
            product_data['datasheet'] = f"products/{category_id}/{subcategory_id}/{product_data['id']}/datasheet.pdf"
        
        # Add product to subcategory
        if 'products' not in subcategory:
            subcategory['products'] = []
        
        subcategory['products'].append(product_data)
        
        self.save_database()
        print(f"✅ Product '{product_data['name']}' added successfully")
        print(f"📁 Product folder created at: {product_folder}")
        print(f"📝 Add images to: {product_folder}/main.jpg")
        print(f"📄 Add datasheet to: {product_folder}/datasheet.pdf")
        
        return True
    
    def remove_product(self, category_id, subcategory_id, product_id):
        """Remove a product from the database"""
        category = self.find_category(category_id)
        if not category:
            print(f"❌ Category '{category_id}' not found")
            return False
        
        subcategory = self.find_subcategory(category, subcategory_id)
        if not subcategory:
            print(f"❌ Subcategory '{subcategory_id}' not found")
            return False
        
        # Find and remove product
        products = subcategory.get('products', [])
        product = next((p for p in products if p['id'] == product_id), None)
        
        if not product:
            print(f"❌ Product '{product_id}' not found")
            return False
        
        products.remove(product)
        
        # Optionally remove product folder
        product_folder = self.products_folder / category_id / subcategory_id / product_id
        if product_folder.exists():
            response = input(f"Delete product folder {product_folder}? (y/n): ")
            if response.lower() == 'y':
                shutil.rmtree(product_folder)
                print(f"🗑️  Product folder deleted")
        
        self.save_database()
        print(f"✅ Product '{product['name']}' removed successfully")
        return True
    
    def update_product(self, category_id, subcategory_id, product_id, updates):
        """Update product information"""
        category = self.find_category(category_id)
        if not category:
            print(f"❌ Category '{category_id}' not found")
            return False
        
        subcategory = self.find_subcategory(category, subcategory_id)
        if not subcategory:
            print(f"❌ Subcategory '{subcategory_id}' not found")
            return False
        
        products = subcategory.get('products', [])
        product = next((p for p in products if p['id'] == product_id), None)
        
        if not product:
            print(f"❌ Product '{product_id}' not found")
            return False
        
        # Update product fields
        product.update(updates)
        
        self.save_database()
        print(f"✅ Product '{product['name']}' updated successfully")
        return True
    
    def list_products(self, category_id=None, subcategory_id=None):
        """List all products or filter by category/subcategory"""
        if category_id:
            category = self.find_category(category_id)
            if not category:
                print(f"❌ Category '{category_id}' not found")
                return
            
            categories = [category]
        else:
            categories = self.db['categories']
        
        for category in categories:
            print(f"\n📦 {category['name']}")
            
            subcategories = category.get('subcategories', [])
            if subcategory_id:
                subcategories = [s for s in subcategories if s['id'] == subcategory_id]
            
            for subcategory in subcategories:
                print(f"  └─ {subcategory['name']}")
                
                for product in subcategory.get('products', []):
                    stock_icon = "✅" if product.get('inStock', False) else "❌"
                    featured_icon = "⭐" if product.get('featured', False) else "  "
                    print(f"      {stock_icon} {featured_icon} {product['name']} ({product.get('viscosity', 'N/A')})")
    
    def search_products(self, query):
        """Search products by name or description"""
        results = []
        query = query.lower()
        
        for category in self.db['categories']:
            for subcategory in category.get('subcategories', []):
                for product in subcategory.get('products', []):
                    if (query in product['name'].lower() or 
                        query in product.get('description', '').lower()):
                        results.append({
                            'category': category['name'],
                            'subcategory': subcategory['name'],
                            'product': product
                        })
        
        return results
    
    def find_category(self, category_id):
        """Find category by ID"""
        return next((c for c in self.db['categories'] if c['id'] == category_id), None)
    
    def find_subcategory(self, category, subcategory_id):
        """Find subcategory by ID"""
        return next((s for s in category.get('subcategories', []) if s['id'] == subcategory_id), None)
    
    def add_category(self, category_data):
        """Add a new category"""
        self.db['categories'].append(category_data)
        
        # Create category folder
        category_folder = self.products_folder / category_data['id']
        category_folder.mkdir(parents=True, exist_ok=True)
        
        self.save_database()
        print(f"✅ Category '{category_data['name']}' added successfully")
    
    def add_subcategory(self, category_id, subcategory_data):
        """Add a new subcategory"""
        category = self.find_category(category_id)
        if not category:
            print(f"❌ Category '{category_id}' not found")
            return False
        
        if 'subcategories' not in category:
            category['subcategories'] = []
        
        category['subcategories'].append(subcategory_data)
        
        # Create subcategory folder
        subcategory_folder = self.products_folder / category_id / subcategory_data['id']
        subcategory_folder.mkdir(parents=True, exist_ok=True)
        
        self.save_database()
        print(f"✅ Subcategory '{subcategory_data['name']}' added successfully")
        return True
    
    def export_to_csv(self, output_file='products_export.csv'):
        """Export all products to CSV"""
        import csv
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Category', 'Subcategory', 'Product Name', 'ID', 'Viscosity', 
                           'Description', 'In Stock', 'Featured', 'Specifications'])
            
            for category in self.db['categories']:
                for subcategory in category.get('subcategories', []):
                    for product in subcategory.get('products', []):
                        writer.writerow([
                            category['name'],
                            subcategory['name'],
                            product['name'],
                            product['id'],
                            product.get('viscosity', ''),
                            product.get('description', ''),
                            product.get('inStock', False),
                            product.get('featured', False),
                            ', '.join(product.get('specifications', []))
                        ])
        
        print(f"✅ Products exported to {output_file}")


def main():
    """Interactive CLI for product management"""
    manager = ProductManager()
    
    print("\n" + "="*60)
    print("🛢️  RUMFIELDS ENTERPRISES - PRODUCT DATABASE MANAGER")
    print("="*60)
    
    while True:
        print("\n📋 MENU:")
        print("1. List all products")
        print("2. Add new product")
        print("3. Remove product")
        print("4. Update product")
        print("5. Search products")
        print("6. Add category")
        print("7. Add subcategory")
        print("8. Export to CSV")
        print("9. Show statistics")
        print("0. Exit")
        
        choice = input("\nEnter your choice: ").strip()
        
        if choice == '1':
            manager.list_products()
        
        elif choice == '2':
            print("\n➕ ADD NEW PRODUCT")
            category_id = input("Category ID: ").strip()
            subcategory_id = input("Subcategory ID: ").strip()
            
            product_data = {
                'id': input("Product ID (e.g., 'quartz-7000-10w40'): ").strip(),
                'name': input("Product Name: ").strip(),
                'description': input("Description: ").strip(),
                'viscosity': input("Viscosity (e.g., '10W40'): ").strip(),
                'specifications': input("Specifications (comma-separated): ").strip().split(','),
                'inStock': input("In Stock? (y/n): ").strip().lower() == 'y',
                'featured': input("Featured? (y/n): ").strip().lower() == 'y'
            }
            
            manager.add_product(category_id, subcategory_id, product_data)
        
        elif choice == '3':
            print("\n➖ REMOVE PRODUCT")
            category_id = input("Category ID: ").strip()
            subcategory_id = input("Subcategory ID: ").strip()
            product_id = input("Product ID: ").strip()
            
            manager.remove_product(category_id, subcategory_id, product_id)
        
        elif choice == '4':
            print("\n✏️  UPDATE PRODUCT")
            category_id = input("Category ID: ").strip()
            subcategory_id = input("Subcategory ID: ").strip()
            product_id = input("Product ID: ").strip()
            
            print("\nWhat would you like to update?")
            print("Leave blank to skip")
            
            updates = {}
            name = input("New name: ").strip()
            if name: updates['name'] = name
            
            desc = input("New description: ").strip()
            if desc: updates['description'] = desc
            
            stock = input("In stock? (y/n): ").strip().lower()
            if stock: updates['inStock'] = stock == 'y'
            
            featured = input("Featured? (y/n): ").strip().lower()
            if featured: updates['featured'] = featured == 'y'
            
            if updates:
                manager.update_product(category_id, subcategory_id, product_id, updates)
            else:
                print("No updates provided")
        
        elif choice == '5':
            print("\n🔍 SEARCH PRODUCTS")
            query = input("Search query: ").strip()
            results = manager.search_products(query)
            
            if results:
                print(f"\n✅ Found {len(results)} results:")
                for r in results:
                    print(f"\n{r['category']} > {r['subcategory']}")
                    print(f"  {r['product']['name']} - {r['product'].get('description', '')}")
            else:
                print("❌ No results found")
        
        elif choice == '6':
            print("\n➕ ADD NEW CATEGORY")
            category_data = {
                'id': input("Category ID (e.g., 'passenger-vehicles'): ").strip(),
                'name': input("Category Name: ").strip(),
                'description': input("Description: ").strip(),
                'icon': input("Icon name: ").strip(),
                'subcategories': []
            }
            manager.add_category(category_data)
        
        elif choice == '7':
            print("\n➕ ADD NEW SUBCATEGORY")
            category_id = input("Category ID: ").strip()
            subcategory_data = {
                'id': input("Subcategory ID: ").strip(),
                'name': input("Subcategory Name: ").strip(),
                'usedFor': input("Used For: ").strip(),
                'products': []
            }
            manager.add_subcategory(category_id, subcategory_data)
        
        elif choice == '8':
            filename = input("Export filename (default: products_export.csv): ").strip()
            if not filename:
                filename = 'products_export.csv'
            manager.export_to_csv(filename)
        
        elif choice == '9':
            print("\n📊 DATABASE STATISTICS")
            print(f"Total Categories: {len(manager.db['categories'])}")
            print(f"Total Products: {manager.count_total_products()}")
            print(f"Last Updated: {manager.db['metadata'].get('lastUpdated', 'N/A')}")
        
        elif choice == '0':
            print("\n👋 Goodbye!")
            break
        
        else:
            print("❌ Invalid choice")


if __name__ == '__main__':
    main()
