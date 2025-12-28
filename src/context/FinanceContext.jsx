// src/context/FinanceContext.jsx
import { createContext, useContext, useState, useMemo } from "react";
import {
  calculateCurrentState,
  calculateControlMetrics,
  calculateGoal2026,
  calculateOption1,
  calculateOption2,
  calculateComboAddon,
  calculateComboDiscount,
} from "../utils/calculations";
import { getDataFromURL } from "../utils/shareLink";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const urlData = getDataFromURL();
  // INPUT DATA - Tất cả các ô màu vàng trong Excel


  const [inputs, setInputs] = useState(() => {
    if (urlData) {
      return urlData; // Load từ URL
    }
    // Default values
    return {
      revenue: 65000,
      staff: 15,
      days: 30,
      aveTicket: 35,
      totalHoursPerDay: 10,
      amountPerHour: 18,
      rent: 10000,
      payroll: 39000,
      supplies: 5000,
      utilities: 5000,
      marketing: 3300,
      goalRevenue: null,
      currentPayrollType: "1099",
      comboPriceA: 35,
      comboPriceB: 30,
      comboDiscountPercent: 20,
      inflationRate: 4,
    };
  });


  // REAL-TIME CALCULATIONS - Tất cả các ô không màu vàng
  const results = useMemo(() => {
    // 1. Tính Module 1: NOW
    const nowMetrics = calculateCurrentState(inputs);

    // 2. Tính Module 2: CONTROL
    const controlMetrics = calculateControlMetrics({
      revenue: inputs.revenue,
      rent: inputs.rent,
      payroll: inputs.payroll,
      supplies: inputs.supplies,
      utilities: inputs.utilities,
      marketing: inputs.marketing,
      inflationRate: inputs.inflationRate,
    });

    // 3. Tính Module 3: GOAL 2026
    const goal2026 = calculateGoal2026({
      currentRevenue: inputs.revenue,
      currentProfitMargin: controlMetrics.profitMarginExact, // C15: % lợi nhuận trước thuế
      inflationRate: inputs.inflationRate, // C21: lạm phát năm (4%)
      strategyTag: controlMetrics.riskAssessment.strategyTag, // C25: từ đánh giá rủi ro
    });

    // 4. Tính Module 4: OPTIONS
    const targetRevenue = inputs.goalRevenue || goal2026.targetRevenue;

    // Option 1: Tăng ticket
    const option1 = calculateOption1({
      goalRevenue: targetRevenue,
      currentAveTicket: inputs.aveTicket,
      staff: inputs.staff,
      workingDays: inputs.days,
      totalHoursPerDay: inputs.totalHoursPerDay,
      currentRevenue: inputs.revenue,
      currentTotalTickets: nowMetrics.totalTickets,
    });

    // Option 2: Upsell
    const option2 = calculateOption2({
      goalRevenue: targetRevenue,
      currentTotalTickets: nowMetrics.totalTickets,
      currentRevenue: inputs.revenue,
      currentAveTicket: inputs.aveTicket, // THÊM MỚI
      currentPayroll: inputs.payroll,
      staff: inputs.staff,
      days: inputs.days,
      hoursPerDay: inputs.totalHoursPerDay,
      amountPerHour: inputs.amountPerHour || 18, // Default 18 nếu chưa có for options 2
      avtTickekStaffPerMonth: option1.avtTickekStaffPerMonth,
      currentProfitMargin: controlMetrics.profitMarginExact, // THÊM MỚI - % lợi nhuận trước thuế
      payrollType: inputs.currentPayrollType,
    });

    // Option 3: Combo Add-on
    const option3Addon = calculateComboAddon({
      priceA: inputs.comboPriceA,
      priceB: inputs.comboPriceB,
      totalTickets: nowMetrics.totalTickets,
      goalRevenue: targetRevenue,
      conversionPercent: inputs.comboConversion,
      staff: inputs.staff, // ← THÊM
      days: inputs.days,
    });

    // Option 3: Combo Discount
    const option3Discount = calculateComboDiscount({
      priceA: inputs.comboPriceA,
      priceB: inputs.comboPriceB,
      discountPercent: inputs.comboDiscountPercent,
      totalTickets: nowMetrics.totalTickets,
      goalRevenue: targetRevenue,
      staff: inputs.staff,        // ← THÊM
      days: inputs.days, 
    });

    return {
      // Module 1: NOW
      now: nowMetrics,

      // Module 2: CONTROL
      control: controlMetrics,

      // Module 3: GOAL 2026
      goal: goal2026,

      // Module 4: OPTIONS
      options: {
        option1,
        option2,
        option3Addon,
        option3Discount,
      },
    };
  }, [inputs]);

  const updateInput = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const updateMultipleInputs = (updates) => {
    setInputs((prev) => ({ ...prev, ...updates }));
  };

  return (
    <FinanceContext.Provider
      value={{
        inputs,
        results,
        updateInput,
        updateMultipleInputs,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return context;
};
