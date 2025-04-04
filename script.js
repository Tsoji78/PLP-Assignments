 // Mobile menu toggle
 const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
 const sidebar = document.querySelector('.sidebar');
 
 mobileMenuBtn.addEventListener('click', () => {
     sidebar.classList.toggle('active');
 });

 // Close sidebar when clicking outside on mobile
 document.addEventListener('click', (e) => {
     if (window.innerWidth <= 1024 && 
         !sidebar.contains(e.target) && 
         !mobileMenuBtn.contains(e.target)) {
         sidebar.classList.remove('active');
     }
 });