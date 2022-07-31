import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input,Collapse, Button, Checkbox, Space, Slider , Select, TreeSelect, Row, Col, Layout, Divider, InputNumber, Card} from 'antd';
import Plot from 'react-plotly.js';
import { DatePicker, message } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import MarketCondition from './MarketConditionPicker.js'; 
import CurrentAllocation from './CurrentAllocationSetter.js'; 
import SuggestedAllocation from './SuggestedAllocation'
import TargetAllocation from './TargetAllocation'
import {riskProfileMapping} from './utils'
import RedemptionLogic from './RedemptionLogic'
import axios from 'axios';
import rank1 from './images/rank1.png';
import rank2 from './images/rank2.png';
import rank3 from './images/rank3.png';
import rank4 from './images/rank4.png';
import rank5 from './images/rank5.png';
import rank6 from './images/rank6.png';
import rank7 from './images/rank7.png';
import rank8 from './images/rank8.png';
import rank9 from './images/rank9.png';
import rank10 from './images/rank10.png';

import WhiteCards from './common_components/WhiteCards'
import CardDarkBlue from './common_components/CardDarkBlue'

import {
  AreaChart,BarChart,Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer, Legend,LineChart, Line, ReferenceLine
} from 'recharts';

const l2MarketChildLevels = [
  {
    title: 'Neutral',
    value: 'Neutral',
  },
  {
    title: 'Attractive',
    value: 'Attractive',
  },
  {
    title: 'Very Attractive',
    value: 'Very Attractive',
  },
  {
    title: 'Risky',
    value: 'Risky',
  },
  {
    title: 'Very Risky',
    value: 'Very Risky',
  }
]

const dynamo_level_mapping = {
  '1':'Very Risky',
  '2':'Risky',
  '3':'Neutral',
  '4':'Attractive',
  '5':'Very Attractive'
}

const expl_var_mapping = {
  'msci_em_std_close_price':'MSCI EM',
  '10y_yield_us':'US 10Y Yield',
  'ftse_rel_min504d':'FTSE 100',
  'nifty50_pe':'Nifty 50 PE',
  'macd_indicator_502_251_188':'MACD Indicator',
  'nifty50_beer':'Nifty50 BEER',
  'dj_rel_min336d':'Dow Jones',
  'msci_em_rel_min504d':'MSCI EM',
  '3m_yield_india':'India 3m Yield',
  'msci_em_rel_max441d':'MSCI EM',
  'nikkei_rel_min399d':'NIKKEI 225',
  'nifty50_pe_std':'Nifty 50 PE',
  '3m_yield_india_std':'India 3m Yield',
  'nifty_std_close_price':'Nifty 50',
  'nifty50_beer_std':'Nifty BEER',
  '2y_yield_india_std':'India 2Y Yield',
  'dax_std_close_price':'DAX 30',
  
}

var config = {responsive: true}

const { Header, Footer, Sider, Content } = Layout;
const style = { background: '#0092ff', padding: '8px 0' };
const equity_return = 0.1;
const debt_return = 0.08;


const outlook_signal_url = 'http://dev-dynamo.indiawealth.in/api/v1/dynamo/dynamo_signal/';
const current_holdings_url = 'http://dev-dynamo.indiawealth.in/api/v1/dynamo/dynamo_recomendation/';
const requestOptions = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic aG9sZGluZ19zZXJ2aWNlOnFINmdZPUJZNlw5Ug==' 
            },
  data: JSON.stringify([
    {
        "as_on": "2021-01-28"
    }])
};



class Dynamo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        l1_equity: 50,
        l1_debt: 50,
        l1_liquid: 0,
        risk_profile: 'Aggressive',
       
        curr_signal:0,
        last_day:0,
        last_week:0,
        last_month:0,
        last_qtr:0,

        callFunc:0,
        equity_state:'Cheap',
        outlook_signal: 2.5,
        large_cap_state: 'Neutral',
        all_names:{},
        all_status:{},
        all_text:{},
        mid_cap_state:   'Neutral',
        current_rank:1,
        small_cap_state: 'Neutral',
        multi_cap_state: 'Neutral',
        expected_return: 0.08,
        expected_return_sugg: 0.08,
        l1_sugg_equity: 0.5,
        l1_sugg_debt: 0.5,
        xmean: ['2017', '2018', '2019'],
        showPopUp:false,
        ymean: [2, 6, 3],
        xmean_sugg: ['2017', '2018', '2019'],
        ymean_sugg: [2.5, 5.5, 3.5],

        holdings_status:"error",
        total_amt:100000,
        dynamo_signal:3,
        pe_zone:'Sell',
        fresh_val:0,
        expl_var_1:'msci_em_std_close_price',
        expl_var_1_level:3,
        expl_var_1_last_day:0,
        expl_var_1_last_week:0,
        expl_var_1_current:0,
        expl_var_1_last_month:0,
        expl_var_1_last_qtr:0,
        expl_var_2_current:0,
        expl_var_2_last_day:0,
        expl_var_2_last_week:0,
        expl_var_2_last_month:0,
        expl_var_2_last_qtr:0,

        expl_var_3_current:0,
        expl_var_3_last_day:0,
        expl_var_3_last_week:0,
        expl_var_3_last_month:0,
        expl_var_3_last_qtr:0,

        expl_var_4_current:0,
        expl_var_4_last_day:0,
        expl_var_4_last_week:0,
        expl_var_4_last_month:0,
        expl_var_4_last_qtr:0,

        expl_var_5_current:0,
        expl_var_5_last_day:0,
        expl_var_5_last_week:0,
        expl_var_5_last_month:0,
        expl_var_5_last_qtr:0,
        
        expl_var_6_current:0,
        expl_var_6_last_day:0,
        expl_var_6_last_week:0,
        expl_var_6_last_month:0,
        expl_var_6_last_qtr:0,

        expl_var_7_current:0,
        expl_var_7_last_day:0,
        expl_var_7_last_week:0,
        expl_var_7_last_month:0,
        expl_var_7_last_qtr:0,

        expl_var_8_current:0,
        expl_var_8_last_day:0,
        expl_var_8_last_week:0,
        expl_var_8_last_month:0,
        expl_var_8_last_qtr:0,

        expl_var_9_current:0,
        expl_var_9_last_day:0,
        expl_var_9_last_week:0,
        expl_var_9_last_month:0,
        expl_var_9_last_qtr:0,

        expl_var_10_current:0,
        expl_var_10_last_day:0,
        expl_var_10_last_week:0,
        expl_var_10_last_month:0,
        expl_var_10_last_qtr:0,
        expl_var_2:'10y_yield_us',
        expl_var_2_level:2,


        var1_impact:0,
        var2_impact:0,
        var3_impact:0,
        var4_impact:0,
        var5_impact:0,
        var6_impact:0,
        var7_impact:0,
        var8_impact:0,
        var9_impact:0,
        var10_impact:0,
        marker_pt:0,
        expl_var_3:'ftse_rel_min504d',
        expl_var_3_level:2,
        expl_var_4:'nifty50_pe',
        expl_var_4_level:3,
        expl_var_5:'macd_indicator_502_251_188',
        expl_var_5_level:3,

        expl_var_6:'nifty50_beer',
        expl_var_6_level:3,
        expl_var_7:'dj_rel_min336d',
        expl_var_7_level:4,
        expl_var_8:'msci_em_rel_min504d',
        expl_var_8_level:5,
        expl_var_9:'3m_yield_india',
        expl_var_9_level:3,
        expl_var_10:'msci_em_rel_max441d',
        expl_var_10_level:3,


        expl_var_1_desc:"",
        expl_var_2_desc:"",
        expl_var_3_desc:"",
        expl_var_4_desc:"",
        expl_var_5_desc:"",
        expl_var_6_desc:"",
        expl_var_7_desc:"",
        expl_var_8_desc:"",
        expl_var_9_desc:"",
        expl_var_10_desc:"",


        latest_signal_data:{},
        latest_date:"2021-02-10",
        nifty_pe:0,
        usr_current_eq:0.5,
        usr_current_dt:0.5,
        usr_current_lq:0,
        usr_sugg_eq:0.5,
        usr_sugg_dt:0.5,
        usr_sugg_lq:0,
        eq_amt:1000,
        dt_amt:1000,
        lq_amt:0,
        today_dt:0.5,
        today_lq:0,
        today_eq:0.5


      };
    
    

    this.onSelect = this.onSelect.bind(this);

}

  formatter = value => {
  return `${value}%`;
  }


  market_signal() {

    fetch("https://ind-dynamo.indiawealth.in/api/v1/dynamo/current_signal/")
    .then( response => {
      if (!response.ok) {
        // get error message from body or default to response status
        const error = response.status;
        return Promise.reject(error);
                }
      return response.json()
    })
      .then( resp => {


        // console.log('\n \n Current signal api has been called')

        var out = 0;
        var scale_length = 16
        var divisions = 5
        var lower_limit = -8
        var inner_block_scale = 20
        out = (inner_block_scale*resp['data']['signal']['dynamo_signal'])+( (resp['data']['signal']['predicted_outlook_signal']/(scale_length/divisions)*inner_block_scale))


        console.log('indicator block : ',(lower_limit + ((scale_length/divisions)*resp['data']['signal']['dynamo_signal']) ))
        console.log((((lower_limit + ((scale_length/divisions)*resp['data']['signal']['dynamo_signal']) )+ resp['data']['signal']['predicted_outlook_signal'])/(scale_length/divisions)))

        console.log('measure',inner_block_scale*resp['data']['signal']['dynamo_signal'],(-lower_limit + ((scale_length/divisions)*resp['data']['signal']['dynamo_signal']) ))

       var rank_names = {
       }
       var rank_status = {
       }

       var rank_text = {

       }

       
      
       for(var p=0;p<=resp['data']['explanation'].length;p++){
         if (resp['data']['explanation'][p]!= undefined)
         
         {rank_names[p+1] = resp['data']['explanation'][p]['var_name']
         rank_status[p+1] = resp['data']['explanation'][p]['category']}
         else {
           continue
         }
        //  rank_names[p+1] = expl_var_mapping[resp['data']['explanation'][p]['text']]

       }



      //  console.log("rank_names",rank_names)
        // console.log('response : ',resp)
        this.setState({
          all_names:rank_names,
          all_status:rank_status,
          all_text:rank_text,
          latest_date:resp['data']['signal']['as_on'],
          marker_pt:out,
          outlook_signal:resp['data']['signal']['predicted_outlook_signal'],
          nifty_pe:resp['data']['signal']['Nifty50_PE'],
          
          last_day:resp['data']['signal']['last_day_outlook_signal'],
          last_week:resp['data']['signal']['last_week_outlook_signal'],
          last_month:resp['data']['signal']['last_month_outlook_signal'],

          last_qtr:resp['data']['signal']['last_qtr_outlook_signal'],

          dynamo_signal:resp['data']['signal']['dynamo_signal'],
          equity_state:dynamo_level_mapping[resp['data']['signal']['dynamo_signal'].toString()],
          expl_var_1:resp['data']['explanation'][0]['var_name'],
          expl_var_2:resp['data']['explanation'][1]['var_name'],
          expl_var_3:resp['data']['explanation'][2]['var_name'],
          expl_var_4:resp['data']['explanation'][3]['var_name'],
          expl_var_5:resp['data']['explanation'][4]['var_name'],
          expl_var_6:resp['data']['explanation'][5]['var_name'],
          expl_var_7:resp['data']['explanation'][6]['var_name'],
          expl_var_8:resp['data']['explanation'][7]['var_name'],
          expl_var_9:resp['data']['explanation'][8]['var_name'],
          expl_var_10:resp['data']['explanation'][9]['var_name'],

          expl_var_1_desc:resp['data']['explanation'][0]['description'],
          expl_var_2_desc:resp['data']['explanation'][1]['description'],
          expl_var_3_desc:resp['data']['explanation'][2]['description'],
          expl_var_4_desc:resp['data']['explanation'][3]['description'],
          expl_var_5_desc:resp['data']['explanation'][4]['description'],
          expl_var_6_desc:resp['data']['explanation'][5]['description'],
          expl_var_7_desc:resp['data']['explanation'][6]['description'],
          expl_var_8_desc:resp['data']['explanation'][7]['description'],
          expl_var_9_desc:resp['data']['explanation'][8]['description'],
          expl_var_10_desc:resp['data']['explanation'][9]['description'],

          expl_var_1_level:resp['data']['explanation'][0]['category'],
          expl_var_2_level:resp['data']['explanation'][1]['category'],
          expl_var_3_level:resp['data']['explanation'][2]['category'],
          expl_var_4_level:resp['data']['explanation'][3]['category'],
          expl_var_5_level:resp['data']['explanation'][4]['category'],

          expl_var_6_level:resp['data']['explanation'][5]['category'],
          expl_var_7_level:resp['data']['explanation'][6]['category'],
          expl_var_8_level:resp['data']['explanation'][7]['category'],
          expl_var_9_level:resp['data']['explanation'][8]['category'],
          expl_var_10_level:resp['data']['explanation'][9]['category'],

          expl_var_1_rank:resp['data']['explanation'][0]['var_rank'],
          expl_var_2_rank:resp['data']['explanation'][1]['var_rank'],
          expl_var_3_rank:resp['data']['explanation'][2]['var_rank'],
          expl_var_4_rank:resp['data']['explanation'][3]['var_rank'],
          expl_var_5_rank:resp['data']['explanation'][4]['var_rank'],

          expl_var_6_rank:resp['data']['explanation'][5]['var_rank'],
          expl_var_7_rank:resp['data']['explanation'][6]['var_rank'],
          expl_var_8_rank:resp['data']['explanation'][7]['var_rank'],
          expl_var_9_rank:resp['data']['explanation'][8]['var_rank'],
          expl_var_10_rank:resp['data']['explanation'][9]['var_rank'],

          expl_var_1_current:resp['data']['explanation'][0]['current_value'],
          expl_var_1_last_day:resp['data']['explanation'][0]['last_day_value'],
          expl_var_1_last_week:resp['data']['explanation'][0]['last_week_value'],
          expl_var_1_last_month:resp['data']['explanation'][0]['last_month_value'],
          expl_var_1_last_qtr:resp['data']['explanation'][0]['last_qtr_value'],

          expl_var_2_current:resp['data']['explanation'][1]['current_value'],
          expl_var_2_last_day:resp['data']['explanation'][1]['last_day_value'],
          expl_var_2_last_week:resp['data']['explanation'][1]['last_week_value'],
          expl_var_2_last_month:resp['data']['explanation'][1]['last_month_value'],
          expl_var_2_last_qtr:resp['data']['explanation'][1]['last_qtr_value'],

          expl_var_3_current:resp['data']['explanation'][2]['current_value'],
          expl_var_3_last_day:resp['data']['explanation'][2]['last_day_value'],
          expl_var_3_last_week:resp['data']['explanation'][2]['last_week_value'],
          expl_var_3_last_month:resp['data']['explanation'][2]['last_month_value'],
          expl_var_3_last_qtr:resp['data']['explanation'][2]['last_qtr_value'],

          expl_var_4_current:resp['data']['explanation'][3]['current_value'],
          expl_var_4_last_day:resp['data']['explanation'][3]['last_day_value'],
          expl_var_4_last_week:resp['data']['explanation'][3]['last_week_value'],
          expl_var_4_last_month:resp['data']['explanation'][3]['last_month_value'],
          expl_var_4_last_qtr:resp['data']['explanation'][3]['last_qtr_value'],


          expl_var_5_current:resp['data']['explanation'][4]['current_value'],
          expl_var_5_last_day:resp['data']['explanation'][4]['last_day_value'],
          expl_var_5_last_week:resp['data']['explanation'][4]['last_week_value'],
          expl_var_5_last_month:resp['data']['explanation'][4]['last_month_value'],
          expl_var_5_last_qtr:resp['data']['explanation'][4]['last_qtr_value'],


          expl_var_6_current:resp['data']['explanation'][5]['current_value'],
          expl_var_6_last_day:resp['data']['explanation'][5]['last_day_value'],
          expl_var_6_last_week:resp['data']['explanation'][5]['last_week_value'],
          expl_var_6_last_month:resp['data']['explanation'][5]['last_month_value'],
          expl_var_6_last_qtr:resp['data']['explanation'][5]['last_qtr_value'],

          expl_var_7_current:resp['data']['explanation'][6]['current_value'],
          expl_var_7_last_day:resp['data']['explanation'][6]['last_day_value'],
          expl_var_7_last_week:resp['data']['explanation'][6]['last_week_value'],
          expl_var_7_last_month:resp['data']['explanation'][6]['last_month_value'],
          expl_var_7_last_qtr:resp['data']['explanation'][6]['last_qtr_value'],


          expl_var_8_current:resp['data']['explanation'][7]['current_value'],
          expl_var_8_last_day:resp['data']['explanation'][7]['last_day_value'],
          expl_var_8_last_week:resp['data']['explanation'][7]['last_week_value'],
          expl_var_8_last_month:resp['data']['explanation'][7]['last_month_value'],
          expl_var_8_last_qtr:resp['data']['explanation'][7]['last_qtr_value'],


          expl_var_9_current:resp['data']['explanation'][8]['current_value'],
          expl_var_9_last_day:resp['data']['explanation'][8]['last_day_value'],
          expl_var_9_last_week:resp['data']['explanation'][8]['last_week_value'],
          expl_var_9_last_month:resp['data']['explanation'][8]['last_month_value'],
          expl_var_9_last_qtr:resp['data']['explanation'][8]['last_qtr_value'],

          expl_var_10_current:resp['data']['explanation'][9]['current_value'],
          expl_var_10_last_day:resp['data']['explanation'][9]['last_day_value'],
          expl_var_10_last_week:resp['data']['explanation'][9]['last_week_value'],
          expl_var_10_last_month:resp['data']['explanation'][9]['last_month_value'],
          expl_var_10_last_qtr:resp['data']['explanation'][9]['last_qtr_value'],


          var1_impact:resp['data']['explanation'][0]['expl_value'],
          var2_impact:resp['data']['explanation'][1]['expl_value'],
          var3_impact:resp['data']['explanation'][2]['expl_value'],
          var4_impact:resp['data']['explanation'][3]['expl_value'],
          var5_impact:resp['data']['explanation'][4]['expl_value'],
          var6_impact:resp['data']['explanation'][5]['expl_value'],
          var7_impact:resp['data']['explanation'][6]['expl_value'],
          var8_impact:resp['data']['explanation'][7]['expl_value'],
          var9_impact:resp['data']['explanation'][8]['expl_value'],
          var10_impact:resp['data']['explanation'][9]['expl_value'],









          
          
        }, this.userHoldings)
     
      });

  
  }




  userHoldings() {


    // console.log('AAAAAAAAAAAAAAAAAA',this.state.callFunc)

    // console.log(typeof(this.state.latest_date),this.state.latest_date)
    var holdingsRequest = {}
    var firstCallStatus = "false"
    if (this.state.callFunc == 0) {
     holdingsRequest = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
                  },
        body: JSON.stringify([
          {
            'user_id':this.props.basic.id.toString(),
            'user_type': 'existing',
            'risk_profile': this.state.risk_profile,
            'market_data': {
                'as_on': this.state.latest_date,
                'predicted_outlook_signal': parseFloat(this.state.outlook_signal),
                'dynamo_signal': parseInt(this.state.dynamo_signal),
                'Nifty50_PE':parseFloat(this.state.nifty_pe)
            },
            'fresh_amount':parseFloat(this.state.fresh_val)
          }])
      }
      firstCallStatus="true"
    }
    else {
    holdingsRequest = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

                },
      body: JSON.stringify([
        {
          'user_id':this.props.basic.id.toString(),
          'user_type': 'existing',
          'risk_profile': this.state.risk_profile,
          'market_data': {
              'as_on': this.state.latest_date,
              'predicted_outlook_signal': parseFloat(this.state.outlook_signal),
              'dynamo_signal': parseInt(this.state.dynamo_signal),
              'Nifty50_PE':parseFloat(this.state.nifty_pe)
          },
          'fresh_amount':parseFloat(this.state.fresh_val),
          "current_profile": {"l1_curr_wt": {"equity": this.state.usr_current_eq, "debt": this.state.usr_current_dt, "liquid": this.state.usr_current_lq}, "total_amt": this.state.total_amt},
        }])
    }


  }

    // console.log('holdingsRequest',holdingsRequest)
    fetch("https://ind-dynamo.indiawealth.in/api/v1/dynamo/dynamo_recomendation/", holdingsRequest)
        .then( response => {
        if (!response.ok) {
          // get error message from body or default to response status
          const error = response.status;
          firstCallStatus = "false"
          this.setState({
            holdings_status:"error",
            callFunc:1
          }, this.userHoldings)
          return Promise.reject(error);
                  }
        return response.json()
      })
        .then( resp => {
          // var counts = [20, 30, 50, 70, 80],
          // goal = Math.round(resp['data']['l1_curr_wt']['equity']*100),
          // r_prof = "";
          // console.log(goal)
          // var closest = counts.reduce(function(prev, curr) {
          //   return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
          // });

          // if (closest == 20) {
          //     r_prof = "Conservative"
          // }
          // else if (closest == 30) {
          //     r_prof = "Moderately Conservative"
          // }
          // else if (closest == 50) {
          //   r_prof = "Balanced"
          // }
          // else if ( closest == 70) {
          //   r_prof = "Moderately Aggressive"
          // }

          // else if ( closest == 80) {
          //   r_prof = "Aggressive"
          // }

          // console.log('r_prof',r_prof)
 
          if (firstCallStatus == "true") {
            this.setState({
              holdings_status:"success"
            })
          }


          var t_eq, t_dt, t_lq = 0;
          t_eq = (resp['data']['total_amt']*resp['data']['l1_curr_wt']['equity']+resp['data']['recommendation']['new_investment_eq'])/(resp['data']['total_amt']+this.state.fresh_val)
          t_dt = (resp['data']['total_amt']*resp['data']['l1_curr_wt']['debt']+resp['data']['recommendation']['new_investment_dt'])/(resp['data']['total_amt']+this.state.fresh_val)
          t_lq = (resp['data']['total_amt']*resp['data']['l1_curr_wt']['liquid']+resp['data']['recommendation']['new_investment_lqd'])/(resp['data']['total_amt']+this.state.fresh_val)

          // console.log('BBBBBBBBBBBBBBBBBBB',t_eq,typeof(NaN))

          if (t_eq == undefined || t_eq == null || isNaN(t_eq)) {
            t_eq = 0
          }
          if (t_dt == undefined || t_dt == null ||  isNaN(t_dt)) {
            t_dt = 0
          }
          if (t_lq == undefined || t_lq == null || isNaN(t_lq)) {
            t_lq = 0
          }


          if (resp['data']['l1_sugg_wt']['liquid'] == undefined) {
            this.setState({
              usr_sugg_lq:0,
              usr_current_eq:resp['data']['l1_curr_wt']['equity'],
              usr_current_dt:resp['data']['l1_curr_wt']['debt'],
              usr_current_lq:resp['data']['l1_curr_wt']['liquid'],
              usr_sugg_eq:resp['data']['l1_sugg_wt']['equity'],
              usr_sugg_dt:resp['data']['l1_sugg_wt']['debt'],
             
              eq_amt:resp['data']['recommendation']['new_investment_eq'],
              dt_amt:resp['data']['recommendation']['new_investment_dt'],
              lq_amt:resp['data']['recommendation']['new_investment_lqd'],
              total_amt:resp['data']['total_amt'],
              today_eq:t_eq,
              today_dt:t_dt,
              today_lq:t_lq,
              risk_profile:this.state.risk_profile,
              callFunc:1
              
            })
          }
          else {
           // resp contains your api response - you can console resp to view api response format/structure 
         this.setState({
           usr_current_eq:resp['data']['l1_curr_wt']['equity'],
           usr_current_dt:resp['data']['l1_curr_wt']['debt'],
           usr_current_lq:resp['data']['l1_curr_wt']['liquid'],
           usr_sugg_eq:resp['data']['l1_sugg_wt']['equity'],
           usr_sugg_dt:resp['data']['l1_sugg_wt']['debt'],
           usr_sugg_lq:resp['data']['l1_sugg_wt']['liquid'],
           eq_amt:resp['data']['recommendation']['new_investment_eq'],
           dt_amt:resp['data']['recommendation']['new_investment_dt'],
           lq_amt:resp['data']['recommendation']['new_investment_lqd'],
           total_amt:resp['data']['total_amt'],
           today_eq:(resp['data']['total_amt']*resp['data']['l1_curr_wt']['equity']+resp['data']['recommendation']['new_investment_eq'])/(resp['data']['total_amt']+this.state.fresh_val),
           today_dt:(resp['data']['total_amt']*resp['data']['l1_curr_wt']['debt']+resp['data']['recommendation']['new_investment_dt'])/(resp['data']['total_amt']+this.state.fresh_val),
           today_lq:(resp['data']['total_amt']*resp['data']['l1_curr_wt']['liquid']+resp['data']['recommendation']['new_investment_lqd'])/(resp['data']['total_amt']+this.state.fresh_val),
           risk_profile:this.state.risk_profile,
           callFunc:1
           

         }) }
         });
        

  }


  updateRiskProfile() {
    // console.log('user id ----------> ', this.props.basic.id, typeof(this.props.basic.id))
    const RequestOpt = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic em9ybzpwaXJhdGVodW50ZXI=' 
                },
      body: JSON.stringify(
        {
            // "user_id": 170,
            "user_id":this.props.basic.id,
            "enroll_type": "existing",
            "payment_method": "lumpsum",
            "amount": 0
        })
    };

    

    fetch("https://ind-dynamo.indiawealth.in/api/v1/dynamo/enroll",RequestOpt)
    .then( response => {
      if (!response.ok) {
        // get error message from body or default to response status
        const error = response.status;
        return Promise.reject(error);
                }
      return response.json()
    })
      .then( resp => {

      });


  }


   historic_data() {


    const req_opt = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic em9ybzpwaXJhdGVodW50ZXI=' 
                },
      body: JSON.stringify(
        {
        }
        )
    };

    fetch("https://ind-dynamo.indiawealth.in/api/v1/dynamo/dynamo_signal/",req_opt)
    .then( response => {
      if (!response.ok) {
        // get error message from body or default to response status
        const error = response.status;
        return Promise.reject(error);
                }
      return response.json()
    })
      .then( resp => {

        // console.log(resp)

      });

   }


  componentDidMount() {
    this.updateRiskProfile();
    this.market_signal();
  }

  onChange_start_val = value => {
    if (value == 0.0) {
      this.setState({
        total_amt:0,
        usr_current_lq:0,
        usr_current_eq:0,
        usr_current_dt:0
      })
    }

    this.setState({
      total_amt:value
    }, this.userHoldings)
  };

  onChange_fresh_val = value => {
    this.setState({
      fresh_val: value
    },
    this.userHoldings);
  };


  
  handleChange = (value) => {
    // console.log(`selected ${value}`);
  }
  
  onSelect = (value) => {

    this.setState({
      risk_profile:value
    },
    this.userHoldings)
  

  }

  onChangeEquity = (value) => {
    if (value + this.state.usr_current_dt + this.state.usr_current_lq > 1) {

      if (this.state.usr_current_lq > 0) {

      this.setState({
        usr_current_eq:value,
        usr_current_lq:+(this.state.usr_current_lq-(value - this.state.usr_current_eq)).toFixed(2)
      }) }
      else {
        return
      }
    }

    else {

    if (this.state.total_amt !=0){
    this.setState({
      usr_current_eq:value,
      usr_current_lq:+(1-(value+this.state.usr_current_dt)).toFixed(2)
    },
    this.userHoldings)
    
  }
    }

  }

  

  get_rank(rank) {
    if (rank == 1)
    return rank1
    else if (rank ==2) 
    return rank2
    else if (rank ==3) 
    return rank3
    else if (rank ==4) 
    return rank4
    else if (rank ==5) 
    return rank5
    else if (rank ==6) 
    return rank6
    else if (rank ==7) 
    return rank7
    else if (rank ==8) 
    return rank8
    else if (rank ==9) 
    return rank9
    else if (rank ==10) 
    return rank10

  }

  onChangeDebt = (value) => { 
    
    if (value + this.state.usr_current_dt + this.state.usr_current_lq > 1) {

      if (this.state.usr_current_lq > 0) {

      this.setState({
        usr_current_dt:value,
        usr_current_lq:+(this.state.usr_current_lq-(value - this.state.usr_current_dt)).toFixed(2)
      }) }
      else {
        return
      }
    }
    else {

    if (this.state.total_amt!=0) {
    this.setState({
      usr_current_dt:value,
      usr_current_lq:+(1-(value+this.state.usr_current_eq)).toFixed(2)
    }, this.userHoldings)
    
  }}
  }


  // onChangeLiquid = (value) => {
  //   if (this.state.total_amt!=0) {
  //   this.setState({
  //     usr_current_lq:value
  //   })
    
  // }
  // }

  indicator_image(level) {
    var img_url = "https://cdn.indiawealth.in/public/images/icons/fmpMeter/mediumRisk.svg"
    if (level == "high") {
      img_url = "https://cdn.indiawealth.in/public/images/icons/fmpMeter/moderatlyHighRisk.svg"
    }
    else if (level == "low") {
      img_url = "https://cdn.indiawealth.in/public/images/icons/fmpMeter/moderatelyLowrisk.svg"
    }
    else if (level == "very low") {
      img_url = "https://cdn.indiawealth.in/public/images/icons/fmpMeter/lowRisk.svg"
    }
    else if (level == "very high") {
      img_url = "https://cdn.indiawealth.in/public/images/icons/fmpMeter/highRisk.svg"
    }
    return img_url
  }

  get_desc =(value) => {
      // console.log('desc',value,this.state.expl_var_9_desc)
      if (value == 1)
      return this.state.expl_var_1_desc
      else if (value ==2) 
      return this.state.expl_var_2_desc
      else if (value ==3) 
      return this.state.expl_var_3_desc
      else if (value ==4) 
      return this.state.expl_var_4_desc
      else if (value ==5) 
      return this.state.expl_var_5_desc
      else if (value ==6) 
      return this.state.expl_var_6_desc
      else if (value ==7) 
      return this.state.expl_var_7_desc
      else if (value ==8) 
      return this.state.expl_var_8_desc
      else if (value ==9) 
      return this.state.expl_var_9_desc
      else if (value ==10) 
      return this.state.expl_var_10_desc
  
    }

    get_impact =(value) => {
      // console.log('desc',value,this.state.expl_var_9_desc)
      if (value == 1)
      return this.state.var1_impact
      else if (value ==2) 
      return this.state.var2_impact
      else if (value ==3) 
      return this.state.var3_impact
      else if (value ==4) 
      return this.state.var4_impact
      else if (value ==5) 
      return this.state.var5_impact
      else if (value ==6) 
      return this.state.var6_impact
      else if (value ==7) 
      return this.state.var7_impact
      else if (value ==8) 
      return this.state.var8_impact
      else if (value ==9) 
      return this.state.var9_impact
      else if (value ==10) 
      return this.state.var10_impact
  
    }


    get_change = (value,w) => {
      if (w == 'd') {
        if (value == 0)
        return (this.state.outlook_signal-this.state.last_day)

        else if (value == 1)
        return (this.state.expl_var_1_current-this.state.expl_var_1_last_day)
        else if (value ==2) 
        return (this.state.expl_var_2_current-this.state.expl_var_2_last_day)
        else if (value ==3) 
        return (this.state.expl_var_3_current-this.state.expl_var_3_last_day)
        else if (value ==4) 
        return (this.state.expl_var_4_current-this.state.expl_var_4_last_day)
        else if (value ==5) 
        return (this.state.expl_var_5_current-this.state.expl_var_5_last_day)
        else if (value ==6) 
        return (this.state.expl_var_6_current-this.state.expl_var_6_last_day)
        else if (value ==7) 
        return (this.state.expl_var_7_current-this.state.expl_var_7_last_day)
        else if (value ==8) 
        return (this.state.expl_var_8_current-this.state.expl_var_8_last_day)
        else if (value ==9) 
        return (this.state.expl_var_9_current-this.state.expl_var_9_last_day)
        else if (value ==10) 
        return (this.state.expl_var_10_current-this.state.expl_var_10_last_week)
      }

      if (w == 'w') {
        if (value == 0)
        return (this.state.outlook_signal-this.state.last_week)

        else if (value == 1)
        return (this.state.expl_var_1_current-this.state.expl_var_1_last_week)
        else if (value ==2) 
        return (this.state.expl_var_2_current-this.state.expl_var_2_last_week)
        else if (value ==3) 
        return (this.state.expl_var_3_current-this.state.expl_var_3_last_week)
        else if (value ==4) 
        return (this.state.expl_var_4_current-this.state.expl_var_4_last_week)
        else if (value ==5) 
        return (this.state.expl_var_5_current-this.state.expl_var_5_last_week)
        else if (value ==6) 
        return (this.state.expl_var_6_current-this.state.expl_var_6_last_week)
        else if (value ==7) 
        return (this.state.expl_var_7_current-this.state.expl_var_7_last_week)
        else if (value ==8) 
        return (this.state.expl_var_8_current-this.state.expl_var_8_last_week)
        else if (value ==9) 
        return (this.state.expl_var_9_current-this.state.expl_var_9_last_week)
        else if (value ==10) 
        return (this.state.expl_var_10_current-this.state.expl_var_10_last_week)
      }

      if (w == 'm') {
        if (value == 0)
        return (this.state.outlook_signal-this.state.last_month)

        else if (value == 1)
        return (this.state.expl_var_1_current-this.state.expl_var_1_last_month)
        else if (value ==2) 
        return (this.state.expl_var_2_current-this.state.expl_var_2_last_month)
        else if (value ==3) 
        return (this.state.expl_var_3_current-this.state.expl_var_3_last_month)
        else if (value ==4) 
        return (this.state.expl_var_4_current-this.state.expl_var_4_last_month)
        else if (value ==5)
        return (this.state.expl_var_5_current-this.state.expl_var_5_last_month)
        else if (value ==6) 
        return (this.state.expl_var_6_current-this.state.expl_var_6_last_month)
        else if (value ==7) 
        return (this.state.expl_var_7_current-this.state.expl_var_7_last_month)
        else if (value ==8) 
        return (this.state.expl_var_8_current-this.state.expl_var_8_last_month)
        else if (value ==9) 
        return (this.state.expl_var_9_current-this.state.expl_var_9_last_month)
        else if (value ==10) 
        return (this.state.expl_var_10_current-this.state.expl_var_10_last_month)
      }


      if (w == 'q') {
        if (value == 0)
        return (this.state.outlook_signal-this.state.last_qtr)

        else if (value == 1)
        return (this.state.expl_var_1_current-this.state.expl_var_1_last_qtr)
        else if (value ==2) 
        return (this.state.expl_var_2_current-this.state.expl_var_2_last_qtr)
        else if (value ==3) 
        return (this.state.expl_var_3_current-this.state.expl_var_3_last_qtr)
        else if (value ==4) 
        return (this.state.expl_var_4_current-this.state.expl_var_4_last_qtr)
        else if (value ==5) 
        return (this.state.expl_var_5_current-this.state.expl_var_5_last_qtr)
        else if (value ==6) 
        return (this.state.expl_var_6_current-this.state.expl_var_6_last_qtr)
        else if (value ==7)
        return (this.state.expl_var_7_current-this.state.expl_var_7_last_qtr)
        else if (value ==8)
        return (this.state.expl_var_8_current-this.state.expl_var_8_last_qtr)
        else if (value ==9) 
        return (this.state.expl_var_9_current-this.state.expl_var_9_last_qtr)
        else if (value ==10) 
        return (this.state.expl_var_10_current-this.state.expl_var_10_last_qtr)
      }
     
    }

  

  render() {
    var txt = " "
    if (this.state.risk_profile=="Conservative") 
    {
      txt = "**Very Low returns with Very Low risk"
    }
    else if (this.state.risk_profile=="Aggressive") 
    {
      txt = "**Very High returns with Very High risk"
    }
    else if (this.state.risk_profile=="Moderately Aggressive") 
    {
      txt = "**High returns with High risk"
    }
    else if (this.state.risk_profile=="Moderately Conservative") 
    {
      txt = "**Low returns with low risk"
    }
    else if (this.state.risk_profile=="Balanced") 
    {
      txt = "**Moderate returns with Moderate risk"
    }

    const { inputValue } = this.state.l1_equity;
    var suggested = riskProfileMapping(this.state.risk_profile);
    const { Option } = Select;
    return (
    <>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col className="gutter-row" span={12}>
        <Layout>
          <Header><h3 style={{ color: 'white', textAlign: 'center',padding:'12px',fontFamily: "Avenir Next", marginBottom:"10px" }}>Portfolio & Allocation Summary</h3></Header>
          <Content> 
          {/* {console.log("holdings_status",this.state.holdings_status)} */}
          {this.state.holdings_status === 'error'?
          <Row style={{padding:"10px 0"}}>
            
           
            <h6 style={{margin: '10px 0', fontSize:'15px', marginLeft:"20px"}}>Current Portfolio :</h6>
            <InputNumber
              min={0}
              max={1000000000}
              style={{width:'110px'}}
              value={this.state.total_amt}
              onChange={this.onChange_start_val}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              step={1000}
              />
           
           
            <h6 style={{margin: '10px 5px',fontSize:'15px'}}>Equity : </h6>
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              value={this.state.usr_current_eq}
              onChange={this.onChangeEquity}
              />
           
            <h6 style={{margin: '10px 5px',fontSize:'15px'}}>Debt :</h6>
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              value={this.state.usr_current_dt}
              onChange={this.onChangeDebt}
              />
            <h6 style={{margin: '10px 0',fontSize:'15px'}}>Liquid : </h6>
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              value={this.state.usr_current_lq}
              onChange={this.onChangeLiquid}
              />
              
          </Row>:
          <Row>
            <CardDarkBlue>
            <h6 style={{margin: '10px 10px 0px 10px', color:'white'}}>Current Portfolio : Rs. {this.state.total_amt}</h6>
            </CardDarkBlue>
            <CardDarkBlue>
            <h6 style={{margin: '10px 10px 10px 10px', color:'white'}}>Equity : {(this.state.usr_current_eq*100).toFixed(2)}%</h6>
            </CardDarkBlue>

            <CardDarkBlue>
            <h6 style={{margin: '10px 10px 10px 10px', color:'white'}}>Debt :{(this.state.usr_current_dt*100).toFixed(2)}%</h6>
            </CardDarkBlue>
            <CardDarkBlue>
            <h6 style={{margin: '10px 10px 10px 10px', color:'white'}}>Liquid : {(this.state.usr_current_lq*100).toFixed(2)}%</h6>
            </CardDarkBlue>
           
              
          </Row>}
          <Row>
                <Col>
                    <h6 style={{margin: '10px 10px 10px 20px'}}>Risk Profile</h6>
                </Col>
                <Col>
                    <Select placeholder="Select Risk Profile" value={this.state.risk_profile} style={{width: 200, margin:'5px 10px 10px 50px' }} bordered onChange={this.onSelect}>
                    <Option value="Conservative" >Conservative</Option>
                    <Option value="Moderately Conservative">Moderately Conservative</Option>
                    <Option selected value="Balanced">Balanced</Option>
                    <Option value="Moderately Aggressive">Moderately Aggressive</Option>
                    <Option value="Aggressive">Aggressive</Option>
                    </Select>
                    <p style={{fontSize:'10px',  margin:'5px 10px 10px 50px' }}>{txt} </p>
                </Col>
                <Col>
            <h6 style={{margin: '10px 10px 10px 20px'}}>Fresh Investment</h6>
            </Col>
            <Col span={4} style={{margin: '5px 0px 0 0'}}>
              <InputNumber
                  min={0}
                  max={100000000}
                  style={{ margin: '0 5px', width:'100px'}}
                  value={this.state.fresh_val}
                  onChange={this.onChange_fresh_val}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  step={1000}
              />
            </Col>
            </Row>


            <Divider style={{'background-color':"lightgray"}}  />
            <Row>
                  <Col>
                  <h5 style={{margin:'-10px 0 0 20px'}}>Current Market Outlook  : </h5></Col>
                  {/* <Col>        <Button type="primary" onClick={() => this.reset_changes()} style={{ margin: '-5px 0 0px 50px'}}>Reset</Button>

                  </Col> */}
                  <div style={{marginTop:"-20px",marginBottom:"10px"}}>    <CardDarkBlue>
                 <h6 style={{color:'white', padding:"10px"}}>{this.state.equity_state}</h6>
                  </CardDarkBlue>
                  </div>
                  
               
              </Row>
              <Row>
                <Col>
                  <h6 style={{margin:'-10px 5px 10px 20px'}}>Raw Outlook Signal : </h6>
                </Col>
                  <h7 style={{margin:'-12px 10px 10px 0'}}>{(this.state.outlook_signal).toFixed(3)}</h7>
              </Row>
          
{/*            
         <div className = "row">
           <div className="col-md-5 col-7" style={{marginLeft:"15px"}}>
          
           </div>
         </div>
        */}


        <div className = "row">
          <div className="col-md-12 col-12">
        <div className='indicator'>
              <div className='marker' style={{'right': `${this.state.marker_pt}%`}}>
                <div className="marker-pointer">
                  {this.state.latest_date}
                  </div>
                </div>
              </div>
          </div>
          </div>
          <div className="d-flex justify-content-between" style ={{margin:'0 20px'}}>
            <p>Very Risky</p>
            <p>Neutral</p>
            <p>Very Attractive</p>

          </div>
          <div className="d-flex justify-content-between" style ={{margin:'0 20px'}} >
           <p>Daily Change : <span style={{color: parseInt(+this.get_change(0,'d').toFixed(2)) > 0 ? "green" : "red"}}>{+this.get_change(0,'d').toFixed(2)}</span></p>
           <p>Weekly Change : <span style={{color: parseInt(+this.get_change(0,'w').toFixed(2)) > 0 ? "green" : "red"}}>{+this.get_change(0,'w').toFixed(2)}</span></p>
           <p>Monthly Change : <span style={{color: parseInt(+this.get_change(0,'m').toFixed(2)) > 0 ? "green" : "red"}}>{+this.get_change(0,'m').toFixed(2)}</span></p>
           <p>Quarterly Change : <span style={{color: parseInt(+this.get_change(0,'q').toFixed(2)) > 0 ? "green" : "red"}}>{+this.get_change(0,'q').toFixed(2)}</span></p>

        </div>
        <Row style={{margin:'0 0 -15px 10px'}}>
        
            </Row>
        
              
          
       
           
                
             {/* <RiskOption />  */}
          </Content>
         
          <Footer></Footer>
        </Layout>
       
      </Col>

      <Col className="gutter-row" span={12}>
      <TargetAllocation curr_equity={this.state.usr_current_eq} curr_debt={this.state.usr_current_dt}
              curr_liquid = {this.state.usr_current_lq}
              sugg_eq ={this.state.usr_sugg_eq}
              sugg_dt ={this.state.usr_sugg_dt} sugg_lq ={this.state.usr_sugg_lq} 
              eq_amt = {this.state.eq_amt} dt_amt = {this.state.dt_amt}
              lq_amt = {this.state.lq_amt}
              total_investible_amt={this.state.fresh_val} total_amt={this.state.start_val}
              equity_state={this.state.equity_state}
              today_dt = {this.state.today_dt}
              today_eq = {this.state.today_eq}
              today_lq = {this.state.today_lq}
              {...riskProfileMapping(this.state.risk_profile)}/>
                 
                 {/* <Header><h2 style={{ color: 'white', textAlign: 'center' }}>Redemption Scheme</h2> */}
            {/* </Header>    */}
            {/* <RedemptionLogic /> */}

      </Col>
      <Col span={24} >
    

      <h6 style={{margin:'10px 0 10px 20px'}}>Outlook Explanation</h6>
             
      <div className="row">
                <div style={{'display':'block'}} className="col-md col-12"  onClick={() => {this.setState({current_rank:1,showPopUp:true})}}>
               

                  <WhiteCards className="d-flex justify-content-between align-items-center p-2">
                  <img src= {this.get_rank(this.state.expl_var_1_rank)} className="img-responsive"
                  style={{   width: '45px' }}></img>
                  {this.state.expl_var_1}
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_1_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_1_level}</p>  
                
                 </div>
                
                
                  </WhiteCards>
                
              
                 
                </div>
              
                <div  className="col-md col-12" style={{'display':'block'}} onClick={() => {this.setState({current_rank:2,showPopUp:true})}} >

                <WhiteCards className="d-flex justify-content-between align-items-center p-2" >
                <img src= {this.get_rank(this.state.expl_var_2_rank)} className="img-responsive"
                  style={{   width: '45px' }}></img>
                  {this.state.expl_var_2}
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_2_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_2_level}</p>  
                 </div>
                
                
                  </WhiteCards>
                
              
                 
                </div>

                <div  className="col-md col-12" style={{'display':'block'}} onClick={() => {this.setState({current_rank:3,showPopUp:true})}}>

                <WhiteCards className="d-flex justify-content-between align-items-center p-2" >
                <img src= {this.get_rank(this.state.expl_var_3_rank)} className="img-responsive"
                  style={{   width: '45px' }}></img>
                  {this.state.expl_var_3}
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_3_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_3_level}</p>  
                 </div>
                
                
                  </WhiteCards>
                
              
                 
                </div>

                <div  className="col-md col-12" style={{'display':'block'}} onClick={() => {this.setState({current_rank:4,showPopUp:true})}}>

                <WhiteCards className="d-flex justify-content-between align-items-center p-2" >
                <img src= {this.get_rank(this.state.expl_var_4_rank)} className="img-responsive"
                  style={{   width: '45px' }}></img>
                  {this.state.expl_var_4}
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_4_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_4_level}</p>  
                 </div>
                
                
                  </WhiteCards>
                
              
                 
                </div>

                <div  className="col-md col-12" style={{'display':'block'}} onClick={() => {this.setState({current_rank:5,showPopUp:true})}}>

                <WhiteCards className="d-flex justify-content-between align-items-center p-2" >
                <img src= {this.get_rank(this.state.expl_var_5_rank)} className="img-responsive"
                  style={{   width: '45px' }}></img>
                  {this.state.expl_var_5}
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_5_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_5_level}</p>  
                 </div>
                
                
                  </WhiteCards>
                
              
                 
                </div>
                </div>
                <div className="row">
                <div style={{'display':'block'}} className="col-md col-12" onClick={() => {this.setState({current_rank:6,showPopUp:true})}}>

                  <WhiteCards className="d-flex justify-content-between align-items-center p-2">
                  <img src= {this.get_rank(this.state.expl_var_6_rank)} className="img-responsive"
                  style={{   width: '45px' }}></img>
                  {this.state.expl_var_6}
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_6_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_6_level}</p>  
                 </div>
                
                
                  </WhiteCards>
                
              
                 
                </div>
              
                <div  className="col-md col-12" style={{'display':'block'}}  onClick={() => {this.setState({current_rank:7,showPopUp:true})}}>

                <WhiteCards className="d-flex justify-content-between align-items-center p-2">
                <img src= {this.get_rank(this.state.expl_var_7_rank)} className="img-responsive"
                  style={{   width: '45px' }}></img>
                  {this.state.expl_var_7}
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_7_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_7_level}</p>  
                 </div>
                
                
                  </WhiteCards>
                
              
                 
                </div>

                <div  className="col-md col-12" style={{'display':'block'}} onClick={() => {this.setState({current_rank:8,showPopUp:true})}}>

                <WhiteCards className="d-flex justify-content-between align-items-center p-2" >
                <img src= {this.get_rank(this.state.expl_var_8_rank)} className="img-responsive"
                  style={{   width: '45px' }}></img>
                  {this.state.expl_var_8}
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_8_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_8_level}</p>  
                 </div>
                
                
                  </WhiteCards>
                
              
                 
                </div>

                <div  className="col-md col-12" style={{'display':'block'}} onClick={() => {this.setState({current_rank:9,showPopUp:true})}}>

                <WhiteCards className="d-flex justify-content-between align-items-center p-2" >
                <img src= {this.get_rank(this.state.expl_var_9_rank)} className="img-responsive"
                  style={{   width: '40px' }}></img>
                  {this.state.expl_var_9}
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_9_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_9_level}</p>  
                 </div>
                
                
                  </WhiteCards>
                
              
                 
                </div>

                <div  className="col-md col-12" style={{'display':'block'}} onClick={() => {this.setState({current_rank:10,showPopUp:true})}}>

                <WhiteCards className="d-flex justify-content-between align-items-center p-2" >
                <img src= {this.get_rank(this.state.expl_var_10_rank)} className="img-responsive"
                  style={{   width: '45px' }}></img>
                 <p style={{textAlign:""}}>{this.state.expl_var_10}</p> 
                 <div>
                 <img src={this.indicator_image(this.state.expl_var_10_level)} className="img-responsive"
                  style={{   width: '60px' }}></img>
                  <p className="m-0 text-center" style={{fontSize:"10px"}}>{this.state.expl_var_10_level}</p>  
                 </div>
                
                
                  </WhiteCards>
                
              
                 </div>
                 <Popup style={{ "overflowY":"auto"}} open={this.state.showPopUp} onClose={() => this.setState({
            showPopUp:false
          })} modal>

          <div style={{'padding':'10px','overflowX':'auto', 'fontFamily':"Avenir Next"}} >  
          <h3 style={{"textAlign":"center","color":"cadetblue","fontSize":"22px","marginBottom":"20px"}}>{this.state.all_names[this.state.current_rank]}</h3>
          <div className="row">
           <div className="col-md-2">
           <img src={this.indicator_image(this.state.all_status[this.state.current_rank])} className="img-responsive"
                  style={{   width: '85px' }}></img>
                   <p className="m-0 text-center" style={{fontSize:"10px",textAlign:"left"}}>{this.state.all_status[this.state.current_rank]}</p>  
           </div>
           <div className="col-md-10">
             <p style={{fontSize:"12px", textAlign:"justify"}}>{this.get_desc(this.state.current_rank)} <br/>This variable has an impact of <span style={{color: parseFloat(+this.get_impact(this.state.current_rank)).toFixed(3) > 0 ? "green" : "red"}}>{+this.get_impact(this.state.current_rank).toFixed(3)}</span> on the market outlook signal as on {this.state.latest_date}</p>
             <p style={{fontSize:"12px", textAlign:"justify"}} >Daily Change : <span style={{color: parseFloat(+this.get_change(this.state.current_rank,'d').toFixed(2)) > 0 ? "green" : "red"}}>{+this.get_change(this.state.current_rank,'d').toFixed(2)}</span></p>
             <p style={{fontSize:"12px", textAlign:"justify"}} >Weekly Change : <span style={{color: parseFloat(+this.get_change(this.state.current_rank,'w').toFixed(2)) > 0 ? "green" : "red"}}>{+this.get_change(this.state.current_rank,'w').toFixed(2)}</span></p>
             <p style={{fontSize:"12px", textAlign:"justify"}} >Monthly Change : <span style={{color: parseFloat(+this.get_change(this.state.current_rank,'m').toFixed(2)) > 0? "green" : "red"}}>{+this.get_change(this.state.current_rank,'m').toFixed(2)}</span></p>
             <p style={{fontSize:"12px", textAlign:"justify"}} >Quarterly Change : <span style={{color: parseFloat(+this.get_change(this.state.current_rank,'q').toFixed(2)) > 0 ? "green" : "red"}}>{+this.get_change(this.state.current_rank,'q').toFixed(2)}</span></p>

           </div>
           </div>
          </div>
     </Popup>
                </div>
               
           
           
      </Col>
    </Row>
   
    
    </>);
  }
}
// ReactDOM.render(<LayoutView />, document.getElementById('root'));

export default Dynamo

