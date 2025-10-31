// RUTA: app.page.tsx
// ESTE ARCHIVO ES AUTOCONTENIDO: CONTIENE LÓGICA (lib/solana.ts) E INTERFAZ
"use client" // <--- DIRECTIVA CRUCIAL AÑADIDA AQUÍ

import { useState, useMemo, useCallback, useEffect } from 'react';
import { LogIn, User, Store, Settings, DollarSign, RefreshCw, Send, QrCode, ArrowDown, ArrowUp, HandCoins, Info, ArrowLeft, Lightbulb, Copy, Scan, TrendingUp } from 'lucide-react';

// =========================================================================
// MÓDULO 1: LÓGICA CENTRAL Y CONSTANTES (Fusión del antiguo lib/solana.ts)
// =========================================================================

// Tipos de datos
type UserRole = 'beneficiary' | 'commerce' | 'admin';
interface UserData {
    email: string;
    role: UserRole;
    walletAddress: string;
    solanaAddress: string;
    balance: number;
    points: number;
}
type MockDatabase = Record<string, UserData>;

// Constantes globales
const CONSTANTS = {
    APY_ANNUAL_PERCENT: 0.05, // 5.0% APY
    MALINTZIN_YIELD_SHARE: 0.20, // 20% de ganancia para Malintzin
    OFF_RAMP_FEE_PERCENT: 0.015, // 1.5% para retiro SPEI (Ganancia de Malintzin)
    PMX_VALUE_MXN: 0.50, // 1 PMX = $0.50 MXN de descuento
    POINTS_REWARD_RATE: 0.10, // 10% de la compra se da en puntos (ej. $100 compra -> 10 PMX)
    BECA_AMOUNT_MXN: 1900.00, // Monto bimestral de la beca
    SPEI_ACCOUNT_CLABE: '646180123456789012',
    SPEI_ACCOUNT_NAME: 'Malintzin Liquidez S.A. (Tesorería)',
};

// Base de datos simulada (Estado inicial)
const MOCK_DB: MockDatabase = {
    'admin@malintzin.com': { email: 'admin@malintzin.com', role: 'admin', walletAddress: 'AdminTreasury', solanaAddress: 'ADMN7v5L8S62uA8T4hG9iO7bX2qP3yR1cZ0eI5kF6gH', balance: 100000.00, points: 0 },
    'donjuan@mail.com': { email: 'donjuan@mail.com', role: 'commerce', walletAddress: 'JuanPerezCommerce', solanaAddress: 'COMMjP1XyR2cZ3eI4kF5gH6vI7jK8lM9nO0pQ1rS2tU', balance: 471.55, points: 0 },
    'becaria@mail.com': { email: 'becaria@mail.com', role: 'beneficiary', walletAddress: 'BecariaUser', solanaAddress: 'BENEf4hG9iO7bX2qP3yR1cZ0eI5kF6gH7vI8jK9lM0n', balance: 200.00, points: 100.2 },
};

// Mantiene una instancia modificable de la base de datos simulada.
let dbState: MockDatabase = { ...MOCK_DB };

// Funciones básicas de DB
const getDBState = () => dbState;
const resetDatabase = () => { dbState = { ...MOCK_DB }; return dbState; };

// Funciones de Lógica de Negocio (Yield, Pagos, etc.)
const validateSecurity = (email: string, password: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, message: 'Formato de email incorrecto.' };
    if (password.length < 8) return { valid: false, message: 'La Contraseña debe tener al menos 8 caracteres.' };
    return { valid: true, message: 'Seguridad OK' };
};
const simulateLogin = (email: string, password: string): UserData | null => dbState[email] && password === 'pass1234' ? dbState[email] : null;

const simulateRegister = (email: string, password: string, role: UserRole): UserData | null => {
    if (dbState[email] || role === 'admin') return null;
    const newUser: UserData = { email, role, walletAddress: email.split('@')[0], solanaAddress: 'NEW_USER_' + Math.random().toString(36).substring(2, 10).toUpperCase(), balance: 0.00, points: 0 };
    dbState[email] = newUser;
    return newUser;
};

// Simula la Carga de Saldo (On-Ramp): 0% para el beneficiario
async function simulateLoadMoney(userEmail: string, amount: number): Promise<string> {
    if (amount <= 0 || !dbState[userEmail]) return "Error: Monto inválido o usuario no encontrado.";
    
    // Asumimos 0% de costo para el beneficiario (subsidio)
    dbState[userEmail].balance += amount; 
    console.log(`[ON-RAMP SPEI] Usuario ${userEmail} cargó ${amount} MXN. Costo: $0.00 (Subsidiado).`);
    return `¡Dispersión de $${amount.toFixed(2)} MXN completada! Tu Saldo Verificado está listo.`;
}

// Simula el Pago Atómico (Venta + Recompensa)
async function simulatePayment(senderEmail: string, receiverEmail: string, amount: number): Promise<string> {
    const sender = dbState[senderEmail];
    const receiver = dbState[receiverEmail];
    if (!sender || !receiver || amount <= 0 || sender.balance < amount) return "Error: Transacción inválida o Saldo Verificado insuficiente.";

    // 1. Movimiento de Stablecoin (Pago 0% Gas)
    sender.balance -= amount;
    receiver.balance += amount;

    // 2. Emisión Atómica de Puntos Malintzin (PMX)
    const pointsRewarded = amount * CONSTANTS.POINTS_REWARD_RATE;
    sender.points += pointsRewarded;

    console.log(`[SOLANA TX - ATÓMICA] Pago de ${amount.toFixed(2)} MXN realizado. Gas: $0.00. Puntos PMX emitidos: ${pointsRewarded.toFixed(2)}.`);
    return `¡Pago de $${amount.toFixed(2)} MXN realizado! Ganaste ${pointsRewarded.toFixed(1)} Puntos de Descuento.`;
}

// Simula el Retiro a Banco (Off-Ramp)
async function simulateSPEIRetiro(userEmail: string, amount: number): Promise<string> {
    const user = dbState[userEmail];
    if (!user || amount <= 0 || user.balance < amount) return "Error: Saldo Verificado insuficiente o monto inválido.";

    const feeAmount = amount * CONSTANTS.OFF_RAMP_FEE_PERCENT;
    const netRetiro = amount - feeAmount;

    user.balance -= amount;
    dbState['admin@malintzin.com'].balance += feeAmount; // La tesorería gana
    
    console.log(`[OFF-RAMP SPEI] Iniciando transferencia de ${netRetiro.toFixed(2)} MXN. Comisión Malintzin (Ganancia): ${feeAmount.toFixed(2)} MXN.`);
    return `Retiro de $${netRetiro.toFixed(2)} MXN en proceso (SPEI). Comisión por Servicio: ${feeAmount.toFixed(2)} MXN.`;
}

// Simula el Uso de Puntos (Redención)
async function redeemPoints(userEmail: string, points: number): Promise<string> {
    const user = dbState[userEmail];
    const discountValue = points * CONSTANTS.PMX_VALUE_MXN;

    if (!user || user.points < points) return "Error: Puntos de Descuento insuficientes.";

    user.points -= points;
    dbState['admin@malintzin.com'].balance -= discountValue; // La tesorería absorbe el costo (pagado con Yield)

    return `¡Descuento de $${discountValue.toFixed(2)} MXN aplicado! Tienes ${user.points.toFixed(1)} Puntos de Descuento restantes.`;
}

// Generación de Yield
function calculateYield(balance: number): { daily: number, annual: number, malintzinShare: number, userShare: number } {
    const annualYield = balance * CONSTANTS.APY_ANNUAL_PERCENT;
    const dailyYield = annualYield / 365;
    const malintzinShare = annualYield * CONSTANTS.MALINTZIN_YIELD_SHARE;
    const userShare = annualYield - malintzinShare;

    return { daily: dailyYield, annual: annualYield, malintzinShare, userShare };
}

// Función para generar QR Code URL
function generateQRCodeURL(receiverAddress: string, amount: number, label: string): string {
    const data = `solana:${receiverAddress}?amount=${amount}&label=${label}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
}

// =========================================================================
// MÓDULO 2: INTERFAZ REACT (app/page.tsx)
// =========================================================================

// URL de servicio web para QR (se usa en el componente)
const QRCodeServiceURL = (data: string) => `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;

// Componente del Logo (basado en tu imagen)
const MalintzinLogo = ({ size = 60 }) => (
    <div className="flex items-center gap-3">
        {/* Usamos un simple <img> apuntando a /public/unnamed.jpg */}
        <img
            src='/unnamed.jpg' 
            alt="Malintzin Logo"
            className="w-12 h-12 rounded-full"
            style={{ width: size, height: size }}
        />
        <h1 className="text-3xl font-bold text-[#243452]">Malintzin</h1>
    </div>
);

// Componente para mostrar mensajes al usuario
const Toaster = ({ message, type }: { message: string, type: 'success' | 'error' | 'info' }) => {
    if (!message) return null;
    const baseStyle = "p-4 rounded-xl mt-4 shadow-lg text-white font-medium";
    const style = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    return (
        <div className={`${baseStyle} ${style}`}>
            {message}
        </div>
    );
};

// Componente para botones de acción en el dashboard
const DashboardButton = ({ icon: Icon, label, onClick, disabled = false, className = '' }: {
    icon: React.ElementType,
    label: string,
    onClick: () => void,
    disabled?: boolean,
    className?: string
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center p-4 rounded-xl transition-all shadow-md w-full
                   ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#51A384] hover:bg-emerald-700 text-white'} ${className}`}
    >
        <Icon className="w-5 h-5 mr-2" />
        {label}
    </button>
);

// Componente para mostrar una tarjeta de opción de rol en el login
const CardOption = ({ icon: Icon, title, description, onClick }: {
    icon: React.ElementType,
    title: string,
    description: string,
    onClick: () => void
}) => (
    <div
        onClick={onClick}
        className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 hover:border-[#51A384]"
    >
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#243452]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7 text-[#243452]" />
            </div>
            <div className="flex-1 space-y-1">
                <h3 className="text-xl font-semibold text-[#243452]">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    </div>
);

// Componente de Frases Motivacionales (Carrusel)
const MotivationalCarousel = () => {
    const quotes = useMemo(() => [
        "Tu dinero gana por sí solo. ¡Cada peso te da más poder de compra!",
        "Pagar sin comisiones es como tener un descuento en cada venta.",
        "Ahorra con tu Saldo Verificado: tu dinero no duerme, ¡trabaja!",
        "Tu billetera Solana es más segura que el efectivo en el bolsillo.",
        "Cero comisiones: más para el comercio, más para tu familia.",
    ], []);
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % quotes.length);
        }, 8000); // Cambia la frase cada 8 segundos
        return () => clearInterval(interval);
    }, [quotes.length]);

    return (
        <div className="bg-blue-50 p-4 rounded-xl mt-6 border border-blue-200 flex items-start min-h-[80px]">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0 mr-2" />
            <p className="text-sm text-blue-800 italic font-medium">
                **Consejo Malintzin:** {quotes[quoteIndex]}
            </p>
        </div>
    );
};


// =========================================================================
// FUNCIÓN PRINCIPAL DE LA APLICACIÓN
// =========================================================================

export default function MalintzinApp() {
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [view, setView] = useState<'login' | 'register' | 'pay' | 'load_money'>('login');
    const [role, setRole] = useState<UserRole | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

    // Montos de simulación y QR
    const [amount, setAmount] = useState<number | ''>(100);
    const [loadAmount, setLoadAmount] = useState<number | ''>(CONSTANTS.BECA_AMOUNT_MXN);
    const [qrAddress, setQrAddress] = useState<string>(''); // Dirección del comercio escaneado

    // Reinicia los mensajes después de un tiempo
    const showMessage = useCallback((msg: string, type: 'success' | 'error' | 'info') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    }, []);

    // Función para actualizar el estado del usuario tras una transacción exitosa
    const updateCurrentUser = useCallback(() => {
        if (currentUser) {
            const latestUser = getDBState()[currentUser.email];
            if (latestUser) {
                // CORRECCIÓN: Crear una nueva referencia del objeto para forzar la actualización en React
                setCurrentUser({ ...latestUser }); 
            } else {
                setCurrentUser(null); // Desloguear si el usuario fue eliminado o no se encuentra
            }
        }
    }, [currentUser]);

    // Función para copiar al portapapeles
    const copyToClipboard = (text: string, field: string) => {
        if (typeof window !== 'undefined') {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showMessage(`¡${field} copiado!`, 'info');
        }
    };

    // Calcula el Yield y Saldo Final
    const userFinance = useMemo(() => {
        if (!currentUser) return null;
        // Obtener el estado más reciente del usuario logueado
        const latestUser = getDBState()[currentUser.email];
        
        if (!latestUser) return null; 

        const balance = latestUser.balance || 0;
        const points = latestUser.points || 0;
        const { userShare, malintzinShare } = calculateYield(balance);
        
        return {
            balance,
            points,
            dailyYield: userShare / 365,
            totalYieldAnnual: userShare,
            treasuryShare: malintzinShare
        };
    }, [currentUser]);

    // Lógica de Autenticación
    const handleAuth = async () => {
        const securityCheck = validateSecurity(email, password);
        if (!securityCheck.valid) {
            showMessage(securityCheck.message, 'error');
            return;
        }

        let authAttempt: UserData | null = null;
        
        if (view === 'login') {
            authAttempt = simulateLogin(email, password);
        } else {
            // Registro: admin no puede registrarse
            if (role === 'admin') {
                showMessage('El registro de administradores no está permitido por seguridad.', 'error');
                return;
            }
            authAttempt = simulateRegister(email, password, role!);
        }

        if (authAttempt) {
            setCurrentUser(authAttempt);
            showMessage(view === 'login' ? '¡Bienvenido! Acceso seguro a tu billetera.' : 'Registro exitoso. Tu billetera Solana fue creada automáticamente.', 'success');
            setRole(null); // Limpia el rol de la vista de login
        } else {
            showMessage(view === 'login' ? 'Credenciales incorrectas o usuario no encontrado.' : 'Error: El usuario ya existe o no se pudo registrar.', 'error');
        }
    };

    // Lógica de Negocio
    const handleLoadMoneyConfirmation = async () => {
        const amountValue = loadAmount as number;
        
        const result = await simulateLoadMoney(currentUser!.email, amountValue);
        
        if (result.startsWith('Error')) {
            showMessage(result, 'error');
        } else {
            updateCurrentUser(); // LLAMADA CLAVE PARA ACTUALIZAR SALDO
            showMessage(result, 'success');
            setLoadAmount(CONSTANTS.BECA_AMOUNT_MXN);
            setView('login'); // Volver al dashboard
        }
    };

    const handlePayment = async () => {
        const receiver = 'donjuan@mail.com'; // Receptor fijo para simulación
        const amountValue = amount as number;

        if (!amountValue || amountValue <= 0) {
            showMessage("Ingresa un monto válido para pagar.", 'error');
            return;
        }
        if (amountValue > userFinance!.balance) {
            showMessage("Saldo Verificado insuficiente.", 'error');
            return;
        }

        const result = await simulatePayment(currentUser!.email, receiver, amountValue);

        if (result.startsWith('Error')) {
            showMessage(result, 'error');
        } else {
            updateCurrentUser(); // LLAMADA CLAVE PARA ACTUALIZAR SALDO Y PUNTOS
            showMessage(result, 'success');
            setAmount(100);
            setQrAddress(''); // Limpia el QR si estaba en modo escanear
        }
    };

    const handleSPEIRetiro = async () => {
        const amountValue = amount as number;
        
        const result = await simulateSPEIRetiro(currentUser!.email, amountValue);

        if (result.startsWith('Error')) {
            showMessage(result, 'error');
        } else {
            updateCurrentUser(); // LLAMADA CLAVE PARA ACTUALIZAR SALDO Y TESORERÍA
            showMessage(result, 'success');
            setAmount(100);
        }
    };

    const handleRedeem = async () => {
        const pointsToRedeem = 10;
        const result = await redeemPoints(currentUser!.email, pointsToRedeem);

        if (result.startsWith('Error')) {
            showMessage(result, 'error');
        } else {
            updateCurrentUser(); // LLAMADA CLAVE PARA ACTUALIZAR PUNTOS Y SALDO
            showMessage(result, 'success');
        }
    };

    const handleGenerateQR = () => {
        // Genera un QR que contiene la dirección del comercio y un monto de 100 sugerido
        const cobroMonto = 100.00; 
        const data = generateQRCodeURL(currentUser!.solanaAddress, cobroMonto, currentUser!.walletAddress);
        setQrAddress(data);
        showMessage("Muestra este QR al Beneficiario para que escanee y te pague al instante.", 'info');
    };

    // Función de Navegación Simple para regresar al dashboard
    const goToDashboard = () => {
        setView('login'); 
        setQrAddress(''); // Limpiar QR
        setLoadAmount(CONSTANTS.BECA_AMOUNT_MXN); // Resetear monto
    }
    
    // =========================================================================
    // RENDERING DE INTERFACES (Definidas antes de ser llamadas)
    // =========================================================================

    const renderSPEILoadScreen = () => (
        <div className="w-full max-w-lg space-y-6 bg-white p-8 rounded-xl shadow-2xl border-t-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-[#243452] flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2 cursor-pointer text-gray-600 hover:text-[#243452]" onClick={goToDashboard} />
                Recarga Gratuita (Tu Apoyo Social)
            </h2>
            <Toaster message={message} type={messageType} />
            
            <div className="bg-indigo-50 p-5 rounded-lg space-y-4 border border-indigo-200">
                <h3 className="text-xl font-semibold text-indigo-800">1. Define el Monto a Recargar</h3>
                <input
                    type="number"
                    placeholder={`Sugerido: ${CONSTANTS.BECA_AMOUNT_MXN.toFixed(2)}`}
                    value={loadAmount}
                    onChange={(e) => setLoadAmount(Number(e.target.value))}
                    className="w-full p-3 text-xl border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="bg-white p-5 rounded-lg space-y-4 shadow-md border">
                <h3 className="text-xl font-semibold text-emerald-700 flex items-center">
                    2. Instrucciones de Transferencia SPEI
                </h3>
                
                <ul className="text-sm space-y-2 bg-gray-50 p-3 rounded-lg border">
                    <li className='flex justify-between items-start'>
                        <span className='font-medium text-gray-700'>Banco Destino:</span>
                        <span className='font-semibold text-[#243452]'>Banco Malintzin (Simulado)</span>
                    </li>
                    <li className='flex justify-between items-start'>
                        <span className='font-medium text-gray-700'>CLABE Única (Copia):</span>
                        <span className='font-mono bg-yellow-100 p-1 rounded-md text-sm flex items-center break-all'>
                            {CONSTANTS.SPEI_ACCOUNT_CLABE}
                            <Copy className='w-4 h-4 ml-2 cursor-pointer text-indigo-600' onClick={() => copyToClipboard(CONSTANTS.SPEI_ACCOUNT_CLABE, 'CLABE')} />
                        </span>
                    </li>
                    <li className='flex justify-between items-start'>
                        <span className='font-medium text-gray-700'>Monto a Enviar:</span>
                        <span className='font-bold text-lg text-green-700 flex items-center'>
                            ${(loadAmount as number)?.toFixed(2) || '0.00'} MXN
                        </span>
                    </li>
                </ul>
                
                <p className="text-xs text-red-600 flex items-start pt-2">
                    <Info className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                    **Recuerda:** Tu Saldo Verificado llegará gratis si usas transferencia SPEI.
                </p>
            </div>
            
            <DashboardButton
                icon={RefreshCw}
                label={`3. Confirmar Transferencia de $${(loadAmount as number)?.toFixed(2) || '0.00'} MXN`}
                onClick={handleLoadMoneyConfirmation}
                disabled={!loadAmount || (loadAmount as number) <= 0}
                className="bg-emerald-600 hover:bg-emerald-700"
            />
        </div>
    );

    const renderLoginScreen = () => (
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-[#243452]">
                {role ? (view === 'login' ? `Acceso ${role === 'admin' ? 'Administrativo' : role === 'commerce' ? 'Comercio' : 'Beneficiario'}` : 'Nuevo Usuario') : 'Selecciona tu Perfil'}
            </h2>
            <Toaster message={message} type={messageType} />

            {/* SELECCIÓN DE ROL */}
            {!role && (
                <div className="space-y-4">
                    <CardOption icon={User} title="Soy Beneficiario" description="Recibe Saldo Verificado y gana Puntos de Descuento." onClick={() => setRole('beneficiary')} />
                    <CardOption icon={Store} title="Soy Comercio" description="Cobra al instante con 0% de comisión en venta." onClick={() => setRole('commerce')} />
                    <CardOption icon={Settings} title="Soy Administrativo" description="Supervisa la Tesorería y la Ganancia de la red." onClick={() => setRole('admin')} />
                </div>
            )}

            {/* FORMULARIO DE AUTH */}
            {role && (
                <div className="space-y-6">
                    <input
                        type="email"
                        placeholder="Correo Electrónico (Para vincular tu Billetera)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#51A384]"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña (mín. 8 caracteres para tu seguridad)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#51A384]"
                    />

                    <button
                        onClick={handleAuth}
                        className="w-full p-3 text-lg font-semibold rounded-lg bg-[#243452] text-white hover:bg-[#243452]/90 transition-all"
                    >
                        {view === 'login' ? 'Iniciar Sesión' : 'Registrarme'}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        {view === 'login' ? (
                            <>¿Eres nuevo? <span className="text-[#51A384] cursor-pointer font-medium" onClick={() => setView('register')}>Crea tu cuenta Malintzin.</span></>
                        ) : (
                            <>
                                <span className="text-[#51A384] cursor-pointer font-medium" onClick={() => setView('login')}>Iniciar Sesión.</span>
                                <p className='text-xs text-gray-500 mt-2'>
                                    Tu **Billetera Solana Segura** se crea automáticamente al registrarte.
                                </p>
                            </>
                        )}
                        <br />
                        <span className='text-xs text-red-500'>*El registro de Admin no está permitido.</span>
                    </p>
                    <p className='text-center text-xs text-gray-500'>
                        Credenciales de prueba: becaria@mail.com | donjuan@mail.com | admin@malintzin.com. Contraseña: pass1234
                    </p>
                </div>
            )}
        </div>
    );

    const renderDashboardContent = () => {
        if (!currentUser || !userFinance) return null;

        const roleColor = currentUser.role === 'beneficiary' ? 'bg-indigo-600' : currentUser.role === 'commerce' ? 'bg-emerald-600' : 'bg-red-600';

        const renderBeneficiary = () => (
            <div className="space-y-6">
                {/* SALDO PRINCIPAL */}
                <div className="bg-white p-6 rounded-xl shadow-inner border-t-4 border-indigo-500">
                    <p className="text-sm text-gray-600 font-semibold">TU SALDO VERIFICADO (MXN)</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-5xl font-extrabold text-indigo-700 mt-1">${userFinance.balance.toFixed(2)}</h3>
                        <span className="text-2xl text-gray-500 font-medium">MXN</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <p className="text-lg font-semibold text-pink-600 flex items-center">
                            <HandCoins className="w-5 h-5 mr-2" />
                            Puntos de Descuento: {userFinance.points.toFixed(1)} PMX
                        </p>
                        <button onClick={handleRedeem} className="text-sm font-medium text-indigo-500 hover:underline disabled:opacity-50" disabled={userFinance.points < 10}>
                            Canjear 10 Puntos ($5.00 MXN)
                        </button>
                    </div>
                </div>
                <MotivationalCarousel />

                <h3 className="text-xl font-bold text-[#243452] mt-8">Herramientas</h3>

                {/* 1. ON-RAMP (Carga de Saldo - Beca) */}
                <div className="bg-indigo-50 p-6 rounded-xl space-y-4">
                    <h4 className="text-lg font-semibold text-indigo-800 flex items-center">
                        <ArrowDown className="w-5 h-5 mr-2" />
                        Cargar Saldo (0% Costo)
                    </h4>
                    <p className="text-sm text-indigo-700">
                        Transfiere tu apoyo social sin comisiones usando nuestra cuenta SPEI.
                    </p>
                    <DashboardButton
                        icon={RefreshCw}
                        label={`Recargar (Transferencia SPEI)`}
                        onClick={() => setView('load_money')}
                        className="bg-indigo-600 hover:bg-indigo-700"
                    />
                </div>

                {/* 2. PAGO QR */}
                <div className="bg-emerald-50 p-6 rounded-xl space-y-4">
                    <h4 className="text-lg font-semibold text-emerald-800 flex items-center">
                        <Scan className="w-5 h-5 mr-2" />
                        Pagar al Comercio (Comisión 0%)
                    </h4>
                    <p className="text-sm text-emerald-700">
                        Ingresa el monto de tu compra y escanea el código del comercio.
                    </p>
                    <input
                        type="number"
                        placeholder="Monto a Pagar (Ej: 100)"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    <DashboardButton
                        icon={Send}
                        label={`Pagar $${(amount as number)?.toFixed(2) || '0.00'} MXN`}
                        onClick={handlePayment} // Simulación de pago
                        disabled={!amount || (amount as number) > userFinance.balance}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    />
                </div>
            </div>
        );

        const renderCommerce = () => (
            <div className="space-y-6">
                {/* SALDO PRINCIPAL COMERCIO */}
                <div className="bg-white p-6 rounded-xl shadow-inner border-t-4 border-emerald-500">
                    <p className="text-sm text-gray-600 font-semibold">TU SALDO VERIFICADO (MXN)</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-5xl font-extrabold text-emerald-700 mt-1">${userFinance.balance.toFixed(2)}</h3>
                        <span className="text-2xl text-gray-500 font-medium">MXN</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <p className="text-lg font-semibold text-green-600 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Ganancia por Ahorro (Yield): {userFinance.dailyYield.toFixed(4)} MXN / Día
                        </p>
                        <p className="text-xs text-gray-500">
                            Tu saldo genera ganancias pasivas (Yield) en la red.
                        </p>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-[#243452] mt-8">Herramientas de Comercio</h3>

                {/* 1. COBRO QR */}
                <div className="bg-emerald-50 p-6 rounded-xl space-y-4 text-center">
                    <h4 className="text-lg font-semibold text-emerald-800 flex items-center justify-center">
                        <QrCode className="w-5 h-5 mr-2" />
                        Cobrar con QR (0% Comisión de Venta)
                    </h4>
                    
                    {qrAddress ? (
                        <>
                            <img src={QRCodeServiceURL(qrAddress)} alt="Código QR de Cobro" className="mx-auto my-4 border-4 border-white shadow-lg" />
                            <p className="text-xs text-gray-700 break-all">Tu ID de Billetera: {currentUser.solanaAddress.slice(0, 8)}...</p>
                            <button onClick={() => setQrAddress('')} className="text-sm text-red-600 hover:underline">Ocultar QR</button>
                        </>
                    ) : (
                        <DashboardButton
                            icon={QrCode}
                            label="Generar Código QR de Cobro"
                            onClick={handleGenerateQR}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        />
                    )}
                </div>

                {/* 2. OFF-RAMP (Retiro SPEI) */}
                <div className="bg-red-50 p-6 rounded-xl space-y-4">
                    <h4 className="text-lg font-semibold text-red-800 flex items-center">
                        <ArrowUp className="w-5 h-5 mr-2" />
                        Retirar a Banco (SPEI)
                    </h4>
                    <p className="text-sm text-red-700 font-semibold">
                        Comisión por Servicio (Off-Ramp): **1.5%** - ¡Ahorra más del 60% vs. TPVs!
                    </p>
                    <input
                        type="number"
                        placeholder="Monto a Retirar"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                    <DashboardButton
                        icon={DollarSign}
                        label={`Retirar $${(amount as number)?.toFixed(2) || '0.00'} MXN`}
                        onClick={handleSPEIRetiro}
                        disabled={!amount || (amount as number) > userFinance.balance}
                        className="bg-red-600 hover:bg-red-700"
                    />
                </div>
            </div>
        );

        const renderAdmin = () => {
            const treasury = getDBState()['admin@malintzin.com'] as UserData;
            const totalFloat = Object.values(getDBState()).reduce((sum, user) => sum + (user.role !== 'admin' ? user.balance : 0), 0);
            const totalPointsIssued = Object.values(getDBState()).reduce((sum, user) => sum + user.points, 0);
            const adminYieldShare = userFinance.treasuryShare || 0; 
            const adminFees = treasury.balance - (MOCK_DB['admin@malintzin.com'].balance - MOCK_DB['becaria@mail.com'].points * CONSTANTS.PMX_VALUE_MXN) + (totalPointsIssued * CONSTANTS.PMX_VALUE_MXN); // Calcula la ganancia por fees netas

            return (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-red-700">Panel de Auditoría y Tesorería</h3>

                    {/* 1. TESORERÍA MALINTZIN */}
                    <div className="bg-red-100 p-6 rounded-xl shadow-inner border-t-4 border-red-700">
                        <p className="text-sm text-gray-600 font-semibold">FONDOS DE OPERACIÓN Y RECOMPENSAS</p>
                        <h3 className="text-5xl font-extrabold text-red-700 mt-1">${treasury.balance.toFixed(2)}</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Estos fondos se usan para **pagar los descuentos de PMX** y cubrir el gas.
                        </p>
                    </div>

                    {/* 2. MÉTRICAS CLAVE */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white shadow-md rounded-xl">
                            <p className="text-xs text-gray-500 font-medium">Float Total (Stablecoin)</p>
                            <p className="text-xl font-bold text-[#243452]">${totalFloat.toFixed(2)}</p>
                            <p className="text-xs text-emerald-600">Fondos activos de Comercios y Beneficiarios.</p>
                        </div>
                        <div className="p-4 bg-white shadow-md rounded-xl">
                            <p className="text-xs text-gray-500 font-medium">Ganancia Pasiva (Yield)</p>
                            <p className="text-xl font-bold text-green-700">${adminYieldShare.toFixed(2)} / Año</p>
                            <p className="text-xs text-emerald-600">Ingreso pasivo de la red por Yield (20%).</p>
                        </div>
                        <div className="p-4 bg-white shadow-md rounded-xl col-span-2">
                            <p className="text-xs text-gray-500 font-medium">Ganancia Neta por Servicios (Off-Ramp)</p>
                            <p className="text-xl font-bold text-red-700">${adminFees.toFixed(2)}</p>
                            <p className="text-xs text-emerald-600">Comisiones netas por retiros SPEI menos costos de PMX.</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 pt-4">
                        *La auditoría de Yield se realiza consultando las APIs de los protocolos (Jito/Marinade) para verificar la ganancia generada por el Float total.
                    </p>
                </div>
            );
        };

        return (
            <div className="w-full max-w-lg mx-auto space-y-6 p-6">
                <div className={`p-4 rounded-xl shadow-md ${roleColor} text-white`}>
                    <div className='flex justify-between items-center'>
                        <h2 className="text-2xl font-bold">¡Hola, {currentUser.walletAddress}!</h2>
                        <button
                            onClick={() => setCurrentUser(null)}
                            className="text-sm underline hover:opacity-80"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                    <p className="text-sm mt-1">{currentUser.role === 'beneficiary' ? 'Tu Saldo es Productivo' : currentUser.role === 'commerce' ? 'Dashboard de Comercio' : 'Panel Administrativo'}</p>
                </div>

                <Toaster message={message} type={messageType} />

                {currentUser.role === 'beneficiary' && renderBeneficiary()}
                {currentUser.role === 'commerce' && renderCommerce()}
                {currentUser.role === 'admin' && renderAdmin()}

            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <header className="fixed top-0 w-full max-w-lg py-4 bg-white shadow-lg flex justify-center z-10">
                <MalintzinLogo />
            </header>
            
            <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 w-full">
                <Toaster message={message} type={messageType} />

                {currentUser ? (
                    // Si el usuario está logueado, verifica si quiere cargar saldo o ir al dashboard
                    view === 'load_money' ? renderSPEILoadScreen() : renderDashboardContent()
                ) : (
                    // Si no está logueado, muestra la pantalla de login
                    renderLoginScreen()
                )}
            </main>

            <footer className="w-full text-center py-4 text-xs text-gray-400">
                Impulsado por Solana y la Abstracción de Cuenta
            </footer>
        </div>
    );
}
