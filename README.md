# Shopify Form Submission App

A custom Shopify embedded app built with React Router that allows customers to submit forms and merchants to view all submissions in an admin dashboard.

## Features

### 1. Customer-Facing Forms
- **Embedded App Form**: Form accessible within the Shopify admin app
- **Storefront Form - App Block**: Drag-and-drop form block for Theme Customizer (no code required!) ⭐
- **Storefront Form - Embed Script**: Form that can be embedded via script tag
- Simple form with three fields:
  - Name
  - Email
  - Phone Number
- Form validation and error handling
- Success message upon submission
- Data saved to SQLite database (via Prisma)
- Automatic shop domain tracking for storefront submissions
- Fully customizable through Theme Customizer settings

  <img width="962" height="733" alt="image" src="https://github.com/user-attachments/assets/0883576f-9ae0-4d3e-bcfa-28b22feb39bc" />

### 2. Admin Dashboard
- View all form submissions in a table format
- Columns: Name, Email, Phone Number, Shop (if from storefront), Submission Date
- Sorted by most recent submissions first
- Accessible only to authenticated merchants
- Shows submissions from both embedded app and storefront

  <img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/56765e5b-b6c4-4597-a3f4-f243af0996fc" />

### 3. Backend API
- **POST `/api/submit`**: Handle form submissions from embedded app
- **POST `/api/public/submit`**: Public endpoint for storefront form submissions (CORS enabled)
- **GET `/api/submissions`**: Fetch all submissions (admin only)
- Built with React Router server actions/loaders
- Uses Prisma ORM with SQLite database

## Tech Stack

- **Frontend**: React, React Router v7
- **Backend**: Node.js, React Router (server-side)
- **Database**: SQLite with Prisma ORM
- **Shopify**: Shopify App Bridge, Shopify CLI
- **Styling**: Inline styles (can be upgraded to Polaris Web Components)

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js**: Version 20.19+ or 22.12+ ([Download](https://nodejs.org/en/download/))
2. **Shopify Partner Account**: [Create one here](https://partners.shopify.com/signup)
3. **Test Store**: Set up a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store)
4. **Shopify CLI**: Install globally
   ```bash
   npm install -g @shopify/cli@latest
   ```

## Quick Start Guide

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/sohanakhatun/form-app.git
cd "form-builder-app"
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

### 3. Database Setup

The app uses SQLite with Prisma. Initialize the database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate dev
```

This will create:
- `Session` table (for Shopify app sessions)
- `Form` table (for form submissions)

### 4. Environment Variables Setup

#### Option A: Automatic Setup with Shopify CLI (Recommended)

When you run `shopify app dev`, the Shopify CLI automatically:
- Creates or connects to an app in your Partner Dashboard
- Generates API keys and sets environment variables
- Creates a tunnel for local development
- Handles all configuration

**You don't need to manually create a `.env` file when using this method.**

#### Option B: Manual Environment Variable Setup

If you need to run the app without Shopify CLI or want to configure manually:

1. **Create a `.env` file** in the root directory 

2. **Add the following environment variables:**

```env
# Shopify App Credentials
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_key_here
SHOPIFY_APP_URL=https://your-app-url.com
SCOPES=write_products

# Database (SQLite - default for development)
DATABASE_URL="file:./prisma/dev.sqlite"

# Node Environment
NODE_ENV=development

# Optional: Custom shop domain (if needed)
# SHOP_CUSTOM_DOMAIN=your-custom-domain.com
```

### 5. Shopify App Configuration & API Keys

#### Getting API Keys from Shopify Partner Dashboard

1. **Log in to [Shopify Partner Dashboard](https://partners.shopify.com/)**

2. **Create a new app** (or use an existing one):
   - Click "Apps" in the left sidebar
   - Click "Create app"
   - Choose "Create app manually"
   - Enter app name (e.g., "Form Builder App")
   - Click "Create app"

3. **Get your API credentials**:
   - In your app's page, go to "App setup" tab
   - Scroll to "Client credentials"
   - Copy the **API key** and **API secret key**
   - Add these to your `.env` file:
     ```env
     SHOPIFY_API_KEY=your_copied_api_key
     SHOPIFY_API_SECRET=your_copied_api_secret
     ```

4. **Configure App URL and Redirect URLs**:
   - **App URL**: Set to your app's public URL (e.g., `https://your-ngrok-url.ngrok.io` for development)
   - **Allowed redirection URL(s)**: Add your auth callback URLs:
     - `https://your-app-url.com/auth/callback`
     - `https://your-app-url.com/auth/shopify/callback`
     - `https://your-app-url.com/api/auth/callback`

5. **Set App Scopes**:
   - In the "Configuration" section, add required scopes
   - For this app, you need: `write_products`
   - This can also be set in `shopify.app.toml` under `[access_scopes]`

#### Using `shopify.app.toml` Configuration

The `shopify.app.toml` file contains your app configuration. Key settings:

```toml
client_id = "your_client_id"  # Automatically set by Shopify CLI
name = "form-builder-app"
application_url = "https://your-app-url.com"
embedded = true

[access_scopes]
scopes = "write_products"

[auth]
redirect_urls = [
    "https://your-app-url.com/auth/callback",
    "https://your-app-url.com/auth/shopify/callback",
    "https://your-app-url.com/api/auth/callback"
]
```

**Note**: The `client_id` is automatically populated when you use Shopify CLI. For manual setup, you can find it in your Partner Dashboard under "App setup" → "Client credentials".

### 6. How to Run the App (Development Mode with Shopify CLI)

#### Recommended: Using Shopify CLI

The easiest way to run the app is using Shopify CLI, which handles everything automatically:

```bash
npm run dev
```

Or directly:

```bash
shopify app dev
```

**What happens when you run this:**

1. **Development server starts** on a local port (typically 3000)
2. **Tunnel is created** automatically (using Cloudflare Tunnel or ngrok)
3. **App URL is displayed** in the terminal (e.g., `https://abc123.ngrok.io`)
4. **You'll be prompted** to:
   - Select or create an app in your Partner Dashboard
   - Choose a development store to install the app on
   - Authorize the app permissions
5. **App opens** in your Shopify admin automatically

**Useful commands while running:**
- Press `P` to open the app URL in your browser
- Press `R` to restart the development server
- Press `Q` to quit

**Getting Your App URL**: When you run `npm run dev`, the Shopify CLI automatically creates a tunnel and displays your app URL in the terminal output. Look for a line that says:
```
✔ App URL: https://abc123.ngrok.io
```
or
```
Your app is running at: https://abc123.ngrok.io
```

This is the URL you'll use for:
- App Block settings during development
- Updating your `.env` file (if running manually)
- Configuring in Partner Dashboard

### 7. Install the App on Your Development Store

1. **When running `shopify app dev`**, you'll be automatically prompted to:
   - Select your development store
   - Install the app
   - Authorize permissions

2. **If installing manually**:
   - Go to your dev dashboard.
   - Navigate to "Apps".
   - Find your app and click "Install"
   - Authorize the requested permissions

3. **The app will open** in your Shopify admin after installation

## Project Structure

```
form-builder-app/
├── app/
│   ├── routes/
│   │   ├── app._index.jsx          # Home page
│   │   ├── app.form.jsx             # Customer-facing form
│   │   ├── app.admin.jsx            # Admin submissions view
│   │   ├── api.submit.jsx           # POST endpoint for form submissions
│   │   └── api.submissions.jsx     # GET endpoint for fetching submissions
│   ├── db.server.js                 # Prisma client instance
│   ├── shopify.server.js            # Shopify app configuration
│   └── root.jsx                     # App root component
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── dev.sqlite                   # SQLite database file
├── public/                          # Static assets
├── package.json
├── shopify.app.toml                 # Shopify app configuration
└── README.md
```

## Usage

### For Customers/Merchants

1. **Add Form to Storefront:**
   - **Using App Block:**
     - Open Theme Customizer in Shopify admin
     - Add the "Contact Form" app block to any section
     - Customize settings (optional)
     - Save and publish - done! No code required!
   - Customers can submit forms directly from your website
   - Submissions automatically appear in the admin dashboard

3. **View Submissions (Admin):**
   - Navigate to "View Submissions" in the app navigation
   - See all submitted forms in a table.
   - Submissions are sorted by date (newest first)
   - Shop column shows which storefront the submission came from

### API Endpoints

#### POST `/api/submit`
Submit a new form entry.

**Request:**
```javascript
FormData {
  name: string,
  email: string,
  phone: string
}
```

**Response:**
```json
{
  "success": true,
  "id": 1
}
```

#### GET `/api/submissions`
Get all form submissions (admin only).

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Database Schema

### Form Model
```prisma
model Form {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  phone     String
  createdAt DateTime @default(now())
}
```

## Development Tips

### View Database

Use Prisma Studio to view and edit database records:
```bash
npx prisma studio
```

### Reset Database

To reset the database (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

### Build for Production

```bash
npm run build
npm start
```

## Deployment

When ready to deploy:

1. **Choose a hosting provider:**
   - [Google Cloud Run](https://shopify.dev/docs/apps/launch/deployment/deploy-to-google-cloud-run)
   - [Fly.io](https://fly.io/docs/js/shopify/)
   - [Render](https://render.com/docs/deploy-shopify-app)

2. **Set environment variables** on your hosting platform

3. **Update database** to PostgreSQL or MySQL for production:
   - Update `prisma/schema.prisma` datasource
   - Run migrations on production database

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Get your app URL** after deployment:
   - **Quick method:** Check your hosting provider dashboard or Shopify Partner Dashboard → Apps → Your App → App setup → App URL

6. **Update app URLs:**
   - Update `shopify.app.toml` with your production URL
   - Update Shopify Partner Dashboard → Apps → Your App → App setup
   - Update the app block URL in `extensions/form-block/blocks/contact-form.liquid`

## Additional Resources

- [Shopify App Development Docs](https://shopify.dev/docs/apps/getting-started)
- [React Router Docs](https://reactrouter.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Shopify CLI Docs](https://shopify.dev/docs/apps/tools/cli)

