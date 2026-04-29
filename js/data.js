// js/data.js - Datos y constantes

// Categorías disponibles
const CATEGORIAS = [
    { id: 'seguridad', nombre: '🔒 Seguridad Web', color: '#00d4ff', icono: '🔒' },
    { id: 'crypto', nombre: '🔐 Criptografía', color: '#b300ff', icono: '🔐' },
    { id: 'redes', nombre: '🌐 Redes', color: '#00ff88', icono: '🌐' },
    { id: 'malware', nombre: '🐛 Malware', color: '#ff3366', icono: '🐛' },
    { id: 'forensica', nombre: '🔍 Forensica', color: '#ffaa00', icono: '🔍' },
    { id: 'programacion', nombre: '💻 Programación', color: '#00e5ff', icono: '💻' },
    { id: 'ia', nombre: '🧠 IA', color: '#9d00ff', icono: '🧠' }
];

// Datos simulados de laboratorios
const LABORATORIOS_SIMULADOS = [
    {
        id: 'lab_001',
        titulo: 'Introducción a la Seguridad Web',
        autor: 'Dr. Carlos Mendoza',
        email: 'carlos@axon.edu',
        categoria: 'seguridad',
        descripcion: 'Aprende los fundamentos de seguridad en aplicaciones web. Incluye OWASP Top 10, inyección SQL, XSS y CSRF.',
        archivo: 'seguridad_web_intro.pdf',
        tamanio: '2.4 MB',
        downloads: 156,
        fecha: '2024-01-15',
        imagen: '🔒'
    },
    {
        id: 'lab_002',
        titulo: 'Criptografía Avanzada con RSA',
        autor: 'Dra. Ana Ramírez',
        email: 'ana@axon.edu',
        categoria: 'crypto',
        descripcion: 'Implementación práctica de RSA, generación de claves y cifrado asimétrico. Ejemplos en Python.',
        archivo: 'cripto_rsa.zip',
        tamanio: '5.1 MB',
        downloads: 89,
        fecha: '2024-01-20',
        imagen: '🔐'
    },
    {
        id: 'lab_003',
        titulo: 'Configuración de Redes Empresariales',
        autor: 'Ing. Roberto Sánchez',
        email: 'roberto@axon.edu',
        categoria: 'redes',
        descripcion: 'Laboratorio práctico de configuración de routers, switches y VLANs. Topologías complejas.',
        archivo: 'redes_empresariales.pdf',
        tamanio: '8.2 MB',
        downloads: 234,
        fecha: '2024-01-10',
        imagen: '🌐'
    },
    {
        id: 'lab_004',
        titulo: 'Análisis de Malware en Entorno Controlado',
        autor: 'Dr. Luis Fernández',
        email: 'luis@axon.edu',
        categoria: 'malware',
        descripcion: 'Metodología para analizar malware en sandbox. Identificación de comportamientos maliciosos.',
        archivo: 'malware_analysis.pdf',
        tamanio: '3.7 MB',
        downloads: 67,
        fecha: '2024-01-25',
        imagen: '🐛'
    },
    {
        id: 'lab_005',
        titulo: 'Forensica Digital: Recuperación de Datos',
        autor: 'Dra. Patricia Gómez',
        email: 'patricia@axon.edu',
        categoria: 'forensica',
        descripcion: 'Técnicas forenses para recuperación de archivos eliminados y análisis de discos.',
        archivo: 'forensica_digital.zip',
        tamanio: '12.3 MB',
        downloads: 112,
        fecha: '2024-01-18',
        imagen: '🔍'
    },
    {
        id: 'lab_006',
        titulo: 'Programación Orientada a Objetos',
        autor: 'Ing. Miguel Torres',
        email: 'miguel@axon.edu',
        categoria: 'programacion',
        descripcion: 'Fundamentos de POO con Java y Python. Ejercicios prácticos y proyectos.',
        archivo: 'poo_completo.pdf',
        tamanio: '4.5 MB',
        downloads: 345,
        fecha: '2024-01-05',
        imagen: '💻'
    },
    {
        id: 'lab_007',
        titulo: 'Redes Neuronales con TensorFlow',
        autor: 'Dr. Andrés López',
        email: 'andres@axon.edu',
        categoria: 'ia',
        descripcion: 'Implementación de redes neuronales profundas para clasificación de imágenes.',
        archivo: 'tensorflow_lab.zip',
        tamanio: '15.7 MB',
        downloads: 178,
        fecha: '2024-01-22',
        imagen: '🧠'
    },
    {
        id: 'lab_008',
        titulo: 'Pentesting Web Avanzado',
        autor: 'Dra. Laura Martínez',
        email: 'laura@axon.edu',
        categoria: 'seguridad',
        descripcion: 'Técnicas avanzadas de penetración en aplicaciones web. Burp Suite, SQLMap, Metasploit.',
        archivo: 'pentesting_avanzado.pdf',
        tamanio: '6.8 MB',
        downloads: 203,
        fecha: '2024-01-28',
        imagen: '🔒'
    },
    {
        id: 'lab_009',
        titulo: 'IoT y Seguridad en Dispositivos',
        autor: 'Dr. Ricardo Díaz',
        email: 'ricardo@axon.edu',
        categoria: 'redes',
        descripcion: 'Seguridad en dispositivos IoT, análisis de vulnerabilidades y protección.',
        archivo: 'iot_seguridad.pdf',
        tamanio: '4.2 MB',
        downloads: 45,
        fecha: '2024-01-30',
        imagen: '🌐'
    },
    {
        id: 'lab_010',
        titulo: 'Machine Learning con Python',
        autor: 'Dra. Sofía Herrera',
        email: 'sofia@axon.edu',
        categoria: 'ia',
        descripcion: 'Introducción a ML con scikit-learn. Regresión, clasificación y clustering.',
        archivo: 'ml_python.zip',
        tamanio: '9.3 MB',
        downloads: 267,
        fecha: '2024-01-12',
        imagen: '🧠'
    }
];

// Función para obtener categoría por ID
function getCategoriaById(id) {
    const cat = CATEGORIAS.find(c => c.id === id);
    return cat || CATEGORIAS[0];
}

// Función para obtener nombre de categoría
function getNombreCategoria(id) {
    const cat = getCategoriaById(id);
    return cat ? cat.nombre : '📚 General';
}

// Función para formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return 'Fecha desconocida';
    const partes = fecha.split('-');
    if (partes.length !== 3) return fecha;
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${parseInt(partes[2])} ${meses[parseInt(partes[1]) - 1]} ${partes[0]}`;
}

// Función para escapar HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}