// ** CRITICAL: Replace this URL with your actual API Gateway Invoke URL **
// Example format: 'https://[your-unique-id].execute-api.[region].amazonaws.com/prod/contact'
const API_BASE_URL = 'https://tigxq01pc7.execute-api.ap-south-1.amazonaws.com/prod/contact';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const responseMessage = document.getElementById('response-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission and page reload

            // 1. Collect Form Data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Log data for debugging (optional)
            console.log('Data being sent:', data);

            // 2. Clear previous message and show loading
            responseMessage.textContent = 'Submitting inquiry...';
            responseMessage.style.color = '#FFD700'; // Gold/Yellow loading color

            try {
                // 3. Send data to the API Gateway Endpoint
                const response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: {
                        // Crucial for telling the API Gateway that the body is JSON
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(data),
                });

                // 4. Handle HTTP Response
                if (response.ok) {
                    const result = await response.json();
                    
                    // Display success message
                    responseMessage.textContent = result.message || 'Thank you! Your query has been submitted successfully.';
                    responseMessage.style.color = '#33cc33'; // Green for success

                    // Clear the form fields after successful submission
                    contactForm.reset(); 
                } else {
                    // Handle non-200 responses (4xx, 5xx)
                    const errorText = await response.text();
                    console.error('Submission error:', errorText);
                    responseMessage.textContent = `Submission error: Could not complete request (${response.status} ${response.statusText}). Please check the API endpoint and CORS settings.`;
                    responseMessage.style.color = '#CC0000'; // Red for error
                }
            } catch (error) {
                // Handle network errors (e.g., ERR_NAME_NOT_RESOLVED, Failed to fetch due to CORS)
                console.error('Network or Fetch Error:', error);
                responseMessage.textContent = `Submission error: TypeError: Failed to fetch. Check network connection or API Gateway status.`;
                responseMessage.style.color = '#CC0000'; // Red for error
            }
        });
    }
});