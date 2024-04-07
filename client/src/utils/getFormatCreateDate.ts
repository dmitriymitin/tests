const months = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

export const getFormatCreateDate = (dateString: string) => {
  const parts = dateString.split(" ");
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day} ${months[parseInt(month, 10) - 1]} ${year} г.`;
}