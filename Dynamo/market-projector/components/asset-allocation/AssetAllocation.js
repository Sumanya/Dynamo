import Allocation from './Allocation';
import {useEffect, useState} from 'react';
import {InputNumber, Select} from 'antd';
import {amountFormatter, isMobile} from '../../utils';
import { RISK_PROFILES } from '../MarketProjector';
const { Option } = Select;

const AssetAllocation = ({ projection, amount, setAmount, riskProfile, setRiskProfile }) => {
    const [equityAmount, setEquityAmount] = useState();

    useEffect(() => {
        setEquityAmount((amount * (projection[riskProfile] / 100)).toFixed(0))
    }, [amount, riskProfile, projection])

    return <div className="d-flex flex-column align-items-center flex-wrap flex-sm-nowrap">
        <div className="d-flex flex-md-nowrap flex-wrap">
            <div className="p-2">
                <h6>Investment Amount</h6>
                <InputNumber
                        placeholder="Enter Amount"
                        value={amount}
                        type="number"
                        onChange={(e) => {
                            setAmount(e)
                        }}
            step={1000}
                        style={{ width: "200px" }}
                />
            </div>
            <div className="p-2">
                <h6>Risk Profile</h6>
                <Select value={riskProfile} onChange={setRiskProfile} style={{ width: "200px" }}>
                    {RISK_PROFILES.map(risk => <Option value={risk}>{ risk }</Option>)}
                </Select>
            </div>
        </div>
        <div className="py-4">
            <div style={{width: isMobile() ? "300px" : "400px", height: "300px"}}>
                <Allocation
                    equity={equityAmount}
                    debt={(amount - equityAmount).toFixed(0)}
                    equityPercentage={projection[riskProfile]}
                    debtPercentage={100 - projection[riskProfile]}
                />
            </div>
            <div className="p-3 d-flex flex-column justify-content-center align-items-center">
                <div>
                    <div className="d-flex align-items-center mb-1">
                        <div style={{ width: "16px", height: "16px", backgroundColor: '#00C49F'}}/>
                        <div className="ml-1">Equity : ₹ {amountFormatter(equityAmount)} </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div style={{ width: "16px", height: "16px", backgroundColor: '#FFBB28'}}/>
                        <div className="ml-1">Debt : ₹ {amountFormatter((amount - equityAmount).toFixed(0))} </div>
                    </div>
                </div>
            </div>
            <h6 className="text-muted text-center py-3">Today's Allocation</h6>
      <p className="text-center px-5">
        Today's staggering amount based on market signal for fresh amount of {amount}
      </p>
        </div>
        </div>
}
export default AssetAllocation;

