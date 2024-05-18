$('#loginFormElement').on('submit', function(e) {
    e.preventDefault(); // Prevenir el envío predeterminado del formulario

    const email = $('#loginEmail').val();
    const contrasena = $('#loginPassword').val();

    $.ajax({
        url: '/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, contrasena }),
        success: function(data) {
            $('#modalMessage').text('Login exitoso');
            $('#myModal').show();
            setTimeout(function() {
                window.location.href = '/home'; // Redirigir al usuario a la página de inicio
            }, 2000); // Esperar 2 segundos antes de redirigir
        },
        error: function(jqXHR) {
            $('#modalMessage').text(jqXHR.responseJSON.message);
            $('#myModal').show();
        }
    });
});

// Peticion al endpoint de registro
$(document).ready(function() {
    $('#registerFormElement').on('submit', function(e) {
        e.preventDefault(); // Prevenir el envío predeterminado del formulario

        const nombres = $('#registerNombres').val();
        const nombre_usuario = $('#registerNombreUsuario').val();
        const email = $('#registerEmail').val();
        const contrasena = $('#registerPassword').val();

        $.ajax({
            url: '/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nombres, nombre_usuario, email, contrasena }),
            success: function(data) {
                $('#modalMessage').text('Usuario registrado exitosamente');
                $('#myModal').show();
                toggleForms(); // Cambiar a la vista de login si el registro es exitoso
            },
            error: function(jqXHR) {
                $('#modalMessage').text(jqXHR.responseJSON.message);
                $('#myModal').show();
            }
        });
    });

    $('#loginFormElement').on('submit', function(e) {
        e.preventDefault(); // Prevenir el envío predeterminado del formulario

        const email = $('#loginEmail').val();
        const contrasena = $('#loginPassword').val();

        $.ajax({
            url: '/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, contrasena }),
            success: function(data) {
                $('#modalMessage').text('Login exitoso');
                $('#myModal').show();
                // Aquí puedes agregar redireccionamiento u otra lógica
            },
            error: function(jqXHR) {
                $('#modalMessage').text(jqXHR.responseJSON.message);
                $('#myModal').show();
            }
        });
    });

    // Cuando el usuario hace clic en <span> (x), cerrar el modal
    $('.close').click(function() {
        $('#myModal').hide();
    });

    // Cuando el usuario hace clic fuera del modal, cerrarlo
    $(window).click(function(event) {
        if ($(event.target).is('#myModal')) {
            $('#myModal').hide();
        }
    });
});

// funcion para cambiar de inicio a registro
function toggleForms() {
    const loginForm = $('#loginForm');
    const registerForm = $('#registerForm');
    loginForm.toggle();
    registerForm.toggle();
}
