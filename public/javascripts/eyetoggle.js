// login form 
// to toglle the password hide unhide
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
  
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = '/images/eye.svg';  
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = '/images/eye-off.svg';  
    }
  };
  
  