import React, { Component } from 'react';
import classNames from 'classnames';
import ReactStopwatch from 'react-stopwatch';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z'];

    this.state = {
      letters: letters,
      pendingLetters: letters,
      skippedLetters: [],
      successLetters: [],
      errorLetters: [],
      initialized: false,
      activeIndex: 0,
      paused: false,
      runningTime: 0,
    }
  }

  buttonPressed(type) {
    const { activeIndex, pendingLetters, successLetters, errorLetters, skippedLetters } = this.state;
    switch(type) {
      case 'success':
        this.setState({
          pendingLetters: pendingLetters.filter(letter => letter !== pendingLetters[activeIndex]),
          successLetters: [...successLetters, pendingLetters[activeIndex]],
          activeIndex: (activeIndex >= pendingLetters.length - 1) ? 0 : activeIndex,
        }, () => {
          if (this.state.pendingLetters.length === 0) {
            clearInterval(this.timer);
          }
        });
        break;
      case 'error':
        clearInterval(this.timer);
        this.setState({
          pendingLetters: pendingLetters.filter(letter => letter !== pendingLetters[activeIndex]),
          errorLetters: [...errorLetters, pendingLetters[activeIndex]],
          activeIndex: (activeIndex >= pendingLetters.length - 1) ? 0 : activeIndex,
          paused: true,
        });
        break;
      case 'skipped':
        clearInterval(this.timer);
        this.setState({
          skippedLetters: [...skippedLetters, pendingLetters[activeIndex]],
          activeIndex: (activeIndex === pendingLetters.length - 1) ? 0 : activeIndex + 1,
          paused: true,
        });
        break;
      default:
    }
  }

  render() {
    const { letters, skippedLetters, pendingLetters, successLetters, errorLetters, initialized, activeIndex, runningTime, paused } = this.state;

    return (
      <div className="app-container">
        <div className="rosco-container">
          <div className='rosco'>
            {letters.map(letter => {
              const letterActive = pendingLetters[activeIndex] === letter;
              const letterClassNames = classNames('letter', {
                'letter-active': initialized && letterActive,
                'letter-skipped': skippedLetters.includes(letter) && !letterActive,
                'letter-success': successLetters.includes(letter) && !letterActive,
                'letter-error': errorLetters.includes(letter) && !letterActive,
              });
              return (
                <span className={letterClassNames} key={letter}>{letter}</span>
              )
            })}

            <div className="buttons">
              {
                initialized && (
                  <span className="time">
                    {Math.round(runningTime / 1000, 0)} segundos
                </span>
                )
              }

              {!initialized && (
                <button className="start-button" onClick={() => {
                  this.setState({ initialized: true });
                  const startTime = Date.now() - runningTime;
                  this.timer = setInterval(() => {
                    this.setState({ runningTime: Date.now() - startTime });
                  }, 1000);
                }}>Empezar</button>
              )}

              {initialized && paused && pendingLetters.length > 0 && (
                <button className="start-button" onClick={() => {
                  this.setState({ paused: false });
                  const startTime = Date.now() - runningTime;
                  this.timer = setInterval(() => {
                    this.setState({ runningTime: Date.now() - startTime });
                  }, 1000);
                }}>Continuar</button>
              )}

              {initialized && !paused && pendingLetters.length > 0 && (
                <React.Fragment>
                  <button className="success-button" onClick={() => this.buttonPressed("success")}>Correcto</button>
                  <button className="error-button" onClick={() => this.buttonPressed("error")}>Error</button>
                  <button className="skipped-button" onClick={() => this.buttonPressed("skipped")}>Pasapalabra</button>
                </React.Fragment>
              )}

              {initialized && pendingLetters.length === 0 && (
                <div className="status">
                  <p>{successLetters.length} correctas</p>
                  <p>{errorLetters.length} incorrectas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
