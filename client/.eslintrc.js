module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  settings: {
    version: 'detect'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-extra-semi': [1],
    'react/jsx-indent': [1, 2],
    'react/jsx-indent-props': [2, 'first'],
    'react/display-name': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,

    'max-len': ['error', {code: 200}],

    /*
                     * Следующие правила относятся к стилю кода
           */

    /*  Правила, связанные с отступом */
    indent: ['warn', 2, {SwitchCase: 1,
      ignoredNodes: ['JSXAttribute', 'JSXSpreadAttribute']}],

    /* Правила, связанные с точкой с запятой */
    semi: [1, 'always'], // Обязательная точка с запятой в конце оператора Игнорировать последнюю точку с запятой в фигурных скобках
    'semi-spacing': [1, { // Обязательные пробелы после точки с запятой и запрещение пробелов перед точкой с запятой
      before: false,
      after: true
    }],
    'semi-style': 1, // Точка с запятой должна стоять в конце предложения
    '@typescript-eslint/member-delimiter-style': [1, {
      multiline: {
        delimiter: 'semi',
        requireLast: true
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false
      }
    }], // в интерфейсах

    /* Правила, связанные с запятыми */
    'comma-dangle': [1, 'only-multiline'], // Последняя запятая пар ключ-значение массива и объекта
    'comma-spacing': [1, { // Пробелы перед запятой запрещены, а пробелы обязательны после запятой
      before: false,
      after: true
    }],

    /* Правила, связанные с пространством */
    'key-spacing': [1, { // Пара "ключ-значение" объекта Нет пробела перед двоеточием, пробел после двоеточия
      beforeColon: false,
      afterColon: true
    }],
    'no-multi-spaces': 1, // Запрещаем использование нескольких пробелов
    'no-trailing-spaces': 1, // Запрещаем конечные пробелы
    'no-whitespace-before-property': 1, // Запрещаем пробелы перед атрибутами
    'space-before-blocks': [1, 'always'], // требуется пробел перед блоком операторов
    'space-before-function-paren': [2, {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }], // требуется пробел перед скобками функции
    'arrow-spacing': [2, {
      before: true,
      after: true
    }],
    'space-in-parens': 1, // Не используйте пробелы в круглых скобках
    'space-infix-ops': 1, // требуются пробелы вокруг оператора
    'space-unary-ops': [1, { // Пробелы требуются после унарных операторов слов. Пробелы не требуются до и после унарных операторов, не являющихся словами
      words: true, // Унарные операторы класса Word new, delete, typeof, void ...
      nonwords: false // Унарные операторы без слов -, +, -, ++,!, !! ...
    }],
    'spaced-comment': [1, 'always', { // Обязательное использование одинаковых пробелов в комментариях // или / *
      line: {
        exceptions: ['-', '+'],
        markers: ['/']
      },
      block: {
        exceptions: ['*'],
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!'],
        balanced: true
      }
    }],
    'array-bracket-spacing': 1, // Не используйте пробелы после массива '[' и перед ']'
    'block-spacing': [1, 'always'],
    // Обеспечивает постоянный интервал между левой фигурной скобкой и следующим токеном на той же строке
    // и устанавливает постоянный интервал между правой фигурной скобкой и предыдущим токеном в той же строке,
    'computed-property-spacing': [1, 'never'], // Запрещаем использование пробелов в вычисляемых атрибутах
    'func-call-spacing': 1, // Запрещаем пробелы между идентификатором функции и ее вызовом
    'keyword-spacing': [1, { // Обязательно используйте одинаковые пробелы до и после ключевых слов
      before: false,
      after: true,
      overrides: {
        from: {
          before: true,
          after: true
        },
        'else': {
          before: true
        },
        'while': {
          before: true
        },
        'return': {
          before: true
        },
        'catch': {
          before: true
        },
        'finally': {
          before: true
        },
        as: {
          before: true
        }
      }
    }],
    'object-curly-spacing': [1, 'never'], // Запрещаем пробелы после '{' и перед '}' объекта
    'switch-colon-spacing': 1, // Принудительно ставить пробел после двоеточия переключателя и запрещать пробел перед двоеточием переключателя
    /*  Правила, связанные с пустой строкой */
    'eol-last': [1, 'always'], // Форсировать пустую строку в конце непустых файлов
    'lines-around-comment': [1, { // Форсировать пустую строку перед комментарием
      allowBlockStart: true,
      allowObjectStart: true,
      allowArrayStart: true,
      allowClassStart: true
    }],
    'lines-between-class-members': [1, 'always', {exceptAfterSingleLine: true}], // Заставить пустую строку между членами класса
    'no-multiple-empty-lines': [2, { // До одной последовательной пустой строки
      max: 1
    }],
    'padding-line-between-statements': [1, { // Форсировать пустую строку после объявления функции
      blankLine: 'always',
      prev: 'var',
      next: '*'
    }, { // Форсировать пустую строку после «блочного оператора», такого как {}, if (a) {}, while (a) {}
      blankLine: 'always',
      prev: 'block-like',
      next: '*'
    }],

    /* Правила, связанные с переносом */
    'one-var-declaration-per-line': 1, // Заставить каждую инструкцию инициализации переменной обернуть
    'operator-linebreak': ['error', 'after', {
      overrides: {
        '?': 'before',
        ':': 'before'
      }
    }], // Принудительно помещать символ новой строки после оператора
    'comma-style': 1, // Принудительно вводить символ новой строки после запятой
    'brace-style': [1, '1tbs'],
    // Обязательная фигурная скобка использует один истинный стиль фигурной скобки, то есть помещает фигурную скобку в ту же строку управляющего оператора или оператора объявления

    /* Правила, связанные с комментариями */
    // 'multiline-comment-style': 1, // Запрещено использовать непрерывные строчные
    // комментарии для представления комментариев блока. Кроме того, перед каждой строкой комментария к блоку обязательно ставить *.
    // 'require-jsdoc-except/require-jsdoc': [1, { // jsdoc необходим для добавления комментариев к функциям и т. д.
    //     require: {
    //         FunctionDeclaration: true,
    //         MethodDefinition: true,
    //         ClassDeclaration: true,
    //         ArrowFunctionExpression: true,
    //         FunctionExpression: true
    //     },
    //     ignore: ['controller', 'link', 'success', 'error']
    // }],

    /* Правила использования кавычек */
    'jsx-quotes': [1, 'prefer-double'],
    quotes: [1, 'single'], // В js необходимо использовать одинарные кавычки

    /* Правила, связанные с именованием переменных */
    camelcase: [1, { // Стандартные переменные названы в верблюжьем регистре (кроме свойств объекта)
      properties: 'never'
    }],
    'new-cap': 1, // Сделать первую букву конструктора заглавной
    'id-blacklist': [1, 'break', 'case', 'catch', 'continue', 'default', 'delete', 'do', 'else',
      'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof',
      'var', 'void', 'while', 'with', 'abstract', 'boolean', 'byte', 'char', 'class', 'const',
      'debugger', 'double', 'enum', 'export', 'extends', 'final', 'float', 'goto', 'implements', 'import', 'int', 'interface',
      'long', 'native', 'package', 'private', 'protected', 'public', 'short',
      'static', 'super', 'synchronized', 'throws', 'transient', 'volatile'
    ], // Запрещено использовать ключевые слова или зарезервированные слова в качестве имен переменных

    /* Правила объявления переменных */
    // 'vars-on-top': 1, // требуется, чтобы объявления переменных располагались в верхней части их области видимости
    'one-var': ['error', {let: 'always',
      'const': 'never'}], // Каждая область позволяет одно объявление переменной, но непрерывные объявления переменных необходимо объединить в одно объявление

    'prefer-const': [1],

    /* Правила, связанные с функциями */
    'wrap-iife': [1, 'inside'], // Слой скобок должен быть окружен функцией немедленного выполнения
    'func-names': [1, 'never'], // Не называйте встроенную функцию

    /* Правила, связанные с массивами и объектами */
    'quote-props': [1, 'as-needed', { // Имя атрибута литерала объекта Используйте кавычки, если это ключевое слово или число, иначе кавычки не используйте
      keywords: true,
      unnecessary: true,
      numbers: true
    }],
    'object-curly-newline': [2],
    'object-property-newline': ['error', {allowAllPropertiesOnSameLine: true}], // Разные атрибуты объекта размещаются на разных строках

    /* Правила, связанные с скобками */
    curly: 1, // Используйте фигурные скобки, даже если в управляющем операторе только одна строка

    /* правила связанные с jshint */
    eqeqeq: 0, // Отключена ошибка ===
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [1, { // Запрещаем сначала использовать переменные и классы, а затем объявлять
      functions: false,
      classes: true,
      variables: true
    }],
    'no-new': 1, // Не используйте конструктор просто в предложении кода, не забудьте присвоить его переменной
    'no-extra-parens': [1, 'all', {ignoreJSX: 'all'}], // запретить ненужные скобки
    'no-unused-vars': 0, // Без проверки Определить неиспользуемые переменные
    'no-undef': 0, // Нельзя использовать неопределенные переменные
    'no-console': 0, // не могу совместить
    'no-extend-native': 0, // Запрещаем расширение собственных типов
    'no-debugger': 1, // Подскажет, когда есть отладчик
    'no-loop-func': 1, // Запрещено объявлять функции в циклах
    'no-array-constructor': 1, // Отключаем конструктор массива,
    'no-new-object': 1, // Отключаем конструктор объекта
    'no-new-func': 1, // отключаем конструктор функций
    'no-new-wrappers': 1, // Запрещено использовать новый оператор для String, Number и Boolean

    /* Прочие связанные правила */
    'linebreak-style': 0, // Используйте 'LF' для разрывов строк
    'consistent-this': [1, '_this', 'that', 'self'], // Ссылка на контекст this может быть названа только с использованием одного из'_this ',' that 'и'self'
    'no-empty-function': 1 // Нет пустой функции
  }
};

