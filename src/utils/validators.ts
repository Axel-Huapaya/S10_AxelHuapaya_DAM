export function validarNombre(nombre: string): boolean {
  const limpio = nombre.trim();
  return limpio.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio);
}

export function validarCorreo(correo: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo.trim());
}

export function validarEdad(edad: string): boolean {
  const numero = Number(edad.trim());
  return !isNaN(numero) && Number.isInteger(numero) && numero >= 18 && numero <= 120;
}

export function validarEntrada(tipoEntrada: string): boolean {
  return tipoEntrada.trim() !== '';
}