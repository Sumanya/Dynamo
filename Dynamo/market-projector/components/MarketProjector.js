import MarketMood from './MarketMood';
import AssetAllocation from './asset-allocation/AssetAllocation';
import {useState, useEffect} from "react";
import axios from 'axios';
import {Button, Divider} from 'antd';
import {getIndexParamsFromSignalValue, isMobile} from '../utils';
import Loader from '../../common_components/loader/Loader';
import OutlookExplanation from './OutlookExplanation';
import {LastIndexes} from './LastIndexes';
import LastUpdated from './LastUpdated';
import {Link, Route, Switch} from 'react-router-dom';
import DynamoTabs from './graph/DynamoTabs';
export const RISK_PROFILES = ["Aggressive", "Balanced", "Conservative"]

const MarketProjector = () => {

    const [projection, setProjection] = useState({
        "signal_output": 50,
        "Aggressive": 60,
        "Balanced": 50,
        "Conservative": 40,
    });

    const [lastIndexes, setLastIndexes] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [explanation, setExplanation] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [amount, setAmount] = useState(100000);
    const [riskProfile, setRiskProfile] = useState(RISK_PROFILES[0]);

    const fetchMarketMood = () => {
        axios.get("https://ind-dynamo.indiawealth.in/api/v1/dynamo/get_mkt_zone/")
        .then((response) => {
            setProjection(response.data.data);
            setLastUpdated(response.data.data.last_update)
            setExplanation(response.data.explanation.slice(0, 6).sort((ex1, ex2) => ex1.var_rank - ex2.var_rank));
            setLastIndexes([
                {
                    label: "Yesterday",
                    ...getIndexParamsFromSignalValue(response.data.data.last_day_signal),
                },
                {
                    label: "1 Week Ago",
                    ...getIndexParamsFromSignalValue(response.data.data.last_week_signal)
                },
                {
                    label: "1 Month Ago",
                    ...getIndexParamsFromSignalValue(response.data.data.last_month_signal)
                },
                {
                    label: "1 Quarter Ago",
                    ...getIndexParamsFromSignalValue(response.data.data.last_quater_signal)
                },
                {
                    label: "1 Year Ago",
                    ...getIndexParamsFromSignalValue(response.data.data.last_year_signal)
                }
            ])
            setLoaded(true);
        })
    }

    useEffect(() => {
        fetchMarketMood();
        const timeout = setInterval(() => {
            fetchMarketMood();
        }, 20000)
        return () => {
            clearInterval(timeout);
        }
    }, []);

    return (<div className="mt-5">
        {
            loaded ?
                    <div className="row">
                        <div className="col-md-7 col-12">
                            <LastUpdated last_update={lastUpdated}/>
                            <MarketMood score={projection.signal_output}/>
                            <LastIndexes lastIndexes={lastIndexes}/>
                            <div className="py-2"/>
                            <OutlookExplanation explanation={explanation}/>
                        </div>
                        <div className="col-md-1 col-12 d-flex mx-2">
                            <Divider type={isMobile() ? 'horizontal' : 'vertical'} style={{ height: isMobile() ? "1px" : "400px"}}/>
                        </div>
                        <div className="col-md-3 col-12">
                            <AssetAllocation
                                projection={projection}
                                amount={amount}
                                setAmount={setAmount}
                                riskProfile={riskProfile}
                                setRiskProfile={setRiskProfile}
                            />
                            <div className="d-flex justify-content-center align-items-center">
                                <Link to="/graph">
                                    <Button>Know More →</Button>
                                </Link>
                            </div>
                        </div>
                    </div> :
                    <Loader/>
        }
        <Switch>

            <Route path="/graph">
                <DynamoTabs riskProfile={riskProfile} amountSelected={amount}/>
            </Route>
            
        </Switch>
    </div>)
}

export default MarketProjector;