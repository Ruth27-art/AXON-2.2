// js/bot.js - Asistente Virtual AXON

// Configuración del bot
const BOT_CONFIG = {
    nombre: 'AXON Assistant',
    avatar: '🤖',
    color: '#00d4ff',
    saludo: '¡Hola! Soy el asistente virtual de AXON Labs. ¿En qué puedo ayudarte hoy?'
};

// Base de conocimiento del bot
const KNOWLEDGE_BASE = [
    {
        palabras: ['hola', 'buenas', 'saludos', 'hey', 'que tal', 'buen día'],
        respuesta: '¡Hola! 👋 Bienvenido a AXON Labs. ¿En qué puedo ayudarte? Puedo ayudarte con información sobre laboratorios, cómo subir archivos, búsquedas, y más.'
    },
    {
        palabras: ['como estas', 'qué tal', 'como andas', 'cómo va'],
        respuesta: '¡Estoy excelente! 🤖 Listo para ayudarte con todo lo relacionado con AXON Labs. ¿Tienes alguna pregunta sobre laboratorios académicos?'
    },
    {
        palabras: ['buscar', 'encontrar', 'laboratorio', 'lab', 'repositorio'],
        respuesta: '📚 Para buscar laboratorios, puedes:\n1. Usar el buscador en la página de Laboratorios\n2. Filtrar por categorías (Seguridad, Redes, IA, etc.)\n3. Ordenar por fecha o popularidad\n\n¿Necesitas ayuda buscando algo específico?'
    },
    {
        palabras: ['subir', 'publicar', 'compartir', 'cargar', 'upload'],
        respuesta: '📤 Para subir un laboratorio:\n1. Inicia sesión en tu cuenta\n2. Ve a "Subir Lab" en el menú\n3. Completa el formulario (título, descripción, categoría)\n4. Selecciona tu archivo (PDF, ZIP, DOC, DOCX)\n5. Haz clic en "Publicar Laboratorio"\n\n¿Necesitas ayuda con algún paso?'
    },
    {
        palabras: ['descargar', 'download', 'obtener', 'bajar'],
        respuesta: '⬇️ Para descargar un laboratorio:\n1. Busca el laboratorio que te interesa\n2. Haz clic en "Ver Detalles"\n3. Presiona el botón "Descargar Laboratorio"\n\n¡Los archivos se descargan automáticamente a tu dispositivo!'
    },
    {
        palabras: ['registrar', 'crear cuenta', 'registrarme', 'nueva cuenta'],
        respuesta: '📝 Para crear una cuenta:\n1. Haz clic en "Registrarse" en el menú\n2. Completa tu nombre, email y contraseña\n3. Acepta los términos y condiciones\n4. Haz clic en "Registrarse"\n\n¡Es gratis y rápido!'
    },
    {
        palabras: ['login', 'iniciar sesión', 'entrar', 'acceder'],
        respuesta: '🔑 Para iniciar sesión:\n1. Haz clic en "Iniciar Sesión" en el menú\n2. Ingresa tu email y contraseña\n3. Haz clic en "Ingresar"\n\n¿Olvidaste tu contraseña? Contacta al administrador.'
    },
    {
        palabras: ['categorias', 'categoría', 'temas', 'áreas'],
        respuesta: '🏷️ Las categorías disponibles son:\n🔒 Seguridad Web\n🔐 Criptografía\n🌐 Redes\n🐛 Análisis de Malware\n🔍 Forensica Digital\n💻 Programación\n🧠 Inteligencia Artificial\n\n¿Te interesa alguna en particular?'
    },
    {
        palabras: ['pdf', 'zip', 'formato', 'archivo', 'extension', 'tamaño'],
        respuesta: '📄 Formatos permitidos: PDF, ZIP, DOC, DOCX\n📏 Tamaño máximo: 10MB por archivo\n\nAsegúrate de que tu archivo cumpla con estos requisitos al subir.'
    },
    {
        palabras: ['cuenta', 'perfil', 'mi cuenta', 'usuario'],
        respuesta: '👤 Para gestionar tu cuenta:\n• Tu nombre se muestra en el header\n• Puedes subir laboratorios si iniciaste sesión\n• Tus laboratorios se guardan en tu perfil\n\n¿Necesitas modificar algo específico?'
    },
    {
        palabras: ['error', 'problema', 'no funciona', 'bug', 'fallo'],
        respuesta: '😕 Lamento que tengas problemas. Por favor:\n1. Refresca la página (F5)\n2. Limpia la caché del navegador\n3. Asegúrate de tener internet\n4. Si persiste, contacta a soporte@axon.edu\n\n¿Puedes describirme el problema específico?'
    },
    {
        palabras: ['contacto', 'soporte', 'ayuda', 'email', 'correo'],
        respuesta: '📧 Puedes contactarnos en:\n✉️ soporte@axon.edu\n📞 +51 123 456 789\n💬 A través de este chat\n\n¡Estamos para ayudarte!'
    },
    {
        palabras: ['gracias', 'gracias', 'thx', 'ok', 'vale', 'perfecto'],
        respuesta: '¡De nada! 🎉 Estoy aquí para ayudarte. ¿Necesitas algo más? ¡Disfruta de AXON Labs!'
    },
    {
        palabras: ['precio', 'costo', 'pagado', 'gratis', 'cuesta'],
        respuesta: '💰 AXON Labs es COMPLETAMENTE GRATUITO para estudiantes y docentes. ¡Sin costos ocultos! Solo necesitas registrarte con tu correo.'
    },
    {
        palabras: ['seguridad', 'privacidad', 'datos', 'información'],
        respuesta: '🔒 Tu seguridad es importante:\n• Las contraseñas se guardan encriptadas\n• Los archivos son privados\n• No compartimos tus datos\n• Puedes eliminar tu cuenta cuando quieras'
    }
];

// Buscar respuesta inteligente
function buscarRespuesta(mensaje) {
    const mensajeLower = mensaje.toLowerCase().trim();
    
    // Verificar palabras clave
    for (const item of KNOWLEDGE_BASE) {
        for (const palabra of item.palabras) {
            if (mensajeLower.includes(palabra)) {
                return item.respuesta;
            }
        }
    }
    
    // Respuesta por defecto
    return `🤔 No estoy seguro de entender "${mensaje}".\n\nPuedo ayudarte con:\n• Buscar laboratorios\n• Subir archivos\n• Registro y login\n• Categorías disponibles\n• Formatos permitidos\n\n¿Podrías reformular tu pregunta?`;
}

// Renderizar interfaz del chat
function renderizarChatbot() {
    return `
        <div id="chatbotContainer" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
            <!-- Botón flotante -->
            <div id="chatbotButton" style="
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #00d4ff, #b300ff);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,212,255,0.4);
                transition: all 0.3s ease;
            ">
                <span style="font-size: 28px;">🤖</span>
            </div>
            
            <!-- Ventana del chat -->
            <div id="chatbotWindow" style="
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background: var(--bg-card);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                border: 1px solid var(--border-color);
                display: none;
                flex-direction: column;
                overflow: hidden;
                backdrop-filter: blur(10px);
            ">
                <!-- Header del chat -->
                <div style="
                    background: linear-gradient(135deg, #00d4ff, #b300ff);
                    padding: 15px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px;">🤖</span>
                        <div>
                            <strong>AXON Assistant</strong>
                            <div style="font-size: 11px; opacity: 0.8;">En línea</div>
                        </div>
                    </div>
                    <button id="closeChatbot" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 20px;
                        cursor: pointer;
                    ">✕</button>
                </div>
                
                <!-- Mensajes -->
                <div id="chatMessages" style="
                    flex: 1;
                    padding: 15px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                ">
                    <div style="display: flex; gap: 8px; align-items: flex-start;">
                        <span style="font-size: 20px;">🤖</span>
                        <div style="
                            background: rgba(0,212,255,0.1);
                            padding: 10px;
                            border-radius: 15px;
                            border-bottom-left-radius: 5px;
                            max-width: 80%;
                            font-size: 14px;
                        ">${BOT_CONFIG.saludo}</div>
                    </div>
                </div>
                
                <!-- Input -->
                <div style="padding: 15px; border-top: 1px solid var(--border-color); display: flex; gap: 10px;">
                    <input type="text" id="chatInput" placeholder="Escribe tu mensaje..." style="
                        flex: 1;
                        padding: 10px;
                        background: rgba(255,255,255,0.05);
                        border: 1px solid var(--border-color);
                        border-radius: 25px;
                        color: var(--text-primary);
                        outline: none;
                    ">
                    <button id="sendChat" style="
                        background: linear-gradient(135deg, #00d4ff, #b300ff);
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        cursor: pointer;
                        font-size: 18px;
                    ">📤</button>
                </div>
            </div>
        </div>
    `;
}

// Inicializar chatbot
function initChatbot() {
    const chatbotHTML = renderizarChatbot();
    
    // Agregar al body si no existe
    if (!document.getElementById('chatbotContainer')) {
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    // Eventos
    const button = document.getElementById('chatbotButton');
    const window = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('closeChatbot');
    const sendBtn = document.getElementById('sendChat');
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    
    if (button) {
        button.addEventListener('click', () => {
            window.style.display = 'flex';
            button.style.transform = 'scale(0.9)';
            setTimeout(() => button.style.transform = 'scale(1)', 200);
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.style.display = 'none';
        });
    }
    
    function agregarMensaje(texto, esUsuario = false) {
        const messageDiv = document.createElement('div');
        messageDiv.style.display = 'flex';
        messageDiv.style.gap = '8px';
        messageDiv.style.alignItems = 'flex-start';
        messageDiv.style.justifyContent = esUsuario ? 'flex-end' : 'flex-start';
        
        if (esUsuario) {
            messageDiv.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #00d4ff, #b300ff);
                    padding: 10px;
                    border-radius: 15px;
                    border-bottom-right-radius: 5px;
                    max-width: 80%;
                    font-size: 14px;
                    color: white;
                ">${texto}</div>
                <span style="font-size: 20px;">👤</span>
            `;
        } else {
            messageDiv.innerHTML = `
                <span style="font-size: 20px;">🤖</span>
                <div style="
                    background: rgba(0,212,255,0.1);
                    padding: 10px;
                    border-radius: 15px;
                    border-bottom-left-radius: 5px;
                    max-width: 80%;
                    font-size: 14px;
                    white-space: pre-wrap;
                ">${texto}</div>
            `;
        }
        
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }
    
    function enviarMensaje() {
        const mensaje = input.value.trim();
        if (!mensaje) return;
        
        agregarMensaje(mensaje, true);
        input.value = '';
        
        // Simular "escribiendo"
        setTimeout(() => {
            const respuesta = buscarRespuesta(mensaje);
            agregarMensaje(respuesta, false);
        }, 500);
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', enviarMensaje);
    }
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') enviarMensaje();
        });
    }
}

// Exportar funciones
window.initChatbot = initChatbot;
window.buscarRespuesta = buscarRespuesta;

console.log('✅ Chatbot cargado correctamente');