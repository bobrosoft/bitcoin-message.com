import * as React from 'react';
import './App.css';
import {Provider} from 'mobx-react';
import {observable} from 'mobx';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router';
import {HomePage} from '../HomePage/HomePage';

const colorsStore = observable({
  foreground: 'red',
  background: 'blue'
});

// @inject('colors') @observer
// class Button extends React.Component<{colors?: {[key: string]: string}, label: string; onClick?: () => void}> {
//   render() {
//     const { colors, label, onClick } = this.props;
//    
//     return (
//       <button style={{color: colors && colors.foreground, backgroundColor: colors && colors.background}} onClick={onClick}>
//         {label}
//       </button>
//     );
//   }
// }

export class App extends React.Component {
  render() {
    return (
      <Provider colors={colorsStore}>
        <div className="App">
          <div className="App-header">
            <h2>Welcome to ReactDDD</h2>
          </div>
          <Router>
            <div>
              <Route exact={true} path="/" component={HomePage}/>
              {/*<Route path="/about" component={About}/>*/}
              {/*<Route path="/topics" component={Second}/>*/}
            </div>
          </Router>
        </div>
      </Provider>
    );
  }
}
