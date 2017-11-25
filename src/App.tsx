import * as React from 'react';
import './App.css';
import {inject, observer, Provider} from 'mobx-react';
import {observable} from 'mobx';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router';

const colorsStore = observable({
  foreground: 'red',
  background: 'blue'
});

@inject('colors') @observer
class Button extends React.Component<{colors?: {[key: string]: string}, label: string; onClick?: () => void}> {
  render() {
    const { colors, label, onClick } = this.props;
    
    return (
      <button style={{color: colors && colors.foreground, backgroundColor: colors && colors.background}} onClick={onClick}>
        {label}
      </button>
    );
  }
}

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

class Second extends React.Component {
  render() {
    console.log(this.props);
    
    return (
      <div>
        <h2>Second</h2>
        <Button label={'Test'}/>
      </div>
    );
  }
}

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

import './New.css';
const New = () => (
  <div className="New">Dfsdfdsfsd</div>
);

export class App extends React.Component {
  render() {
    return (
      <Provider colors={colorsStore}>
        <div className="App">
          <div className="App-header">
            <h2>Welcome to ReactDDD <New/></h2>
          </div>
          <Router>
            <div>
              <Route exact={true} path="/" component={Home}/>
              <Route path="/about" component={About}/>
              <Route path="/topics" component={Second}/>
            </div>
          </Router>
        </div>
      </Provider>
    );
  }
}
