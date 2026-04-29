// js/auth.js - Versión SIMPLE que FUNCIONA

// ============================================
// FUNCIONES DE SEGURIDAD BÁSICA
// ============================================

// Función para hashear contraseña
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validar nombre
function validarNombre(nombre) {
    return nombre && nombre.length >= 3 && /^[a-zA-ZáéíóúñÑÁÉÍÓÚ\s]+$/.test(nombre);
}

// Validar contraseña segura
function validarContrasena(password) {
    return password.length >= 6;
}

// Medir fortaleza
function medirFortalezaContrasena(password) {
    if (password.length < 6) return { nivel: 'débil', color: '#ff3366', text: '🔴 Mínimo 6 caracteres' };
    if (password.length < 8) return { nivel: 'media', color: '#ffaa00', text: '🟡 Añade mayúsculas y números' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
        return { nivel: 'fuerte', color: '#00ff88', text: '🟢 Contraseña fuerte' };
    }
    return { nivel: 'media', color: '#ffaa00', text: '🟡 Añade mayúsculas y números' };
}

// ============================================
// REGISTRO DE USUARIO - SIMPLE
// ============================================
async function registrarUsuario(nombre, email, password) {
    console.log('registrarUsuario llamado:', { nombre, email, password: '***' });
    
    // Validar campos
    if (!nombre || !email || !password) {
        mostrarNotificacion('❌ Completa todos los campos', 'error');
        return false;
    }
    
    // Validar nombre
    if (!validarNombre(nombre)) {
        mostrarNotificacion('❌ Nombre inválido (mínimo 3 letras)', 'error');
        return false;
    }
    
    // Validar email
    if (!validarEmail(email)) {
        mostrarNotificacion('❌ Email inválido', 'error');
        return false;
    }
    
    // Validar contraseña
    if (password.length < 6) {
        mostrarNotificacion('❌ La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }
    
    // Obtener usuarios existentes
    let usuarios = [];
    const usuariosStr = localStorage.getItem('axon_usuarios');
    if (usuariosStr) {
        usuarios = JSON.parse(usuariosStr);
    }
    
    // Verificar si el email ya existe
    if (usuarios.find(u => u.email === email)) {
        mostrarNotificacion('❌ Este correo ya está registrado', 'error');
        return false;
    }
    
    try {
        // Hashear contraseña
        const hashedPassword = await hashPassword(password);
        
        // Crear nuevo usuario
        const nuevoUsuario = {
            id: 'user_' + Date.now(),
            nombre: nombre,
            email: email,
            password: hashedPassword,
            fechaRegistro: new Date().toISOString(),
            verificado: true
        };
        
        // Guardar usuario
        usuarios.push(nuevoUsuario);
        localStorage.setItem('axon_usuarios', JSON.stringify(usuarios));
        
        // Iniciar sesión automáticamente
        const usuarioSesion = { 
            id: nuevoUsuario.id, 
            nombre: nuevoUsuario.nombre, 
            email: nuevoUsuario.email 
        };
        sessionStorage.setItem('axon_usuario_actual', JSON.stringify(usuarioSesion));
        
        // Actualizar variable global
        if (typeof window.actualizarUsuarioGlobal === 'function') {
            window.actualizarUsuarioGlobal(usuarioSesion);
        }
        
        // Actualizar UI
        if (typeof actualizarUIUsuario === 'function') {
            actualizarUIUsuario();
        }
        
        mostrarNotificacion(`✅ ¡Bienvenido, ${nombre}! Registro exitoso.`, 'success');
        return true;
        
    } catch (error) {
        console.error('Error en registro:', error);
        mostrarNotificacion('❌ Error al registrar usuario', 'error');
        return false;
    }
}

// ============================================
// INICIAR SESIÓN
// ============================================
async function iniciarSesion(email, password) {
    console.log('iniciarSesion llamado:', { email, password: '***' });
    
    if (!email || !password) {
        mostrarNotificacion('Correo y contraseña son requeridos', 'error');
        return false;
    }
    
    // Obtener usuarios
    const usuariosStr = localStorage.getItem('axon_usuarios');
    if (!usuariosStr) {
        mostrarNotificacion('No hay usuarios registrados', 'error');
        return false;
    }
    
    const usuarios = JSON.parse(usuariosStr);
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
        mostrarNotificacion('Usuario no encontrado', 'error');
        return false;
    }
    
    // Verificar contraseña
    const hashedInput = await hashPassword(password);
    
    if (usuario.password !== hashedInput) {
        mostrarNotificacion('Contraseña incorrecta', 'error');
        return false;
    }
    
    // Guardar sesión
    const usuarioSesion = { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        email: usuario.email 
    };
    sessionStorage.setItem('axon_usuario_actual', JSON.stringify(usuarioSesion));
    
    // Actualizar variable global
    if (typeof window.actualizarUsuarioGlobal === 'function') {
        window.actualizarUsuarioGlobal(usuarioSesion);
    }
    
    // Actualizar UI
    if (typeof actualizarUIUsuario === 'function') {
        actualizarUIUsuario();
    }
    
    mostrarNotificacion(`¡Bienvenido, ${usuario.nombre}!`, 'success');
    return true;
}

// ============================================
// CERRAR SESIÓN
// ============================================
function cerrarSesion() {
    sessionStorage.removeItem('axon_usuario_actual');
    if (typeof window.actualizarUsuarioGlobal === 'function') {
        window.actualizarUsuarioGlobal(null);
    }
    if (typeof actualizarUIUsuario === 'function') {
        actualizarUIUsuario();
    }
    mostrarNotificacion('Sesión cerrada', 'success');
    window.location.hash = 'inicio';
}

// ============================================
// OBTENER USUARIO ACTUAL
// ============================================
function obtenerUsuarioActual() {
    const stored = sessionStorage.getItem('axon_usuario_actual');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch(e) {
            return null;
        }
    }
    return null;
}

// ============================================
// VERIFICAR SESIÓN ACTIVA
// ============================================
function haySesionActiva() {
    return obtenerUsuarioActual() !== null;
}

// ============================================
// GOOGLE LOGIN (placeholder)
// ============================================
async function iniciarSesionConGoogle() {
    mostrarNotificacion('Google Login - Próximamente disponible', 'info');
    return false;
}

// ============================================
// OTP (placeholder)
// ============================================
async function verificarOTP(email, codigo) {
    return { success: false, message: 'No implementado' };
}

async function reenviarOTP(email) {
    return { success: false, message: 'No implementado' };
}

// ============================================
// NOTIFICACIONES
// ============================================
function mostrarNotificacion(mensaje, tipo = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:1000;display:flex;flex-direction:column;gap:10px;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    const bgColor = tipo === 'success' ? 'rgba(0,255,136,0.95)' : tipo === 'error' ? 'rgba(255,51,102,0.95)' : 'rgba(0,212,255,0.95)';
    toast.style.cssText = `background:${bgColor};color:white;padding:12px 20px;border-radius:8px;font-size:14px;animation:slideInRight 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.2);`;
    toast.textContent = mensaje;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// ACTUALIZAR UI
// ============================================
function actualizarUIUsuario() {
    const user = obtenerUsuarioActual();
    const userNameSpan = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const registroLink = document.getElementById('registroNavLink');
    const loginLink = document.getElementById('loginNavLink');
    const logoutLink = document.getElementById('logoutNavLink');
    const subirLink = document.getElementById('subirNavLink');
    
    console.log('Actualizando UI, usuario:', user);
    
    if (user) {
        if (userNameSpan) userNameSpan.textContent = user.nombre;
        if (userAvatar) userAvatar.innerHTML = `<span>${user.nombre.charAt(0).toUpperCase()}</span>`;
        if (registroLink) registroLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'flex';
        if (subirLink) subirLink.style.display = 'flex';
    } else {
        if (userNameSpan) userNameSpan.textContent = 'Invitado';
        if (userAvatar) userAvatar.innerHTML = '<span>👤</span>';
        if (registroLink) registroLink.style.display = 'flex';
        if (loginLink) loginLink.style.display = 'flex';
        if (logoutLink) logoutLink.style.display = 'none';
        if (subirLink) subirLink.style.display = 'none';
    }
}

// ============================================
// FUNCIONES GLOBALES
// ============================================
window.registrarUsuario = registrarUsuario;
window.iniciarSesion = iniciarSesion;
window.cerrarSesion = cerrarSesion;
window.obtenerUsuarioActual = obtenerUsuarioActual;
window.haySesionActiva = haySesionActiva;
window.iniciarSesionConGoogle = iniciarSesionConGoogle;
window.verificarOTP = verificarOTP;
window.reenviarOTP = reenviarOTP;
window.medirFortalezaContrasena = medirFortalezaContrasena;
window.actualizarUIUsuario = actualizarUIUsuario;
window.mostrarNotificacion = mostrarNotificacion;

// Cargar usuario al iniciar
document.addEventListener('DOMContentLoaded', function() {
    actualizarUIUsuario();
});

console.log('✅ Auth.js cargado correctamente');