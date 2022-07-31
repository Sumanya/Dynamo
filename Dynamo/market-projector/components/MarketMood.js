import ReactSpeedometer from 'react-d3-speedometer';
import {useState} from 'react';
import {indexTags, isMobile, isTablet} from '../utils';

const MarketMood = ({ score }) => {

    const [meterOptions, setMeterOptions] = useState({
        value: score,
        minValue: 0,
        maxValue: 100,
        width: isMobile() ? 300 : 600,
        height: isMobile() ? 300 : 360,
        valueTextFontSize: '40px',
        customSegmentLabels: indexTags().map(({ tag }) => ({
            text: tag,
            position: 'OUTSIDE'
        })),
    });

    return <div className="d-flex flex-column align-items-center w-100">
        <h1 className="font-weight-bold">AI Market Signal</h1>
        <div className="py-3" />
        <ReactSpeedometer {...meterOptions} />
    </div>;
};
export default MarketMood;