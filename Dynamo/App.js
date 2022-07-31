import React, {Component} from 'react';
import querystring from "querystring";
import ApiService from './Services/ApiService';
import './App.css'
import Locker from 'lockr';
import AuthService from './Services/AuthService';
// import Dynamo from './Dynamo';

// import InternalBasket from './InternalBasket'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import MarketProjector from './market-projector/components/MarketProjector';
import Loader from './common_components/loader/Loader';
import Dynamo from './Dynamo';


class App extends Component {
  constructor(props) {
    super(props);
    let {token} = querystring.parse(window.location.search.replace('?', ''));
    if (token) {
        Locker.set(
            "token",token
        )
    }
    else {
        token = Locker.get("token")
    }
    this.state = {
      token,
        authorised: false,
        loader: true
    }
  }

  componentDidMount() {
    if(this.state.token) {
        AuthService.setToken(this.state.token)
        ApiService.get('v3/user/basic/', res => {
            this.setState({
                basic: res,
                authorised: true,
                loader: false
            })
        }, () => {
            this.setState({
                authorised: false,
                loader: false

            })
        })
    } else {
        // if(AuthService.setToken()){
        //  AuthService.removeToken()
        // }
        this.setState({
            loader: false
        })
    }

  }

  render() {
    if(this.state.loader) return <div className="centerBody">
          <Loader/>
      </div>
    // if(!this.state.authorised) return NotAuthorisedView()
        return (<Router>
            <Switch>
                <Route path="/" component={MarketProjector}/>
                <Route path={'/v0'} exact={true} component={() => <Dynamo basic={this.state.basic}/>}  />
                {/* <Route path={'/user_baskets'} exact={true} component={InternalBasket} /> */}
            </Switch>

                {/*POC APPLICATION*/}

                </Router>);
    }
}


export const NotAuthorisedView = () => <div className={'centerBody'}>
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-exclamation" width="100" height="100" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        <line x1="19" y1="7" x2="19" y2="10" />
        <line x1="19" y1="14" x2="19" y2="14.01" />
    </svg>
    <p>
        Not authorised. Please provide valid credentials.
    </p>
</div>
export default App;
