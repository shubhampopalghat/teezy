
//flash message fade animation
window.addEventListener('DOMContentLoaded', () => {
    const flashMessages = document.querySelectorAll('.flash-message');
    
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.classList.add('opacity-0', 'transition-opacity', 'duration-500');  
    
            setTimeout(() => {
                msg.remove();  
            }, 500);  
        }, 1000); 
    });
    });
  