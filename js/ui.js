// js/ui.js - UI y renderizado

let usuarioActual = null;

// ============================================
// SISTEMA DE USUARIOS
// ============================================
function cargarSesion() {
    const saved = sessionStorage.getItem('axon_usuario_actual');
    if (saved) {
        try {
            usuarioActual = JSON.parse(saved);
        } catch(e) {
            usuarioActual = null;
        }
    }
    actualizarUIUsuario();
    return usuarioActual;
}

function iniciarSesion(email, password) {
    const usuarios = JSON.parse(localStorage.getItem('axon_usuarios') || '[]');
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        usuarioActual = { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
        sessionStorage.setItem('axon_usuario_actual', JSON.stringify(usuarioActual));
        actualizarUIUsuario();
        mostrarNotificacion(`¡Bienvenido, ${usuario.nombre}!`, 'success');
        return true;
    }
    mostrarNotificacion('Credenciales incorrectas', 'error');
    return false;
}

function registrarUsuario(nombre, email, password) {
    const usuarios = JSON.parse(localStorage.getItem('axon_usuarios') || '[]');
    
    if (usuarios.find(u => u.email === email)) {
        mostrarNotificacion('El email ya está registrado', 'error');
        return false;
    }
    
    const nuevoUsuario = {
        id: 'user_' + Date.now(),
        nombre: nombre,
        email: email,
        password: password
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('axon_usuarios', JSON.stringify(usuarios));
    
    usuarioActual = { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email };
    sessionStorage.setItem('axon_usuario_actual', JSON.stringify(usuarioActual));
    actualizarUIUsuario();
    mostrarNotificacion('Registro exitoso!', 'success');
    return true;
}

function cerrarSesion() {
    usuarioActual = null;
    sessionStorage.removeItem('axon_usuario_actual');
    actualizarUIUsuario();
    mostrarNotificacion('Sesión cerrada', 'info');
    window.location.hash = 'inicio';
}

function actualizarUIUsuario() {
    const userNameSpan = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const registroLink = document.getElementById('registroNavLink');
    const loginLink = document.getElementById('loginNavLink');
    const logoutLink = document.getElementById('logoutNavLink');
    const subirLink = document.getElementById('subirNavLink');
    
    if (usuarioActual) {
        if (userNameSpan) userNameSpan.textContent = usuarioActual.nombre;
        if (userAvatar) userAvatar.innerHTML = `<span>${usuarioActual.nombre.charAt(0).toUpperCase()}</span>`;
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
// RENDERIZADO DE PÁGINAS
// ============================================

function renderizarTarjetaLab(lab) {
    let categoriaNombre = lab.categoriaNombre || getCategoriaById(lab.categoria)?.nombre || '📚 General';
    let categoriaColor = getCategoriaById(lab.categoria)?.color || '#00d4ff';
    let imagenIcono = lab.imagen || getCategoriaById(lab.categoria)?.icono || '📚';
    const tieneArchivo = lab.archivo && lab.archivo.data;
    
    // Verificar si el usuario actual es el dueño del laboratorio
    let userActual = null;
    try {
        const stored = sessionStorage.getItem('axon_usuario_actual');
        if (stored) userActual = JSON.parse(stored);
    } catch(e) {}
    
    const esAdmin = userActual && userActual.email === 'admin@axon.edu';
    const esPropietario = userActual && (userActual.email === lab.email || userActual.nombre === lab.autor);
    const puedeEliminar = esAdmin || esPropietario;
    
    return `
        <div class="lab-card" data-id="${lab.id}" id="lab-card-${lab.id}">
            <div class="lab-card-image">
                <span style="font-size: 3rem;">${imagenIcono}</span>
                ${tieneArchivo ? '<span style="position: absolute; bottom: 5px; right: 5px; font-size: 0.8rem;">📎</span>' : ''}
            </div>
            <div class="lab-card-content">
                <span class="lab-card-category" style="background: ${categoriaColor}20; color: ${categoriaColor};">
                    ${categoriaNombre}
                </span>
                <h3 class="lab-card-title">${escapeHtml(lab.titulo)}</h3>
                <p class="lab-card-author">👨‍🏫 ${escapeHtml(lab.autor)}</p>
                <p class="lab-card-description">${escapeHtml(lab.descripcion.substring(0, 100))}${lab.descripcion.length > 100 ? '...' : ''}</p>
                <div class="lab-card-stats">
                    <span>📅 ${formatearFecha(lab.fecha)}</span>
                    <span>⬇️ ${lab.downloads || 0} descargas</span>
                    <span>${tieneArchivo ? `📄 ${lab.archivo.nombre.split('.').pop().toUpperCase()}` : '📄 Archivo'}</span>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
                    <button class="btn btn-sm btn-primary ver-detalle" data-id="${lab.id}">👁️ Ver Detalles</button>
                    ${tieneArchivo ? 
                        `<button class="btn btn-sm btn-success descargar-lab" data-id="${lab.id}">📥 Descargar</button>` : 
                        `<button class="btn btn-sm btn-outline" disabled style="opacity:0.5;">📥 Sin archivo</button>`
                    }
                    ${puedeEliminar ? 
                        `<button class="btn btn-sm eliminar-lab" data-id="${lab.id}" data-titulo="${escapeHtml(lab.titulo)}" style="background: #ff3366; color: white; border: none; border-radius: 0.5rem; padding: 0.5rem 1rem; cursor: pointer;">🗑️ Eliminar</button>` : 
                        ''
                    }
                </div>
            </div>
        </div>
    `;
}

function renderizarInicio() {
    const stats = obtenerEstadisticas();
    const labs = obtenerLaboratorios();
    const ultimos = labs.slice(0, 6);
    
    return `
        <div style="padding: 2rem 0;">
            <div style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-bottom: 4rem;">
                    <div>
                        <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">AXON <span style="color: #00d4ff;">Labs</span></h1>
                        <p style="font-size: 1.25rem; color: #a0a0b0; margin-bottom: 1rem;">Repositorio Académico Profesional</p>
                        <p style="color: #6b6b7a; margin-bottom: 2rem;">Comparte, descubre y aprende con la comunidad académica más grande.</p>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="window.location.hash='laboratorios'">📚 Explorar Laboratorios</button>
                            <button class="btn btn-outline" onclick="window.location.hash='subir'">📤 Subir Laboratorio</button>
                        </div>
                        <div style="display: flex; gap: 2rem; margin-top: 2rem;">
                            <div><div style="font-size: 1.5rem; font-weight: bold; color: #00d4ff;">${stats.totalLabs}+</div><div style="font-size: 0.875rem; color: #6b6b7a;">Laboratorios</div></div>
                            <div><div style="font-size: 1.5rem; font-weight: bold; color: #00d4ff;">${stats.totalDownloads}+</div><div style="font-size: 0.875rem; color: #6b6b7a;">Descargas</div></div>
                            <div><div style="font-size: 1.5rem; font-weight: bold; color: #00d4ff;">${CATEGORIAS.length}</div><div style="font-size: 0.875rem; color: #6b6b7a;">Categorías</div></div>
                        </div>
                    </div>
                    <div style="text-align: center; font-size: 8rem;">🧠📚🚀</div>
                </div>
                
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h2>📌 Últimos Laboratorios</h2>
                    <p style="color: #6b6b7a;">Descubre los recursos más recientes</p>
                </div>
                <div class="labs-grid">
                    ${ultimos.map(lab => renderizarTarjetaLab(lab)).join('')}
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <button class="btn btn-outline" onclick="window.location.hash='laboratorios'">Ver todos los laboratorios →</button>
                </div>
            </div>
        </div>
    `;
}

function renderizarLaboratorios(termino = '', categoria = '') {
    const labs = buscarLaboratorios(termino, categoria);
    
    return `
        <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1>📚 Biblioteca de Laboratorios</h1>
                <p style="color: #6b6b7a;">Explora nuestra colección de recursos académicos</p>
            </div>
            
            <div style="background: var(--bg-card); border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <span style="font-size: 1.25rem;">🔍</span>
                    <input type="text" id="searchInput" placeholder="Buscar por título, autor o descripción..." 
                           value="${escapeHtml(termino)}"
                           style="flex:1; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 0.75rem; color: white; outline: none;">
                    <button id="clearSearchBtn" style="background: none; border: none; color: #6b6b7a; cursor: pointer; font-size: 1.25rem;">✖</button>
                </div>
                
                <div class="filter-group" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="filter-chip ${categoria === '' ? 'active' : ''}" data-categoria="">Todos</button>
                    ${CATEGORIAS.map(cat => `
                        <button class="filter-chip ${categoria === cat.id ? 'active' : ''}" data-categoria="${cat.id}">${cat.nombre}</button>
                    `).join('')}
                </div>
                
                <div style="margin-top: 1rem; color: #6b6b7a;">
                    <span>📊 ${labs.length} laboratorios encontrados</span>
                    ${termino ? `<span style="margin-left: 1rem;">🔍 Buscando: "${escapeHtml(termino)}"</span>` : ''}
                </div>
            </div>
            
            <div class="labs-grid" id="labsContainer">
                ${labs.length > 0 ? labs.map(lab => renderizarTarjetaLab(lab)).join('') : 
                  '<div style="text-align:center; padding:3rem; grid-column: 1/-1;"><span style="font-size:3rem;">🔍</span><h3>No se encontraron laboratorios</h3><p style="color:#6b6b7a;">Intenta con otros términos de búsqueda</p></div>'}
            </div>
        </div>
    `;
}

function renderizarSubir() {
    if (!usuarioActual) {
        return `
            <div style="max-width: 500px; margin: 2rem auto; text-align: center;">
                <div style="background: var(--bg-card); border-radius: 1rem; padding: 2rem;">
                    <span style="font-size: 4rem;">🔒</span>
                    <h2>Acceso Restringido</h2>
                    <p>Debes iniciar sesión para subir laboratorios</p>
                    <button class="btn btn-primary" onclick="window.location.hash='login'">Iniciar Sesión</button>
                </div>
            </div>
        `;
    }
    
    return `
        <div style="max-width: 600px; margin: 2rem auto;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1>📤 Compartir Laboratorio</h1>
                <p style="color: #6b6b7a;">Comparte tu conocimiento con la comunidad</p>
            </div>
            
            <div style="background: var(--bg-card); border-radius: 1rem; padding: 2rem;">
                <form id="uploadForm">
                    <div class="form-group">
                        <label class="form-label required">Título del Laboratorio</label>
                        <input type="text" id="labTitulo" class="form-input" placeholder="Ej: Introducción a la Ciberseguridad" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Descripción</label>
                        <textarea id="labDescripcion" class="form-textarea" rows="5" placeholder="Describe el contenido..." required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Autor(es)</label>
                        <input type="text" id="labAutor" class="form-input" value="${escapeHtml(usuarioActual.nombre)}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Categoría</label>
                        <select id="labCategoria" class="form-select" required>
                            <option value="">Seleccionar categoría</option>
                            ${CATEGORIAS.map(cat => `<option value="${cat.id}">${cat.nombre}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">📁 Seleccionar archivo (PDF, ZIP, DOC, DOCX)</label>
                        <input type="file" id="labArchivoFile" class="form-input" accept=".pdf,.zip,.doc,.docx" required>
                        <small class="form-help">Máximo 10MB. Formatos permitidos: PDF, ZIP, DOC, DOCX</small>
                    </div>
                    
                    <div id="previewArchivo" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(0,245,255,0.1); border-radius: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <span style="font-size: 2rem;">📄</span>
                            <div style="flex: 1;">
                                <div id="previewNombre" style="font-weight: 500;"></div>
                                <div id="previewTamaño" style="font-size: 0.875rem; color: #6b6b7a;"></div>
                            </div>
                            <span id="previewTipo" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: rgba(0,212,255,0.2); border-radius: 0.5rem;"></span>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 1rem;">
                        🚀 Publicar Laboratorio
                    </button>
                </form>
            </div>
        </div>
    `;
}

function renderizarDetalle(labId) {
    const lab = obtenerLaboratorioPorId(labId);
    
    if (!lab) {
        return `
            <div style="max-width: 500px; margin: 2rem auto; text-align: center;">
                <div style="background: var(--bg-card); border-radius: 1rem; padding: 2rem;">
                    <span style="font-size: 4rem;">❌</span>
                    <h2>Laboratorio no encontrado</h2>
                    <button class="btn btn-primary" onclick="window.location.hash='laboratorios'">Volver</button>
                </div>
            </div>
        `;
    }
    
    const categoria = getCategoriaById(lab.categoria);
    const isOwner = usuarioActual && (usuarioActual.email === lab.email || usuarioActual.nombre === lab.autor);
    const tieneArchivo = lab.archivo && lab.archivo.data;
    
    return `
        <div style="max-width: 800px; margin: 2rem auto;">
            <button class="btn btn-outline" onclick="window.location.hash='laboratorios'" style="margin-bottom: 1rem;">← Volver</button>
            
            <div style="background: var(--bg-card); border-radius: 1rem; padding: 2rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <span style="background: ${categoria.color}20; color: ${categoria.color}; padding: 0.25rem 0.75rem; border-radius: 2rem;">${categoria.nombre}</span>
                    <div style="color: #6b6b7a;">⬇️ ${lab.downloads || 0} descargas | 📅 ${formatearFecha(lab.fecha)}</div>
                </div>
                
                <h1 style="font-size: 2rem; margin-bottom: 1rem;">${escapeHtml(lab.titulo)}</h1>
                
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #00d4ff, #b300ff); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">👨‍🏫</div>
                    <div><div style="font-weight: 600;">${escapeHtml(lab.autor)}</div><div style="color: #6b6b7a; font-size: 0.875rem;">${escapeHtml(lab.email)}</div></div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3>📝 Descripción</h3>
                    <p style="color: #a0a0b0;">${escapeHtml(lab.descripcion)}</p>
                </div>
                
                <div style="margin-bottom: 2rem; padding: 1rem; background: rgba(0,245,255,0.05); border-radius: 0.5rem;">
                    <h3>📄 Información del Archivo</h3>
                    <p><strong>Nombre:</strong> ${escapeHtml(tieneArchivo ? lab.archivo.nombre : lab.archivo || 'No disponible')}<br>
                    <strong>Tamaño:</strong> ${tieneArchivo ? (lab.archivo.tamaño / 1024 / 1024).toFixed(2) + ' MB' : lab.tamanio || 'Desconocido'}</p>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    ${tieneArchivo ? 
                        `<button class="btn btn-primary" id="downloadBtn" data-id="${lab.id}">📥 Descargar Laboratorio</button>` : 
                        `<button class="btn btn-outline" disabled style="opacity:0.5;">📥 Archivo no disponible</button>`
                    }
                    ${isOwner ? `<button class="btn btn-error" id="deleteBtn" data-id="${lab.id}">🗑️ Eliminar</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderizarCategorias() {
    const labs = obtenerLaboratorios();
    const counts = {};
    labs.forEach(lab => { counts[lab.categoria] = (counts[lab.categoria] || 0) + 1; });
    
    return `
        <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1>🏷️ Explorar por Categorías</h1>
                <p style="color: #6b6b7a;">Encuentra laboratorios según tu área de interés</p>
            </div>
            
            <div class="categories-grid">
                ${CATEGORIAS.map(cat => `
                    <div class="category-card" data-categoria="${cat.id}" style="cursor: pointer; text-align: center; padding: 1.5rem; background: var(--bg-card); border-radius: 1rem;">
                        <div style="font-size: 3rem;">${cat.icono}</div>
                        <h3>${cat.nombre}</h3>
                        <p style="color: #6b6b7a;">${counts[cat.id] || 0} laboratorios</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderizarLogin() {
    if (usuarioActual) {
        return `
            <div style="max-width: 500px; margin: 2rem auto; text-align: center;">
                <div style="background: var(--bg-card); border-radius: 1rem; padding: 2rem;">
                    <span style="font-size: 4rem;">✅</span>
                    <h2>Sesión Activa</h2>
                    <p>Bienvenido, ${usuarioActual.nombre}</p>
                    <button class="btn btn-primary" onclick="window.location.hash='inicio'">Ir al inicio</button>
                </div>
            </div>
        `;
    }
    
    return `
        <div style="max-width: 500px; margin: 2rem auto;">
            <div style="background: var(--bg-card); border-radius: 1rem; padding: 2rem;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <span style="font-size: 3rem;">🔑</span>
                    <h2>Iniciar Sesión</h2>
                    <p style="color: #6b6b7a;">Accede a tu cuenta de AXON Labs</p>
                </div>
                
                <form id="loginForm">
                    <div class="form-group">
                        <label class="form-label required">Correo electrónico</label>
                        <input type="email" id="loginEmail" class="form-input" placeholder="ejemplo@axon.edu" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Contraseña</label>
                        <input type="password" id="loginPassword" class="form-input" placeholder="Tu contraseña" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-lg" style="width:100%">🔐 Iniciar Sesión</button>
                </form>
                
                <p style="text-align: center; margin-top: 1rem;">¿No tienes cuenta? <a href="#" onclick="window.location.hash='registro'; return false;">Regístrate aquí</a></p>
            </div>
        </div>
    `;
}

if (page === 'registro') {
    const form = document.getElementById('registerForm');
    if (form) {
        const nuevoForm = form.cloneNode(true);
        form.parentNode.replaceChild(nuevoForm, form);
        const formFinal = document.getElementById('registerForm');
        
        // Medidor de fuerza de contraseña
        const passInput = document.getElementById('regPassword');
        if (passInput) {
            passInput.addEventListener('input', function() {
                const strength = medirFortalezaContrasena(this.value);
                const strengthDiv = document.getElementById('passwordStrength');
                if (strengthDiv) {
                    strengthDiv.innerHTML = `<span style="color: ${strength.color};">${strength.text}</span>`;
                }
            });
        }
        
        formFinal.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('regNombre')?.value.trim();
            const email = document.getElementById('regEmail')?.value.trim();
            const password = document.getElementById('regPassword')?.value;
            const confirm = document.getElementById('regConfirm')?.value;
            const terms = document.getElementById('regTerms')?.checked;
            
            if (!terms) {
                mostrarNotificacion('Debes aceptar los términos y condiciones', 'error');
                return;
            }
            
            const result = await registrarUsuario(nombre, email, password, confirm);
            
            if (result.success) {
                if (result.necesitaVerificacion) {
                    mostrarNotificacion(result.message, 'success');
                    setTimeout(() => {
                        window.location.hash = `verificacion?email=${encodeURIComponent(email)}`;
                    }, 1500);
                } else {
                    mostrarNotificacion(result.message, 'success');
                    setTimeout(() => {
                        window.location.hash = 'inicio';
                    }, 1500);
                }
            } else {
                mostrarNotificacion(result.message, 'error');
            }
        });
    }
}
if (page === 'login') {
    const form = document.getElementById('loginForm');
    if (form) {
        const nuevoForm = form.cloneNode(true);
        form.parentNode.replaceChild(nuevoForm, form);
        const formFinal = document.getElementById('loginForm');
        
        formFinal.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail')?.value.trim();
            const password = document.getElementById('loginPassword')?.value;
            
            const result = await iniciarSesion(email, password);
            
            if (result.success) {
                mostrarNotificacion(result.message, 'success');
                setTimeout(() => {
                    window.location.hash = 'inicio';
                    location.reload();
                }, 1000);
            } else {
                mostrarNotificacion(result.message, 'error');
            }
        });
    }
}

function renderizarRegistro() {
    if (usuarioActual) {
        return `
            <div style="max-width: 500px; margin: 2rem auto; text-align: center;">
                <div style="background: var(--bg-card); border-radius: 1rem; padding: 2rem;">
                    <span style="font-size: 4rem;">✅</span>
                    <h2>Ya tienes sesión activa</h2>
                    <p>Estás logueado como ${usuarioActual.nombre}</p>
                    <button class="btn btn-primary" onclick="window.location.hash='inicio'">Ir al inicio</button>
                </div>
            </div>
        `;
    }
    
    return `
        <div style="max-width: 500px; margin: 2rem auto;">
            <div style="background: var(--bg-card); border-radius: 1rem; padding: 2rem;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <span style="font-size: 3rem;">📝</span>
                    <h2>Crear Cuenta</h2>
                    <p style="color: #6b6b7a;">Únete a la comunidad académica</p>
                </div>
                
                <form id="registerForm">
                    <div class="form-group">
                        <label class="form-label required">Nombre completo</label>
                        <input type="text" id="regNombre" class="form-input" placeholder="Ej: Juan Pérez" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Correo electrónico</label>
                        <input type="email" id="regEmail" class="form-input" placeholder="ejemplo@correo.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Contraseña</label>
                        <input type="password" id="regPassword" class="form-input" required>
                        <div id="passwordStrength" style="margin-top: 0.5rem; font-size: 0.8rem;"></div>
                        <small class="form-help">Mínimo 6 caracteres</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Confirmar contraseña</label>
                        <input type="password" id="regConfirm" class="form-input" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-lg" style="width:100%">📝 Registrarse</button>
                    <div id="msgRegistro" style="margin-top: 1rem;"></div>
                </form>
                
                <p style="text-align: center; margin-top: 1rem;">
                    ¿Ya tienes cuenta? <a href="#" onclick="window.location.hash='login'; return false;">Iniciar sesión</a>
                </p>
            </div>
        </div>
    `;
}