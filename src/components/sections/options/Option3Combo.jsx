// src/components/sections/Option3Combo.jsx
import React from "react";
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

  // NỘI DUNG TAB 1: COMBO ADD-ON SERVICE (Ghép dịch vụ)
  const AddonTab = () => (
    <Row gutter={24} className="py-4">
      <Col span={12} className="border-r border-gray-100">
        <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase">
          Thiết lập giá Dịch vụ
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-medium">Giá Dịch vụ A:</span>
            <InputNumber
              className="bg-yellow-50 border-yellow-400 font-bold text-gray-800! text-sm w-64!"
              size="large"
              value={inputs.comboPriceA !== null ? inputs.comboPriceA : ""}
              placeholder="Nhập giá dịch vụ A"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(val) => updateInput("comboPriceA", val)}
              min={0}
            />
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-medium">Giá Dịch vụ B:</span>
            <InputNumber
              className="bg-yellow-50 border-yellow-400 font-bold text-gray-800! text-sm w-64!"
              size="large"
              value={inputs.comboPriceB !== null ? inputs.comboPriceB : ""}
              placeholder="Nhập giá dịch vụ B"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(val) => updateInput("comboPriceB", val)}
              min={0}
            />
          </div>
        </div>
      </Col>
      <Col span={12} className="pl-6">
        <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase">
          Kết quả tính toán
        </h4>
        <div className="space-y-3">
          {/* Bảng hiển thị dữ liệu */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 gap-0">
              {/* Doanh thu mục tiêu */}
              {/* <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Doanh thu mục tiêu
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatCurrency(option3Addon?.goalRevenueAddOn)}
                </span>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">Tổng ticket 2025</span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatNumber(option3Addon?.totalTickets)}
                </span>
              </div> */}

              {/* % khách chuyển sang combo */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  % khách cần chuyển sang combo
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {" "}
                  {option3Addon?.PercentcustomerSwitchedToTheComboAddon?.toFixed(
                    0
                  )}
                  %
                </span>
              </div>
              {/* Số khách dùng combo */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Số khách dùng combo
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatNumber(
                    option3Addon.NumberofGuestsUsingTheComboAddonFinal
                  )}
                </span>
              </div>

              {/* Số khách vẫn dùng A-only */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Số khách vẫn dùng A-only
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatNumber(option3Addon.aOnlyCustomers)}
                </span>
              </div>

              {/* số khách combo / tháng / ngày */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Số khách combo/ thợ/ ngày
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatNumber(option3Addon.comboPerStaffPerDay)}
                </span>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Số khách combo/ tháng/ ngày
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatNumber(option3Addon.comboPerMonthPerDay)}
                </span>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Doanh thu trước combo
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatCurrency(option3Addon.revenueBeforeCombo)}
                </span>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Doanh thu sau combo
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatCurrency(option3Addon.revenueAfterCombo)}
                </span>
              </div>

              {/* Check nhanh khả thi */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Check nhanh khả thi
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <Tag
                  color={option3Addon?.feasibility?.color || "default"}
                  className="font-bold"
                >
                  {option3Addon?.feasibility?.label || "Đang tính..."}
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );

  // NỘI DUNG TAB 2: COMBO DISCOUNT (Giảm giá)
  const DiscountTab = () => (
    <Row gutter={24} className="py-4">
      <Col span={12} className="border-r border-gray-100">
        <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase">
          Thiết lập giá Dịch vụ
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-medium">Giá Dịch vụ A:</span>
            <InputNumber
              className="bg-yellow-50 border-yellow-400 font-bold text-gray-800! text-sm w-64!"
              size="large"
              value={inputs.comboPriceA !== null ? inputs.comboPriceA : ""}
              placeholder="Nhập giá dịch vụ A"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(val) => updateInput("comboPriceA", val)}
              min={0}
            />
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-medium">Giá Dịch vụ B:</span>
            <InputNumber
              className="bg-yellow-50 border-yellow-400 font-bold text-gray-800! text-sm w-64!"
              size="large"
              value={inputs.comboPriceB !== null ? inputs.comboPriceB : ""}
              placeholder="Nhập giá dịch vụ B"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(val) => updateInput("comboPriceB", val)}
              min={0}
            />
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="font-medium">% giảm giá combo:</span>
            <InputNumber
              className="bg-yellow-50 border-yellow-400 font-bold text-gray-800! text-sm w-64!"
              size="large"
              value={
                inputs.comboDiscountPercent !== null
                  ? inputs.comboDiscountPercent
                  : ""
              }
              placeholder="Nhập % giảm giá"
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace(/%/g, "")}
              onChange={(val) => updateInput("comboDiscountPercent", val)}
              min={0}
              max={100}
            />
          </div>
        </div>
      </Col>
      <Col span={12} className="pl-6">
        <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase">
          Kết quả tính toán
        </h4>
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 gap-0">
              {/* Giá combo sau giảm */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Giá combo sau giảm
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatCurrency(option3Discount?.discountedPrice)}
                </span>
              </div>

              {/* Doanh thu toàn bộ ticket */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Doanh thu toàn bộ ticket
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatCurrency(option3Discount?.revenueAllTickets)}
                </span>
              </div>

              {/* Doanh thu tăng cần đạt */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Doanh thu tăng cần đạt
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatCurrency(option3Discount?.revenueGapNeeded)}
                </span>
              </div>

              {/* Cần bao nhiêu khách dùng combo */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Cần bao nhiêu khách dùng combo
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {formatNumber(option3Discount?.comboCustomersNeeded)}
                </span>
              </div>

              {/* % số khách dùng combo */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  % số khách dùng combo
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {option3Discount?.percentCustomersUsingCombo?.toFixed(0)}%
                </span>
              </div>

              {/* Số khách dùng combo / thợ / ngày */}
              <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Số khách dùng combo / thợ / ngày
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <span className="font-bold text-gray-800">
                  {roundNumber(option3Discount?.comboPerStaffPerDay)}
                </span>
              </div>

              {/* Doanh thu sau combo */}
              <div className="px-4 py-3 bg-gray-50 border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Doanh thu sau combo
                </span>
              </div>
              <div className="px-4 py-3 bg-white text-right">
                <span className="font-bold text-gray-800">
                  {formatCurrency(option3Discount?.revenueAfterCombo)}
                </span>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200">
                <span className="text-xs text-gray-900!">
                  Check nhanh khả thi
                </span>
              </div>
              <div className="px-4 py-3 bg-white border-b border-gray-200 text-right">
                <Tag
                  color={option3Discount?.feasibility?.color || "default"}
                  className="font-bold"
                >
                  {option3Discount?.feasibility?.label || "Đang tính..."}
                </Tag>
              </div>
          </div>
        </div>
      </Col>
    </Row>
  );

  return (
    <Card className="rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="bg-linear-to-r from-orange-500 to-orange-400 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <GiftOutlined className="text-xl" />
          <h3 className="text-white font-bold text-lg m-0 uppercase">
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
