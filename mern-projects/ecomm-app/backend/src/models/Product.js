const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
















































































































/*# Practical Exam Guide: Secure File Sharing Between Cloud Instances (AWS EC2)

---

## What This Practical Is About

Create two EC2 instances inside a custom **VPC (Virtual Private Cloud)**, and securely transfer files between them using their **private IP addresses** via SCP. Everything is done through the **AWS browser terminal (EC2 Instance Connect)** — no local terminal or `.pem` file needed.

---

## Key Concepts to Know (Say This to Examiner)

| Term | What to Say |
|------|-------------|
| **VPC** | Virtual Private Cloud — an isolated private network inside AWS where your EC2 instances live |
| **Subnet** | A subdivision of the VPC's IP range — instances are placed inside a subnet |
| **Internet Gateway** | A gateway that connects the VPC to the internet so instances can get public IPs |
| **Route Table** | Rules that define where network traffic should go (e.g., all traffic → internet gateway) |
| **Private IP** | The IP address of an instance inside the VPC — only reachable by other instances in the same VPC |
| **SCP** | Secure Copy Protocol — transfers files securely between Linux machines over SSH |
| **EC2 Instance Connect** | AWS browser-based terminal — lets you connect to EC2 without any local SSH client or `.pem` file |
| **Security Group** | AWS firewall that controls which traffic is allowed in/out of an instance |
| **SSH Keypair** | A pair of public + private keys used for passwordless secure login between machines |

---

## Architecture

```
              AWS Cloud
  ─────────────────────────────────────
          Custom VPC (10.0.0.0/16)
                    │
             Public Subnet
              (10.0.1.0/24)
             /             \
            /               \
     EC2: node1          EC2: node2
  Private: 10.0.1.x    Private: 10.0.1.x

        <──── SCP File Transfer ────>
             (via private IP)
  ─────────────────────────────────────
```

---

## PHASE 1 — AWS Network Setup (VPC + Subnet + Gateway)

### Step 1 — Create a Custom VPC

1. AWS Console → search **VPC** → open VPC Dashboard
2. Click **Create VPC** → choose **VPC only**
3. Fill in:

| Field | Value |
|-------|-------|
| Name tag | `my-vpc` |
| IPv4 CIDR | `10.0.0.0/16` |

4. Click **Create VPC**

---

### Step 2 — Create a Subnet

1. Left panel → **Subnets** → **Create subnet**
2. Fill in:

| Field | Value |
|-------|-------|
| VPC ID | `my-vpc` |
| Subnet name | `public-subnet` |
| IPv4 CIDR block | `10.0.1.0/24` |

3. Click **Create subnet**

---

### Step 3 — Enable Auto-Assign Public IP on Subnet

1. Select `public-subnet`
2. Click **Actions → Edit subnet settings**
3. Enable **Auto-assign public IPv4 address**
4. Save changes

> This ensures each EC2 instance gets a public IP so EC2 Instance Connect can reach them.

---

### Step 4 — Create Internet Gateway

1. Left panel → **Internet Gateways** → **Create internet gateway**
2. Name: `my-igw`
3. Click **Create internet gateway**

---

### Step 5 — Attach Internet Gateway to VPC

1. Select `my-igw`
2. Click **Actions → Attach to VPC**
3. Select `my-vpc` → click **Attach internet gateway**

---

### Step 6 — Create Route Table

1. Left panel → **Route Tables** → **Create route table**
2. Fill in:

| Field | Value |
|-------|-------|
| Name | `my-rt` |
| VPC | `my-vpc` |

3. Click **Create route table**

---

### Step 7 — Add Internet Route to Route Table

1. Select `my-rt` → open **Routes** tab → **Edit routes**
2. Click **Add route**:

| Destination | Target |
|-------------|--------|
| `0.0.0.0/0` | Internet Gateway → `my-igw` |

3. Save changes

---

### Step 8 — Associate Subnet with Route Table

1. Still inside `my-rt` → **Subnet associations** tab
2. Click **Edit subnet associations**
3. Select `public-subnet` → Save

---

## PHASE 2 — Launch Two EC2 Instances

### Step 9 — Launch node1

1. EC2 Dashboard → **Launch Instance**
2. Configure:

| Setting | Value |
|---------|-------|
| Name | `VM-node1` |
| AMI | `Ubuntu Server 22.04 LTS` |
| Instance Type | `t2.micro` |
| Key pair | **Proceed without key pair** |
| VPC | `my-vpc` |
| Subnet | `public-subnet` |

3. **Security Group** — create new, add these inbound rules:

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | Anywhere `0.0.0.0/0` |
| All traffic | All | Custom → `10.0.0.0/16` |

> The "All traffic from 10.0.0.0/16" rule allows node1 and node2 to freely communicate with each other inside the VPC.

4. Click **Launch Instance**

---

### Step 10 — Launch node2

1. Repeat the same steps
2. Only change the **Name** to `VM-node2`
3. Use the **same security group** created for node1 (select existing)
4. Click **Launch Instance**

---

### Step 11 — Wait and Note Private IPs

Wait for both instances to show **Running** status.

Click each instance and note the **Private IPv4 address**:

| Instance | Example Private IP |
|----------|-------------------|
| VM-node1 | `10.0.1.25` |
| VM-node2 | `10.0.1.50` |

> You will use node2's private IP for the file transfer — copy it now.

---

## PHASE 3 — Connect to Instances (No Local Terminal Needed)

### Step 12 — Open Browser Terminal on node1

1. Select `VM-node1` in EC2 Dashboard
2. Click **Connect** (top right)
3. Select tab: **EC2 Instance Connect**
4. Click **Connect**

A browser terminal opens — you are now inside node1 as the `ubuntu` user.

---

### Step 13 — Generate SSH Keypair on node1

In the node1 browser terminal, run:

```bash
ssh-keygen -t rsa -b 2048 -f ~/.ssh/id_rsa -N ""
```

This creates two files:
- `~/.ssh/id_rsa` — private key (stays on node1)
- `~/.ssh/id_rsa.pub` — public key (will be added to node2)

Now copy the public key content:

```bash
cat ~/.ssh/id_rsa.pub
```

**Select all the output and copy it** — it starts with `ssh-rsa AAAA...`

---

### Step 14 — Open Browser Terminal on node2

1. Open a **new browser tab** → go to EC2 Dashboard
2. Select `VM-node2` → click **Connect** → **EC2 Instance Connect** → **Connect**

In the node2 browser terminal, run:

```bash
mkdir -p ~/.ssh
echo "PASTE_NODE1_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

> Replace `PASTE_NODE1_PUBLIC_KEY_HERE` with the full `ssh-rsa AAAA...` line you copied from node1.

---

## PHASE 4 — File Transfer Between Instances

### Step 15 — Create a File on node1

Go back to the **node1 browser terminal**:

```bash
echo "Hello from node1 to node2 - Secure Transfer" > testfile.txt
cat testfile.txt
```

Expected output:
```
Hello from node1 to node2 - Secure Transfer
```

---

### Step 16 — Transfer File from node1 to node2

Still on node1, run:

```bash
scp -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no testfile.txt ubuntu@<NODE2_PRIVATE_IP>:/home/ubuntu/
```

Example (replace with your actual node2 private IP):

```bash
scp -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no testfile.txt ubuntu@10.0.1.50:/home/ubuntu/
```

Expected output:
```
testfile.txt    100%   45     1.2KB/s   00:00
```

---

### Step 17 — Verify File Received on node2

Go to the **node2 browser terminal**:

```bash
ls /home/ubuntu/
cat testfile.txt
```

Expected output:
```
Hello from node1 to node2 - Secure Transfer
```

---

### Step 18 — Send Reply from node2 to node1 (Bidirectional)

On node2, first add node2's public key to node1's authorized_keys:

```bash
ssh-keygen -t rsa -b 2048 -f ~/.ssh/id_rsa -N ""
cat ~/.ssh/id_rsa.pub
```

Copy this output → go to node1 terminal → run:

```bash
echo "PASTE_NODE2_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Back on node2, create and transfer a reply file:

```bash
echo "Reply from node2 to node1 - Received!" > reply.txt

scp -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no reply.txt ubuntu@<NODE1_PRIVATE_IP>:/home/ubuntu/
```

On node1, verify:

```bash
cat reply.txt
```

Expected:
```
Reply from node2 to node1 - Received!
```

---

## What Each Command Does (Explain to Examiner)

```bash
ssh-keygen -t rsa -b 2048 -f ~/.ssh/id_rsa -N ""
# Generates RSA keypair (2048 bits), saves to ~/.ssh/id_rsa, no passphrase

cat ~/.ssh/id_rsa.pub
# Prints the public key — this is what you share with the other machine

echo "..." >> ~/.ssh/authorized_keys
# Appends the trusted public key — machines holding the matching private key can now login

chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
# SSH strict permission requirements — it refuses to work if permissions are too open

scp -i ~/.ssh/id_rsa testfile.txt ubuntu@10.0.1.50:/home/ubuntu/
# Copies testfile.txt to node2's /home/ubuntu/ using private key for auth

-o StrictHostKeyChecking=no
# Skips the "are you sure you want to connect?" prompt (safe inside a known VPC)
```

---

## Common Errors & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| EC2 Instance Connect button is greyed out | Port 22 not open | Security group → add SSH inbound rule (port 22, anywhere) |
| EC2 Instance Connect fails to connect | No public IP on instance | Subnet → enable auto-assign public IPv4 → relaunch instance |
| `scp` times out | node2 security group not allowing traffic from node1 | Add inbound rule: All traffic, source `10.0.0.0/16` |
| `Permission denied (publickey)` | Public key not added to node2 correctly | Re-run the `echo "..." >> authorized_keys` step on node2 |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | Wrong permissions on `id_rsa` | Run `chmod 600 ~/.ssh/id_rsa` on node1 |
| File not found on node2 | SCP path wrong | Verify path: `/home/ubuntu/` — check `ls /home/ubuntu/` |

---

## Quick Reference Commands

```bash
# Generate keypair
ssh-keygen -t rsa -b 2048 -f ~/.ssh/id_rsa -N ""

# View public key (to copy to other instance)
cat ~/.ssh/id_rsa.pub

# Create a test file
echo "Hello from node1" > testfile.txt

# SCP file to another instance (using private IP)
scp -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no testfile.txt ubuntu@<PRIVATE_IP>:/home/ubuntu/

# Verify file contents
cat testfile.txt

# Check file permissions
ls -la ~/.ssh/

# Fix SSH key permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 600 ~/.ssh/authorized_keys

# Ping the other instance (check connectivity)
ping -c 4 <NODE2_PRIVATE_IP>
```

---

## Architecture Diagram (Draw This if Asked)

```
[Browser Tab 1]              [Browser Tab 2]
EC2 Instance Connect         EC2 Instance Connect
       │                            │
  [VM-node1]  ──── SCP ────>  [VM-node2]
  Private IP: 10.0.1.25       Private IP: 10.0.1.50
       │                            │
       └──────────┬─────────────────┘
                  │
          Public Subnet (10.0.1.0/24)
                  │
          Custom VPC (10.0.0.0/16)
                  │
         Internet Gateway (my-igw)
                  │
             [Internet]
                  │
          [AWS Console / Browser]
```

---

## Examiner Questions & Answers

**Q: What is a VPC?**
A: Virtual Private Cloud — a logically isolated section of the AWS cloud where you define your own network, including IP ranges, subnets, route tables, and gateways.

**Q: Why use private IP for file transfer instead of public IP?**
A: Private IPs are faster, more secure, and free — traffic stays inside the AWS network and never touches the internet. Public IPs can change and require internet routing.

**Q: What is SCP?**
A: Secure Copy Protocol — it transfers files over an SSH connection. The data is encrypted during transfer.

**Q: What is EC2 Instance Connect?**
A: A browser-based SSH terminal provided by AWS. It lets you connect to EC2 instances directly from the AWS Console without a local SSH client or `.pem` file.

**Q: Why do we need an Internet Gateway?**
A: The Internet Gateway connects the VPC to the internet. Without it, EC2 instances can't get public IPs and EC2 Instance Connect can't reach them.

**Q: What is the purpose of the Route Table?**
A: It tells the subnet where to send traffic. We added a route `0.0.0.0/0 → my-igw` so all outbound internet traffic goes through the internet gateway.

**Q: What does `chmod 600` do on the key files?**
A: It sets permissions so only the file owner can read/write it. SSH requires strict permissions — it refuses to use keys that are readable by others.

**Q: What is `authorized_keys`?**
A: A file on each Linux machine that lists public keys trusted for SSH login. If your private key matches a public key in this file, you can log in without a password.

**Q: What does the security group rule "All traffic from 10.0.0.0/16" do?**
A: It allows unrestricted communication between all instances inside the VPC. This is what lets node1 SCP files to node2 on their private IPs.

**Q: What is the difference between public IP and private IP in AWS?**
A: Public IP is accessible from the internet (used for EC2 Instance Connect). Private IP is only reachable inside the VPC (used for node-to-node file transfer).

---

## Checklist Before Showing Examiner

- [ ] VPC `my-vpc` created with CIDR `10.0.0.0/16`
- [ ] Subnet `public-subnet` created with CIDR `10.0.1.0/24`
- [ ] Subnet has **Auto-assign public IP** enabled
- [ ] Internet Gateway `my-igw` created and **attached to VPC**
- [ ] Route Table has route `0.0.0.0/0 → my-igw` and is **associated with the subnet**
- [ ] Both EC2 instances are **Running** with status checks passed
- [ ] Security group allows **SSH (port 22)** and **All traffic from 10.0.0.0/16**
- [ ] Connected to node1 via **EC2 Instance Connect** (browser terminal)
- [ ] SSH keypair generated on node1 with `ssh-keygen`
- [ ] node1's public key added to node2's `~/.ssh/authorized_keys`
- [ ] `testfile.txt` created on node1
- [ ] SCP transfer from node1 to node2 **succeeded**
- [ ] `cat testfile.txt` on node2 shows the correct content
- [ ] Reply file transferred from node2 back to node1 (bidirectional)
*/
