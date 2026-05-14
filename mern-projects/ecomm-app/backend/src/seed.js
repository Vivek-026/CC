const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality over-ear wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
    price: 2499,
    category: "Electronics",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  },
  {
    name: "Laptop Backpack",
    description: "Durable and water-resistant laptop backpack with multiple compartments, USB charging port, and padded straps. Fits laptops up to 15.6 inches.",
    price: 1299,
    category: "Accessories",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
  },
  {
    name: "Smart Watch Pro",
    description: "Feature-packed smartwatch with heart rate monitor, GPS tracking, sleep analysis, and water resistance. Compatible with Android and iOS.",
    price: 3999,
    category: "Electronics",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  },
  {
    name: "Running Shoes",
    description: "Lightweight and breathable running shoes with cushioned sole, arch support, and slip-resistant grip. Available in multiple sizes.",
    price: 1899,
    category: "Footwear",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Double-walled vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, 750ml capacity.",
    price: 599,
    category: "Home & Kitchen",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches, anti-ghosting, and programmable keys. Ideal for gaming and productivity.",
    price: 2199,
    category: "Electronics",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80",
  },
  {
    name: "Sunglasses Classic",
    description: "Polarized UV400 protection sunglasses with lightweight metal frame. Stylish design suitable for all face types.",
    price: 799,
    category: "Accessories",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
  },
  {
    name: "Desk Lamp LED",
    description: "Adjustable LED desk lamp with 5 brightness levels and 3 color temperatures. USB charging port included. Eye-care technology.",
    price: 999,
    category: "Home & Kitchen",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&q=80",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for seeding...");

    await Product.deleteMany({});
    console.log("Cleared existing products.");

    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} sample products.`);

    await mongoose.connection.close();
    console.log("Database connection closed. Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();


























































/*
 * =============================================================================
 * DEPLOYMENT GUIDE — MERN Stack on AWS EC2 + MongoDB Atlas
 * =============================================================================
 *
 * PHASE 1 — MongoDB Atlas Setup
 * ─────────────────────────────
 * Step 1 — Create a Free Cluster
 *   Go to mongodb.com/cloud/atlas → Sign up / Login
 *   Click Create a deployment → choose M0 Free
 *   Provider: AWS, Region: ap-south-1 (Mumbai) → Click Create
 *
 * Step 2 — Create Database User
 *   Left panel → Database Access → Add New Database User
 *   Username: admin | Password: yourpassword | Role: Atlas admin
 *   Click Add User
 *
 * Step 3 — Whitelist All IPs
 *   Left panel → Network Access → Add IP Address
 *   Click Allow Access from Anywhere → 0.0.0.0/0 → Confirm
 *
 * Step 4 — Get Connection String
 *   Left panel → Database → Connect → Drivers → Node.js
 *   Copy: mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
 *   Replace <password> with actual password
 *
 * =============================================================================
 * PHASE 2 — Launch Two EC2 Instances
 * =============================================================================
 *
 * Step 5 — Backend Instance
 *   Name: mern-backend | AMI: Ubuntu 22.04 | Type: t2.micro
 *   Security Group: SSH:22, HTTP:80, Custom TCP:5000 (all Anywhere)
 *
 * Step 6 — Frontend Instance
 *   Name: mern-frontend | AMI: Ubuntu 22.04 | Type: t2.micro
 *   Security Group: SSH:22, HTTP:80 (all Anywhere)
 *
 * =============================================================================
 * PHASE 3 — Backend EC2 Setup (connect via EC2 Instance Connect)
 * =============================================================================
 *
 * Step 7 — Install Node.js
 *   sudo apt update
 *   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
 *   sudo apt install -y nodejs
 *
 * Step 8 — Clone Project
 *   sudo apt install -y git
 *   git clone https://github.com/<your-username>/<your-repo>.git
 *   cd <your-repo>/backend
 *
 * Step 9 — Install Dependencies
 *   npm install
 *
 * Step 10 — Create .env File
 *   nano .env
 *   MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/blogdb?retryWrites=true&w=majority
 *   PORT=5000
 *
 * Step 11 — Install PM2
 *   sudo npm install -g pm2
 *
 * Step 12 — Start Backend with PM2
 *   pm2 start src/server.js --name backend
 *   pm2 save
 *   pm2 startup   ← run the command it outputs
 *   curl http://localhost:5000   ← should return API running message
 *
 * Step 13 — Install & Configure Nginx (Backend)
 *   sudo apt install -y nginx
 *   sudo nano /etc/nginx/sites-available/backend
 *   ─── paste: ───
 *   server {
 *       listen 80;
 *       location / {
 *           proxy_pass http://localhost:5000;
 *           proxy_http_version 1.1;
 *           proxy_set_header Upgrade $http_upgrade;
 *           proxy_set_header Connection 'upgrade';
 *           proxy_set_header Host $host;
 *           proxy_cache_bypass $http_upgrade;
 *       }
 *   }
 *   ──────────────
 *   sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
 *   sudo rm /etc/nginx/sites-enabled/default
 *   sudo nginx -t && sudo systemctl enable nginx && sudo systemctl restart nginx
 *
 * =============================================================================
 * PHASE 4 — Frontend EC2 Setup (connect via EC2 Instance Connect)
 * =============================================================================
 *
 * Step 14 — Install Node.js (same as Step 7)
 *
 * Step 15 — Clone Project
 *   sudo apt install -y git
 *   git clone https://github.com/<your-username>/<your-repo>.git
 *   cd <your-repo>/frontend
 *
 * Step 16 — Create .env File
 *   nano .env
 *   VITE_API_URL=http://<BACKEND_PUBLIC_IP>/api
 *
 * Step 17 — Build the React App
 *   npm install
 *   npm run build
 *   ls dist/   ← should show index.html and assets/
 *
 * Step 18 — Install Nginx and Serve Build
 *   sudo apt install -y nginx
 *   sudo rm -rf /var/www/html/*
 *   sudo cp -r dist/* /var/www/html/
 *   sudo nano /etc/nginx/sites-available/frontend
 *   ─── paste: ───
 *   server {
 *       listen 80;
 *       root /var/www/html;
 *       index index.html;
 *       location / {
 *           try_files $uri $uri/ /index.html;
 *       }
 *       location /api/ {
 *           proxy_pass http://<BACKEND_PUBLIC_IP>/api/;
 *           proxy_http_version 1.1;
 *           proxy_set_header Host $host;
 *           proxy_set_header X-Real-IP $remote_addr;
 *       }
 *   }
 *   ──────────────
 *   sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
 *   sudo rm /etc/nginx/sites-enabled/default
 *   sudo nginx -t && sudo systemctl enable nginx && sudo systemctl restart nginx
 *
 * =============================================================================
 * PHASE 5 — Verify
 * =============================================================================
 *
 * Backend EC2:
 *   pm2 status
 *   curl http://localhost:5000
 *   curl http://localhost
 *
 * Frontend EC2:
 *   ls /var/www/html/
 *   sudo systemctl status nginx
 *
 * Browser: http://<FRONTEND_PUBLIC_IP>
 *
 * =============================================================================
 * PM2 COMMANDS
 * =============================================================================
 *   pm2 status              → see all processes
 *   pm2 logs backend        → live logs
 *   pm2 restart backend     → restart after code change
 *   pm2 stop backend        → stop
 *   pm2 delete backend      → remove from PM2
 *   pm2 save                → persist across reboot
 *
 * =============================================================================
 * COMMON ERRORS
 * =============================================================================
 *   curl localhost:5000 fails     → pm2 restart backend
 *   MongoDB connection error      → check .env URI, whitelist 0.0.0.0/0 on Atlas
 *   API calls fail from frontend  → wrong BACKEND_PUBLIC_IP in .env, rebuild
 *   npm run build fails           → check console, fix import paths
 *   Nginx test failed             → sudo nginx -t and fix conf
 *   Page refresh gives 404        → add try_files $uri $uri/ /index.html in Nginx
 *   CORS error in browser         → add cors({ origin: 'http://<FRONTEND_IP>' }) in server.js
 * =============================================================================
 */

