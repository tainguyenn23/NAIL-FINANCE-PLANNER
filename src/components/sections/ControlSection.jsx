// src/components/sections/ControlSection.jsx
import React, { useState } from "react";
import { Card, Table, InputNumber, Tag, Row, Col, Button, Tooltip } from "antd";
import { SwapOutlined, DollarOutlined, PercentageOutlined } from "@ant-design/icons";
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

  // Tính toán giá trị hiển thị cho ô Input Payroll
  // inputs.payroll trong Context LUÔN LUÔN lưu số tiền (Value)
  const getPayrollDisplayValue = () => {
    const revenue = inputs.revenue || 0;
    if (isPayrollPercent) {
        // Nếu mode %, quy đổi từ tiền trong store ngược ra % để hiển thị
        // VD: store có 39000, revenue 65000 -> hiển thị 60
        return revenue > 0 ? (inputs.payroll / revenue) * 100 : 0;
    }
    // Nếu mode $, hiển thị số tiền bình thường
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
      // các giá trị value/percent sẽ được xử lý ở columns render
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
      label: "Marketing & Merchant",
      value: inputs.marketing,
      percent: calcPercent(inputs.marketing),
      target: "5-8%",
    },
  ];

  const columns = [
    { title: "Hạng mục", dataIndex: "label", key: "label" },
    {
      title: "Nhập liệu", // Đổi tên cột cho đúng ngữ cảnh
      dataIndex: "value",
      key: "value",
      width: 180,
      render: (text, record) => {
        // --- LOGIC RIÊNG CHO PAYROLL ---
        if (record.key === "payroll") {
          return (
            <div className="flex items-center gap-1">
              <InputNumber
                value={getPayrollDisplayValue()}
                onChange={handlePayrollChange}
                formatter={(value) =>
                  isPayrollPercent
                    ? `${value}` // Nếu là % thì chỉ hiện số (hoặc thêm % tùy ý)
                    : `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                max={isPayrollPercent ? 100 : undefined} 
                min={0}
                className={`w-full text-right font-bold ${isPayrollPercent ? 'text-blue-600' : 'text-green-700'}`}
                size="small"
                addonAfter={
                    <Tooltip title={isPayrollPercent ? "Đổi sang nhập số tiền ($)" : "Đổi sang nhập phần trăm (%)"}>
                        <div 
                            className="cursor-pointer hover:text-blue-500 px-1 flex items-center justify-center"
                            onClick={() => setIsPayrollPercent(!isPayrollPercent)}
                        >
                           {isPayrollPercent ? <PercentageOutlined /> : <DollarOutlined />}
                           <SwapOutlined className="text-xs ml-1 text-gray-400" />
                        </div>
                    </Tooltip>
                }
              />
            </div>
          );
        }

        return (
          <InputNumber
            value={text}
            onChange={(val) => updateInput(record.key, val)}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            className="w-full bg-yellow-50 text-right"
            size="small"
          />
        );
      },
    },
    {
      title: "% Thực tế",
      dataIndex: "percent",
      key: "percent",
      align: "center",
      // Nếu đang nhập Payroll theo %, cột này sẽ hiển thị số tiền quy đổi (để người dùng đối chiếu)
      // Còn các dòng khác vẫn hiện % bình thường
      render: (text, record) => {
        if (record.key === 'payroll' && isPayrollPercent) {
             return <span className="text-gray-500 text-xs">${Number(inputs.payroll).toLocaleString()}</span>
        }
        return <span className="font-bold">{Math.round(text)}%</span>;
      },
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      className: "text-gray-900 text-xs",
      align: "right",
    },
  ];

  return (
    <Card
      title={
        <span className="text-green-700 font-bold">
          2. CHI PHÍ CƠ CẤU (CONTROL)
        </span>
      }
      className="h-full shadow-sm border-t-4 border-green-600"
      size="small"
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={14}>
          <Table
            dataSource={expenseData}
            columns={columns}
            pagination={false}
            size="small"
            summary={() => {
              const totalPercent = calcPercent(control.totalExpense);
              return (
                <>
                  <Table.Summary.Row className="bg-gray-100 font-bold">
                    <Table.Summary.Cell>Total tháng</Table.Summary.Cell>
                    <Table.Summary.Cell className="text-right text-red-600">
                      ${control.totalExpense.toLocaleString()}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell className="text-center text-red-600">
                      {Math.round(totalPercent)}%
                    </Table.Summary.Cell>
                    <Table.Summary.Cell />
                  </Table.Summary.Row>
                  <Table.Summary.Row className="bg-gray-100 font-bold w-full">
                    <Table.Summary.Cell>Total năm</Table.Summary.Cell>
                    <Table.Summary.Cell className="text-right text-red-600">
                      ${control.totalExpenseYear.toLocaleString()}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </Col>

        {/* Cột 2: (Scorecard) -*/}
        <Col xs={24} md={10}>
          <div
            className={`h-full p-6 rounded-xl border flex flex-col justify-center items-center text-center transition-colors duration-300
            ${
              control.riskAssessment.color === "red"
                ? "bg-red-50 border-red-200"
                : control.riskAssessment.color === "orange"
                ? "bg-orange-50 border-orange-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <p className="text-gray-500 uppercase text-xs font-bold tracking-widest mb-2">
              Lợi nhuận trước thuế của tháng/năm
            </p>

            <h2
              className={`text-5xl font-black mb-2
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
              className="text-sm font-bold px-3 py-1 uppercase"
            >
              {control.riskAssessment.label}
            </Tag>

            <div className="mt-6 pt-4 border-t border-gray-200 w-full">
              <div className="flex justify-between text-sm mb-1">
                <span>Amount Month:</span>
                <span className="font-bold">
                  ${control.profit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Amount Year:</span>
                <span className="font-bold">
                  ${control.totalYear.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Lạm phát (4%):</span>
                <span className="text-gray-500">
                  -${(control.totalExpense * 0.04).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ControlSection;