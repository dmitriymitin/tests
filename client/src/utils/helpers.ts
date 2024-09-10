export const getUniqId = () => (+String(performance.now()).replace('.', '') + Date.now()).toString();

export function areAllUniqueInArrString(arr: string[]) {
  // Создаем множество из элементов массива
  const uniqueSet = new Set(arr);

  // Сравниваем размер множества с длиной массива
  return uniqueSet.size === arr.length;
}

export function pluralization(number: number, textForms: string[]): string {
  const value = Math.abs(number) % 100;
  const last = value % 10;
  if (value > 10 && value < 20) {
    return textForms[2];
  }

  if (last > 1 && last < 5) {
    return textForms[1];
  }

  if (last === 1) {
    return textForms[0];
  }

  return textForms[2];
}

export function convertIdToCustomFormat(uniqueId: string) {
  // По умолчанию буква будет 'T'
  let letter = 'T';

  // Проверяем, если первый символ уникального ID — это цифра
  const firstChar = uniqueId.charAt(0);
  // @ts-ignore
  if (!isNaN(firstChar)) {
    // Преобразуем цифру в соответствующую букву английского алфавита
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const index = parseInt(firstChar); // Преобразуем символ в число
    letter = alphabet[index - 1] || 'T'; // Получаем букву или оставляем 'T', если индекс за пределами
  }

  // Преобразуем последние 6 символов в число из 16-ричной системы
  const digits = parseInt(uniqueId.slice(-6), 16);

  // Формируем строку в нужном формате
  return `#${letter}${digits}`;
}

