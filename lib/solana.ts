// RUTA: lib/solana.ts
// Este archivo simula la lógica del Smart Contract de Solana y el Backend Off-Chain (Drizzle/SPEI)

// =========================================================================
// INTERFACES Y CONSTANTES
// =========================================================================

export type UserRole = 'beneficiary' | 'commerce' | 'admin';

export interface UserData {
    email: string;
    role: UserRole;
    walletAddress: string;
    solanaAddress: string; // Para simular la asignación de billetera automática
    balance: number;
    points: number;
}

export type MockDatabase = Record<string, UserData>;

// MOCK: Base de datos simulada con credenciales de prueba
export const MOCK_DB: MockDatabase = {
    // Admin no puede registrarse, solo iniciar sesión
    'admin@malintzin.com': {
        email: 'admin@malintzin.com',
        role: 'admin',
        walletAddress: 'MalintzinTreasuryAdmin',
        solanaAddress: 'ADMN7v5L8S62uA8T4hG9iO7bX2qP3yR1cZ0eI5kF6gH',
        balance: 100000.00,
        points: 0,
    },
    'donjuan@mail.com': {
        email: 'donjuan@mail.com',
        role: 'commerce',
        walletAddress: 'JuanPerezCommerce',
        solanaAddress: 'COMMjP1XyR2cZ3eI4kF5gH6vI7jK8lM9nO0pQ1rS2tU',
        balance: 471.55, // Saldo inicial para Yield
        points: 0,
    },
    'becaria@mail.com': {
        email: 'becaria@mail.com',
        role: 'beneficiary',
        walletAddress: 'BecariaUser',
        solanaAddress: 'BENEf4hG9iO7bX2qP3yR1cZ0eI5kF6gH7vI8jK9lM0n',
        balance: 200.00, // Saldo inicial
        points: 100.2, // Puntos iniciales
    },
};

export const CONSTANTS = {
    APY_ANNUAL_PERCENT: 0.05, // 5.0% APY
    MALINTZIN_YIELD_SHARE: 0.20, // 20% de ganancia para Malintzin
    OFF_RAMP_FEE_PERCENT: 0.015, // 1.5% para retiro SPEI (Ganancia de Malintzin)
    ON_RAMP_FEE_PERCENT: 0.00, // 0% para el beneficiario (Subsidio Social)
    POINTS_REWARD_RATE: 0.10, // 10% de la compra se da en puntos (ej. $100 compra -> 10 PMX)
    PMX_VALUE_MXN: 0.50, // 1 PMX = $0.50 MXN de descuento
    LOGO_URL: 'unnamed.jpg', // Ruta del logo en /public
    // Datos de la cuenta bancaria para simular el depósito SPEI (rampa de entrada)
    SPEI_ACCOUNT_CLABE: '646180123456789012',
    SPEI_ACCOUNT_NAME: 'Malintzin Liquidez S.A. (Tesorería)',
    // Monto típico de la beca para la carga de saldo
    BECA_AMOUNT_MXN: 1900.00, 
};

// Mantiene una instancia modificable de la base de datos simulada.
let dbState: MockDatabase = { ...MOCK_DB };

// Resetea la DB (usado para cerrar sesión)
export function resetDatabase() {
    dbState = { ...MOCK_DB };
    return dbState;
}

// Devuelve el estado actual de la DB
export function getDBState(): MockDatabase {
    return dbState;
}

// -------------------------------------------------------------------------
// Autenticación y Seguridad
// -------------------------------------------------------------------------

export function validateSecurity(email: string, password: string): { valid: boolean, message: string } {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, message: 'Formato de email incorrecto.' };
    }
    if (password.length < 8) {
        return { valid: false, message: 'La Contraseña debe tener al menos 8 caracteres para tu seguridad.' };
    }
    return { valid: true, message: 'Seguridad OK' };
}

export function simulateLogin(email: string, password: string): UserData | null {
    // Simulación de validación de contraseña (en un ambiente real, se usa hashing)
    if (dbState[email] && password === 'pass1234') {
        return dbState[email];
    }
    return null;
}

export function simulateRegister(email: string, password: string, role: UserRole): UserData | null {
    if (dbState[email]) {
        return null; // Usuario ya existe
    }

    // El ID de la billetera se crea automáticamente (Abstracción de Cuenta)
    const newUser: UserData = {
        email,
        role,
        walletAddress: email.split('@')[0], // Usamos el nombre del email como ID simple
        solanaAddress: 'NEW_USER_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        balance: 0.00,
        points: 0,
    };

    // Actualiza la DB
    dbState[email] = newUser;
    return newUser;
}

// -------------------------------------------------------------------------
// Funciones de Negocio (El Corazón de Solana)
// -------------------------------------------------------------------------

// Simula la Carga de Saldo (On-Ramp): 0% para el beneficiario (subsidio)
export async function simulateLoadMoney(userEmail: string, amount: number): Promise<string> {
    if (amount <= 0 || !dbState[userEmail]) {
        return "Error: Monto inválido o usuario no encontrado.";
    }

    const netAmount = amount * (1 - CONSTANTS.ON_RAMP_FEE_PERCENT);
    
    dbState[userEmail].balance += netAmount;

    // Lógica On-Chain/Off-Chain:
    console.log(`[ON-RAMP SPEI] Usuario ${userEmail} cargó ${amount} MXN. Costo: $0.00 (Subsidiado).`);
    
    return `¡Carga de $${netAmount.toFixed(2)} MXN exitosa! Tu Saldo Verificado está listo para usarse.`;
}

// Simula el Pago Atómico (Venta + Recompensa)
export async function simulatePayment(
    senderEmail: string,
    receiverEmail: string,
    amount: number
): Promise<string> {
    const sender = dbState[senderEmail];
    const receiver = dbState[receiverEmail];

    if (!sender || !receiver || amount <= 0 || sender.balance < amount) {
        return "Error: Transacción inválida o Saldo Verificado insuficiente.";
    }

    // 1. Movimiento de Stablecoin (Pago 0% Gas)
    sender.balance -= amount;
    receiver.balance += amount;

    // 2. Emisión Atómica de Puntos Malintzin (PMX)
    const pointsRewarded = amount * CONSTANTS.POINTS_REWARD_RATE;
    sender.points += pointsRewarded;

    // Simulación de Consola
    console.log(`[SOLANA TX - ATÓMICA] Pago de ${amount.toFixed(2)} MXN realizado. Gas: $0.00.`);
    console.log(`[SOLANA TX - ATÓMICA] Puntos PMX emitidos: ${pointsRewarded.toFixed(2)} al Beneficiario.`);

    return `¡Pago de $${amount.toFixed(2)} MXN realizado! Ganaste ${pointsRewarded.toFixed(1)} Puntos de Descuento.`;
}

// Simula el Retiro a Banco (Off-Ramp)
export async function simulateSPEIRetiro(userEmail: string, amount: number): Promise<string> {
    const user = dbState[userEmail];

    if (!user || amount <= 0 || user.balance < amount) {
        return "Error: Saldo Verificado insuficiente o monto inválido.";
    }

    const feeAmount = amount * CONSTANTS.OFF_RAMP_FEE_PERCENT;
    const netRetiro = amount - feeAmount;

    user.balance -= amount;
    
    // Malintzin gana la comisión por el servicio de Off-Ramp
    dbState['admin@malintzin.com'].balance += feeAmount; 
    
    // Lógica Off-Chain:
    console.log(`[OFF-RAMP SPEI] Iniciando transferencia de ${netRetiro.toFixed(2)} MXN.`);
    console.log(`[OFF-RAMP SPEI] Comisión Malintzin (Ganancia): ${feeAmount.toFixed(2)} MXN.`);

    return `Retiro de $${netRetiro.toFixed(2)} MXN en proceso (SPEI). Comisión por Servicio: ${feeAmount.toFixed(2)} MXN.`;
}

// Simula el Uso de Puntos (Redención)
export async function redeemPoints(userEmail: string, points: number): Promise<string> {
    const user = dbState[userEmail];
    const discountValue = points * CONSTANTS.PMX_VALUE_MXN;

    if (!user || user.points < points) {
        return "Error: Puntos de Descuento insuficientes.";
    }

    user.points -= points;
    // La tesorería de Malintzin (Admin) absorbe este costo, que se paga con el Yield
    dbState['admin@malintzin.com'].balance -= discountValue;

    return `¡Descuento de $${discountValue.toFixed(2)} MXN aplicado! Tienes ${user.points.toFixed(1)} Puntos de Descuento restantes.`;
}

// -------------------------------------------------------------------------
// Funciones de Generación de Yield (Ganancia Pasiva)
// -------------------------------------------------------------------------

export function calculateYield(balance: number): { daily: number, annual: number, malintzinShare: number, userShare: number } {
    // Cálculo: (Balance * APY) / 365 días
    const annualYield = balance * CONSTANTS.APY_ANNUAL_PERCENT;
    const dailyYield = annualYield / 365;

    // Distribución del Yield
    const malintzinShare = annualYield * CONSTANTS.MALINTZIN_YIELD_SHARE;
    const userShare = annualYield - malintzinShare;

    return {
        daily: dailyYield,
        annual: annualYield,
        malintzinShare: malintzinShare,
        userShare: userShare,
    };
}

// Función para generar QR Code URL (Usando un servicio web simulado)
export function generateQRCodeURL(receiverAddress: string, amount: number, label: string): string {
    const data = `solana:${receiverAddress}?amount=${amount}&label=${label}`;
    // Usando un generador de QR público
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
}