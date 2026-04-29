// js/labs.js - Gestión de laboratorios

// Inicializar datos
function initLaboratorios() {
    if (!localStorage.getItem('axon_laboratorios')) {
        localStorage.setItem('axon_laboratorios', JSON.stringify(LABORATORIOS_SIMULADOS));
    }
    if (!localStorage.getItem('axon_usuarios')) {
        const usuariosIniciales = [
            { id: 'user_001', nombre: 'Admin', email: 'admin@axon.edu', password: 'admin123' }
        ];
        localStorage.setItem('axon_usuarios', JSON.stringify(usuariosIniciales));
    }
}

// Obtener todos los laboratorios
function obtenerLaboratorios() {
    const labs = localStorage.getItem('axon_laboratorios');
    return labs ? JSON.parse(labs) : [];
}

// Guardar laboratorios
function guardarLaboratorios(laboratorios) {
    localStorage.setItem('axon_laboratorios', JSON.stringify(laboratorios));
}

// Obtener un laboratorio por ID
function obtenerLaboratorioPorId(id) {
    const labs = obtenerLaboratorios();
    return labs.find(lab => lab.id === id);
}

// Subir nuevo laboratorio
function subirLaboratorio(nuevoLab) {
    const labs = obtenerLaboratorios();
    
    const newId = 'lab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    
    const lab = {
        id: newId,
        ...nuevoLab,
        downloads: 0,
        fecha: new Date().toISOString().split('T')[0]
    };
    
    labs.unshift(lab);
    guardarLaboratorios(labs);
    return lab;
}

// Incrementar contador de descargas
function incrementarDescargas(id) {
    const labs = obtenerLaboratorios();
    const index = labs.findIndex(lab => lab.id === id);
    if (index !== -1) {
        labs[index].downloads++;
        guardarLaboratorios(labs);
        return labs[index].downloads;
    }
    return 0;
}

// Eliminar laboratorio
function eliminarLaboratorio(id) {
    const labs = obtenerLaboratorios();
    const nuevosLabs = labs.filter(lab => lab.id !== id);
    guardarLaboratorios(nuevosLabs);
    return true;
}

// Buscar laboratorios
function buscarLaboratorios(termino, categoria = null) {
    let labs = obtenerLaboratorios();
    
    if (termino && termino.trim() !== '') {
        const searchTerm = termino.toLowerCase();
        labs = labs.filter(lab => 
            lab.titulo.toLowerCase().includes(searchTerm) ||
            lab.autor.toLowerCase().includes(searchTerm) ||
            lab.descripcion.toLowerCase().includes(searchTerm)
        );
    }
    
    if (categoria && categoria !== '' && categoria !== 'todos') {
        labs = labs.filter(lab => lab.categoria === categoria);
    }
    
    return labs;
}

// Obtener estadísticas
function obtenerEstadisticas() {
    const labs = obtenerLaboratorios();
    const totalLabs = labs.length;
    const totalDownloads = labs.reduce((sum, lab) => sum + (lab.downloads || 0), 0);
    const categoriasCount = {};
    
    labs.forEach(lab => {
        const cat = lab.categoria;
        categoriasCount[cat] = (categoriasCount[cat] || 0) + 1;
    });
    
    return { totalLabs, totalDownloads, categoriasCount };
}

// Función para descargar archivo desde localStorage
function descargarArchivo(labId) {
    const labs = obtenerLaboratorios();
    const lab = labs.find(l => l.id === labId);
    
    if (lab && lab.archivo && lab.archivo.data) {
        // Crear un enlace temporal para descargar
        const link = document.createElement('a');
        link.href = lab.archivo.data;
        link.download = lab.archivo.nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Incrementar contador de descargas
        incrementarDescargas(labId);
        
        mostrarNotificacion(`Descargando: ${lab.archivo.nombre}`, 'success');
    } else {
        mostrarNotificacion('Error: Archivo no encontrado', 'error');
    }
}

// Función para obtener URL del archivo (para el detalle)
function obtenerUrlArchivo(labId) {
    const labs = obtenerLaboratorios();
    const lab = labs.find(l => l.id === labId);
    return lab?.archivo?.data || null;
}

// Exportar funciones adicionales
window.descargarArchivo = descargarArchivo;
window.obtenerUrlArchivo = obtenerUrlArchivo;

// Función para descargar archivo desde localStorage
function descargarArchivoReal(labId) {
    const labs = obtenerLaboratorios();
    const lab = labs.find(l => l.id === labId);
    
    if (lab && lab.archivo && lab.archivo.data) {
        const link = document.createElement('a');
        link.href = lab.archivo.data;
        link.download = lab.archivo.nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        incrementarDescargas(labId);
        mostrarNotificacion(`Descargando: ${lab.archivo.nombre}`, 'success');
    } else {
        mostrarNotificacion('Error: Archivo no encontrado', 'error');
    }
}

window.descargarArchivoReal = descargarArchivoReal;