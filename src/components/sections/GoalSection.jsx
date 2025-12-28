import { Tag } from "antd";
import { ArrowRightOutlined, RiseOutlined } from "@ant-design/icons";
import { useFinance } from "../../context/FinanceContext";
import { formatNumber } from "../../utils/formatters";
const GoalSection = () => {
  const { inputs, results } = useFinance();
  const { goal } = results; // Lấy kết quả tính toán Goal

  const getTagColor = (strategyTag) => {
    const colorMap = {
      "BUỘC TĂNG INCOME": "red",
      "CẦN TĂNG INCOME": "orange",
      "ỔN NHƯNG KHÔNG BỀN VỮNG": "blue",
      "DUY TRÌ": "green",
    };
    return colorMap[strategyTag] || "default";
  };
  return (
    <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-200 bg-linear-to-br from-rose-50 via-pink-50 to-rose-50">
      {/* Background Gradient - Pastel nhẹ */}
      <div className="absolute inset-0 bg-linear-to-r from-rose-50/80 via-pink-50/80 to-rose-50/80 z-0"></div>

      {/* Decorative Circles - Rất nhẹ */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-200 opacity-10 rounded-full z-0"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-20 h-20 bg-amber-200 opacity-15 rounded-full z-0"></div>

      <div className="relative z-10 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* LEFT: Tiêu đề & Tag Chiến lược */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <RiseOutlined className="text-rose-500 text-xl" />
              <h2 className="text-gray-700 font-bold uppercase tracking-widest text-sm m-0">
                MỤC TIÊU TĂNG TRƯỞNG 2026
              </h2>
            </div>

            {/* Tag chiến lược */}
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <Tag
                color={getTagColor(goal.strategyTag)}
                className="text-sm! font-black uppercase border-none shadow-sm"
              >
                {goal.strategyTag}
              </Tag>
              <Tag
                color="default"
                className="text-sm! font-bold bg-gray-100 border-none shadow-sm"
              >
                Tăng: {goal.growthPercent}%
              </Tag>
            </div>
            <p className="text-gray-600 text-xs mt-2 italic">
              *Dựa trên lợi nhuận trước thuế và mức lạm phát năm
            </p>
          </div>

          {/* CENTER: Visual Flow (Current -> Goal) */}
          <div className="flex items-center justify-center gap-4 md:gap-7 bg-white/60 p-6 md:p-8 rounded-lg backdrop-blur-sm border border-pink-200/50 shadow-sm flex-1 min-w-0">
            {/* Số cũ */}
            <div className="text-center shrink-0">
              <p className="text-xs uppercase mb-1 text-gray-600 font-semibold">
                Hiện tại
              </p>
              <p className="text-xl md:text-2xl font-bold text-gray-600">
                ${formatNumber(inputs.revenue)}
              </p>
            </div>

            <ArrowRightOutlined className="text-rose-400 text-2xl md:text-3xl shrink-0" />

            {/* Số Mới */}
            <div className="text-center flex-1 min-w-0">
              <p className="text-xs uppercase text-gray-700 font-bold mb-1">
                Mục tiêu năm tới
              </p>
              <div className="bg-transparent border-b-2 border-rose-500 text-gray-900 font-black text-3xl md:text-4xl text-center py-2 inline-block min-w-45">
                ${(inputs.goalRevenue || goal.targetRevenue).toLocaleString()}
              </div>
            </div>
          </div>

          {/* RIGHT: Con số GAP (Khoảng cách) */}
          <div className="text-center  md:text-right">
            <p className="text-gray-700 text-xs font-bold uppercase mb-1">
              Cần tăng thêm
            </p>
            <div className="flex items-baseline justify-center md:justify-end gap-2">
              <p className="text-2xl md:text-3xl font-black text-rose-600 drop-shadow-sm">
                +${formatNumber(goal.gap)}
              </p>
              <p className="text-sm text-amber-600 font-bold">/ tháng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSection;
