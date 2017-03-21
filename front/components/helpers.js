const countRubrics = (vacancies) => {
  const rubrics = {};

  // Проходим по каждой загруженной вакансии, чтобы посмотреть, какие есть рубрики
  // Считаем количество вакансий, которые отсносятся к каждой рубрике
  for (let i = 0; i < vacancies.length; i++) {
    const vacancy = vacancies[i];

    // Проходим по всем рубрикам для текущей вакансии
    for (let j = 0; j < vacancy.rubrics.length; j++) {
      const rubric = vacancy.rubrics[j];
      const rubricId = rubric.id;

      // Если такая рубрика уже попадалась, добавляем к счетчику 1
      if (rubrics[rubricId]) rubrics[rubricId].vacancyCount++;
      // Если нет, сохраняем рубрику и выставляем счетчик в единицу
      else {
        rubrics[rubricId] = rubric;
        rubrics[rubricId].vacancyCount = 1;
      }
    }
  }

  // Добавляем рубрики из объекта в массив
  const rubricsArray = [];

  for (let rubricId in rubrics) {
    rubricsArray.push(rubrics[rubricId]);
  }
  // Сортируем массив с рубриками по количеству вакансий
  rubricsArray.sort((a, b) => {
    return b.vacancyCount - a.vacancyCount;
  });

  return rubricsArray;
}


const countWords = (vacancies, smartWordsDetection) => {
  const wordsCounters = {};
  const wordsArray = []

  // Проходим по всем вакансиям, чтобы поситать слова
  for (let vacancyKey in vacancies) {
    const header = vacancies[vacancyKey].header;
    const words = header.split(" ");
    // Проходим по каждому слову в названии вакансии
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      // Если включена опция "Умное распознавание", то запускаем волшебный алгоритм распознавания
      if (smartWordsDetection) {
        // Если попадается предлог
        if (word == 'по' || word == 'в' || word == 'с' || word == 'на' || word == 'и' || word == 'для') {
          // При этом слово не первое и не последнее в списке
          if (i > 0 && i < words.length - 1) {
            // То объединяем этот предлог с предыдущим и со следующим словом
            word = [words[i-1], words[i], words[i+1]].join(' ');
            words[i-1] = word;
            words.splice(i, 2);
            i -= 2;
            continue;
          }
        }
        // Смотрим на последнюю букву слова, если это й, ю, х, у, я, то объединяем слово со следующим
        // так как, скорее всего, это прилагательное
        if (word.search(/([й,ю,х,у,я,е, с, в, по, на, и, для])$/i) != -1) {
          // Если  так, то объединяем это слово со следующим
          if (words[i + 1]) {
            word = [words[i], words[i + 1]].join(' ');
            words[i] = word;
            words.splice(i + 1, 1);
            i--;
            continue;
          }
        }
      }
      // Пропускаем пустую строку
      if (word == '') continue;
      // Подсчитываем статисктику для слова
      if (wordsCounters[word]) wordsCounters[word]++;
      else wordsCounters[word] = 1;
    }
  }
  // Перемещаем все слова с их счетчиками в массив для сортировки
  for (let wordKey in wordsCounters) {
    wordsArray.push({
      value: wordKey,
      count: wordsCounters[wordKey]
    });
  }
  // Сортируем слова по частоте встречаемости
  wordsArray.sort((a, b) => {
    return b.count - a.count;
  })

  return wordsArray;
}

export { countWords, countRubrics }
