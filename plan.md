# Plan za Auto Klub Aplikaciju - Korisnički Profili i Hosting

## 🎯 Cilj

Implementirati kompletnu korisničku autentifikaciju i profile, povezati automobile sa korisnicima, i postaviti aplikaciju na besplatan hosting.

## 📋 Detaljan Plan Implementacije

### Faza 1: Backend - Korisnički Model i Autentifikacija

#### 1.1 Korisnički Model (User.js)

- **Polja:**
  - `username` (unique, required)
  - `email` (unique, required)
  - `password` (hashed, required)
  - `firstName` (required)
  - `lastName` (required)
  - `avatar` (URL slike)
  - `joinDate` (default: Date.now)
  - `isActive` (default: true)
  - `role` (enum: ['user', 'admin'], default: 'user')

#### 1.2 Autentifikacija (JWT)

- **Instalirati pakete:**
  ```bash
  npm install bcryptjs jsonwebtoken
  ```
- **Kreirati middleware:**
  - `auth.js` - JWT middleware za zaštitu ruta
  - `password.js` - Hash/verify lozinki

#### 1.3 Auth Rute (/api/auth)

- **POST /register** - Registracija korisnika
- **POST /login** - Prijava korisnika
- **POST /logout** - Odjava (opciono)
- **GET /me** - Dohvatanje trenutnog korisnika
- **PUT /profile** - Ažuriranje profila

#### 1.4 Izmena Car Modela

- **Dodati polje:**
  - `user` (ObjectId, ref: 'User', required)
- **Ukloniti polje:**
  - `owner` (zameniti sa user referencom)

#### 1.5 Izmena Car Ruta

- **Zaštititi rute:**
  - POST /cars (samo ulogovani korisnici)
  - PUT /cars/:id (samo vlasnik automobila)
  - DELETE /cars/:id (samo vlasnik automobila)
- **Dodati filter:**
  - GET /cars/my-cars (automobili trenutnog korisnika)

### Faza 2: Frontend - Autentifikacija i Profile

#### 2.1 Auth Komponente

- **Login.jsx** - Forma za prijavu
- **Register.jsx** - Forma za registraciju
- **AuthContext.jsx** - Context za stanje autentifikacije
- **ProtectedRoute.jsx** - Zaštita ruta

#### 2.2 Auth Servis (auth.js)

- **Funkcije:**
  - `login(email, password)`
  - `register(userData)`
  - `logout()`
  - `getCurrentUser()`
  - `updateProfile(userData)`

#### 2.3 Izmena Postojećih Komponenti

- **Navbar.jsx** - Dodati login/register dugmad, prikaz korisnika
- **Profile.jsx** - Povezati sa pravim korisnikom
- **AddCar.jsx** - Automatski dodati userId
- **EditCar.jsx** - Proveriti vlasništvo
- **CarGallery.jsx** - Dodati filter "Moji automobili"

#### 2.4 User Profile Komponenta

- **UserProfile.jsx** - Detaljan profil korisnika
- **EditProfile.jsx** - Uređivanje profila
- **ChangePassword.jsx** - Promena lozinke

### Faza 3: Firebase Hosting Setup

#### 3.1 Firebase Konfiguracija

- **Instalirati Firebase CLI:**
  ```bash
  npm install -g firebase-tools
  ```
- **Inicijalizovati Firebase:**
  ```bash
  firebase login
  firebase init
  ```

#### 3.2 Backend na Firebase Functions

- **Migrirati backend na Firebase Functions**
- **Konfigurisati environment variables**
- **Povezati sa MongoDB Atlas (besplatno)**

#### 3.3 Frontend na Firebase Hosting

- **Build React aplikacije**
- **Deploy na Firebase Hosting**
- **Konfigurisati custom domain (opciono)**

#### 3.4 Besplatni Servisi

- **MongoDB Atlas** - Besplatna baza podataka (512MB)
- **Firebase Hosting** - Besplatni hosting
- **Firebase Functions** - Besplatni serverless (125K poziva/mesečno)
- **Cloudinary** - Besplatni upload slika (25GB/mesečno)

### Faza 4: Dodatne Funkcionalnosti

#### 4.1 Korisničke Funkcionalnosti

- **Email verifikacija** (opciono)
- **Reset lozinke** (opciono)
- **Avatar upload**
- **Korisničke postavke**
- **Notifikacije** (komentari, lajkovi)

#### 4.2 Admin Funkcionalnosti

- **Admin panel**
- **Moderacija automobila**
- **Upravljanje korisnicima**
- **Statistike**

#### 4.3 Social Features

- **Pratiti korisnike**
- **Favoriti automobili**
- **Komentari na automobile**
- **Lajkovanje automobila**

## 🗄️ Entity Relationship Diagram (ERD)

### Baza Podataka - MongoDB Collections

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│      User       │         │       Car       │         │    Comment      │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ _id: ObjectId   │◄────────┤ _id: ObjectId   │◄────────┤ _id: ObjectId   │
│ username: String│         │ user: ObjectId  │         │ car: ObjectId   │
│ email: String   │         │ brand: String   │         │ user: ObjectId  │
│ password: String│         │ model: String   │         │ text: String    │
│ firstName: String│        │ year: Number    │         │ createdAt: Date │
│ lastName: String │        │ fuel: String    │         │ updatedAt: Date │
│ avatar: String  │         │ mileage: String │         └─────────────────┘
│ joinDate: Date  │         │ color: String   │
│ isActive: Boolean│        │ condition: String│
│ role: String    │         │ description: String│
│ createdAt: Date │         │ images: [String]│
│ updatedAt: Date │         │ mainImage: String│
└─────────────────┘         │ likes: Number   │
                            │ views: Number   │
                            │ createdAt: Date │
                            │ updatedAt: Date │
                            └─────────────────┘
                                    │
                                    │
                            ┌─────────────────┐
                            │      Like       │
                            ├─────────────────┤
                            │ _id: ObjectId   │
                            │ car: ObjectId   │
                            │ user: ObjectId  │
                            │ createdAt: Date │
                            └─────────────────┘
```

### Relacije:

1. **User → Car** (1:N)

   - Jedan korisnik može imati više automobila
   - Polje: `Car.user` (ObjectId, ref: 'User')

2. **User → Comment** (1:N)

   - Jedan korisnik može napisati više komentara
   - Polje: `Comment.user` (ObjectId, ref: 'User')

3. **Car → Comment** (1:N)

   - Jedan automobil može imati više komentara
   - Polje: `Comment.car` (ObjectId, ref: 'Car')

4. **User ↔ Car** (N:N) - Lajkovanje
   - Korisnici mogu lajkovati više automobila
   - Automobili mogu biti lajkovani od više korisnika
   - Kroz `Like` kolekciju

### Indeksi za Performance:

```javascript
// User kolekcija
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Car kolekcija
db.cars.createIndex({ user: 1 });
db.cars.createIndex({ brand: 1, model: 1 });
db.cars.createIndex({ createdAt: -1 });

// Comment kolekcija
db.comments.createIndex({ car: 1 });
db.comments.createIndex({ user: 1 });
db.comments.createIndex({ createdAt: -1 });

// Like kolekcija
db.likes.createIndex({ car: 1, user: 1 }, { unique: true });
db.likes.createIndex({ car: 1 });
db.likes.createIndex({ user: 1 });
```

### Dodatne Kolekcije (Budućnost):

```
┌─────────────────┐         ┌─────────────────┐
│   Notification  │         │    Follow       │
├─────────────────┤         ├─────────────────┤
│ _id: ObjectId   │         │ _id: ObjectId   │
│ user: ObjectId  │         │ follower: ObjectId│
│ type: String    │         │ following: ObjectId│
│ message: String │         │ createdAt: Date │
│ read: Boolean   │         └─────────────────┘
│ createdAt: Date │
└─────────────────┘
```

### MongoDB Aggregation Pipeline

Za kompleksne upite i povezivanje podataka iz različitih kolekcija koristiti MongoDB aggregation pipeline:

#### 1. Korisnik sa automobilima i statistikama:

```js
// Dohvati korisnika sa svim automobilima
db.users.aggregate([
  { $match: { _id: ObjectId("user_id") } },
  {
    $lookup: {
      from: "cars",
      localField: "_id",
      foreignField: "user",
      as: "cars",
    },
  },
  {
    $addFields: {
      totalCars: { $size: "$cars" },
      totalLikes: { $sum: "$cars.likes" },
      totalViews: { $sum: "$cars.views" },
    },
  },
]);
```

#### 2. Automobil sa vlasnikom i komentarima:

```js
// Dohvati automobil sa vlasnikom i komentarima
db.cars.aggregate([
  { $match: { _id: ObjectId("car_id") } },
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "owner",
    },
  },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "car",
      as: "comments",
    },
  },
  { $unwind: "$owner" },
]);
```

#### 3. Top korisnici po broju automobila:

```js
// Najaktivniji korisnici
db.cars.aggregate([
  {
    $group: {
      _id: "$user",
      carCount: { $sum: 1 },
      totalLikes: { $sum: "$likes" },
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user",
    },
  },
  { $unwind: "$user" },
  { $sort: { carCount: -1 } },
  { $limit: 10 },
]);
```

#### 4. Popularni automobili:

```js
// Automobili sa najviše lajkova
db.cars.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "owner",
    },
  },
  { $unwind: "$owner" },
  { $sort: { likes: -1 } },
  { $limit: 10 },
]);
```

### Prednosti Aggregation Pipeline-a:

- **Performanse:** Kompleksni upiti se izvršavaju na nivou baze
- **Fleksibilnost:** Mogućnost transformacije podataka
- **Skalabilnost:** Optimizovano za velike količine podataka
- **Čitljivost:** Jasna struktura upita

## 🛠️ Tehnički Stack

### Backend

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT autentifikacija**
- **bcryptjs** (hash lozinki)
- **Firebase Functions** (hosting)

### Frontend

- **React + Vite**
- **React Router**
- **Context API** (state management)
- **Axios** (API pozivi)
- **Firebase Hosting** (deploy)

### Eksterni Servisi

- **MongoDB Atlas** (baza)
- **Cloudinary** (slike)
- **Firebase** (hosting + functions)

## 📅 Vremenski Plan

### Nedelja 1: Backend Auth

- [ ] User model i rute
- [ ] JWT autentifikacija
- [ ] Izmena Car modela
- [ ] Testiranje API-ja

### Nedelja 2: Frontend Auth

- [ ] Login/Register forme
- [ ] Auth context
- [ ] Zaštita ruta
- [ ] Izmena postojećih komponenti

### Nedelja 3: Profile i Firebase

- [ ] User profile komponente
- [ ] Firebase setup
- [ ] Deploy backend na Functions
- [ ] Deploy frontend na Hosting

### Nedelja 4: Testiranje i Optimizacija

- [ ] End-to-end testiranje
- [ ] Bug fixes
- [ ] Performance optimizacija
- [ ] Dokumentacija

## 💡 Moji Predlozi

### 1. UX/UI Poboljšanja

- **Dark mode** toggle
- **Responsive design** optimizacija
- **Loading states** i skeleton screens
- **Error boundaries** za bolje error handling
- **Toast notifications** za feedback

### 2. Performance Optimizacije

- **Lazy loading** za slike
- **Pagination** za galeriju automobila
- **Caching** strategije
- **Code splitting** za manje bundle size

### 3. Security Poboljšanja

- **Rate limiting** na API rute
- **Input validation** i sanitization
- **CORS** konfiguracija
- **Helmet.js** za security headers

### 4. Dodatne Funkcionalnosti

- **Search** automobila (po marki, modelu, godini)
- **Filter** automobila (cena, gorivo, stanje)
- **Sort** automobila (datum, cena, popularnost)
- **Export** podataka (PDF, Excel)

### 5. Monetizacija (Budućnost)

- **Premium članstvo** (više slika, napredne opcije)
- **Oglasi** automobila na prodaju
- **Servis booking** sistem
- **Insurance quotes** integracija

### 6. Mobile App

- **React Native** verzija
- **Push notifications**
- **Offline mode**
- **Camera integration** za slike

## 🚀 Deployment Checklist

### Pre Deploy

- [ ] Testirati sve funkcionalnosti
- [ ] Optimizovati slike
- [ ] Minifikovati kod
- [ ] Proveriti environment variables
- [ ] Backup baze podataka

### Post Deploy

- [ ] Testirati live aplikaciju
- [ ] Proveriti performance
- [ ] Setup monitoring
- [ ] Dokumentacija za korisnike
- [ ] Marketing materijali

## 📊 Metrike za Praćenje

### User Engagement

- **Broj registriranih korisnika**
- **Broj dodanih automobila**
- **Broj pregleda profila**
- **Vreme provedeno na aplikaciji**

### Technical Metrics

- **Page load time**
- **API response time**
- **Error rate**
- **Uptime**

---

**Ovaj plan će transformisati vašu aplikaciju u ozbiljnu platformu sa pravim korisnicima i mogućnošću za rast! 🚗✨**

## ⚙️ Standardizacija Odgovora i Error Handling (Backend)

### Asinhroni Handler (asyncHandler)

- Koristiti higher-order funkciju `asyncHandler` za sve asinhrone rute.
- Omogućava automatsko hvatanje grešaka bez try/catch u svakoj ruti.

**Primer asyncHandler-a:**

```js
// middleware/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
module.exports = asyncHandler;
```

**Korišćenje u ruti:**

```js
const asyncHandler = require("./middleware/asyncHandler");
router.get(
  "/cars",
  asyncHandler(async (req, res) => {
    const cars = await Car.find();
    res.json({ success: true, data: cars });
  })
);
```

### Standardizovan Odgovor i Error Format

- Svi odgovori sa servera treba da budu u formatu:
  - Uspeh: `{ success: true, data: ... }`
  - Greška: `{ success: false, message: 'Opis greške', error: ... }`

**Globalni error handler:**

```js
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
module.exports = errorHandler;
```

**Dodavanje u Express aplikaciju:**

```js
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);
```

### Prednosti:

- Nema više try/catch u svakoj ruti
- Svi odgovori su konzistentni
- Frontend može lako da obradi greške
- Lakše debugovanje i održavanje

---
