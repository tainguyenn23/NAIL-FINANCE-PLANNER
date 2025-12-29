import { useState } from "react";
import { Card, Tooltip, InputNumber, Tag, Modal, Button } from "antd";
import {
  DollarOutlined,
  InfoCircleOutlined,
  SwapOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useFinance } from "../../../context/FinanceContext";
import { roundNumber } from "../../../utils/formatters";
import ComparisonTable from "../../table/ComparisonTable";

const MetricRow = ({
  label,
  target,
  current,
  gap,
  isHighlight = false,
  tooltip,
  isInput = false,
  inputValue,
  onInputChange,
  gapColor,
  isCurrency = true,
}) => (
  <div
    className={`grid grid-cols-12 gap-2 py-4 border-b border-gray-100 items-center ${
      isHighlight ? "bg-purple-50/50" : ""
    }`}
  >
    {/* Tên chỉ số */}
    <div className="col-span-5 pl-4 font-semibold text-gray-700 text-sm flex items-center gap-1">
      {label}
      {tooltip && (
        <Tooltip title={tooltip}>
          <InfoCircleOutlined className="text-gray-300 text-[10px]" />
        </Tooltip>
      )}
    </div>

    {/* Cột 1: Mục tiêu 2026 */}
    <div className="col-span-2 text-center font-bold text-purple-700 text-lg">
      {isInput ? (
        <InputNumber
          className="w-full bg-yellow-50 border-yellow-400 font-bold text-gray-800! text-sm"
          size="small"
          value={inputValue}
          onChange={onInputChange}
          formatter={(value) =>
            `${isCurrency ? "$ " : ""}${value}`.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ","
            )
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          min={0}
        />
      ) : target === "-" ? (
        "-"
      ) : typeof target === "number" ? (
        // Kiểm tra isCurrency trước khi thêm dấu $
        `${isCurrency ? "$" : ""}${target.toLocaleString()}`
      ) : (
        target
      )}
    </div>

    {/* Cột 2: Hiện tại 2025 */}
    <div className="col-span-2 text-center text-gray-400 font-medium">
      {current === "-"
        ? "-"
        : typeof current === "number"
        ? `${isCurrency ? "$" : ""}${current.toLocaleString()}`
        : current}
    </div>

    {/* Cột 3: Cần thêm (GAP) */}
    <div className="col-span-3 text-center">
      {gap !== null && gap !== undefined && gap !== "-" ? (
        <Tag
          color={gapColor ? gapColor : gap < 0 ? "blue" : "red"}
          className="font-bold text-lg! px-3 py-1 border-0 rounded-full min-w-15"
        >
          {gap > 0 ? "+" : gap < 0 ? "-" : ""}
          $
          {typeof gap === "number" ? Math.abs(gap).toLocaleString() : gap}
        </Tag>
      ) : (
        <span className="text-gray-400">-</span>
      )}
    </div>
  </div>
);

const Option2UpSell = () => {
  const { inputs, results, updateInput } = useFinance();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { options } = results;
  const option2 = options.option2;
  const isW2Profitable = option2.w2Gap >= 0;

  return (
    <Card className="rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 h-full">
      {/* HEADER CARD: Màu Tím */}
      <div className="bg-linear-to-r from-purple-600 to-purple-500 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-xl" />
          <h3 className="text-white font-bold text-lg m-0 uppercase">
            Option 2: Upsell
          </h3>
        </div>
        <Tag
          className="text-purple-700 font-bold uppercase border-none bg-white cursor-pointer hover:bg-gray-100 hover:scale-105 transition-transform flex items-center gap-1 px-3 py-1"
          onClick={() => setIsModalVisible(true)}
        >
          <EyeOutlined /> Xem bảng so sánh
        </Tag>
      </div>

      {/* HEADER BẢNG 3 CỘT */}
      <div className="grid grid-cols-12 gap-2 bg-gray-50 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
        <div className="col-span-5 pl-4">Chỉ số đo lường</div>
        <div className="col-span-2 text-center text-purple-700">
          Mục tiêu 2026
        </div>
        <div className="col-span-2 text-center">Hiện tại 2025</div>
        <div className="col-span-3 text-center text-red-500">GROWTH</div>
      </div>

      {/* NỘI DUNG BẢNG */}
      <div className="bg-white">
        {/* 1. UPSELL (Ave Ticket) */}
        <MetricRow
          label="UPSELL"
          target={roundNumber(option2.targetAveTicket)}
          current={roundNumber(option2.currentAveTicket)}
          gap={roundNumber(option2.priceGap)}
          isHighlight={true}
          tooltip="Giá trung bình mỗi ticket cần đạt"
        />

        {/* 2. Số ticket cần có */}
        <MetricRow
          label="Số ticket cần có"
          target={roundNumber(option2.ticketsNeeded)}
          // current={option2.ticketsNeeded}
          gap="-"
          tooltip="Giữ nguyên số ticket hiện tại"
          isCurrency={false}
        />

        {/* 3. AVE PAYROLL/ Thợ */}
        <MetricRow
          label="AVE PAYROLL/ Thợ"
          target={roundNumber(option2.avePayrollPerStaff)}
          current={roundNumber(option2.CurrentavePayrollPerStaff)}
          gap="-"
          tooltip="Lương trung bình mỗi thợ"
        />

        {/* 4. CHỦ (Owner) */}
        <MetricRow
          label="CHỦ (Owner)"
          target={roundNumber(option2.targetOwnerProfit)}
          current={roundNumber(option2.currentOwnerProfit)}
          gap={roundNumber(option2.ownerProfitGap)}
          tooltip="Lợi nhuận của chủ tiệm hiện tại 1099"
        />

         <MetricRow
          label="Tổng lợi nhuận chủ (12 tháng)"
          target={roundNumber(option2.targetOwnerProfit * 12)}
          tooltip="Tổng lợi nhuận của chủ tiệm trong 12 tháng"
        />

        {/* 5. W2 */}
        <MetricRow
          label="Chi phí W2 / Thợ" // Label rõ ràng hơn
          // Target này là chi phí dự kiến cho 1 thợ ($5,400)
          target={roundNumber(option2.W2PayrollPerStaff)}
          current="-"
          // Đây là số tiền tiết kiệm được (hoặc bị lỗ)
          gap={roundNumber(option2.w2Gap)}
          // TRUYỀN MÀU TÙY CHỈNH VÀO ĐÂY
          // Nếu Lời (Dương) -> Green, Nếu Lỗ (Âm) -> Red
          gapColor={isW2Profitable ? "green" : "red"}
          tooltip="Tổng chi phí ước tính cho 1 thợ nếu trả theo W2 (bao gồm thuế)"
        />

        {/* 6. Amount/ Giờ (Input - màu vàng) */}
        <MetricRow
          label="Amount/ Giờ"
          target={inputs.amountPerHour}
          current="-"
          gap="-"
          isInput={true}
          inputValue={inputs.amountPerHour}
          onInputChange={(val) => updateInput("amountPerHour", val)}
          tooltip="Nhập lương/giờ để tính W2 payroll"
        />
      </div>

      {/* Hiển thị insight về giá */}
      {option2.priceInsight && (
        <div
          className={`p-3 rounded-lg border ${
            option2.priceInsight.type === "success"
              ? "bg-green-50 border-green-200"
              : option2.priceInsight.type === "warning"
              ? "bg-orange-50 border-orange-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <p
            className={`text-xl font-bold ${
              option2.priceInsight.type === "success"
                ? "text-green-800"
                : option2.priceInsight.type === "warning"
                ? "text-orange-800"
                : "text-red-800"
            }`}
          >
            {option2.priceInsight.message}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {option2.priceInsight.desc}
          </p>
        </div>
      )}

      {/* FOOTER: Bảng so sánh W2 vs 1099 */}
      {/* --- PHẦN SO SÁNH W2 vs 1099 --- */}
      {/* --- 3. BẢNG SO SÁNH ĐỐI CHIẾU (COMPARISON TABLE) --- */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-purple-700">
            <SwapOutlined />{" "}
            <span className="uppercase font-bold">
              So sánh hiệu quả: W2 vs 1099
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setIsModalVisible(false)}
            className="bg-purple-600"
          >
            Đã hiểu
          </Button>,
        ]}
        width={700} 
        centered
      >
       <ComparisonTable />
      </Modal>
    </Card>
  );
};

export default Option2UpSell;
