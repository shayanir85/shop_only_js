document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
    });

    const name = document.getElementById('name').value;
    const pass = document.getElementById('password').value;
    const UserInfo = JSON.parse(localStorage.getItem('users')) || [];

    const user = UserInfo.find(user => user.name === name && user.password === pass);
    if (user) {
        // Set session flag and store minimal user data
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('username', name);

        Toast.fire({
            icon: 'success',
            title: 'Login successful'
        }).then(() => {
            window.location.href = 'index.html';
            this.reset();
        });
    } else {
        Toast.fire({
            icon: 'error',
            title: 'Invalid credentials'
        });
    }
});