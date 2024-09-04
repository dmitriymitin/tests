export const getUniqId = () => (+String(performance.now()).replace('.', '') + Date.now()).toString();

export function areAllUniqueInArrString(arr: string[]) {
  // Создаем множество из элементов массива
  const uniqueSet = new Set(arr);

  // Сравниваем размер множества с длиной массива
  return uniqueSet.size === arr.length;
}
