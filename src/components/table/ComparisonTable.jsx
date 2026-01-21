import { Table } from "antd";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency, roundNumber } from "../../utils/formatters";

const ComparisonTable = () => {
  const { results } = useFinance();
  const { options } = results;
  const option2 = options.option2;
  const { comparison } = option2;

  const diffCost = comparison.payrollperStaff1099 - comparison.W2PayrollPerStaff;
  const diffProfit = comparison.profitW2Oner - comparison.targetOwnerProfit1099;

  const calcPercent = (diff, base) => {
    if (!base || base === 0) return 0;
    return (diff / base) * 100;
  };

  const data = [
    {
      key: "1",
      label: "1. Amount/ Giờ",
      w2_plan: comparison.amountPerHour,
      current_1099: "-",
      diff: "-",
      total_diff: null,
      type: "input_row",
    },
    {
      key: "2",
      label: "2. Chi phí W2/Thợ",
      w2_plan: formatCurrency(comparison.W2PayrollPerStaff),
      current_1099: formatCurrency(comparison.payrollperStaff1099),
      diff: formatCurrency(diffCost),
      percent: calcPercent(diffCost, comparison.payrollperStaff1099),
      total_diff: diffCost * option2.staff,
      isNegative: diffCost < 0,
    },
    {
      key: "3",
      label: "3. Lợi nhuận CHỦ",
      w2_plan: formatCurrency(comparison.profitW2Oner),
      current_1099: formatCurrency(comparison.targetOwnerProfit1099),
      diff: formatCurrency(diffProfit),
      percent: calcPercent(diffProfit, comparison.targetOwnerProfit1099),
      total_diff: diffProfit * option2.staff,
      isNegative: diffProfit < 0,
    },
  ];

  const columns = [
    {
      title: "TÊN CHỈ SỐ",
      dataIndex: "label",
      key: "label",
      width: 110, // Cố định chiều rộng (px) thay vì %
      fixed: "left", // QUAN TRỌNG: Cố định cột này khi cuộn
      render: (value) => (
        <span className="text-purple-700 font-bold text-[10px] md:text-sm leading-tight block">
          {value}
        </span>
      ),
    },
    {
      title: (
        <div className="leading-tight">
          KẾ HOẠCH <br /> <span className="text-[9px] font-normal">(W2)</span>
        </div>
      ),
      dataIndex: "w2_plan",
      key: "w2_plan",
      width: 100, // Đủ rộng để chứa số tiền lớn
      align: "center",
      className: "bg-purple-50/40", // Màu nền nhẹ phân biệt cột
      render: (value) => (
        <span className="text-purple-700 font-bold text-[11px] md:text-sm whitespace-nowrap">
          {value}
        </span>
      ),
    },
    {
      title: (
        <div className="leading-tight">
          HIỆN TẠI <br /> <span className="text-[9px] font-normal">(1099)</span>
        </div>
      ),
      dataIndex: "current_1099",
      key: "current_1099",
      width: 100,
      align: "center",
      render: (value) => (
        <span className="text-gray-500 font-semibold text-[11px] md:text-sm whitespace-nowrap">
          {value}
        </span>
      ),
    },
    {
      title: (
        <div className="leading-tight">
          CHÊNH LỆCH <br /> <span className="text-[9px] font-normal">(/Thợ)</span>
        </div>
      ),
      dataIndex: "diff",
      key: "diff",
      width: 100,
      align: "center",
      render: (value, record) => {
        if (!value || value === "-") return <span className="text-gray-400 text-[11px]">-</span>;
        return (
          <div className="flex flex-col items-center leading-none">
            <span
              className={`${
                record.isNegative ? "text-red-500" : "text-green-600"
              } font-bold text-[11px] md:text-sm whitespace-nowrap`}
            >
              {value}
            </span>
            {record.percent !== undefined && record.percent !== 0 && (
              <span className="text-[9px] text-gray-400 font-normal mt-0.5">
                ({roundNumber(record.percent)}%)
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div className="leading-tight text-blue-800">
          TỔNG <br /> <span className="text-[9px] font-normal">CHÊNH LỆCH</span>
        </div>
      ),
      dataIndex: "total_diff",
      key: "total_diff",
      width: 110,
      align: "center",
      className: "bg-blue-50/40",
      render: (value, record) => {
        if (value === null || value === undefined) return <span className="text-gray-400 text-[11px]">-</span>;
        return (
          <span
            className={`${
              record.isNegative ? "text-red-600" : "text-green-600"
            } font-black text-[11px] md:text-sm whitespace-nowrap`}
          >
            {formatCurrency(value)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-0 md:p-4 bg-white md:rounded-lg md:shadow-sm md:border border-gray-200">
      {/* CSS Override: Ép padding nhỏ lại để bảng gọn nhất có thể */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ant-table-cell { 
          padding: 8px 4px !important; 
        }
        .ant-table-thead > tr > th {
          font-size: 10px !important;
          padding: 6px 2px !important;
        }
        /* Tinh chỉnh cột cố định có bóng đổ nhẹ để dễ nhìn */
        .ant-table-cell-fix-left {
          box-shadow: 2px 0 5px -2px rgba(0,0,0,0.1) !important;
        }
      `}} />

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
        // QUAN TRỌNG: scroll.x = tổng width các cột (110+100+100+100+110 = 520)
        // Số này lớn hơn màn hình mobile (360-400), sẽ kích hoạt thanh cuộn
        scroll={{ x: 520 }} 
        tableLayout="fixed"
        className="text-[11px]" // Base font size
      />

      <div className="mt-2 text-[10px] text-gray-400 text-right pr-2 italic">
        * Vuốt ngang để xem chi tiết &rarr;
      </div>
    </div>
  );
};

export default ComparisonTable;