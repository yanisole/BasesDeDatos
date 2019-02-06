'use strict';

$(function() {
    if(sessionStorage.getItem('user') == null)
    {
        alert('Debe iniciar sesión');
        window.location.href = '/';
    }
    
    $('#logout').on('click', function() {
        //Cierro la sesión del usuario
        sessionStorage.removeItem('user');
        window.location.href = '/';
    });
});