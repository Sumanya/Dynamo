import styled from "styled-components";
const ProgressBar = styled.div`
  background: #BDBDBD;
  opacity: 0.4;
  border-radius: 8px;
  height: 8px;
`;
const CurrentValue = styled.div`
  background: #017AFF;
  position: relative;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  width: 80px;
  &:after{
    content: " ";
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 8px;
    border-style: solid;
    border-color: #017AFF transparent transparent transparent;
  }
`;

export default function VariableProgress({ min, max, value }){
  return <div className="mx-5 overflow-visible">
    <div className="d-flex mb-2 mt-5">
      <div className="position-relative w-100">
        <div 
          className="position-absolute" 
          style={{ 
            bottom: 0, 
            left: `calc(${((value - min) / (max - min) * 100)}% - 40px)`,
          }}
        >
          <CurrentValue className="text-white p-2">
            <div>Current</div> 
            <div>{ value.toFixed(2) }</div>
          </CurrentValue>
        </div>
      </div>
    </div>
    <div>
      <ProgressBar className="w-full mb-2"/>
      <div className="d-flex justify-content-between">
        <div className="font-weight-bold">
          <div className="text-muted">
            Min Value
          </div>
          <div>
            { min }
          </div> 
        </div>
        <div className="font-weight-bold">
          <div className="text-muted">
            Max Value
          </div>
          <div>
            { max }
          </div>
        </div>
      </div>
    </div>
  </div>
}

