export const deleteElementFromArrayByIndex = (array: any[], index: number) => {
  return array.reduce((acc, el, i) => {
    if (i !== index) acc.push(el);
    return acc;
  }, []);
};
