/**
 * Storefront Form Embed Script
 * 
 * Add this script to your Shopify storefront theme to embed the contact form.
 * 
 * Usage:
 * 1. Add this script to your theme's liquid file (e.g., contact.liquid or page.liquid)
 * 2. Add a div with id="form-builder-container" where you want the form to appear
 * 3. Include this script with your app URL:
 * 
 * <div id="form-builder-container"></div>
 * <script src="YOUR_APP_URL/public/storefront-form-embed.js" data-app-url="YOUR_APP_URL"></script>
 */

(function() {
  'use strict';

  // Get app URL from script tag data attribute
  const scriptTag = document.currentScript || document.querySelector('script[data-app-url]');
  const appUrl = scriptTag?.getAttribute('data-app-url') || '';
  
  if (!appUrl) {
    console.error('Form Builder: Please provide data-app-url attribute on the script tag');
    return;
  }

  const apiUrl = `${appUrl}/api/public/submit`;
  
  // Get shop domain from Shopify global object or current hostname
  const shopDomain = (typeof Shopify !== 'undefined' && Shopify.shop) 
    ? Shopify.shop 
    : window.location.hostname.replace('.myshopify.com', '');

  // Form HTML template
  const formHTML = `
    <div class="form-builder-container" style="max-width: 500px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
      <h2 style="margin-bottom: 10px;">Contact Us</h2>
      <p style="margin-bottom: 20px; color: #666;">Fill out the form below and we'll get back to you soon!</p>
      
      <div id="form-builder-message"></div>
      
      <form id="form-builder-form">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">
            Name <span style="color: #d32f2f;">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;"
            placeholder="Enter your name"
          />
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">
            Email <span style="color: #d32f2f;">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;"
            placeholder="Enter your email"
          />
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">
            Phone Number <span style="color: #d32f2f;">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;"
            placeholder="Enter your phone number"
          />
        </div>
        
        <button 
          type="submit" 
          id="form-builder-submit"
          style="width: 100%; padding: 12px 24px; background-color: #008060; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;"
        >
          Submit
        </button>
      </form>
    </div>
  `;

  // Inject form into container
  const container = document.getElementById('form-builder-container');
  if (!container) {
    console.error('Form Builder: Container element with id="form-builder-container" not found');
    return;
  }

  container.innerHTML = formHTML;

  // Get form elements
  const form = document.getElementById('form-builder-form');
  const messageDiv = document.getElementById('form-builder-message');
  const submitButton = document.getElementById('form-builder-submit');

  function showMessage(text, type) {
    const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
    const textColor = type === 'success' ? '#155724' : '#721c24';
    const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
    
    messageDiv.innerHTML = `
      <div style="padding: 12px; border-radius: 4px; margin-bottom: 20px; background-color: ${bgColor}; color: ${textColor}; border: 1px solid ${borderColor};">
        ${text}
      </div>
    `;
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.innerHTML = '';
      }, 5000);
    }
  }

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    // Add shop domain if available
    if (shopDomain) {
      formData.append('shop', shopDomain);
    }
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    submitButton.style.backgroundColor = '#ccc';
    messageDiv.innerHTML = '';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('✓ Thank you! Your form has been submitted successfully.', 'success');
        form.reset();
      } else {
        showMessage(`Error: ${data.error || 'Failed to submit form. Please try again.'}`, 'error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage('An error occurred. Please try again later.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
      submitButton.style.backgroundColor = '#008060';
    }
  });
})();

