const SUPABASE_URL = 'https://mbbmtiprjxufyhixpdis.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iYm10aXByanh1ZnloaXhwZGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzQ4MjMsImV4cCI6MjA4MDAxMDgyM30.qgKzQwboqfo8u97mR4TVkq1ZTpuuatYkpUFCUu5QQcI';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
  console.log('Newsletter script loaded');

  // Check if Supabase is loaded
  if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded!');
    return;
  }

  const { createClient } = supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Email validation
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Get ALL newsletter forms on the page (handles 1 or multiple)
  const forms = document.querySelectorAll('#newsletter-form');
  
  console.log(`Found ${forms.length} newsletter form(s)`);

  // If no forms found, exit
  if (forms.length === 0) {
    console.warn('No newsletter forms found on this page');
    return;
  }

  // Attach event listener to EACH form
  forms.forEach((form, index) => {
    console.log(`Initializing form ${index + 1}`);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      console.log(`Form ${index + 1} submitted`);

      // Get elements within THIS specific form
      const emailInput = this.querySelector('#email-input');
      const submitBtn = this.querySelector('#subscribe-btn');
      const message = this.querySelector('#message');

      if (!emailInput || !submitBtn || !message) {
        console.error('Form elements not found in this form');
        return;
      }

      const email = emailInput.value.trim().toLowerCase();

      // Validate email
      if (!isValidEmail(email)) {
        message.textContent = 'Please enter a valid email address';
        message.style.color = '#ef4444';
        message.style.display = 'block';
        return;
      }

      // Disable button during submission
      submitBtn.disabled = true;
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin text-primary fs-4"></i>';
      message.style.display = 'none';

      try {
        console.log('Attempting to insert:', email);

        // Insert into Supabase
        const { data, error } = await supabaseClient
          .from('newsletter_subscribers')
          .insert([
            {
              email: email,
              is_active: true,
              source: 'website'
            }
          ])
          .select();

        if (error) {
          console.error('Supabase error:', error);
          
          if (error.code === '23505') {
            // Duplicate email
            message.textContent = 'You are already subscribed!';
            message.style.color = 'white';
            message.style.fontWeight = 'bold';
          } else {
            throw error;
          }
        } else {
          console.log('Success:', data);
          message.textContent = 'Successfully subscribed! Thank you!';
          message.style.color = 'white';
          message.style.fontWeight = 'bold';
          emailInput.value = ''; // Clear input on success
        }

        message.style.display = 'block';

      } catch (error) {
        console.error('Subscription error:', error);
        message.textContent = 'Something went wrong. Please try again.';
        message.style.color = '#ef4444';
        message.style.fontWeight = 'bold';
        message.style.display = 'block';
      } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  });
});
