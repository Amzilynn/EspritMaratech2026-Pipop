# Omnia Frontoffice - New Features

## 🎉 Recently Added Features

### 1. **OCR (Optical Character Recognition)** 📄
**Route:** `/ocr`

A powerful text extraction tool that allows public users to:
- Upload images containing text (documents, photos, screenshots)
- Extract text automatically using EasyOCR (supports French, English, Arabic)
- Copy extracted text to clipboard
- Beautiful, user-friendly interface with drag-and-drop support

**How to access:**
- Navigate to the OCR link in the main menu
- Or visit: http://localhost:5174/ocr

**Features:**
- Image preview before extraction
- Real-time text extraction
- Copy to clipboard functionality
- Support for PNG, JPG, JPEG formats
- Multilingual support (FR, EN, AR)

---

### 2. **User Profile Page** 👤
**Route:** `/profile`

A comprehensive profile management page for registered users:
- View personal information (name, email, phone, role)
- Edit profile details (first name, last name, phone)
- Role badge display with color coding
- Quick links to OCR and other features
- Logout functionality

**How to access:**
- Click "Mon Profil" button in the header (visible when logged in)
- Or visit: http://localhost:5174/profile

**Features:**
- View mode and edit mode
- Form validation
- Success/error notifications
- Quick access links to:
  - OCR extraction tool
  - Actions page
  - Contact page

---

## 🔐 Authentication Flow

### For New Users:
1. Visit http://localhost:5174/register
2. Fill in registration form
3. Account created with CITOYEN role
4. Redirect to login page
5. Login and access profile + OCR features

### For Existing Users:
1. Visit http://localhost:5174/login
2. Enter credentials
3. Access profile and OCR features

---

## 🎨 UI/UX Highlights

### OCR Page:
- **Color Scheme:** Purple gradient (667eea → 764ba2)
- **Upload Area:** Dashed border with hover effects
- **Result Display:** Monospace font for better readability
- **Responsive:** Mobile-friendly design

### Profile Page:
- **Color Scheme:** Blue gradient (1E5A8E → 2B7EC1 → 5FA3D8)
- **Avatar:** Large circular avatar with user icon
- **Role Badge:** Color-coded by role type
  - ADMIN: Red (#D32F2F)
  - RESPONSABLE_TERRAIN: Blue (#1976D2)
  - BENEVOLE: Green (#388E3C)
  - CITOYEN: Orange (#F57C00)

---

## 🛠️ Technical Details

### Backend Integration:
- **OCR Endpoint:** `POST http://localhost:8001/ocr/extract`
- **Profile Endpoint:** `GET /auth/profile`
- **Update Profile:** `PATCH /users/profile`

### Frontend Stack:
- Vue 3 with TypeScript
- Vue Router for navigation
- Composition API with `<script setup>`
- Responsive CSS with modern gradients

### Authentication:
- JWT token stored in localStorage
- Conditional rendering based on login status
- Protected routes (profile requires authentication)

---

## 📱 Navigation Updates

The main navigation menu now includes:
- ACCUEIL
- BUREAU
- ACTIONS
- GALERIE
- **OCR** ← New!
- NOS PARTENAIRES
- CONTACT

Header buttons:
- **Not logged in:** "Se Connecter" + "S'inscrire"
- **Logged in:** "Mon Profil" button

---

## 🚀 How to Run

Make sure all services are running:

```bash
# Backend
cd backend/omnia-backend
npm run start:dev

# ML Service (for OCR)
cd ml-service
python main.py

# Frontoffice
cd frontend/frontoffice
npm run dev
```

Access at: **http://localhost:5174**

---

## 📝 Notes

- OCR requires the ML service to be running on port 8001
- Profile page requires user to be logged in
- All features are mobile-responsive
- French language interface throughout

---

## 🎯 Future Enhancements

Potential improvements:
- [ ] Password change functionality
- [ ] Profile picture upload
- [ ] OCR history/saved extractions
- [ ] Batch OCR processing
- [ ] Export extracted text to PDF/TXT
- [ ] Language selection for OCR
- [ ] User activity dashboard

---

**Created:** February 2026  
**Version:** 1.0.0
