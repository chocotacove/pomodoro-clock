import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props);
    this.interval = undefined;
    this.state = {
      clockName: 'Session',
      sessionTimer: 25,
      clockCount: 25 * 60,
      breakTimer: 5,
      isRunning: false,
    }
    this.handleBreakPlus = this.handleBreakPlus.bind(this);
    this.handleBreakMinus = this.handleBreakMinus.bind(this);
    this.handleSessionPlus = this.handleSessionPlus.bind(this);
    this.handleSessionMinus = this.handleSessionMinus.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
  }
  handleBreakPlus() {
    if (this.state.breakTimer < 60)
    this.setState({
      breakTimer: this.state.breakTimer+ 1
    })
  }
  handleBreakMinus() {
   if (this.state.breakTimer > 1) 
    this.setState({
      breakTimer: this.state.breakTimer - 1
    })
  }
  handleSessionPlus() {
    if (this.state.sessionTimer < 60)
    this.setState({
      sessionTimer: this.state.sessionTimer +1,
      clockCount: (this.state.sessionTimer +1) * 60,
    })
  }
  handleSessionMinus() {
    if (this.state.sessionTimer > 1)
    this.setState({
      sessionTimer: this.state.sessionTimer - 1,
      clockCount: (this.state.sessionTimer -1) * 60,
    })
  }
  getTime(count){
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;
    minutes = minutes < 10? '0'+minutes: minutes;
    seconds = seconds < 10? '0'+ seconds: seconds;
    return `${minutes}:${seconds}`
  }
  handlePlayPause() {
    const { isRunning } = this.state;
    if (isRunning) {
      clearInterval(this.interval)
      this.setState({
        isRunning: false,
      })     
    } else {
      this.setState({
        isRunning: true,
      })
      this.interval = setInterval(() => {
        const { clockCount, clockName } = this.state;
        if (clockCount === 0){
          if (clockName === 'Session') {
            document.querySelector('audio').play();
            this.setState({
              clockName: 'Break',
              clockCount: this.state.breakTimer * 60,
            })
          } else {
            document.querySelector('audio').play();
            this.setState({
              clockName: 'Session',
              clockCount: this.state.sessionTimer * 60,
            })
          }
        } else {
          this.setState({
            clockCount: clockCount - 1,
          })
        }
      }, 1000)
    }
  }
  handleReset() {
    document.querySelector('audio').pause();
    document.querySelector('audio').currentTime = 0;
    clearInterval(this.interval);
    this.interval = undefined;
    this.setState({
      clockName: 'Session',
      clockCount: 25 * 60,
      breakTimer: 5,
      sessionTimer: 25,
      isRunning: false,
    })
  }
  render() {
    const { breakTimer, 
           sessionTimer, 
           clockCount,
           clockName,
           isRunning
          } = this.state;
    return(    
    <div className="container">
        <h1>Pomodoro Clock</h1>
    <div className="btn-container">
    <Timer 
      timerId="break-length"
      incrementId="break-increment" 
      decrementId="break-decrement" 
      titleId="break-label" 
      title='Break' 
      timer={breakTimer} 
      onPlusClick={this.handleBreakPlus}  
      onMinusClick={this.handleBreakMinus}/>
    <Timer 
      timerId="session-length"
      incrementId="session-increment" 
      decrementId="session-decrement" 
      titleId="session-label" 
      title='Session' 
      timer={sessionTimer} 
      onPlusClick={this.handleSessionPlus} 
      onMinusClick={this.handleSessionMinus}/>
        </div>
        
          <p id="timer-label">{clockName}</p>
        <div id="time-left" className="clock">
          {this.getTime(clockCount)}
        </div>
        <div className="controls">
          <button id="start_stop" onClick={this.handlePlayPause}><i className={`fa fa-${isRunning? `pause`: `play`} fa-2x`}></i></button>
          <button id="reset" onClick={this.handleReset}><i className="fa fa-sync-alt fa-2x"></i></button>
        </div>
        
    </div>
    )}
}

const Timer = (props) => {
  const { title, 
         onMinusClick, 
         onPlusClick, 
         timer, 
         titleId, 
         incrementId, 
         decrementId,
         timerId,
        } = props;
  return (
    <div className="timer-container">
      <span id={titleId}>{title}</span>
  <div className="timer">      
      <button id={decrementId} onClick={onMinusClick}><i className="fa fa-minus fa-2x"></i></button>
    <span id={timerId}>{timer}</span>
    <button id={incrementId} onClick={onPlusClick}><i className="fa fa-plus fa-2x"></i></button>
      
  </div>
  </div>
  )}

ReactDOM.render(<App />, document.getElementById('app'))

export default App;
