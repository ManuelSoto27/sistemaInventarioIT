document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const Correo_Usuario = document.getElementById('email').value;
    const Password_Usuario = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Correo_Usuario, Password_Usuario }),
        });

        const result = await response.json();

        if (response.ok) {
            const token = result.token;
            localStorage.setItem('token', token); // Almacena el token en localStorage
        
            // Llama al servidor para redirigir al menú correspondiente
            fetch('/auth/redirigirMenu', {
                method: 'GET',
                credentials: 'include', // Permite incluir cookies en las solicitudes
            })
            .then((res) => {
                if (!res.ok) throw new Error('Redirección fallida');
                return res.json();
            })
            .then((data) => {
                window.location.href = data.redirectUrl; // Redirige al usuario a la URL correspondiente
            })
            .catch((error) => {
                console.error(error);
                alert('Hubo un problema al redirigir.');
            });
        } else {
            alert(result.error || 'Error al iniciar sesión');
        }
        
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});
