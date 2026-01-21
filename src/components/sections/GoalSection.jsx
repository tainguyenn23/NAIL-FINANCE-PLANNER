/* eslint-disable react-hooks/set-state-in-effect */
import { Tag, InputNumber } from "antd";
import { ArrowRightOutlined, RiseOutlined } from "@ant-design/icons";
import { useFinance } from "../../context/FinanceContext";
import { formatNumber } from "../../utils/formatters";
import { useState, useEffect } from "react";
const GoalSection = () => {
  const { inputs, results, updateInput } = useFinance();
  const { goal } = results; // Lấy kết quả tính toán Goal

  const [localPercent, setLocalPercent] = useState(goal.growthPercent);

  useEffect(() => {
    setLocalPercent((prev) => {
      if (Math.abs(goal.growthPercent - prev) > 0.1) {
        return goal.growthPercent;
      }
      // Nếu không lệch nhiều (nghĩa là do người dùng đang nhập), giữ nguyên
      return prev;
    });
  }, [goal.growthPercent]); // Chỉ phụ thuộc duy nhất vào goal.growthPercent


  const getTagColor = (strategyTag) => {
    const colorMap = {
      "BUỘC TĂNG INCOME": "red",
      "CẦN TĂNG INCOME": "orange",
      "ỔN NHƯNG KHÔNG BỀN VỮNG": "blue",
      "DUY TRÌ": "green",
    };
    return colorMap[strategyTag] || "default";
  };

  // input = % target
 const handleGrowthChange = (percent) => {
    // 1. Cập nhật UI ngay lập tức (Local State)
    setLocalPercent(percent);

    const safePercent = percent || 0;
    const currentRevenue = inputs.revenue || 0;

    // 2. Tính toán doanh thu mục tiêu
    let calculatedRevenue = currentRevenue * (1 + safePercent / 100);

    calculatedRevenue = Math.round(calculatedRevenue); 
    
    // 4. Lưu con số chẵn đẹp vào hệ thống
    updateInput("goalRevenue", calculatedRevenue);
  }
  
  return (
    <div className="relative overflow-hidden rounded-lg md:rounded-xl shadow-md border border-gray-200 bg-linear-to-br from-rose-50 via-pink-50 to-rose-50">
      <div className="absolute inset-0 bg-linear-to-r from-rose-50/80 via-pink-50/80 to-rose-50/80 z-0"></div>

      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-200 opacity-10 rounded-full z-0 hidden md:block"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-20 h-20 bg-amber-200 opacity-15 rounded-full z-0 hidden md:block"></div>

      <div className="relative z-10 p-4 md:p-4">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <RiseOutlined className="text-rose-500 text-lg md:text-xl" />
              <h2 className="text-gray-700 font-bold uppercase tracking-widest text-xs md:text-sm m-0">
                MỤC TIÊU TĂNG TRƯỞNG 2026
              </h2>
            </div>

            <div className="mt-2 md:mt-3 flex items-center gap-2 md:gap-3 flex-wrap justify-center md:justify-start">
              <Tag
                color={getTagColor(goal.strategyTag)}
                className="text-xs md:text-sm! font-black uppercase border-none shadow-sm"
              >
                {goal.strategyTag}
              </Tag>
              {/* replace old tag */}
              <div className="flex items-center bg-white border border-gray-200 rounded shadow-sm px-2 py-0.5">
                <span className="text-xs md:text-sm font-bold text-gray-600 mr-1">Tăng:</span>
                <InputNumber
                  className="font-bold text-gray-800 text-xs md:text-sm"
                  size="small"
                  min={0}
                  // Lấy giá trị từ kết quả tính toán hiện tại
                  value={localPercent}
                  onChange={handleGrowthChange}
                  precision={3}   // 1. Cho phép hiển thị 1 số sau dấu phẩy (VD: 19.8%)
                  // Hiển thị thêm dấu %
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace('%', '')}
                  // Style để input trong suốt, hòa vào nền
                  bordered={false}
                  style={{ width: '60px', padding: 0 }}
                  controls={false} // Ẩn nút tăng giảm mặc định cho gọn
                />
              </div>
              {/* -------------------------------------------------- */}
            </div>
            <p className="text-gray-600 text-[10px] md:text-xs mt-2 italic">
              *Nhập lại vào ô tăng để tùy chỉnh mục tiêu
            </p>
          </div>

          {/* CENTER: Visual Flow (Current -> Goal) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 bg-white/60 p-4 md:p-6 rounded-lg backdrop-blur-sm border border-pink-200/50 shadow-sm w-full">
            {/* Số cũ */}
            <div className="text-center">
              <p className="text-xs uppercase mb-1 text-gray-600 font-semibold">
                Hiện tại
              </p>
              <p className="text-lg md:text-2xl font-bold text-gray-600">
                ${formatNumber(inputs.revenue)}
              </p>
            </div>

            <ArrowRightOutlined className="text-rose-400 text-xl md:text-3xl transform rotate-90 sm:rotate-0" />

            {/* Số Mới */}
            <div className="text-center flex-1">
              <p className="text-xs uppercase text-gray-700 font-bold mb-1">
                Mục tiêu năm tới
              </p>
              <div className="bg-transparent border-b-2 border-rose-500 text-gray-900 font-black text-2xl md:text-4xl text-center py-2 px-2">
                ${(inputs.goalRevenue || goal.targetRevenue).toLocaleString()}
              </div>
            </div>
          </div>

          {/* RIGHT: Con số GAP (Khoảng cách) */}
          <div className="text-center bg-rose-50 p-3 md:p-4 rounded-lg border border-rose-200 w-full">
            <p className="text-gray-700 text-xs font-bold uppercase mb-1">
              Cần tăng thêm
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <p className="text-xl md:text-3xl font-black text-rose-600 drop-shadow-sm">
                +${formatNumber(goal.gap)}
              </p>
              <p className="text-xs md:text-sm text-amber-600 font-bold">/ tháng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSection;
