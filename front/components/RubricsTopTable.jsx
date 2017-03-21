import React from 'react';

const RubricsTopTable = ({ rubrics }) => {

  const rubricsTableLines = rubrics.map((rubric) =>
    <tr key={ rubric.id }>
      <td>{ rubric.title }</td>
      <td>{ rubric.vacancyCount }</td>
    </tr>
  );

  return (
    <table className="table mt-3">
      <thead>
        <tr>
          <th>Рубрика</th>
          <th>Количество вакансий</th>
        </tr>
      </thead>
      <tbody>
        { rubricsTableLines }
      </tbody>
    </table>
  )
}

export default RubricsTopTable;
