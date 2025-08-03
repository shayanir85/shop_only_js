        document.getElementById('signupForm').addEventListener('submit', function (event) {
            event.preventDefault();

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });

            const UserInfo = JSON.parse(localStorage.getItem('users')) || [];
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // 1. Check for empty fields
            if (!name || !email || !password || !confirmPassword) {
                Toast.fire({
                    icon: 'error',
                    title: 'Please fill all fields'
                });
                return;
            }

            // 2. Check password match
            if (password !== confirmPassword) {
                Toast.fire({
                    icon: 'error',
                    title: 'Passwords do not match'
                });
                return;
            }

            // 3. Check for existing user
            const userExists = UserInfo.some(user =>
                user.name === name || user.email === email
            );

            if (userExists) {
                Toast.fire({
                    icon: 'error',
                    title: 'Username or email already taken'
                });
                return;
            }

            // Create user object with all properties
            const userData = {
                name: name,
                email: email,
                password: password, // Note: In production, NEVER store plain passwords
            };

            // Add new user and save
            UserInfo.push(userData);
            localStorage.setItem('users', JSON.stringify(UserInfo));
            sessionStorage.setItem('isAuthenticated','true');
            // Show success message
            Toast.fire({
                icon: 'success',
                title: 'Registration successful'
            }).then(() => {
                 window.location.href = `index.html`;
                this.reset();
            });
        
        });