function convertIdToCustomFormat(uniqueId, indexOffset = -1, symbolFirst = '#') {
    // По умолчанию буква будет 'T'
    let letter = 'T';

    // Проверяем, если первый символ уникального ID — это цифра
    const firstChar = uniqueId.charAt(0);
    // @ts-ignore
    if (!isNaN(firstChar)) {
        // Преобразуем цифру в соответствующую букву английского алфавита
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const index = parseInt(firstChar); // Преобразуем символ в число
        letter = alphabet[index + indexOffset] || 'T'; // Получаем букву или оставляем 'T', если индекс за пределами
    }

    // Преобразуем последние 6 символов в число из 16-ричной системы
    const digits = parseInt(uniqueId.slice(-6), 16);

    // Формируем строку в нужном формате
    return symbolFirst + `${letter}${digits}`;
}

function shuffleArray(array) {
    const shuffled = array.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled;
}

module.exports = {convertIdToCustomFormat, shuffleArray};