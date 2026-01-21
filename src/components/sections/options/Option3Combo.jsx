import { Card, Tabs, Tag, Row, Col, InputNumber, Button } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import {
  formatCurrency,
  formatNumber,
  roundNumber,
} from "../../../utils/formatters";
import { useFinance } from "../../../context/FinanceContext";

const Option3Combo = () => {
  const { inputs, updateInput, results } = useFinance();
  const { options } = results;
  const option3Addon = options.option3Addon;
  const option3Discount = options.option3Discount; // ← THÊM

const AddonTab = () => (
    <div className="py-2">
      <Row gutter={[16, 16]}>
        {/* --- PHẦN 1: THIẾT LẬP GIÁ (INPUT) --- */}
        <Col xs={24} lg={10}>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-full">
            <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase border-b pb-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-yellow-400 rounded-full block"></span>
              Thiết lập giá Dịch vụ
            </h4>

            <div className="space-y-4">
              {/* Input Giá A */}
              <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  Giá Dịch vụ A
                </label>
                <InputNumber
                  className="w-full font-bold text-gray-800 text-sm bg-white"
                  size="large"
                  value={inputs.comboPriceA}
                  placeholder="0"
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(val) => updateInput("comboPriceA", val)}
                  min={0}
                />
              </div>

              {/* Input Giá B */}
              <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  Giá Dịch vụ B
                </label>
                <InputNumber
                  className="w-full font-bold text-gray-800 text-sm bg-white"
                  size="large"
                  value={inputs.comboPriceB}
                  placeholder="0"
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(val) => updateInput("comboPriceB", val)}
                  min={0}
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-400 italic mt-3 text-center">
              * Nhập giá để tính toán doanh thu dự kiến
            </p>
          </div>
        </Col>

        {/* --- PHẦN 2: KẾT QUẢ TÍNH TOÁN (OUTPUT) --- */}
        <Col xs={24} lg={14}>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full">
            <h4 className="text-sm font-bold text-gray-700 p-4 bg-gray-50/80 uppercase border-b flex items-center gap-2 mb-0">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full block"></span>
              Kết quả dự báo
            </h4>

            <div className="divide-y divide-gray-100">
              {/* Row 1: % Chuyển đổi */}
              <div className="flex justify-between items-center p-3 md:px-5 hover:bg-gray-50">
                <span className="text-xs md:text-sm text-gray-600 font-medium">
                  % Khách chuyển sang Combo
                </span>
                <span className="font-bold text-blue-600 text-sm md:text-base">
                  {option3Addon?.PercentcustomerSwitchedToTheComboAddon?.toFixed(0)}%
                </span>
              </div>

              {/* Row 2: Số khách Combo */}
              <div className="flex justify-between items-center p-3 md:px-5 hover:bg-gray-50">
                <span className="text-xs md:text-sm text-gray-600">
                  Số khách dùng Combo
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {formatNumber(
                    option3Addon.NumberofGuestsUsingTheComboAddonFinal
                  )}
                </span>
              </div>

              {/* Row 3: Số khách A-only */}
              <div className="flex justify-between items-center p-3 md:px-5 hover:bg-gray-50">
                <span className="text-xs md:text-sm text-gray-600">
                  Số khách vẫn dùng A-only
                </span>
                <span className="font-bold text-gray-800 text-sm">
                  {formatNumber(option3Addon.aOnlyCustomers)}
                </span>
              </div>

              {/* Group Chi tiết (Box xanh nhạt) */}
              <div className="bg-blue-50/40 rounded-lg m-3 p-3 border border-blue-100/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] md:text-xs text-gray-500 uppercase font-bold">
                    Combo / Thợ / Ngày
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {formatNumber(option3Addon.comboPerStaffPerDay)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-xs text-gray-500 uppercase font-bold">
                    Combo / Tiệm / Ngày
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {formatNumber(option3Addon.comboPerMonthPerDay)}
                  </span>
                </div>
              </div>

              {/* Row Doanh thu cũ */}
              <div className="flex justify-between items-center p-3 md:px-5 hover:bg-gray-50">
                <span className="text-xs md:text-sm text-gray-500">
                  Doanh thu trước Combo
                </span>
                <span className="font-semibold text-gray-400 text-sm line-through decoration-gray-300">
                  {formatCurrency(option3Addon.revenueBeforeCombo)}
                </span>
              </div>

              {/* Row Doanh thu mới (Highlight) */}
              <div className="flex justify-between items-center p-3 md:px-5 bg-green-50/40">
                <span className="text-xs md:text-sm text-green-700 font-bold uppercase">
                  Doanh thu sau Combo
                </span>
                <span className="font-black text-green-700 text-base">
                  {formatCurrency(option3Addon.revenueAfterCombo)}
                </span>
              </div>

              {/* Row Đánh giá */}
              <div className="flex justify-between items-center p-3 md:px-5 pt-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Đánh giá khả thi
                </span>
                <Tag
                  color={option3Addon?.feasibility?.color || "default"}
                  className="font-bold px-3 py-0.5 rounded-full border-none text-xs m-0"
                >
                  {option3Addon?.feasibility?.label || "Đang tính..."}
                </Tag>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );

  // NỘI DUNG TAB 2: COMBO DISCOUNT (Giảm giá)
const DiscountTab = () => (
  <div className="py-2">
    <Row gutter={[16, 16]}>
      {/* --- PHẦN 1: THIẾT LẬP GIÁ (INPUT) --- */}
      <Col xs={24} lg={10}>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-full">
          <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase border-b pb-2 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-yellow-400 rounded-full block"></span>
            Thiết lập giá Dịch vụ
          </h4>

          <div className="space-y-4">
            {/* Input Giá A */}
            <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                Giá Dịch vụ A
              </label>
              <InputNumber
                className="w-full font-bold text-gray-800 text-sm bg-white"
                size="large"
                value={inputs.comboPriceA !== null ? inputs.comboPriceA : ""}
                placeholder="Nhập giá ($)"
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(val) => updateInput("comboPriceA", val)}
                min={0}
              />
            </div>

            {/* Input Giá B */}
            <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                Giá Dịch vụ B
              </label>
              <InputNumber
                className="w-full font-bold text-gray-800 text-sm bg-white"
                size="large"
                value={inputs.comboPriceB !== null ? inputs.comboPriceB : ""}
                placeholder="Nhập giá ($)"
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(val) => updateInput("comboPriceB", val)}
                min={0}
              />
            </div>

            {/* Input % Giảm giá */}
            <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                % Giảm giá Combo
              </label>
              <InputNumber
                className="w-full font-bold text-blue-600 text-sm bg-white"
                size="large"
                value={
                  inputs.comboDiscountPercent !== null
                    ? inputs.comboDiscountPercent
                    : ""
                }
                placeholder="Nhập %"
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace(/%/g, "")}
                onChange={(val) => updateInput("comboDiscountPercent", val)}
                min={0}
                max={100}
              />
            </div>
          </div>
          
          <p className="text-[10px] text-gray-400 italic mt-3 text-center">
            * Nhập giá và % giảm để tính toán doanh thu mục tiêu
          </p>
        </div>
      </Col>

      {/* --- PHẦN 2: KẾT QUẢ TÍNH TOÁN (OUTPUT) --- */}
      <Col xs={24} lg={14}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full">
          <h4 className="text-sm font-bold text-gray-700 p-4 bg-gray-50/80 uppercase border-b flex items-center gap-2 mb-0">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full block"></span>
            Kết quả dự báo
          </h4>

          <div className="divide-y divide-gray-100">
            {/* Row: Giá Combo sau giảm */}
            <div className="flex justify-between items-center p-3 md:px-5 bg-blue-50/30">
              <span className="text-xs md:text-sm text-blue-800 font-bold uppercase">
                Giá Combo sau giảm
              </span>
              <span className="font-black text-blue-600 text-base">
                {formatCurrency(option3Discount?.discountedPrice)}
              </span>
            </div>

            {/* Row: Doanh thu toàn bộ ticket */}
            <div className="flex justify-between items-center p-3 md:px-5 hover:bg-gray-50">
              <span className="text-xs md:text-sm text-gray-600">
                Doanh thu toàn bộ ticket
              </span>
              <span className="font-bold text-gray-800 text-sm">
                {formatCurrency(option3Discount?.revenueAllTickets)}
              </span>
            </div>

            {/* Row: Doanh thu tăng cần đạt */}
            <div className="flex justify-between items-center p-3 md:px-5 hover:bg-gray-50">
              <span className="text-xs md:text-sm text-gray-600">
                Doanh thu tăng cần đạt
              </span>
              <span className="font-bold text-gray-800 text-sm">
                {formatCurrency(option3Discount?.revenueGapNeeded)}
              </span>
            </div>

            {/* Group: Khách hàng cần thiết */}
            <div className="bg-gray-50/50 m-3 p-3 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 font-medium">Cần bao nhiêu khách dùng Combo</span>
                <span className="font-bold text-gray-900 text-sm">
                   {formatNumber(option3Discount?.comboCustomersNeeded)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 font-medium">% Số khách dùng Combo</span>
                <span className="font-bold text-blue-600 text-sm">
                   {option3Discount?.percentCustomersUsingCombo?.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                <span className="text-[10px] uppercase font-bold text-gray-500">Khách dùng Combo / Thợ / Ngày</span>
                <span className="font-bold text-gray-900 text-sm">
                   {roundNumber(option3Discount?.comboPerStaffPerDay)}
                </span>
              </div>
            </div>

            {/* Row: Doanh thu sau Combo */}
            <div className="flex justify-between items-center p-3 md:px-5 bg-green-50/40 border-t border-gray-100">
              <span className="text-xs md:text-sm text-green-700 font-bold uppercase">
                Doanh thu sau Combo
              </span>
              <span className="font-black text-green-700 text-base">
                {formatCurrency(option3Discount?.revenueAfterCombo)}
              </span>
            </div>

            {/* Row: Đánh giá khả thi */}
            <div className="flex justify-between items-center p-3 md:px-5 pt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Đánh giá khả thi
              </span>
              <Tag
                color={option3Discount?.feasibility?.color || "default"}
                className="font-bold px-3 py-0.5 rounded-full border-none text-xs m-0"
              >
                {option3Discount?.feasibility?.label || "Đang tính..."}
              </Tag>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
);

  return (
    <Card className="rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4 md:mt-6">
      <div className="bg-linear-to-r from-orange-500 rounded-lg to-orange-400 p-3 md:p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <GiftOutlined className="text-lg md:text-xl" />
          <h3 className="text-white font-bold text-sm md:text-lg m-0 uppercase">
            Option 3: Chiến lược Combo
          </h3>
        </div>
      </div>

      <div className="px-6 pb-2">
        <Tabs
          defaultActiveKey="1"
          items={[
            { key: "1", label: "Combo Add-on (Ghép)", children: AddonTab() },
            {
              key: "2",
              label: "Combo Discount (Giảm giá)",
              children: DiscountTab(),
            },
          ]}
          tabBarStyle={{ marginBottom: 0 }}
        />
      </div>
    </Card>
  );
};

export default Option3Combo;
