# Shelfed Bookstore

**Shelfed is a curated online bookstore designed to feel more like browsing a great independent bookshop than scrolling through an e-commerce catalog.**

Instead of the usual grid of identical product cards, Shelfed uses an editorial, magazine-inspired experience: staff picks, mood-based shelves, new arrivals, handwritten-style recommendations, and a checkout flow built around UPI and WhatsApp.

---

## What is Shelfed?

Shelfed is an online bookstore where books are treated as **curated discoveries**, not just products.

The experience is built around a simple idea:

> **A bookstore should help you discover what to read, not just help you search for a title you already know.**

The homepage feels like a physical bookstore's recommendation table. Books are grouped into editorial sections and moods, while staff recommendations are presented as digital index cards.

Users can:

- Browse a curated collection of books
- Explore books by genre and mood
- Discover staff picks
- View detailed book pages
- Search the catalog
- Add books to a persistent cart
- Create an account and maintain a wishlist
- Leave reviews and ratings
- Checkout with delivery details
- Pay through UPI
- Send their order details directly through WhatsApp
- Track their order status through their account

---

## The Experience

### Editorial Homepage

Shelfed doesn't open with a giant promotional banner or a carousel.

The homepage is structured more like a magazine or bookstore table:

- Masthead
- Editorial quote
- Featured books
- New arrivals
- Mood-based shelves
- Staff recommendations
- Curated discovery sections

The goal is to make browsing feel intentional rather than transactional.

### Staff Picks

One of Shelfed's signature elements is the **staff table**.

Recommendations appear as digital index cards inspired by the handwritten recommendation cards found underneath staff picks in independent bookstores.

Each recommendation has its own personality rather than looking like another generic product card.

### Mood-Based Discovery

Instead of forcing users to know exactly what genre they want, Shelfed lets them browse based on moods and reading situations.

For example:

- Something hopeful
- For when you need a reset
- Dark and thought-provoking
- A book for a quiet Sunday
- Stories that stay with you

This makes discovery possible even when the user doesn't know what they are looking for.

---

## Visual Identity

Shelfed deliberately avoids the standard "AI-generated bookstore" aesthetic.

### Color

The interface uses a warm paper-inspired palette with:

- Putty paper tones
- Deep Daunt-inspired green
- Brass accents
- Wine-colored secondary accents

### Typography

The type system combines four distinct typefaces:

- **Fraunces** — expressive editorial display typography
- **Libre Franklin** — humanist body text
- **IBM Plex Mono** — prices, ISBNs and order information
- **Caveat** — handwritten staff-pick annotations

Together they make the interface feel closer to an editorial publication than a conventional e-commerce site.

---

## What Makes It Different?

### Not a Generic Product Grid

Books aren't presented as interchangeable cards.

The interface uses different visual treatments depending on the context:

- Editorial sections
- Index-card staff picks
- Mood shelves
- Book detail pages
- New-arrival displays
- Recommendation content

### No Payment Gateway

Shelfed uses a lightweight checkout model designed around the Indian payment ecosystem.

Instead of integrating a traditional payment gateway:

1. The customer places the order.
2. Shelfed generates a UPI payment link and QR code.
3. The customer pays through their UPI app.
4. The customer can send the order information through WhatsApp.
5. An admin confirms the payment.
6. The order moves into fulfillment.

This keeps the payment flow simple while still supporting real orders.

---

## Shopping Flow

### 1. Discover

Browse genres, moods, new arrivals and staff recommendations.

### 2. Explore

Open a book to see its:

- Cover
- Title
- Author
- Description
- ISBN
- Genre
- Price
- Rating
- Reviews
- Availability

### 3. Save

Add books to the wishlist for later.

### 4. Cart

Add books to the cart and adjust quantities.

Guest carts persist locally, while signed-in users can synchronize their cart with their account.

### 5. Checkout

Enter delivery information and review the order.

### 6. Pay

Shelfed generates a UPI QR code and payment link for the exact order amount.

### 7. Confirm

The order can be sent to the bookstore through WhatsApp with the relevant order information already prepared.

### 8. Fulfillment

The admin confirms payment and moves the order through its fulfillment lifecycle.

---

## Accounts & Personalization

Shelfed supports user accounts rather than treating every visitor as anonymous.

Signed-in users can access:

- Account information
- Order history
- Wishlist
- Persistent cart
- Reviews
- Order status

The cart starts locally for guests and can be synchronized with the database after login.

---

## Admin Experience

Shelfed also includes an admin side for managing the bookstore.

Administrators can:

- View orders
- Review payment status
- Update order status
- Manage the fulfillment workflow
- Access the bookstore's operational data

Admin routes are protected separately from normal customer accounts.

---

## Under the Hood

Shelfed is a full-stack application built with:

| Layer | Technology |
|---|---|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js |
| Client State | Zustand |
| Payments | UPI |
| Order Communication | WhatsApp |
| Book Covers | Open Library Covers API |

The application uses the Next.js App Router and separates catalog, account, checkout, administrative and API functionality into dedicated areas.

---

## Data & Catalog

Book information is stored in PostgreSQL through Prisma.

Book covers are sourced from the **Open Library Covers API using ISBNs**.

When a cover isn't available, Shelfed doesn't display a broken image. It falls back to a generated typographic cover treatment.

The catalog supports information such as:

- ISBN
- Title
- Author
- Description
- Genre
- Price
- Stock
- Cover
- Rating
- Review count

---

## Reviews

Users can review books after interacting with the catalog.

When a review is submitted, Shelfed recalculates the book's aggregate rating and rating count so the displayed rating stays synchronized with the underlying reviews.

---

## Accessibility

Accessibility is part of the interface rather than an afterthought.

Shelfed includes:

- Semantic page landmarks
- Skip-to-content navigation
- Visible keyboard focus states
- `aria-live` regions for dynamic cart/search information
- Reduced-motion support
- Accessible interactive controls

---

## Project Structure

```text
src/
├── app/
│   ├── catalog
│   ├── books/[slug]
│   ├── cart
│   ├── checkout
│   ├── login
│   ├── register
│   ├── account
│   ├── admin
│   └── api
│
├── components/
│   └── UI and feature components
│
├── lib/
│   ├── Prisma client
│   ├── authentication
│   ├── UPI utilities
│   ├── WhatsApp utilities
│   ├── validation
│   └── database queries
│
├── store/
│   ├── cart
│   └── wishlist
│
├── types/
└── hooks/

prisma/
├── schema.prisma
└── seed.ts

data/
└── books.json
```

---

## Design Philosophy

Shelfed is built around three principles:

### 01 — Discovery over inventory

A bookstore should make you want to read something you didn't know you wanted.

### 02 — Editorial over transactional

The interface should feel curated and human rather than optimized around generic e-commerce patterns.

### 03 — Simple commerce

The purchasing flow should be understandable and practical without requiring a complicated payment stack.

---

## Built For

Shelfed is designed as a modern independent bookstore concept that combines:

**Editorial curation + modern e-commerce + Indian payment workflows + personalized discovery.**

It is intentionally more than a CRUD bookstore.

The project explores how a small online bookstore can have a distinctive identity while still providing the infrastructure expected from a modern full-stack application.

---

## License

This project is for educational and portfolio purposes.
