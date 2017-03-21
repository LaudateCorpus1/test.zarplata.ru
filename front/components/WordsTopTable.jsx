import React from 'react';

const WordsTopTable = ({ words }) => {

  const wordsTableLines = words.map((word, index) =>
    <tr key={ index }>
      <td>{ word.value }</td>
      <td>{ word.count }</td>
    </tr>
  );

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Слово</th>
          <th>Количество упоминаний</th>
        </tr>
      </thead>
      <tbody>
        { wordsTableLines }
      </tbody>
    </table>
  )
}

export default WordsTopTable;
