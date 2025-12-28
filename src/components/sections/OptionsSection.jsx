// src/components/sections/OptionsSection.jsx
import { Row, Col } from "antd";

import { useFinance } from "../../context/FinanceContext";

import Option1AverageTicket from "./options/Option1AverageTicket";
import Option2UpSell from "./options/Option2UpSell";
import Option3Combo from "./options/Option3Combo";

const OptionsSection = ({ option1Ref, option2Ref, option3Ref }) => {
  const { inputs, results } = useFinance();
  const { goal } = results;
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center sticky top-16 z-40 shadow-sm">
        <span className="font-bold text-gray-600 text-sm uppercase">
          Mục tiêu cần đạt:
        </span>
        <div className="flex gap-4">
          <span className="text-gray-500 text-sm">
            Doanh thu cần đạt:{" "}
            <b>
              ${(inputs.goalRevenue || goal.targetRevenue).toLocaleString()}
            </b>
          </span>
          <span className="text-red-500 text-sm font-black bg-white px-2 rounded border border-red-100">
            Thiếu (Gap): ${goal.gap.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="border-l-4 border-pink-600 pl-4 py-1">
        <h3 className="text-xl font-black text-gray-800 m-0 uppercase">
          Các Kịch bản Tăng trưởng
        </h3>
      </div>

      {/* 2. LAYOUT 2 CỘT CHO OPTION 1 & 2 */}
      <Row gutter={[24, 24]}>
        {/* OPTION 1: VOLUME (50%) */}
        <Col xs={24} lg={12}>
          <div className="h-full" ref={option1Ref}>
            <Option1AverageTicket />
          </div>
        </Col>

        {/* OPTION 2: UPSELL & W2 (50%) */}
        <Col xs={24} lg={12}>
          <div className="h-full" ref={option2Ref}>
            <Option2UpSell />
          </div>
        </Col>

        {/* OPTION 3: COMBO (100%) */}
        <Col span={24}>
          <div className="h-full" ref={option3Ref}>
            <Option3Combo />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OptionsSection;
