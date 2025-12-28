import { Table } from "antd";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency, roundNumber } from "../../utils/formatters";

const ComparisonTable = () => {
  const { results } = useFinance();
  const { options } = results;
  const option2 = options.option2;
  const { comparison } = option2;

  const diffCost =
    comparison.payrollperStaff1099 - comparison.W2PayrollPerStaff;
  const diffProfit = comparison.profitW2Oner - comparison.targetOwnerProfit1099;

  const calcPercent = (diff, base) => {
    if (!base || base === 0) return 0;
    return (diff / base) * 100;
  };

  const data = [
    {
      key: "1",
      label: "1. Amount/ Giờ (Input)",
      w2_plan: comparison.amountPerHour,
      current_1099: null,
      diff: null,
      type: "input_row",
    },

    {
      key: "2",
      label: "2. Chi phí W2 / Thợ",
      subLabel: "(Logic hiển thị)",
      w2_plan: `${formatCurrency(comparison.W2PayrollPerStaff)}`,
      current_1099: `${formatCurrency(comparison.payrollperStaff1099)}`,
      diff: `${formatCurrency(diffCost)}`,
      percent: calcPercent(diffCost, comparison.payrollperStaff1099),
      total_diff: diffCost * option2.staff,
      isNegative: true, // Để tô màu đỏ
    },

    {
      key: "3",
      label: "3. Lợi nhuận CHỦ",
      subLabel: "(Sau khi trừ W2)",
      w2_plan: `${formatCurrency(comparison.profitW2Oner)}`,
      current_1099: `${formatCurrency(comparison.targetOwnerProfit1099)}`,
      diff: `${formatCurrency(diffProfit)}`,
      percent: calcPercent(diffProfit, comparison.targetOwnerProfit1099),
      total_diff: diffProfit * option2.staff,
      isNegative: true, // Để tô màu đỏ
    },
  ];

  const columns = [
    {
      title: "TÊN CHỈ SỐ",
      dataIndex: "label",
      key: "label",
      width: "30%",
      render: (value, record) => {
        // Nếu là dòng 1 (Input) -> Hiển thị kiểu ô Input nhưng Read-only
        if (record.type === "input_row") {
          return (
            <div className="flex justify-center items-center gap-2">
              <span className="text-gray-500 font-bold"></span>

              <span className="text-purple-700 font-bold text-lg">{value}</span>

              <span className="text-gray-500 font-bold"></span>
            </div>
          );
        }
        // Các dòng còn lại -> Text màu tím
        return (
          <span className="text-purple-700 font-bold text-lg">{value}</span>
        );
      },
    },

    {
      title: () => (
        <div className="text-purple-700 font-bold">
          KẾ HOẠCH (W2)
          <br />
          <span className="text-xs font-normal">(Màu Tím)</span>
        </div>
      ),

      dataIndex: "w2_plan",
      key: "w2_plan",
      align: "center",
      className: "bg-purple-50", // Nền nhẹ cho cột W2
      render: (value, record) => {
        if (record.type === "input_row") {
          return (
            <div className="flex justify-center items-center gap-2">
              <span className="text-gray-500 font-bold"></span>

              <span className="text-purple-700 font-bold text-lg">{value}</span>

              <span className="text-gray-500 font-bold"></span>
            </div>
          );
        }
        // Các dòng còn lại -> Text màu tím
        return (
          <span className="text-purple-700 font-bold text-lg">{value}</span>
        );
      },
    },

    {
      title: () => (
        <div className="text-gray-600 font-bold">
          HIỆN TẠI (1099)
          <br />
          <span className="text-xs font-normal">(Màu Xám)</span>
        </div>
      ),
      dataIndex: "current_1099",
      key: "current_1099",
      align: "center",
      render: (value) =>
        value ? (
          <span className="text-gray-500 font-semibold text-lg">{value}</span>
        ) : (
          <span>-</span>
        ),
    },

    {
      title: () => (
        <div className="text-gray-800 font-bold">
          CHÊNH LỆCH
          <br />
          <span className="text-xs font-normal">(Nếu chuyển sang W2)</span>
        </div>
      ),
      dataIndex: "diff",
      key: "diff",
      align: "center",
      render: (value, record) => {
        if (!value) return <span>-</span>;
        return (
          <div className="flex flex-col items-center">
            {/* Hiển thị số tiền */}
            <span
              className={`${
                record.isNegative ? "text-red-500" : "text-green-600"
              } font-bold text-lg leading-tight`}
            >
              {value}
            </span>

            {record.percent !== undefined && record.percent !== 0 && (
              <span className="text-xs text-gray-500 font-normal">
                ({roundNumber(record.percent)}%)
              </span>
            )}
          </div>
        );
      },
    },

    {
      title: () => (
        <div className="text-blue-800 font-bold">
          Tổng chênh lệch
          <div className="text-xs font-normal">(Nếu chuyển sang W2)</div>
        </div>
      ),
      dataIndex: "total_diff",
      key: "total_diff",
      align: "center",
      className: "bg-blue-50", // Nền xanh nhạt để làm nổi bật cột tổng
      render: (value, record) => {
        if (value === null || value === undefined) return <span>-</span>;
        return (
          <span
            className={`${
              record.isNegative ? "text-red-600" : "text-green-600"
            } font-extrabold text-lg`}
          >
            {formatCurrency(value)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tiêu đề bảng nếu cần */}
      {/* <h3 className="mb-4 font-bold text-lg text-gray-700">Bảng So Sánh Hiệu Quả</h3> */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="middle"
        rowClassName={() => "align-middle"} // Căn giữa nội dung dòng
      />

      <div className="mt-2 text-xs text-gray-400 text-right">
        * Số liệu tính toán dựa trên số giờ được nhập
      </div>
    </div>
  );
};

export default ComparisonTable;
