# Storefront Form Setup Guide

This guide explains how to add the contact form to your Shopify storefront so customers can submit forms directly from your website.

## Overview

The form submissions from your storefront will automatically appear in your app's admin dashboard under "View Submissions".

## Method 1: Using App Block (Easiest - No Code Required!) ⭐

**This is the most merchant-friendly method!** Merchants can add the form through the Theme Customizer - no code editing needed.

### How Merchants Use It

1. **Install the app** on their Shopify store
2. **Open Theme Customizer:**
   - Go to **Online Store > Themes**
   - Click **Customize** on the active theme
3. **Add the block:**
   - Navigate to any section (Homepage, Product page, etc.)
   - Click **Add block** or **Add section**
   - Find **"Contact Form"** in the app blocks
   - Click to add it
4. **Customize (optional):**
   - Set the App URL (from your `npm run dev` output during development)
   - Customize heading, colors, spacing, etc.
5. **Save and publish!**

That's it! The form is now live on their storefront.

### For Developers: Deploying the Extension

The app block is already created in `extensions/form-block/`. To deploy:

```bash
cd form-builder-app
shopify app deploy
```

Or during development:

```bash
npm run dev
```

The extension is automatically included.

### App URL Configuration

**During Development:**
- Merchants need to set the App URL in block settings
- Get it from `npm run dev` terminal output
- Example: `https://abc123-def456.tunnel.cloudflare.com`

**In Production:**
- You can set a default URL in the block code
- Or use app metafields to auto-detect
- Or configure via environment variables

See [APP_BLOCK_SETUP.md](./APP_BLOCK_SETUP.md) for detailed instructions.

## Method 2: Using the Embed Script (For Advanced Users)

This is the easiest way to add the form to any page in your Shopify theme.

### Step 1: Get Your App URL

When you run `npm run dev`, the Shopify CLI automatically creates a tunnel and displays your app URL in the terminal. Look for a line that says `✔ App URL:` or `Your app is running at:`. Copy that URL.

### Step 2: Add to Your Theme

1. In your Shopify admin, go to **Online Store > Themes**
2. Click **Actions > Edit code** on your active theme
3. Navigate to the page where you want the form (e.g., `templates/page.contact.liquid` or create a new page template)
4. Add the following code where you want the form to appear:

```liquid
<div id="form-builder-container"></div>
<script 
  src="{{ 'storefront-form-embed.js' | asset_url }}" 
  data-app-url="YOUR_APP_URL_HERE"
></script>
```

**Important:** Replace `YOUR_APP_URL_HERE` with your actual app URL (e.g., `https://your-app.ngrok.io`)

### Step 3: Upload the Script File

1. In your theme editor, go to **Assets**
2. Click **Add a new asset**
3. Upload the file: `form-builder-app/public/storefront-form-embed.js`
4. Name it `storefront-form-embed.js`

### Alternative: Direct Script URL

If you prefer to load the script directly from your app server:

```liquid
<div id="form-builder-container"></div>
<script 
  src="YOUR_APP_URL/public/storefront-form-embed.js" 
  data-app-url="YOUR_APP_URL"
></script>
```

## Method 3: Custom Liquid Template

Create a custom page template in your theme:

1. In theme editor, go to **Templates**
2. Create a new template: `page.form.liquid`
3. Add the form HTML:

```liquid
<div class="form-builder-container" style="max-width: 500px; margin: 0 auto; padding: 20px;">
  <h2>{{ page.title }}</h2>
  <div id="form-builder-container"></div>
  <script>
    const APP_URL = 'YOUR_APP_URL_HERE';
  </script>
  <script src="{{ APP_URL }}/public/storefront-form-embed.js" data-app-url="{{ APP_URL }}"></script>
</div>
```

## Testing the Form

1. Visit the page where you added the form on your storefront
2. Fill out and submit the form
3. Check your app's admin dashboard ("View Submissions") to see the submission

## Form Features

- ✅ Real-time validation
- ✅ Success/error messages
- ✅ Automatic shop domain tracking
- ✅ Mobile-responsive design
- ✅ CORS-enabled for cross-origin requests

## Customization

### Styling

The form uses inline styles that you can customize. You can:

1. Override styles with CSS in your theme
2. Modify the `storefront-form-embed.js` file to change the styling
3. Use CSS classes and add your own stylesheet

### Form Fields

To add or modify fields:

1. Edit `public/storefront-form-embed.js`
2. Add new input fields in the form HTML
3. Update the API endpoint to handle new fields
4. Update the database schema if needed

## Troubleshooting

### Form Not Appearing

- Check browser console for JavaScript errors
- Verify the script URL is correct
- Ensure the container div has the correct ID: `form-builder-container`

### Submissions Not Saving

- Check that your app is running and accessible
- Verify the API endpoint: `YOUR_APP_URL/api/public/submit`
- Check browser network tab for API errors
- Verify CORS headers are being sent (check Network tab)

### Submissions Not Showing in Admin

- Ensure you're logged into the app admin
- Check that the database migration ran successfully
- Verify the shop domain is being captured correctly

## Security Notes

- The public API endpoint allows submissions from any origin (CORS: *)
- Consider adding rate limiting for production use
- You may want to add CAPTCHA for spam protection
- Consider adding shop domain validation to ensure submissions are from valid Shopify stores

## Production Considerations

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **CAPTCHA**: Consider adding reCAPTCHA or hCaptcha
3. **Validation**: Add server-side validation for all fields
4. **Monitoring**: Set up error logging and monitoring
5. **HTTPS**: Ensure your app URL uses HTTPS in production

## Support

For issues or questions, check:
- App logs in your hosting platform
- Browser console for client-side errors
- Network tab for API request/response details

