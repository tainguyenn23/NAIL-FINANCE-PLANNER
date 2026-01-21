import { useState } from "react";
import { Card, Table, InputNumber, Tag, Row, Col, Tooltip } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";

import {
  SwapOutlined,
  DollarOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { useFinance } from "../../context/FinanceContext";

const ControlSection = () => {
  const { inputs, results, updateInput } = useFinance();
  const { control } = results;

  const [isPayrollPercent, setIsPayrollPercent] = useState(true);

  const calcPercent = (value) => {
    if (!inputs || !inputs.revenue) return 0;
    return ((value / inputs.revenue) * 100).toFixed(1);
  };

  const handlePayrollChange = (val) => {
    const revenue = inputs.revenue || 0;
    if (isPayrollPercent) {
      const calculatedValue = (val / 100) * revenue;
      updateInput("payroll", calculatedValue);
    } else {
      updateInput("payroll", val);
    }
  };

  const getPayrollDisplayValue = () => {
    const revenue = inputs.revenue || 0;
    if (isPayrollPercent) {
      return revenue > 0 ? (inputs.payroll / revenue) * 100 : 0;
    }
    return inputs.payroll;
  };

  const expenseData = [
    {
      key: "rent",
      label: "Rent",
      value: inputs.rent,
      percent: calcPercent(inputs.rent),
      target: "8-10%",
    },
    {
      key: "payroll",
      label: "Payroll",
      value: inputs.payroll,
      percent: calcPercent(inputs.payroll),
      target: "40-60%",
    },
    {
      key: "supplies",
      label: "Supplies",
      value: inputs.supplies,
      percent: calcPercent(inputs.supplies),
      target: "5-8%",
    },
    {
      key: "utilities",
      label: "Utilities",
      value: inputs.utilities,
      percent: calcPercent(inputs.utilities),
      target: "3-6%",
    },
    {
      key: "marketing",
      label: "Marketing",
      value: inputs.marketing,
      percent: calcPercent(inputs.marketing),
      target: "5-8%",
    },
  ];

  const columns = [
    {
      title: "Hạng mục",
      dataIndex: "label",
      key: "label",
      width: "25%",
      fixed: "left", // Cố định trên mobile khi scroll
      render: (text) => (
        <span className="font-bold text-gray-700 text-[12px]">{text}</span>
      ),
    },
    {
      title: "Nhập liệu",
      dataIndex: "value",
      key: "value",
      width: "40%",
      render: (text, record) => {
        if (record.key === "payroll") {
          return (
            <div className="flex flex-col w-full">
              {/* --- DÒNG NOTE NHỎ Ở TRÊN --- */}
              {/* Dùng leading-none và text-[9px] để không chiếm nhiều chiều cao */}
              <span className="text-[9px] text-gray-400 italic mb-1 ml-0.5 leading-none">
                * Nhấn icon để đổi đơn vị
              </span>

              <InputNumber
                value={getPayrollDisplayValue()}
                onChange={handlePayrollChange}
                className="w-full font-bold"
                size="small"
                // Formatter logic cũ
                formatter={(value) =>
                  isPayrollPercent
                    ? `${value}%`
                    : `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|%|(,*)/g, "")}
                // --- PHẦN NÚT BẤM (ADDON) ---
                addonAfter={
                  <Tooltip
                    title={
                      isPayrollPercent
                        ? "Đổi sang nhập tiền ($)"
                        : "Đổi sang nhập %"
                    }
                  >
                    <div
                      className="cursor-pointer flex items-center justify-center h-full px-2 bg-gray-100 hover:bg-gray-200 border-l border-gray-300 transition-colors group"
                      onClick={() => setIsPayrollPercent(!isPayrollPercent)}
                      style={{
                        minWidth: "26px", // Đảm bảo độ rộng tối thiểu để dễ bấm trên mobile
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                      }}
                    >
                      <SwapOutlined className="text-[10px] text-gray-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </Tooltip>
                }
              />
            </div>
          );
        }

        // Các dòng khác (Rent, Supplies...) căn giữa theo chiều dọc để đẹp đội hình
        return (
          <div className="flex flex-col w-full justify-end h-full pt-3">
            {/* Thêm pt-3 để bù lại khoảng trống do dòng note của Payroll tạo ra, giúp các ô input thẳng hàng nhau */}
            <InputNumber
              value={text}
              onChange={(val) => updateInput(record.key, val)}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              className="w-full bg-yellow-50 font-bold"
              size="small"
            />
          </div>
        );
      },
    },
    {
      title: "%",
      dataIndex: "percent",
      key: "percent",
      width: "18%",
      align: "center",
      render: (text, record) => {
        if (record.key === "payroll" && isPayrollPercent) {
          return (
            <span className="text-gray-400 text-[10px]">
              ${Math.round(inputs.payroll).toLocaleString()}
            </span>
          );
        }
        const currentPercent = parseFloat(text);
        let maxTarget = 100
        if (record.target && record.target.includes("-")) {
          const parts = record.target.split("-");
          maxTarget = parseFloat(parts[1].replace("%", ""));
        }
        const isExceeded = currentPercent > maxTarget;
        return (
          <span className={`font-bold ${isExceeded ? "text-red-500" : "text-gray-600"}`}>
            {Math.round(currentPercent)}%
            </span>
        );
      },
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      width: "17%",
      align: "right",
      render: (text) => (
        <span className="text-gray-700 text-[10px]">{text}</span>
      ),
    },
  ];

  return (
    <div className="finance-container">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ant-table-cell { padding: 8px 4px !important; font-size: 13px !important; }
        .ant-card-body { padding: 12px !important; }
        .ant-input-number-group-addon { padding: 0 4px !important; }
      `,
        }}
      />

      <Card
        title={
          <span className="text-green-700 font-bold text-sm md:text-base uppercase">
            2. Chi phí cơ cấu (Control)
          </span>
          
        }
        className="shadow-md border-t-4 border-green-600 rounded-lg"
        
      >
        <Row gutter={[16, 24]}>
          {/* PHẦN BẢNG - Chiếm 24 col trên mobile, 14 col trên desktop */}
          <Col xs={24} lg={14}>
            <Table
              dataSource={expenseData}
              columns={columns}
              pagination={false}
              size="small"
              bordered={false}
              tableLayout="fixed"
              scroll={{ x: "max-content" }} // Đảm bảo cột target không bị mất
              summary={() => {
                const totalPercent = calcPercent(control.totalExpense);
                return (
                  <>
                    <Table.Summary.Row className="bg-gray-50 font-bold">
                      <Table.Summary.Cell index={0} fixed="left">
                        Total tháng
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={1}
                        className="text-right text-red-600"
                      >
                        ${control.totalExpense.toLocaleString()}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={2}
                        className="text-center text-red-600"
                      >
                        {Math.round(totalPercent)}%
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} />
                    </Table.Summary.Row>
                    <Table.Summary.Row className="bg-gray-50 font-bold">
                      <Table.Summary.Cell index={0} fixed="left">
                        Total năm
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={1}
                        className="text-right text-red-600"
                      >
                        ${control.totalExpenseYear.toLocaleString()}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} colSpan={2} />
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
            <div className="mt-2 text-[10px] text-gray-400 text-right italic md:hidden">
              * Vuốt ngang để xem hết nếu bị tràn nội dung tiết &rarr;
            </div>
          </Col>
              
          {/* PHẦN SCORECARD - Chiếm 24 col trên mobile, 10 col trên desktop */}
          <Col xs={24} lg={10}>
            <div
              className={`h-full p-4 md:p-6 rounded-2xl border flex flex-col justify-center items-center text-center transition-all
              ${
                control.riskAssessment.color === "red"
                  ? "bg-red-50 border-red-100"
                  : control.riskAssessment.color === "orange"
                    ? "bg-orange-50 border-orange-100"
                    : "bg-blue-50 border-blue-100"
              }`}
            >
              <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mb-2">
                Lợi nhuận trước thuế
              </p>
              <h2
                className={`text-4xl md:text-5xl font-black mb-1
                ${
                  control.riskAssessment.color === "red"
                    ? "text-red-600"
                    : control.riskAssessment.color === "orange"
                      ? "text-orange-600"
                      : "text-blue-600"
                }`}
              >
                {control.profitMargin}%
              </h2>
              <Tag
                color={control.riskAssessment.color}
                className="text-[10px] font-bold uppercase px-2 py-0 border-none rounded-full"
              >
                {control.riskAssessment.label}
              </Tag>

              <div className="mt-5 pt-4 border-t border-gray-200/50 w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Amount Month:</span>
                  <span className="font-bold text-gray-800">
                    ${control.profit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-sm pt-1 italic">
                  <span className="text-gray-500">Lạm phát (4%)/tháng:</span>
                  {/* // hiện tai là lạm phát tháng */}
                  <span className="text-red-400">
                    -${(control.totalExpense * 0.04).toLocaleString()} 
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Amount Year:</span>
                  <span className="font-bold text-gray-800">
                    ${control.totalYear.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ControlSection;
