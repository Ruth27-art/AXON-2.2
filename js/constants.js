// js/constants.js
// Constantes centralizadas para todo el proyecto

// Categorías disponibles
export const CATEGORIAS = [
    { id: 'seguridad_web', nombre: '🔒 Seguridad Web', icono: '🔒' },
    { id: 'cryptografia', nombre: '🔐 Criptografía', icono: '🔐' },
    { id: 'redes', nombre: '🌐 Redes', icono: '🌐' },
    { id: 'malware', nombre: '🐛 Análisis de Malware', icono: '🐛' },
    { id: 'forensica', nombre: '🔍 Forensica Digital', icono: '🔍' },
    { id: 'programacion', nombre: '💻 Programación', icono: '💻' },
    { id: 'ia', nombre: '🧠 Inteligencia Artificial', icono: '🧠' }
];

// Obtener nombre de categoría por ID
export function getNombreCategoria(id) {
    const cat = CATEGORIAS.find(c => c.id === id);
    return cat ? cat.nombre : '📚 General';
}

// Obtener todas las categorías para selects
export function getCategoriasForSelect() {
    return CATEGORIAS;
}

// Límites y configuraciones
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
export const ALLOWED_EXTENSIONS = ['.pdf', '.zip', '.doc', '.docx'];

// Appwrite IDs
export const DATABASE_ID = 'axon_lab_db';
export const LABS_COLLECTION_ID = 'laboratorios';
export const DOCUMENTS_BUCKET_ID = 'documentos_usuarios';