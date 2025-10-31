# 🚀 How to Run Your Website Locally

## ❌ The Problem

You're seeing this error:
```
Access to fetch at 'file:///...' has been blocked by CORS policy
```

**Why?** Browsers block JavaScript from loading local files when you open HTML files directly (using `file://` protocol). This is a security feature.

## ✅ The Solution

You need to run a **local web server**. Don't worry - it's super easy!

---

## 🎯 Quick Start (Easiest Method)

### Windows

**Step 1:** Double-click this file:
```
start-server.bat
```

**Step 2:** Open your browser and go to:
```
http://localhost:8000
```

**Step 3:** Navigate to your pages:
- Homepage: `http://localhost:8000/index.html`
- Products: `http://localhost:8000/products.html`

**That's it!** ✅

---

## 🔧 Alternative Methods

### Method 1: Python HTTP Server (Recommended)

**Open Command Prompt in your project folder:**
```bash
cd C:\Users\ndaza\CascadeProjects\lubricants-website
python -m http.server 8000
```

**Then open:** `http://localhost:8000`

### Method 2: Node.js HTTP Server

**If you have Node.js installed:**
```bash
# Install http-server globally (one time only)
npm install -g http-server

# Run server
cd C:\Users\ndaza\CascadeProjects\lubricants-website
http-server -p 8000
```

**Then open:** `http://localhost:8000`

### Method 3: VS Code Live Server Extension

**If you use VS Code:**
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Browser opens automatically!

### Method 4: PHP Built-in Server

**If you have PHP installed:**
```bash
cd C:\Users\ndaza\CascadeProjects\lubricants-website
php -S localhost:8000
```

**Then open:** `http://localhost:8000`

---

## 🌐 Understanding the URLs

### ❌ Wrong (File Protocol)
```
file:///C:/Users/ndaza/CascadeProjects/lubricants-website/index.html
```
- Opens directly from file system
- JavaScript fetch() is blocked
- CORS errors occur

### ✅ Correct (HTTP Protocol)
```
http://localhost:8000/index.html
```
- Served through web server
- JavaScript works normally
- No CORS errors

---

## 📋 Step-by-Step Guide

### For Complete Beginners

**1. Check if Python is installed:**
```bash
python --version
```

If you see a version number (e.g., `Python 3.11.0`), you're good!

If not, download Python from: https://www.python.org/downloads/

**2. Open Command Prompt:**
- Press `Windows + R`
- Type `cmd`
- Press Enter

**3. Navigate to your project:**
```bash
cd C:\Users\ndaza\CascadeProjects\lubricants-website
```

**4. Start the server:**
```bash
python -m http.server 8000
```

You'll see:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

**5. Open your browser:**
- Go to `http://localhost:8000`
- Click on `index.html` or `products.html`

**6. To stop the server:**
- Press `Ctrl + C` in the Command Prompt

---

## 🎯 Quick Access

### Main Pages
- **Homepage**: http://localhost:8000/index.html
- **Products**: http://localhost:8000/products.html

### Testing
- **Search**: Try searching for "synthetic" or "diesel"
- **Filter**: Click category tabs
- **Product Cards**: Click any product card

---

## 🔍 Troubleshooting

### "Port 8000 is already in use"

**Solution 1:** Use a different port
```bash
python -m http.server 8080
```
Then open: `http://localhost:8080`

**Solution 2:** Stop the existing server
- Find the Command Prompt window running the server
- Press `Ctrl + C`

### "Python is not recognized"

**Solution:** Install Python
1. Go to https://www.python.org/downloads/
2. Download Python 3.x
3. **Important:** Check "Add Python to PATH" during installation
4. Restart Command Prompt

### "Still getting CORS errors"

**Check:**
1. ✅ Are you using `http://localhost:8000` (not `file://`)?
2. ✅ Is the server still running?
3. ✅ Did you refresh the page after starting the server?

### "Page not found (404)"

**Solution:** Make sure you're in the correct directory
```bash
# Check current directory
cd

# Should show: C:\Users\ndaza\CascadeProjects\lubricants-website

# If not, navigate there:
cd C:\Users\ndaza\CascadeProjects\lubricants-website
```

---

## 💡 Pro Tips

### Keep Server Running
- Don't close the Command Prompt window
- Minimize it instead
- Server runs until you stop it

### Auto-Refresh
- Make code changes
- Save files
- Refresh browser (F5)
- Changes appear instantly!

### Multiple Devices
- Find your computer's IP address: `ipconfig`
- Look for "IPv4 Address" (e.g., 192.168.1.100)
- Access from phone/tablet: `http://192.168.1.100:8000`

### Development Workflow
1. Start server once
2. Keep it running
3. Edit files in your IDE
4. Refresh browser to see changes
5. Stop server when done

---

## 🚀 Production Deployment

When ready to go live, you'll need:
1. **Web hosting** (shared hosting, VPS, or cloud)
2. **Domain name** (e.g., rumfields.com)
3. **Upload files** via FTP/SFTP
4. **Configure server** (Apache, Nginx, etc.)

Popular hosting options:
- **Shared Hosting**: Bluehost, HostGator, SiteGround
- **Cloud**: AWS, Google Cloud, Azure
- **Simple**: Netlify, Vercel (free for static sites)

---

## 📞 Quick Reference

### Start Server
```bash
python -m http.server 8000
```

### Access Website
```
http://localhost:8000
```

### Stop Server
```
Ctrl + C
```

---

## ✅ Checklist

Before starting:
- [ ] Python is installed
- [ ] You're in the project directory
- [ ] No other server is using port 8000

After starting:
- [ ] Server is running (don't close terminal)
- [ ] Browser shows `http://localhost:8000`
- [ ] Products page loads without errors
- [ ] Search functionality works

---

**Now you're ready to develop! 🎉**

Just run `start-server.bat` and open `http://localhost:8000` in your browser!
