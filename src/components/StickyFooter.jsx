// src/components/StickyFooter.jsx
import { useFinance } from '../context/FinanceContext';
import { Tag } from 'antd';
import { RiseOutlined } from '@ant-design/icons';
import { formatCurrency } from '../utils/formatters';

const StickyFooter = () => {
  const { inputs, results } = useFinance();
  const { goal } = results;

  const targetRevenue = inputs.goalRevenue || goal.targetRevenue;
  const gap = goal.gap;
  const growthPercent = goal.growthPercent;
  const strategyTag = goal.strategyTag;

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
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 text-xs">
        {/* LEFT: Doanh thu mục tiêu */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Mục tiêu:</span>
          <span className="font-bold text-gray-800">{formatCurrency(targetRevenue)}</span>
        </div>

        {/* CENTER: Mục tiêu tăng trưởng */}
        <div className="flex items-center gap-2">
          <RiseOutlined className="text-rose-500 text-xs" />
          <span className="text-gray-600">Tăng trưởng:</span>
          <Tag
            color={getTagColor(strategyTag)}
            className="text-xs font-bold border-none m-0"
          >
            {growthPercent}%
          </Tag>
          <Tag color={getTagColor(strategyTag)} className="text-xs m-0">
            {strategyTag}
          </Tag>
        </div>

        {/* RIGHT: Gap */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Cần tăng:</span>
          <span className="font-black text-rose-600">+{formatCurrency(gap)}</span>
        </div>
      </div>
    </div>
  );
};

export default StickyFooter;