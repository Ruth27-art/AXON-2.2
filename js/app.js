// js/app.js - Aplicación principal

function initApp() {
    console.log('🚀 Iniciando AXON Labs...');
    
    initLaboratorios();
    cargarSesion();
    
    const savedTheme = localStorage.getItem('axon_theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    
    setupEventListeners();
    
    const initialPage = window.location.hash.slice(1).split('?')[0] || 'inicio';
    loadPage(initialPage);
}

function setupEventListeners() {
    window.addEventListener('hashchange', () => {
        const page = window.location.hash.slice(1).split('?')[0] || 'inicio';
        loadPage(page);
    });
    
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // Botones de descarga
    document.querySelectorAll('.descargar-lab').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const labId = this.dataset.id;
        const labs = obtenerLaboratorios();
        const lab = labs.find(l => l.id === labId);
        
        if (lab && lab.archivo && lab.archivo.data) {
            // Crear enlace para descargar
            const link = document.createElement('a');
            link.href = lab.archivo.data;
            link.download = lab.archivo.nombre;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Incrementar contador
            incrementarDescargas(labId);
            mostrarNotificacion(`Descargando: ${lab.archivo.nombre}`, 'success');
        } else {
            mostrarNotificacion('Error: Archivo no encontrado', 'error');
        }
    });
});
    
    const logoutBtn = document.getElementById('logoutNavLink');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('axon_theme', isLight ? 'light' : 'dark');
        });
    }
}

function loadPage(page) {
    const contentDiv = document.getElementById('page-content');
    if (!contentDiv) return;
    
    let html = '';
    let searchTerm = '';
    let categoria = '';
    
    // Extraer parámetros de búsqueda
    const hash = window.location.hash;
    if (hash.includes('?')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        searchTerm = params.get('search') || '';
        categoria = params.get('cat') || '';
        page = hash.slice(1).split('?')[0];
    }
    
    // Determinar qué página renderizar
    switch(page) {
        case 'inicio': 
            html = renderizarInicio(); 
            break;
        case 'laboratorios': 
            html = renderizarLaboratorios(searchTerm, categoria); 
            break;
        case 'subir': 
            html = renderizarSubir(); 
            break;
        case 'registro': 
            html = renderizarRegistro(); 
            break;
        case 'login': 
            html = renderizarLogin(); 
            break;
        case 'categorias': 
            html = renderizarCategorias(); 
            break;
        case 'detalle': 
            const labId = new URLSearchParams(window.location.hash.split('?')[1] || '').get('id');
            html = renderizarDetalle(labId);
            break;
        default: 
            html = renderizarInicio();
    }
    
    contentDiv.innerHTML = html;
    
    // Actualizar clase activa en el menú
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Configurar eventos después de cargar el HTML
    setTimeout(() => {
        configurarEventosDePagina(page);
    }, 50);
}

function configurarEventosDePagina(page) {
    console.log('Configurando eventos para:', page);
    
    // ============================================
    // LABORATORIOS - BUSCADOR Y FILTROS
    // ============================================
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
            
            if (!nombre || !email || !password || !confirm) {
                mostrarNotificacion('Completa todos los campos', 'error');
                return;
            }
            
            if (password !== confirm) {
                mostrarNotificacion('Las contraseñas no coinciden', 'error');
                return;
            }
            
            if (password.length < 6) {
                mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            // Deshabilitar botón
            const btn = formFinal.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '⏳ Registrando...';
            btn.disabled = true;
            
            // Registrar usuario
            const result = await window.registrarUsuario(nombre, email, password);
            
            if (result === true) {
                setTimeout(() => {
                    window.location.hash = 'inicio';
                    location.reload();
                }, 1500);
            } else {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
}
    
   // ============================================
// SUBIR LABORATORIO - VERSIÓN CORREGIDA
// ============================================
if (page === 'subir') {
    const form = document.getElementById('uploadForm');
    if (form) {
        const nuevoForm = form.cloneNode(true);
        form.parentNode.replaceChild(nuevoForm, form);
        const formFinal = document.getElementById('uploadForm');
        
        // Preview del archivo seleccionado
        const fileInput = document.getElementById('labArchivoFile');
        const previewDiv = document.getElementById('previewArchivo');
        const previewNombre = document.getElementById('previewNombre');
        const previewTamaño = document.getElementById('previewTamaño');
        const previewTipo = document.getElementById('previewTipo');
        
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
                    const fileExt = file.name.split('.').pop().toUpperCase();
                    previewNombre.textContent = file.name;
                    previewTamaño.textContent = `${sizeMB} MB`;
                    previewTipo.textContent = fileExt;
                    previewDiv.style.display = 'block';
                } else {
                    previewDiv.style.display = 'none';
                }
            });
        }
        
        formFinal.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const titulo = document.getElementById('labTitulo')?.value.trim();
            const descripcion = document.getElementById('labDescripcion')?.value.trim();
            const autor = document.getElementById('labAutor')?.value.trim();
            const categoria = document.getElementById('labCategoria')?.value;
            const archivo = fileInput?.files[0];
            
            if (!titulo || !descripcion || !autor || !categoria) {
                mostrarNotificacion('Completa todos los campos', 'error');
                return;
            }
            
            if (!archivo) {
                mostrarNotificacion('Selecciona un archivo para subir', 'error');
                return;
            }
            
            if (archivo.size > 10 * 1024 * 1024) {
                mostrarNotificacion('El archivo no debe superar los 10MB', 'error');
                return;
            }
            
            const extensiones = ['pdf', 'zip', 'doc', 'docx'];
            const extension = archivo.name.split('.').pop().toLowerCase();
            if (!extensiones.includes(extension)) {
                mostrarNotificacion('Formato no permitido. Usa PDF, ZIP, DOC o DOCX', 'error');
                return;
            }
            
            const btn = formFinal.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = '⏳ Subiendo archivo...';
            btn.disabled = true;
            
            try {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const archivoData = {
                        nombre: archivo.name,
                        tamaño: archivo.size,
                        tipo: archivo.type,
                        data: e.target.result
                    };
                    
                    const categoriasMap = {
                        'seguridad': '🔒 Seguridad Web',
                        'crypto': '🔐 Criptografía',
                        'redes': '🌐 Redes',
                        'malware': '🐛 Análisis de Malware',
                        'forensica': '🔍 Forensica Digital',
                        'programacion': '💻 Programación',
                        'ia': '🧠 Inteligencia Artificial'
                    };
                    
                    const getEmoji = (cat) => {
                        const emojis = { 'seguridad': '🔒', 'crypto': '🔐', 'redes': '🌐', 'malware': '🐛', 'forensica': '🔍', 'programacion': '💻', 'ia': '🧠' };
                        return emojis[cat] || '📚';
                    };
                    
                    const nuevoLab = {
                        id: 'lab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
                        titulo: titulo,
                        descripcion: descripcion,
                        autor: autor,
                        categoria: categoria,
                        categoriaNombre: categoriasMap[categoria] || '📚 General',
                        email: usuarioActual?.email || 'anonimo@axon.edu',
                        archivo: archivoData,
                        downloads: 0,
                        fecha: new Date().toISOString().split('T')[0],
                        imagen: getEmoji(categoria)
                    };
                    
                    const labs = JSON.parse(localStorage.getItem('axon_laboratorios') || '[]');
                    labs.unshift(nuevoLab);
                    localStorage.setItem('axon_laboratorios', JSON.stringify(labs));
                    
                    mostrarNotificacion('Laboratorio publicado exitosamente!', 'success');
                    formFinal.reset();
                    if (previewDiv) previewDiv.style.display = 'none';
                    
                    setTimeout(() => {
                        window.location.hash = 'laboratorios';
                    }, 1500);
                };
                reader.readAsDataURL(archivo);
                
            } catch (error) {
                console.error('Error:', error);
                mostrarNotificacion('Error al subir el archivo', 'error');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
}
    
    // ============================================
    // DETALLE
    // ============================================
    if (page === 'detalle') {
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            const nuevoBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(nuevoBtn, downloadBtn);
            const btnFinal = document.getElementById('downloadBtn');
            
            btnFinal.addEventListener('click', function() {
                incrementarDescargas(this.dataset.id);
                const lab = obtenerLaboratorioPorId(this.dataset.id);
                mostrarNotificacion(`Descargando: ${lab?.archivo}`, 'success');
            });
        }
        
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            const nuevoDelete = deleteBtn.cloneNode(true);
            deleteBtn.parentNode.replaceChild(nuevoDelete, deleteBtn);
            const deleteFinal = document.getElementById('deleteBtn');
            
            deleteFinal.addEventListener('click', function() {
                if (confirm('¿Eliminar este laboratorio?')) {
                    eliminarLaboratorio(this.dataset.id);
                    mostrarNotificacion('Laboratorio eliminado', 'success');
                    setTimeout(() => window.location.hash = 'laboratorios', 1000);
                }
            });
        }
    }
    
    // ============================================
    // REGISTRO
    // ============================================
    if (page === 'registro') {
        const form = document.getElementById('registerForm');
        if (form) {
            const nuevoForm = form.cloneNode(true);
            form.parentNode.replaceChild(nuevoForm, form);
            const formFinal = document.getElementById('registerForm');
            
            formFinal.addEventListener('submit', function(e) {
                e.preventDefault();
                const nombre = document.getElementById('regNombre')?.value;
                const email = document.getElementById('regEmail')?.value;
                const password = document.getElementById('regPassword')?.value;
                const confirm = document.getElementById('regConfirm')?.value;
                
                if (password !== confirm) {
                    mostrarNotificacion('Las contraseñas no coinciden', 'error');
                    return;
                }
                if (password.length < 6) {
                    mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error');
                    return;
                }
                if (registrarUsuario(nombre, email, password)) {
                    setTimeout(() => window.location.hash = 'inicio', 1500);
                }
            });
        }
    }
    
    // ============================================
    // LOGIN
    // ============================================
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
            
            if (!email || !password) {
                mostrarNotificacion('Completa todos los campos', 'error');
                return;
            }
            
            const btn = formFinal.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '⏳ Ingresando...';
            btn.disabled = true;
            
            const result = await window.iniciarSesion(email, password);
            
            if (result === true) {
                setTimeout(() => {
                    window.location.hash = 'inicio';
                    location.reload();
                }, 1000);
            } else {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
}
    // ============================================
    // CATEGORÍAS
    // ============================================
    if (page === 'categorias') {
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const nuevaCard = card.cloneNode(true);
            card.parentNode.replaceChild(nuevaCard, card);
            
            nuevaCard.addEventListener('click', function() {
                window.location.hash = `laboratorios?cat=${this.dataset.categoria}`;
            });
        });
    }
}

// ============================================
// FUNCIONES PARA ELIMINAR LABORATORIOS
// ============================================

function reconectarBotonesLaboratorios() {
    console.log('Reconectando botones de laboratorios...');
    
    // Botones "Ver Detalles"
    document.querySelectorAll('.ver-detalle').forEach(btn => {
        btn.removeEventListener('click', btn._detalleListener);
        btn._detalleListener = function() {
            window.location.hash = `detalle?id=${this.dataset.id}`;
        };
        btn.addEventListener('click', btn._detalleListener);
    });
    
    // Botones "Descargar"
    document.querySelectorAll('.descargar-lab').forEach(btn => {
        btn.removeEventListener('click', btn._descargaListener);
        btn._descargaListener = function() {
            const lab = obtenerLaboratorioPorId(this.dataset.id);
            if (lab) {
                incrementarDescargas(this.dataset.id);
                mostrarNotificacion(`Descargando: ${lab.archivo || lab.titulo}`, 'success');
            } else {
                mostrarNotificacion('Error: Laboratorio no encontrado', 'error');
            }
        };
        btn.addEventListener('click', btn._descargaListener);
    });
    
    // Botones "Eliminar" - NUEVO
    document.querySelectorAll('.eliminar-lab').forEach(btn => {
        btn.removeEventListener('click', btn._eliminarListener);
        btn._eliminarListener = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const labId = this.dataset.id;
            const labTitulo = this.dataset.titulo;
            confirmarYEliminar(labId, labTitulo);
        };
        btn.addEventListener('click', btn._eliminarListener);
    });
}

// Función para confirmar y eliminar
function confirmarYEliminar(labId, labTitulo) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'deleteOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
    `;
    
    overlay.innerHTML = `
        <div style="
            background: var(--bg-card);
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            border: 1px solid #ff3366;
            animation: fadeInUp 0.3s ease;
        ">
            <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
            <h2 style="margin-bottom: 1rem;">¿Eliminar laboratorio?</h2>
            <p style="color: #a0a0b0; margin-bottom: 1.5rem;">
                ¿Estás seguro de que quieres eliminar<br>
                <strong style="color: #ff3366;">"${escapeHtml(labTitulo)}"</strong>?<br>
                Esta acción no se puede deshacer.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="btnConfirmarDelete" class="btn btn-error" style="background: #ff3366; color: white;">
                    🗑️ Sí, eliminar
                </button>
                <button id="btnCancelarDelete" class="btn btn-outline">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Evento confirmar
    document.getElementById('btnConfirmarDelete').onclick = function() {
        eliminarLaboratorioReal(labId);
        overlay.remove();
    };
    
    // Evento cancelar
    document.getElementById('btnCancelarDelete').onclick = function() {
        overlay.remove();
    };
    
    // Cerrar al hacer clic fuera
    overlay.onclick = function(e) {
        if (e.target === overlay) overlay.remove();
    };
}

// Función real para eliminar
function eliminarLaboratorioReal(labId) {
    console.log('Eliminando laboratorio:', labId);
    
    // Obtener laboratorios
    let labs = localStorage.getItem('axon_laboratorios');
    if (!labs) {
        mostrarNotificacion('Error: No hay laboratorios', 'error');
        return;
    }
    
    labs = JSON.parse(labs);
    const labAEliminar = labs.find(l => l.id === labId);
    
    if (!labAEliminar) {
        mostrarNotificacion('Laboratorio no encontrado', 'error');
        return;
    }
    
    // Verificar permisos
    const userActual = obtenerUsuarioActual();
    const esAdmin = userActual && userActual.email === 'admin@axon.edu';
    const esPropietario = userActual && (userActual.email === labAEliminar.email || userActual.nombre === labAEliminar.autor);
    
    if (!esAdmin && !esPropietario) {
        mostrarNotificacion('No tienes permiso para eliminar este laboratorio', 'error');
        return;
    }
    
    // Filtrar y guardar
    const nuevosLabs = labs.filter(l => l.id !== labId);
    localStorage.setItem('axon_laboratorios', JSON.stringify(nuevosLabs));
    
    mostrarNotificacion(`✅ "${labAEliminar.titulo}" eliminado correctamente`, 'success');
    
    // Recargar la página de laboratorios
    const currentHash = window.location.hash;
    if (currentHash.includes('laboratorios')) {
        // Recargar el contenido
        const termino = document.getElementById('searchInput')?.value || '';
        const categoriaActiva = document.querySelector('.filter-chip.active')?.dataset.categoria || '';
        const nuevoHtml = renderizarLaboratorios(termino, categoriaActiva);
        document.getElementById('page-content').innerHTML = nuevoHtml;
        
        // Reconectar eventos
        setTimeout(() => {
            if (typeof configurarEventosDePagina === 'function') {
                configurarEventosDePagina('laboratorios');
            }
            reconectarBotonesLaboratorios();
        }, 100);
    } else {
        // Redirigir a laboratorios
        setTimeout(() => {
            window.location.hash = 'laboratorios';
        }, 1500);
    }
}

// Función helper para escapar HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para obtener usuario actual (si no existe en auth.js)
if (typeof obtenerUsuarioActual !== 'function') {
    window.obtenerUsuarioActual = function() {
        const stored = sessionStorage.getItem('axon_usuario_actual');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch(e) {
                return null;
            }
        }
        return null;
    };
}



// Función para mostrar modal de confirmación
function mostrarModalConfirmacion(labId, labTitulo) {
    // Crear modal si no existe
    let modal = document.getElementById('modalConfirmacion');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalConfirmacion';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div style="
            background: var(--bg-card);
            border-radius: 1rem;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            text-align: center;
            border: 1px solid var(--color-error);
            animation: fadeInUp 0.3s ease;
        ">
            <span style="font-size: 4rem;">⚠️</span>
            <h2 style="margin: 1rem 0;">¿Eliminar laboratorio?</h2>
            <p style="color: #a0a0b0; margin-bottom: 1.5rem;">
                ¿Estás seguro de que quieres eliminar <strong>"${escapeHtml(labTitulo)}"</strong>?<br>
                Esta acción no se puede deshacer.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="confirmarEliminar" class="btn btn-error" data-id="${labId}">
                    🗑️ Sí, eliminar
                </button>
                <button id="cancelarEliminar" class="btn btn-outline">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Evento de confirmar
    document.getElementById('confirmarEliminar').addEventListener('click', function() {
        const id = this.dataset.id;
        eliminarLaboratorioReal(id);
        modal.style.display = 'none';
    });
    
    // Evento de cancelar
    document.getElementById('cancelarEliminar').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Función real para eliminar laboratorio
function eliminarLaboratorioReal(labId) {
    // Obtener laboratorios actuales
    let labs = obtenerLaboratorios();
    
    // Buscar el laboratorio a eliminar
    const labAEliminar = labs.find(l => l.id === labId);
    
    if (!labAEliminar) {
        mostrarNotificacion('❌ Laboratorio no encontrado', 'error');
        return;
    }
    
    // Verificar permisos nuevamente (seguridad)
    const userActual = obtenerUsuarioActual();
    const esAdmin = userActual && userActual.email === 'admin@axon.edu';
    const esPropietario = userActual && (userActual.email === labAEliminar.email || userActual.nombre === labAEliminar.autor);
    
    if (!esAdmin && !esPropietario) {
        mostrarNotificacion('❌ No tienes permiso para eliminar este laboratorio', 'error');
        return;
    }
    
    // Filtrar para eliminar
    const nuevosLabs = labs.filter(l => l.id !== labId);
    
    // Guardar en localStorage
    guardarLaboratorios(nuevosLabs);
    
    // Mostrar notificación de éxito
    mostrarNotificacion(`✅ "${labAEliminar.titulo}" ha sido eliminado`, 'success');
    
    // Recargar la página actual para actualizar la vista
    const currentPage = window.location.hash.slice(1).split('?')[0] || 'laboratorios';
    if (currentPage === 'laboratorios') {
        // Recargar solo el contenido de laboratorios
        const termino = document.getElementById('searchInput')?.value || '';
        const categoriaActiva = document.querySelector('.filter-chip.active')?.dataset.categoria || '';
        const nuevoHtml = renderizarLaboratorios(termino, categoriaActiva);
        document.getElementById('page-content').innerHTML = nuevoHtml;
        
        // Reconectar eventos
        setTimeout(() => {
            configurarEventosDePagina('laboratorios');
        }, 50);
    } else {
        // Si no está en laboratorios, redirigir
        setTimeout(() => {
            window.location.hash = 'laboratorios';
        }, 1500);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);

// ============================================
// FUNCIONES PARA ELIMINAR LABORATORIOS
// ============================================

// Escuchar clics en toda la página para detectar botones eliminar
function initEliminarBotones() {
    document.body.addEventListener('click', function(e) {
        // Buscar si el clic fue en un botón eliminar o dentro de él
        const eliminarBtn = e.target.closest('.eliminar-lab');
        if (eliminarBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const labId = eliminarBtn.dataset.id;
            const labTitulo = eliminarBtn.dataset.titulo;
            
            // Confirmar con confirm nativo (simple)
            if (confirm(`¿Eliminar "${labTitulo}"? Esta acción no se puede deshacer.`)) {
                eliminarLaboratorioReal(labId);
            }
        }
    });
}

// Función real para eliminar
function eliminarLaboratorioReal(labId) {
    console.log('Eliminando laboratorio:', labId);
    
    // Obtener laboratorios de localStorage
    let labs = localStorage.getItem('axon_laboratorios');
    if (!labs) {
        alert('Error: No hay laboratorios');
        return;
    }
    
    labs = JSON.parse(labs);
    const labAEliminar = labs.find(l => l.id === labId);
    
    if (!labAEliminar) {
        alert('Laboratorio no encontrado');
        return;
    }
    
    // Verificar permisos (seguridad)
    let userActual = null;
    try {
        const stored = sessionStorage.getItem('axon_usuario_actual');
        if (stored) userActual = JSON.parse(stored);
    } catch(e) {}
    
    const esAdmin = userActual && userActual.email === 'admin@axon.edu';
    const esPropietario = userActual && (userActual.email === labAEliminar.email || userActual.nombre === labAEliminar.autor);
    
    if (!esAdmin && !esPropietario) {
        alert('No tienes permiso para eliminar este laboratorio');
        return;
    }
    
    // Filtrar y guardar
    const nuevosLabs = labs.filter(l => l.id !== labId);
    localStorage.setItem('axon_laboratorios', JSON.stringify(nuevosLabs));
    
    alert(`✅ "${labAEliminar.titulo}" eliminado correctamente`);
    
    // Recargar la página de laboratorios
    const currentHash = window.location.hash;
    if (currentHash.includes('laboratorios')) {
        // Recargar el contenido
        const termino = document.getElementById('searchInput')?.value || '';
        const categoriaActiva = document.querySelector('.filter-chip.active')?.dataset.categoria || '';
        const nuevoHtml = renderizarLaboratorios(termino, categoriaActiva);
        document.getElementById('page-content').innerHTML = nuevoHtml;
        
        // Reconectar eventos después de recargar
        setTimeout(() => {
            if (typeof configurarEventosDePagina === 'function') {
                configurarEventosDePagina('laboratorios');
            }
        }, 100);
    } else {
        // Redirigir a laboratorios
        setTimeout(() => {
            window.location.hash = 'laboratorios';
        }, 1000);
    }
}

// Inicializar escucha de eliminar
initEliminarBotones();