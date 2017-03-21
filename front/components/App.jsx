import React from 'react';
import axios from 'axios';

import VacanciesProgressBar from './VacanciesProgressBar.jsx';
import RubricsTopTable from './RubricsTopTable.jsx';
import WordsTopTable from './WordsTopTable.jsx';
import CustomCheckbox from './CustomCheckbox.jsx';

import * as Helpers from './helpers.js';

const API_BASE = 'https://api.zp.ru/v1';
const CONFIG = {
  period: 'today',
  onlyNew: true,
  limit: 100,
  geoId: 826
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      vacanciesLoaded: false,
      vacancies: [],
      count: 0,
      offset: 0,
      rubrics: [],
      words: [],
      smartWordsDetection: false,
      geoId: null
    }
  }

  loadVacancies() {
    axios.get(`${API_BASE}/vacancies/?
      period=${CONFIG.period}&
      geo_id=${this.state.geoId}&
      limit=${CONFIG.limit}&
      is_new_only=${CONFIG.onlyNew}&
      offset=${this.state.offset}
      `)
      .then(({ data }) => {
        this.setState(prevState => ({
          count: data.metadata.resultset.count,
          vacancies: prevState.vacancies.concat(data.vacancies),
          offset: prevState.offset + data.vacancies.length
        }));
        // Если загруженное количество вакансий меньше, чем общее их количество
        // Вызываем метод еще раз
        if (this.state.offset < this.state.count)
          this.loadVacancies();
        // Если загружены все вакансии, вызываем методы для подсчета статистики
        else {
          this.setState({ vacanciesLoaded: true });
          this.countRubrics();
          this.countWords();
        }
      })
      .catch((error) => console.log(error));
  }

  countRubrics() {
    const rubrics = Helpers.countRubrics(this.state.vacancies);
    this.setState({ rubrics });
  }

  countWords() {
    const words = Helpers.countWords(
      this.state.vacancies, this.state.smartWordsDetection
    );
    this.setState({ words });
  }

  componentDidMount() {
    this.loadVacancies();
  }

  smartDetectionChange() {
    this.setState(
      (prevState) => ({ smartWordsDetection: ! prevState.smartWordsDetection }),
      () => { this.countWords(); } // Обновляем топ слов, когда setState завершится
    );
  }

  handleRefresh() {
    this.setState({
      vacanciesLoaded: false,
      vacancies: [],
      offset: 0
    });
    this.loadVacancies();
  }

  geoIdChange() {
    const newGeoId = (this.state.geoId) ? null : CONFIG.geoId;
    this.setState({ geoId: newGeoId }, () => this.handleRefresh());
  }

  render() {
    return (
      <div className="container">
        <div className="row mt-3">
          <div className="col">
            <h2>
              Загрузка вакансий: { this.state.offset } / { this.state.count }
            </h2>
            <CustomCheckbox
              checked={ this.state.onlyNsk }
              onChange={ this.geoIdChange.bind(this) }>
              Только Новосибирск
            </CustomCheckbox>
            <button
              type="button" className="btn btn-secondary"
              onClick={ this.handleRefresh.bind(this) }>
              Перезагрузить
            </button>
          </div>
        </div>

        <VacanciesProgressBar progress={ this.state.offset / this.state.count * 100 }/>

        { this.state.vacanciesLoaded &&
          <div className="row mt-3">
            <div className="col">
              <h3 className="mt-5">Топ рубрик по количеству вакансий:</h3>
              <RubricsTopTable rubrics={ this.state.rubrics } />

              <h3 className="mt-5">Топ слов по упоминанию в заголовках вакансий:</h3>
              <CustomCheckbox
                checked={ this.state.smartWordsDetection }
                onChange={ this.smartDetectionChange.bind(this) }>
                Включить <del>не очень</del> очень умное распознавание словосочетаний
              </CustomCheckbox>
              <WordsTopTable words={ this.state.words } />
            </div>
          </div>
        }
      </div>
    );
  }
}
