function convertIdToCustomFormat(uniqueId) {
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

module.exports = convertIdToCustomFormat;