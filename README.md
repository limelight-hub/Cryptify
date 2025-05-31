# 🔐 Cryptify – Desktop Encryption Toolkit

**Cryptify** is a modern desktop application that enables users to encrypt and decrypt messages using both classical and modern cryptographic algorithms: **PlayFair** and **RSA**. Built with **Electron**, **React**, and **TypeScript**, Cryptify is designed to run entirely offline, ensuring your data stays secure and private.

> Whether you're a student, developer, or just curious about how encryption works — Cryptify is your interactive and open-source playground for learning cryptography.

---

## 📦 Features

### ✳️ Classical Encryption
- **PlayFair Cipher**:
  - 5x5 matrix-based substitution cipher
  - Custom keyword support
  - Handles repeating characters and padding logic

### 🔐 Public-Key Encryption
- **RSA Algorithm**:
  - 2048-bit key generation
  - Public/Private key export in PEM format
  - Text encryption using public key & decryption using private key
  - All operations performed **locally** using Node.js crypto module

### 💻 Desktop App Experience
- Light and dark theme support (Ctrl+T to toggle)
- Full keyboard shortcut support
- Cross-platform support (Windows, macOS, Linux)
- Built with Electron, React, and TypeScript
- No backend server required – all processing happens offline

---

## 🧰 Tech Stack

- **Electron** – Cross-platform desktop app framework
- **React** – Interactive frontend UI
- **TypeScript** – Type-safe logic & maintainability
- **TailwindCSS** – Utility-first styling
- **Lucide Icons** – Beautiful, consistent iconography

---

## ⌨️ Keyboard Shortcuts

Cryptify supports numerous keyboard shortcuts to improve workflow:

| Shortcut         | Action                       |
|------------------|------------------------------|
| `Ctrl + Enter`   | Process text (encrypt/decrypt) |
| `Ctrl + Shift + C` | Copy output to clipboard     |
| `Ctrl + R`       | Clear all fields              |
| `Ctrl + T`       | Toggle light/dark theme       |
| `Ctrl + 1`       | Switch to Playfair cipher     |
| `Ctrl + 2`       | Switch to RSA encryption      |


---

## 📁 Project Structure

```
cryptify/
├── 📂 src/
│   ├── 📂 main/                 # Electron main process
│   │   ├── main.ts
│   │   └── preload.ts
│   ├── 📂 renderer/             # React frontend
│   │   ├── 📂 components/       # UI components
│   │   │   └── EncryptionApp.tsx # Main application component
│   │   ├── 📂 context/          # React contexts
│   │   │   └── ThemeContext.tsx  # Theme management
│   │   └── 📂 lib/              # Encryption libraries
│   │       ├── playfair.ts      # Playfair cipher implementation
│   │       └── rsa.ts           # RSA algorithm implementation
├── 📂 public/                   # Static assets
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 electron-builder.json     # Build configuration
```

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### 🖥️ Installation & Run

```bash
# Clone the repository
git clone https://github.com/yourusername/cryptify.git
cd cryptify

# Install dependencies
pnpm install

# Run the app in development mode
pnpm dev
```

### 📦 Build for production

```bash
pnpm build     # Builds React assets
pnpm package   # Creates Electron binary (.exe, .dmg, etc.)
```

> Uses electron-builder for packaging. Configuration can be extended via electron-builder.json.

---
## 📸 Screenshots

Coming soon! We're working on capturing the best shots of Cryptify in action.

---
## 📚 Use Cases

- Learn and visualize how encryption works
- Demonstrate classic vs. modern encryption techniques
- Offline message encryption for secure text sharing
- Educational tool for cryptography learners

---
## 📄 License
MIT License © 2025 – Networking Security Project

---

## 🤝 Contributors

Thanks to the following people who have contributed to this project:

| Name            | Role                 | Contribution Summary                    |
|-----------------|----------------------|------------------------------------------|
| Truc Lam        | Creator / Maintainer | Built core functionality, UI, and logic  |
| Vu Binh         | Contributor          | Improved encryption logic (RSA)          |
| Chanh Phuc      | Contributor          | UI refinements and accessibility support |

