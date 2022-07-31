import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Loader from '../../common_components/loader/Loader';
import WhiteCards from '../../common_components/WhiteCards';

import rank1 from '../../images/rank1.png';
import rank2 from '../../images/rank2.png';
import rank3 from '../../images/rank3.png';
import rank4 from '../../images/rank4.png';
import rank5 from '../../images/rank5.png';
import rank6 from '../../images/rank6.png';
import OutlookMeter from './OutlookMeter';
import Outlook from './Outlook';

export function get_rank(rank) {
    if (rank == 1) return rank1; else if (rank == 2) return rank2; else if (rank == 3) return rank3; else if (rank == 4) return rank4; else if (rank == 5) return rank5; else if (rank == 6) return rank6;
}

function indicator_image(level) {
    var img_url = 'https://cdn.indiawealth.in/public/images/icons/fmpMeter/mediumRisk.svg';
    if (level == 'high') {
        img_url = 'https://cdn.indiawealth.in/public/images/icons/fmpMeter/moderatlyHighRisk.svg';
    } else if (level == 'low') {
        img_url = 'https://cdn.indiawealth.in/public/images/icons/fmpMeter/moderatelyLowrisk.svg';
    } else if (level == 'very low') {
        img_url = 'https://cdn.indiawealth.in/public/images/icons/fmpMeter/lowRisk.svg';
    } else if (level == 'very high') {
        img_url = 'https://cdn.indiawealth.in/public/images/icons/fmpMeter/highRisk.svg';
    }
    return img_url;
}

const OutlookExplanation = ({ explanation }) => {

    return <div className="px-3">
        <div>
            <h6 className="px-2">Outlook Explanation</h6>
            <div className="d-flex justify-content-between row">
                {explanation.slice(0, 3).map((outlook) => {
                    return <div className="col-4" key={outlook.var_rank}>
                        <Outlook { ...outlook }/>
                    </div>;
                })}
            </div>
            <div className="d-flex justify-content-between row">
                {explanation.slice(3, 6).map((outlook) => {
                    return <div className="col-4" key={outlook.var_rank}>
                        <Outlook { ...outlook }/>
                    </div>;
                })}
            </div>
        </div>
    </div>;
};
export default OutlookExplanation;
