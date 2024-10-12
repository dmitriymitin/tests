import {IFullTest} from '../api/test';
import {ETypeTest, ITestModelResponse} from '../api/test/type';

export const getUniqId = () => (+String(performance.now()).replace('.', '') + Date.now()).toString();

export const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
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

export function shuffleArray<T>(array: T[]) {
  const shuffled = array.slice();

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

export const getTestType = (el: IFullTest | ITestModelResponse): ETypeTest => {
  if (el?.testType) {
    return el.testType;
  }

  if (!!el?.quantityQuestion && !el?.descriptionEditor && !el?.questionsId) {
    return ETypeTest.SIMPLE;
  }

  if (el?.descriptionEditor && !el?.questionsId) {
    return ETypeTest.WITH_DESCRIPTION;
  }

  return ETypeTest.WITH_QUESTIONS;
};