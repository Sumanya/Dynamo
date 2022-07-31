import React from "react";
import { useState } from "react";
import PortfolioGraphWrapper from "./PortfolioGraphWrapper";
import SipGraphWrapper from "./SipGraphWrapper";
import { Modal } from "antd";

const DynamoTabs = ({ riskProfile, amountSelected }) => {
  const GRAPHS = {
    STP: "STP",
    SIP: "SIP",
  };
  const [show, setShow] = useState(true);
  return (
    <Modal
      footer={null}
      visible={true}
      closable={false}
      width="100vw"
      style={{ top: "16px" }}
    >
      <div>
        <button
          onClick={() => setShow(true)}
          className="px-3 py-2 mr-2 text-lg"
        >
          {GRAPHS.STP}
        </button>

        <div className="overflow-auto">
            <PortfolioGraphWrapper
              riskProfile={riskProfile}
              amountSelected={amountSelected}
            />
          </div>
      </div>
    </Modal>
  );
};

export default DynamoTabs;