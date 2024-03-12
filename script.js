async function createAccount() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

     // Validate email format
     if (!isValidEmail(email)) {
        document.getElementById('error-message').innerText = 'Invalid email address';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
    
        const result = response.ok ? await response.json() : {};
        console.log(result.message);

        if (response.ok) {
        // Redirect to Login.html after successful account creation
            window.location.href = 'login.html';
        } else {
            // Display the error message in the designated area
            const errorMessageElement = document.getElementById('errorMessage');
            errorMessageElement.textContent = result.error || 'Username or Email already in use';
        }    
    } catch (error) {
        console.error('Error during account creation:', error);
        // Handle any unexpected errors here
  }
}


async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = response.ok ? await response.json() : {};
        console.log(result.message);

        if (response.ok) {
            // Login successful, redirect to LoggedIn.html
            window.location.href = 'Logged In.html';
        } else {
            // Display the error message in the designated area
            const errorMessageElement = document.getElementById('errorMessage');
            errorMessageElement.textContent = 'Invalid username or password';
        }
    } catch (error) {
        console.error('Error during login:', error);
        // Handle any unexpected errors here
    }
}


// Add this function to send the reset email
async function sendResetEmail() {
    const email = document.getElementById('email').value;

    // Validate email format
    if (!isValidEmail(email)) {
        document.getElementById('error-message').innerText = 'Invalid email address';
        return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
        const result = await response.json();
        if (response.ok) {
          // Show success message or redirect to a success page
          window.location.href = 'resetLink.html';
      } else {
          // Display an error message to the user
          document.getElementById('error-message').innerText = result.error;
      }
  } catch (error) {
      console.error('Error sending email:', error);
      // Handle unexpected errors here
  }
}


// Function to validate email format
function isValidEmail(email) {
    // Use a regular expression or any other method to validate email format
    // For simplicity, a basic regex is used here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


async function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const resetToken = getResetTokenFromQueryString(); // Implement a function to get the token from the URL

    try {
        const response = await fetch('http://localhost:3000/api/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword, resetToken }),
        });

        const result = response.ok ? await response.json() : {};

        if (response.ok) {
            // Redirect to a confirmation page or handle success
            window.location.href = 'Password Reset Confirmation.html';
        } else {
            // Display the error message in the designated area
            const errorMessageElement = document.getElementById('resetPasswordErrorMessage');
            errorMessageElement.textContent = result.error || 'Password reset failed';
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        // Handle any unexpected errors here
    }
}

// Event listener for the showPassword checkbox
document.getElementById('showPassword').addEventListener('change', togglePasswordVisibility);

// Function to toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}


function previewImage(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const image = document.getElementById('profileImage');
            image.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}