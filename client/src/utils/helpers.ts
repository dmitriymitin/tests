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
