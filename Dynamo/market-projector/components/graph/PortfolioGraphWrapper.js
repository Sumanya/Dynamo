import {useCallback, useEffect, useMemo, useState} from 'react';
import moment from 'moment';
import axios from 'axios';
import Header from './Header';
import {CartesianGrid, Legend, ResponsiveContainer, AreaChart, Tooltip, XAxis, YAxis, Area} from 'recharts';
import dayjs from 'dayjs';
import { Spin, DatePicker} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

export default function PortfolioGraphWrapper({ riskProfile = "Aggressive", amountSelected = 10000 }) {
    const [graphData, setGraphData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [startDate, setStartDate] = useState(new Date("2018").toISOString().slice(0, 10));
    const [fetchingData, setFetchingData] = useState(false);
    const [trxnData, setTrxnData] = useState([]);

    useEffect(() => {
        setFetchingData(true);
        axios.post("https://ind-dynamo.indiawealth.in/api/v1/dynamo/get_portfolio_values/", [{
            "start_date":startDate,
        }])
        .then((res) => {
            setGraphData(res.data.data.data)
            setTableData(res.data.data)
            setFetchingData(false)
            setTrxnData(res.data.data.transfers)
        })
    }, [riskProfile, startDate])

    const normaliseAmount = useCallback((amount) => {
        return Math.round(amount * (amountSelected / 100000))
    }, [amountSelected])

    const graphDataToShow = useMemo(() => graphData.map(data => ({
        ...data,
        as_on: data.as_on ? data.as_on.split("T")[0] : data.as_on,
        Benchmark_value: normaliseAmount(data.Benchmark_value),
        Normal_STP: normaliseAmount(data.Normal_STP),
        Robo_STP: normaliseAmount(data.Robo_STP),
        Robo_STP_wc: normaliseAmount(data.Robo_STP_wc)
    })), [normaliseAmount, graphData])

    const disabledDate = current => {
      return current && current >= moment().endOf('day');
    }

    const renderTable = () => {
        return(
            <table style={{width: "30%"}} class="table table-bordered ml-5 mt-2">
                <thead>
                    <tr>
                        <th>type</th>
                        <th>benchmark</th>
                        <th>normal_stp</th>
                        <th>robo_stp</th>
                        <th>robo_stp_wc</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.abs_return && <tr>
                        <td>Total Return</td>
                        <td>{tableData.abs_return.benchmark}</td>
                        <td>{tableData.abs_return.normal_stp}</td>
                        <td>{tableData.abs_return.robo_stp}</td>
                        <td>{tableData.abs_return.robo_stp_wc}</td>
                    </tr>}
                    {tableData.return && <tr>
                        <td>CAGR</td>
                        <td>{tableData.return.benchmark}</td>
                        <td>{tableData.return.normal_stp}</td>
                        <td>{tableData.return.robo_stp}</td>
                        <td>{tableData.return.robo_stp_wc}</td>
                    </tr>}
                    {tableData.volatility && <tr>
                        <td>Volatility</td>
                        <td>{tableData.volatility.benchmark}</td>
                        <td>{tableData.volatility.normal_stp}</td>
                        <td>{tableData.volatility.robo_stp}</td>
                        <td>{tableData.volatility.robo_stp_wc}</td>
                    </tr>}
                    {tableData.sharpe && <tr>
                        <td>Sharpe Ratio</td>
                        <td>{tableData.sharpe.benchmark}</td>
                        <td>{tableData.sharpe.normal_stp}</td>
                        <td>{tableData.sharpe.robo_stp}</td>
                        <td>{tableData.sharpe.robo_stp_wc}</td>
                    </tr>}

                </tbody>
            </table>
        )
    }

    const renderTrxns = () => {
        return(
            <table style={{width: "80%"}} class="table table-bordered ml-5 mt-2">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Signal</th>
                        <th>Switch_amount</th>
                        <th>Robo_equity</th>
                        <th>Robo_debt</th>
                        <th>Switch_amount_wc</th>
                        <th>Robo_equity_wc</th>
                        <th>Robo_debt_wc</th>                       
                    </tr>
                </thead>
                <tbody>
                    {trxnData.map((data)=>{
                        return(<tr>
                            <td>{data.as_on.split('T')[0]}</td>
                                <td>{data.signal}</td>
                                <td>{data.switch_amount}</td>
                                <td>{data.robo_eq}</td>
                                <td>{data.robo_dt}</td>
                                <td>{data.switch_amount2}</td>
                                <td>{data.robo_eq2}</td>
                                <td>{data.robo_dt2}</td>

                            </tr>)
                    })}
                    </tbody>
            </table>
        )
    }

    return (
        <>
            
            <div>
                <div className="d-flex justify-content-end align-items-center">
                    {
                        fetchingData ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : null
                    }
                    <Header/>
                    <div className="mx-3"/>
                    <div className="d-flex flex-row align-items-end justify-content-between w-100">
                        {renderTable()}
                        <div className="mr-5 mb-5"><DatePicker disabledDate={disabledDate} placeholder={startDate} onChange={(e,v) => setStartDate(v)} /></div>
                    </div>
                </div>
                <ResponsiveContainer height={400} width="100%">
                    <AreaChart width={1400} height={400} data={graphDataToShow}>
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" vertical={false}/>

                        <XAxis dataKey="as_on" tickFormatter={(it) => dayjs(it).format("MMM YYYY")}/>
                        <YAxis domain={['dataMin', 'dataMax']}/>
                        <Tooltip />
                        <Legend />

                        <defs>
                            <linearGradient id="myGradient" gradientTransform="rotate(90)">
                                <stop offset="4%"  stopColor="#c4c4c433" />
                                <stop offset="96%" stopColor="#FFFFFF" />
                            </linearGradient>
                        </defs>

                        <Area
                                dot={false}
                                connectNulls={true}
                                strokeWidth={3}
                                type="linear"
                                dataKey="Benchmark_value"
                                name={"Benchmark_value"}
                                fill="url('#myGradient')"
                                stroke="#2774DB"
                        />

                        <Area
                                dot={false}
                                connectNulls={true}
                                strokeWidth={3}
                                type="linear"
                                dataKey="Normal_STP"
                                name={"Normal_STP"}
                                fill="url('#myGradient')"
                                stroke="#FF9800"
                        />

                        <Area
                                dot={false}
                                connectNulls={true}
                                strokeWidth={3}
                                type="linear"
                                dataKey="Robo_STP"
                                name={"Robo_STP"}
                                fill="url('#myGradient')"
                                stroke="#20c997"
                        />

                        <Area
                                dot={false}
                                connectNulls={true}
                                strokeWidth={3}
                                type="linear"
                                dataKey="Robo_STP_wc"
                                name={"Robo_STP_wc"}
                                fill="url('#myGradient')"
                                stroke="#c920c3"
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="d-flex flex-row align-items-end justify-content-between w-100">
                        {renderTrxns()}
                    </div>

            </div>
        </>
    )
}
