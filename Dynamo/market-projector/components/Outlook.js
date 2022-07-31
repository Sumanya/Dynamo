import OutlookMeter from './OutlookMeter';
import WhiteCards from '../../common_components/WhiteCards';
import React, {useState} from 'react';
import {get_rank} from './OutlookExplanation';
import Popup from 'reactjs-popup';
import VariableProgress from './VariableProgress';

export default function Outlook({var_name, var_rank, score, description, value = 0, max_val, min_val }){
	const [showPopup, setShowPopup] = useState(false);
	return <>
		<Popup contentStyle={{ borderRadius: "16px"}} style={{ "overflowY":"auto" }} open={showPopup} onClose={() => setShowPopup(false)} modal>
			<div style={{'padding':'20px','overflowX':'auto', 'fontFamily':"Avenir Next"}} >
				<div className="row">
					<div className="col-12">
						<h3 style={{"color":"cadetblue","fontSize":"22px","marginBottom":"20px"}}>{ var_name }</h3>
						<div className="text-muted font-weight-bold mb-1">
							Last Closing - {value.toFixed(2)}
						</div>
						<p>{description}</p>
					</div>
					{/* <div className="col-4 d-flex flex-column justify-content-center">
						<OutlookMeter value={score} style={{width: '160px'}} className="img-responsive"/>
						<div className="text-muted text-center font-weight-bold mb-1">
							Range meter
						</div>
					</div> */}
				</div>
			</div>
      <div className="pb-4">
        <VariableProgress max={max_val} min={min_val} value={value}/>
      </div>
		</Popup>
		<WhiteCards
				className="d-flex justify-content-between align-items-center p-2 w-100"
				onClick={() => {
					console.log("opening")
					setShowPopup(true)
				}}
		>
			<img
					src={get_rank(var_rank)}
					className="img-responsive"
					style={{width: '45px'}}
			/>
			<div className="text-wrap">
				{var_name}
			</div>
			<OutlookMeter value={Math.round(((value - min_val) / (max_val - min_val)) * 100)} style={{width: '60px', fontSize: "10px"}} className="img-responsive"/>
		</WhiteCards>
	</>
}