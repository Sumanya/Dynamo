import {useCallback, useEffect, useMemo, useState} from 'react';
import moment from 'moment';
import axios from 'axios';
import Header from './Header';
import {CartesianGrid, Legend, ResponsiveContainer, AreaChart, Tooltip, XAxis, YAxis, Area} from 'recharts';
import dayjs from 'dayjs';
import { Spin, DatePicker, InputNumber} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

export default function SipGraphWrapper({ riskProfile = "Aggressive" }) {
    const [graphData, setGraphData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [tableData2, setTableData2] = useState([]);
    const [startDate, setStartDate] = useState(new Date("2018").toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date(Date.now() - 86400000).toISOString().slice(0, 10))
    const [fetchingData, setFetchingData] = useState(false);
    const [sipAmount, setSIPAmount] = useState(10000);

    useEffect(() => {
        setFetchingData(true);
        axios.post("https://ind-dynamo.indiawealth.in/api/v1/dynamo/get_sip_values/", [{
            "start_date":startDate,
            "end_date":endDate
        }])
        .then((res) => {
            setGraphData(res.data.data.data)
            setTableData(res.data.data)
            setFetchingData(false)
        });
        axios.post("https://ind-dynamo.indiawealth.in/api/v1/dynamo/plot_sip_values/", [{
            "start_date":startDate,
            "end_date":endDate
        }])
        .then((res) => {
            setTableData2(res.data.data)
            setFetchingData(false)
        });

    }, [riskProfile, startDate, endDate])

    const normaliseAmount = useCallback((amount) => {
        return Math.round(amount * (sipAmount / 10000))
    }, [sipAmount])

    const graphDataToShow = useMemo(() => graphData.map(data => ({
        ...data,
        as_on: data.as_on ? data.as_on.split("T")[0] : data.as_on,
        Robo_SIP: normaliseAmount(data.Robo_SIP),
        Normal_SIP: normaliseAmount(data.Normal_SIP)
    })), [normaliseAmount, graphData])

    const disabledDate = current => {
      return current && current >= moment().endOf('day');
    }
    const renderTable = () => {
        return(
            <table style={{width: "35%"}} class="table table-bordered ml-5 mt-2">
                <thead>
                    <tr>
                        <th>type</th>
                        <th>normal_sip</th>
                        <th>robo_sip 1</th>
                        <th>robo_sip 2</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.investment_amount && <tr>
                        <td>Investment amount</td>
                        <td>{normaliseAmount(tableData.investment_amount).toFixed()}</td>
                        <td>{normaliseAmount(tableData.investment_amount).toFixed()}</td>
                        <td>{normaliseAmount(tableData.investment_amount).toFixed()}</td>
                        </tr>}
                    {tableData.abs_return && <tr>
                        <td>Current Value</td>
                        <td>{normaliseAmount(tableData.abs_return.normal_sip).toFixed()}</td>
                        <td>{normaliseAmount(tableData.abs_return.robo_sip).toFixed()}</td>
                        {tableData2.abs_return && <td>{normaliseAmount(tableData2.abs_return.robo_sip).toFixed()}</td>}
                    </tr>}
                    {tableData.return && <tr>
                        <td>XIRR (%)</td>
                        <td>{tableData.return.normal_sip.toFixed(2)}</td>
                        <td>{tableData.return.robo_sip.toFixed(2)}</td>
                        {tableData2.return && <td>{tableData2.return.robo_sip.toFixed(2)}</td>}
                    </tr>}
                    {tableData.volatility && <tr>
                        <td>Volatility</td>
                        <td>{tableData.volatility.normal_sip.toFixed(2)}</td>
                        <td>{tableData.volatility.robo_sip.toFixed(2)}</td>
                        {tableData2.volatility && <td>{tableData2.return.volatility.toFixed(2)}</td>}
                    </tr>}
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
                        <div>
                            <div className="mb-3 mr-5">
                                <strong>SIP Amount:&nbsp;</strong>
                                    <InputNumber
                                        placeholder="Enter SIP Amount"
                                        value={sipAmount}
                                        type="number"
                                        onChange={(e) => {
                                        setSIPAmount(e)
                                       }}
                                        step={1000}
                                     style={{ width: "140px" }}
                                    />
                            </div>
                            <div className="mr-5 mb-3"><span><strong>Start Date:&nbsp;</strong></span><DatePicker disabledDate={disabledDate} placeholder={startDate} onChange={(e,v) => setStartDate(v)} /></div>
                            <div className="mr-5 mb-5"><span><strong>End Date:&nbsp;&nbsp;&nbsp;</strong></span><DatePicker disabledDate={disabledDate} placeholder={endDate} minDate={'2021-02-04'} onChange={(e,v) => setEndDate(v)} /></div>
                        </div>
                        
                    </div>
                </div>


                <ResponsiveContainer height={400} width="100%">
                    <AreaChart width={1400} height={400} data={graphDataToShow}>
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" vertical={false}/>

                        <XAxis dataKey="as_on" tickFormatter={(it) => dayjs(it).format("MMM YYYY")}/>
                        <YAxis domain={[dataMin => (dataMin.toFixed(2).replace(/\.00$/, '')), dataMax => (dataMax.toFixed(2).replace(/\.00$/, ''))]}/>
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
                                dataKey="Normal_SIP"
                                name={"Normal_SIP"}
                                fill="url('#myGradient')"
                                stroke="#FF9800"
                        />

                        <Area
                                dot={false}
                                connectNulls={true}
                                strokeWidth={3}
                                type="linear"
                                dataKey="Robo_SIP"
                                name={"Robo_SIP"}
                                fill="url('#myGradient')"
                                stroke="#20c997"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

