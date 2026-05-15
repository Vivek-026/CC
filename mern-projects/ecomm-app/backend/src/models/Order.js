const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
  },
  customerAddress: {
    type: String,
    required: [true, "Customer address is required"],
    trim: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);






















































































































/*1. Update Packages
sudo apt update -y
sudo apt upgrade -y
2. Install Nginx
sudo apt install nginx -y
3. Remove Default HTML Files
sudo rm -rf /var/www/html/*
4. Create index.html
sudo nano /var/www/html/index.html

Paste this:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quick Converter Tool</title>

    <style>
        :root {
            --primary: #3b82f6;
            --bg: #f8fafc;
            --text: #1e293b;
        }

        body {
            font-family: system-ui, sans-serif;
            background: var(--bg);
            color: var(--text);
            display: flex;
            justify-content: center;
            padding: 2rem;
        }

        .card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
        }

        h1 {
            text-align: center;
            color: var(--primary);
        }

        .group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }

        input {
            width: 100%;
            padding: 0.5rem;
            border-radius: 6px;
            border: 1px solid #ccc;
        }

        .result {
            margin-top: 0.5rem;
            color: gray;
        }
    </style>
</head>

<body>

<div class="card">

    <h1>Quick Converter</h1>

    <div class="group">
        <label>Celsius to Fahrenheit</label>

        <input type="number"
               id="celsius"
               placeholder="Enter Celsius"
               oninput="convertTemp()">

        <div id="tempResult" class="result">
            Result: -- °F
        </div>
    </div>

    <hr>

    <div class="group">
        <label>Miles to Kilometers</label>

        <input type="number"
               id="miles"
               placeholder="Enter Miles"
               oninput="convertDist()">

        <div id="distResult" class="result">
            Result: -- km
        </div>
    </div>

</div>

<script>

function convertTemp() {

    const c = document.getElementById('celsius').value;

    const res = document.getElementById('tempResult');

    if(c === "") {
        res.innerHTML = "Result: -- °F";
        return;
    }

    const f = (c * 9/5) + 32;

    res.innerHTML = `Result: ${f.toFixed(1)} °F`;
}

function convertDist() {

    const m = document.getElementById('miles').value;

    const res = document.getElementById('distResult');

    if(m === "") {
        res.innerHTML = "Result: -- km";
        return;
    }

    const k = m * 1.60934;

    res.innerHTML = `Result: ${k.toFixed(2)} km`;
}

</script>

</body>
</html>
5. Save File

In nano:

CTRL + O → save
Press Enter
CTRL + X → exit
6. Start and Enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
7. Check Nginx Status
sudo systemctl status nginx

You should see:

active (running)
8. Open Website

Copy EC2 public IP:

http://YOUR_PUBLIC_IP

Example:

http://13.233.xx.xx

Your converter website should open.*/
