
/**
 * MODULE 1: NOW
 * Tính toán các chỉ số cơ bản dựa trên input đầu vào
 */

import { formatCurrency } from "./formatters";

export const calculateCurrentState = (inputs) => {
  const { revenue, staff, days, aveTicket } = inputs;

  // Tính ngược ra tổng số ticket hiện tại
  const totalTickets = aveTicket > 0 ? revenue / aveTicket : 0;

  // Tính ticket trung bình mỗi thợ mỗi ngày
  const ticketsPerStaffPerDay =
    staff * days > 0 ? totalTickets / (staff * days) : 0;

  return {
    totalTickets,
    ticketsPerStaffPerDay,
  };
};

/**
 * MODULE 2: CONTROL
 * Tính toán chi phí, lợi nhuận và đánh giá rủi ro
 */
export const calculateControlMetrics = (data) => {
  const {
    revenue,
    rent,
    payroll,
    supplies,
    utilities,
    marketing,
    inflationRate,
  } = data;

  // tổng chi phí
  const totalExpense = rent + payroll + supplies + utilities + marketing;
  const profit = revenue - totalExpense;

  // fix bug real margin is 4.15% and display 4%
  const profitMarginExact = revenue > 0 ? (profit / revenue) * 100 : 0;
  const profitMargin = Math.round(profitMarginExact);

  const totalYear = profit * 12;
  const totalExpenseYear = totalExpense * 12;

  // Tính lạm phát: Chi phí tăng theo lạm phát năm (4%/năm)
  // Áp dụng cho tháng: (1 + 4%/100) ^ (1/12) ≈ 1.00327 hoặc đơn giản: 1 + 4%/12
  const monthlyInflationFactor = 1 + inflationRate / 100 / 12; // Lạm phát tháng
  const expenseAfterInflation = totalExpense * monthlyInflationFactor;
  const profitAfterInflation = revenue - expenseAfterInflation;
  const profitMarginAfterInflation =
    revenue > 0 ? (profitAfterInflation / revenue) * 100 : 0;

  // Đánh giá rủi ro DỰA TRÊN profitMarginAfterInflation (sau lạm phát)
  let riskAssessment;

  if (profitMarginAfterInflation <= 5) {
    riskAssessment = {
      code: "DANGER",
      label: "High Risk",
      strategyTag: "BUỘC TĂNG INCOME",
      color: "red",
    };
  } else if (profitMarginAfterInflation < 10) {
    riskAssessment = {
      code: "WARNING",
      label: "Warning",
      strategyTag: "CẦN TĂNG INCOME",
      color: "orange",
    };
  } else if (profitMarginAfterInflation <= 20) {
    riskAssessment = {
      code: "HEALTHY",
      label: "Healthy",
      strategyTag: "ỔN NHƯNG KHÔNG BỀN VỮNG",
      color: "blue",
    };
  } else {
    riskAssessment = {
      code: "GROWTH",
      label: "Growth",
      strategyTag: "DUY TRÌ",
      color: "green",
    };
  }

  return {
    totalExpense,
    totalExpenseYear,
    profit,
    totalYear,
    profitMarginExact,
    profitMargin, // Giữ lại để hiển thị (trước lạm phát)
    profitMarginAfterInflation, // Dùng để đánh giá rủi ro và tính Goal
    riskAssessment,
    expenseAfterInflation,
    monthlyInflationFactor
  };
};

/**
 * MODULE 3: GOAL 2026
 * Tính doanh thu mục tiêu để đạt Profit Margin mong muốn (ví dụ 20%)
 */
export const calculateGoal2026 = (data) => {
  const { currentRevenue, currentProfitMargin, inflationRate, strategyTag, goalRevenue } =
    data;

  
    // Nếu có goalRevenue từ input (người dùng tự điều chỉnh), dùng nó
  if (goalRevenue && goalRevenue > 0) {
    const gap = goalRevenue - currentRevenue;
    // tỷ llệ cần phát triển
    const growthPercent = currentRevenue > 0 
      ? ((gap / currentRevenue) * 100).toFixed(1)
      : "0.0";
    
    return {
      targetRevenue: goalRevenue,
      gap,
      strategyTag,
      growthPercent,
    };
  }

  // Công thức Excel: IF(C25="DUY TRÌ", 0, 20% - (C15 - C21))
  let rawPercent = 0;

  if (strategyTag !== "DUY TRÌ") {
    // Dùng giá trị chính xác: 20% - (4.15% - 4%) = 19.85%
    const exactProfitMargin = currentProfitMargin / 100; // 4.15 → 0.0415
    const exactInflationRate = inflationRate / 100; // 4 → 0.04

    rawPercent = 0.2 - (exactProfitMargin - exactInflationRate);
    if (rawPercent < 0) rawPercent = 0;
  }

  const growthPercent =  parseFloat((rawPercent * 100 ).toFixed(4)); // Giữ 4 chữ số thập phân để tính toán chính xác hơn
  // Tính doanh thu mục tiêu: doanh thu + (doanh thu * growthPercent)
  const revenueIncrease = currentRevenue * (growthPercent / 100);
  // Excel làm tròn revenueIncrease trước khi cộng
  const targetRevenue = Math.round(currentRevenue + revenueIncrease);
  const gap = targetRevenue - currentRevenue;

  return {
    targetRevenue,
    gap,
    strategyTag,
    growthPercent: growthPercent.toFixed(3), // 19.85% → 19.9%
  };
};

/**
 * MODULE 4 - OPTION 1: AVT TICKET (Tăng Ticket)
 */
export const calculateOption1 = (data) => {
  const {
    goalRevenue,
    currentAveTicket,
    staff,
    workingDays,
    currentRevenue,
    currentTotalTickets,
    totalHoursPerDay,
    serviceTimeMinutes = 45,
  } = data;

  // Tổng ticket mục tiêu
  const targetTickets =
    currentAveTicket > 0 ? goalRevenue / currentAveTicket : 0;

  // Tổng ticket hiện tại (lấy từ currentTotalTickets hoặc tính từ revenue)
  const currentTickets =
    currentTotalTickets ||
    (currentAveTicket > 0 ? currentRevenue / currentAveTicket : 0);

  // Ticket cần thêm
  const extraTicketsNeeded = targetTickets - currentTickets;

  // Ticket / ngày / thợ (KPI)
  const kpiPerStaff =
    staff * workingDays > 0 ? extraTicketsNeeded / (staff * workingDays) : 0;

  // Ticket cần thêm / ngày (cả tiệm)
  const targetDay = workingDays > 0 ? targetTickets / workingDays : 0;
  const currentDay = workingDays > 0 ? currentTickets / workingDays : 0;
  const gapDay = workingDays > 0 ? extraTicketsNeeded / workingDays : 0;

  // Ticket / ngày / thợ hiện tại
  const currentPerStaffDay =
    staff * workingDays > 0 ? currentTickets / (staff * workingDays) : 0;

  // Ticket / ngày / thợ mục tiêu
  const targetPerStaffDay = currentPerStaffDay + kpiPerStaff;

  //  AVE TICKET/ THỢ
  const avtTickekStaffPerMonth = staff > 0 ? targetTickets / staff : 0;
  const currentAvtTickekStaffPerMonth = staff > 0 ? currentTickets / staff : 0;
  const gapAvtTicketStaffPerMonth =
    avtTickekStaffPerMonth - currentAvtTickekStaffPerMonth;
  // Tính feasibility (độ tải công suất)
  // Tính feasibility (độ tải công suất)
  const minutesPerDay = totalHoursPerDay * 60;
  const capacityPercent =
    minutesPerDay > 0
      ? ((targetPerStaffDay * serviceTimeMinutes) / minutesPerDay) * 100
      : 0;

  // Insight: Làm tròn lên số khách cần thêm
  const gapRounded = Math.ceil(kpiPerStaff);

  // Logic đánh giá: Ưu tiên số khách cần thêm (theo yêu cầu)
  let feasibility;
  // Logic sửa đổi gợi ý: Kiểm tra quá tải trước
  if (capacityPercent > 90) {
    // Nếu đã > 90% thì dù chỉ thêm 1 khách cũng là không thể (trừ khi tăng giờ làm/thêm thợ)
    feasibility = {
      label: "QUÁ TẢI (CẦN THÊM THỢ)",
      color: "red",
      percent: capacityPercent,
    };
  } else if (capacityPercent > 80) {
    // Vùng nguy hiểm
    feasibility = {
      label: "KHÓ KHĂN (GẦN FULL)",
      color: "red",
      percent: capacityPercent,
    };
  }
  // Sau khi chắc chắn thợ còn chỗ, mới xét đến số khách cần kiếm thêm
  else if (gapRounded <= 2) {
    feasibility = {
      label: "RẤT KHẢ THI",
      color: "green",
      percent: capacityPercent,
    };
  } else if (gapRounded <= 4) {
    // Nới lỏng gap một chút
    feasibility = { label: "KHẢ THI", color: "blue", percent: capacityPercent };
  } else {
    feasibility = {
      label: "CẦN NỖ LỰC LỚN",
      color: "orange",
      percent: capacityPercent,
    };
  }

  const insight = {
    gapRounded,
    message:
      gapRounded <= 2
        ? `Tuyệt vời! Bạn chỉ cần thêm ${gapRounded} khách/ngày cho mỗi thợ.`
        : `Thử thách: Cần thêm ${gapRounded} khách/ngày cho mỗi thợ.`,
    desc:
      gapRounded <= 2
        ? "Mức này rất khả thi. Chỉ cần sắp xếp lịch hẹn khéo léo là đạt được ngay."
        : "Mức này khá căng thẳng. Cần xem xét chạy thêm Marketing mạnh.",
    type: gapRounded <= 2 ? "success" : "warning",
  };

  return {
    targetTickets,
    currentTickets,
    extraTicketsNeeded,
    kpiPerStaff,
    currentDay,
    targetDay,
    gapDay,
    currentPerStaffDay,
    targetPerStaffDay,
    feasibility,
    insight,
    avtTickekStaffPerMonth, // AVT Ticket/Staff By month
    currentAvtTickekStaffPerMonth,
    gapAvtTicketStaffPerMonth,
  };
};

/**
 * MODULE 4 - OPTION 2: UPSELL & PAYROLL
 */
export const calculateOption2 = (data) => {
  const {
    goalRevenue,
    currentTotalTickets,
    currentAveTicket = 35,
    currentRevenue,
    staff,
    days,
    hoursPerDay,
    amountPerHour,
    avtTickekStaffPerMonth,
    currentPayroll,
    currentProfitMargin,
  } = data;

  // 1. Giá Upsell cần đạt
  const targetAveTicket =
    currentTotalTickets > 0 ? goalRevenue / currentTotalTickets : 0;
  const priceGap = targetAveTicket - currentAveTicket;

  // 2. Số ticket cần có (giữ nguyên)
  const ticketsNeeded = currentTotalTickets;

  // CURRENT AVE PAYROLL/ Thợ (1099 - hiện tại)
  const CurrentavePayrollPerStaff = staff > 0 ? currentPayroll / staff : 0;
  // AVT PAYROLL (tính theo công thức: AVT Ticket/Thợ * Giá Upsell * % Payroll)
  const payrollPercent =
    currentRevenue > 0 ? currentPayroll / currentRevenue : 0;

  const avePayrollPerStaff =
    avtTickekStaffPerMonth && targetAveTicket && payrollPercent
      ? avtTickekStaffPerMonth * targetAveTicket * payrollPercent
      : CurrentavePayrollPerStaff; // Fallback về giá trị hiện tại

  // Owner profit hiện tại (1099)
  const ExactProfitMargin = currentProfitMargin / 100;
  const currentOwnerProfit = currentRevenue * ExactProfitMargin;
  // Owner profit mục tiêu (Hiện tại là 1099)
  const targetOwnerProfit = goalRevenue * ExactProfitMargin;
  // Gap = tiết kiệm được (1099)
  const ownerProfitGap = targetOwnerProfit - currentOwnerProfit;
  // W2
  const W2PayrollPerStaff = // PAYROLL W2/ THỢ
    days && hoursPerDay ? days * hoursPerDay * amountPerHour : 0;
  const w2Gap = (avePayrollPerStaff - W2PayrollPerStaff) * staff;
  const costDiffPayroll1099andW2 = W2PayrollPerStaff - avePayrollPerStaff;

  const aveRevenuePerStaff = staff > 0 ? goalRevenue / staff : 0;
  const profitW2Oner = aveRevenuePerStaff - W2PayrollPerStaff;

  const diffProfitPayroll1099andW2 = targetOwnerProfit - profitW2Oner;
  const totalDiffPayrollStaff =
    staff > 0 ? costDiffPayroll1099andW2 * staff : 0;

  const priceInsight =
    priceGap < 7
      ? {
          message: "Ít kháng cự giá",
          type: "success",
          desc: "Mức tăng giá dưới $7 thường ít gây phản ứng từ khách hàng.",
        }
      : {
          message: "Cần giải thích giá trị",
          type: "warning",
          desc: "Mức tăng giá từ $7 trở lên cần giải thích rõ lợi ích cho khách.",
        };

  // 5. Bảng so sánh W2 vs 1099
  const comparison = {
    amountPerHour: amountPerHour,
    payrollperStaff1099: avePayrollPerStaff,
    W2PayrollPerStaff: W2PayrollPerStaff,
    costDiffPayroll1099andW2: costDiffPayroll1099andW2,
    targetOwnerProfit1099: targetOwnerProfit,
    profitW2Oner: profitW2Oner,
    diffProfitPayroll1099andW2: diffProfitPayroll1099andW2,
    totalDiffPayrollStaff: totalDiffPayrollStaff,
  };

  return {
    targetAveTicket,
    priceGap,
    currentAveTicket,
    ticketsNeeded,
    CurrentavePayrollPerStaff,
    avePayrollPerStaff,
    currentOwnerProfit,
    targetOwnerProfit,
    ownerProfitGap,
    W2PayrollPerStaff,
    priceInsight,
    w2Gap,
    comparison,
    staff,
  };
};

/**
 * MODULE 4 - OPTION 3: COMBO ADD-ON
 */
export const calculateComboAddon = (data) => {
  const { priceA, priceB, totalTickets, goalRevenue, staff, days } = data;
  console.log(totalTickets);
  const goalRevenueAddOn = goalRevenue;
  // Tính % khách cần chuyển sang combo (nếu priceBTotal = 0 thì trả về 0)
  const revenueGap = goalRevenue - priceA * totalTickets;

  const priceBTotal = priceB * totalTickets;
  const PercentcustomerSwitchedToTheComboAddon =
    priceBTotal !== 0 ? (revenueGap / priceBTotal) * 100 : 0;

  // Số khách dùng combo (dùng conversionPercent từ input hoặc tính toán)
  const NumberofGuestsUsingTheComboAddon =
    priceB !== 0 ? Math.ceil(revenueGap / priceB) : 0;
  const NumberofGuestsUsingTheComboAddonFinal = Math.max(
    0,
    Math.min(NumberofGuestsUsingTheComboAddon, totalTickets)
  );

  // Số khách vẫn dùng A-only
  const aOnlyCustomers = totalTickets - NumberofGuestsUsingTheComboAddonFinal;

  // số khách dùng combo / thợ / ngày
  const comboPerStaffPerDay =
    staff && days && staff > 0 && days > 0
      ? NumberofGuestsUsingTheComboAddonFinal / (staff * days)
      : 0;

  // số khách dùng combo/ tháng/ ngày
  // Số khách combo / tháng / ngày (trung bình mỗi ngày trong tháng)
  const comboPerMonthPerDay =
    days && days > 0 ? NumberofGuestsUsingTheComboAddonFinal / days : 0;

  // doanh thu trước combo
  const revenueBeforeCombo = priceA * totalTickets;
  // doanh thu sau combo
  // = (Số khách dùng combo × (priceA + priceB)) + (Số khách chỉ dùng A × priceA)
  const comboPrice = priceA + priceB;
  const revenueAfterCombo =
    NumberofGuestsUsingTheComboAddonFinal * comboPrice +
    aOnlyCustomers * priceA;

  // Auto check: Khả thi / Không khả thi / Khó triển khai
  const percentNeeded = PercentcustomerSwitchedToTheComboAddon;
  let feasibilityStatus = {
    isFeasible: false,
    label: "Không Khả Thi",
    color: "red",
    message: "Không đạt mục tiêu doanh thu",
  };

  // Kiểm tra nếu cần >40% khách chuyển sang combo → "Khó triển khai"
  if (percentNeeded > 40) {
    feasibilityStatus = {
      isFeasible: false,
      label: "Khó triển khai",
      color: "orange",
      message: `Cần ${percentNeeded.toFixed(
        1
      )}% khách chuyển sang combo - Quá cao`,
    };
  }
  // Kiểm tra nếu đạt mục tiêu doanh thu
  else if (revenueAfterCombo >= goalRevenue) {
    feasibilityStatus = {
      isFeasible: true,
      label: "Khả Thi",
      color: "green",
      message: "Đạt mục tiêu doanh thu",
    };
  }
  // Không khả thi
  else {
    feasibilityStatus = {
      isFeasible: false,
      label: "Không Khả Thi",
      color: "red",
      message: `Thiếu ${formatCurrency(
        goalRevenue - revenueAfterCombo
      )} để đạt mục tiêu`,
    };
  }
  console.log(totalTickets);
  return {
    goalRevenueAddOn: goalRevenueAddOn,
    PercentcustomerSwitchedToTheComboAddon:
      PercentcustomerSwitchedToTheComboAddon,
    NumberofGuestsUsingTheComboAddonFinal:
      NumberofGuestsUsingTheComboAddonFinal,
    aOnlyCustomers: aOnlyCustomers,
    comboPerStaffPerDay: comboPerStaffPerDay,
    comboPerMonthPerDay: comboPerMonthPerDay,
    revenueBeforeCombo: revenueBeforeCombo,
    revenueAfterCombo: revenueAfterCombo,
    feasibility: feasibilityStatus,
    totalTickets: totalTickets,
  };
};

/**
 * MODULE 4 - OPTION 3: COMBO DISCOUNT
 */
export const calculateComboDiscount = (data) => {
  const {
    priceA,
    priceB,
    discountPercent,
    totalTickets,
    goalRevenue,
    staff,
    days,
  } = data;

  // 1. Giá combo sau giảm
  const originalComboPrice = priceA + priceB;
  const discountedPrice = originalComboPrice * (1 - discountPercent / 100);

  // 2. Doanh thu toàn bộ ticket (doanh thu hiện tại nếu tất cả chỉ dùng A)
  const revenueAllTickets = totalTickets * priceA;

  // 3. Doanh thu tăng cần đạt
  const revenueGapNeeded = goalRevenue - revenueAllTickets;

  // 4. Cần bao nhiêu khách dùng combo
  // Logic: goalRevenue = (comboCustomers * discountedPrice) + ((totalTickets - comboCustomers) * priceA)
  // => comboCustomers = (goalRevenue - totalTickets * priceA) / (discountedPrice - priceA)
  const priceDifference = discountedPrice - priceA;
  const comboCustomersNeeded =
    priceDifference !== 0 ? Math.ceil(revenueGapNeeded / priceDifference) : 0;

  // Đảm bảo không vượt quá totalTickets và không âm
  const comboCustomersFinal = Math.max(
    0,
    Math.min(comboCustomersNeeded, totalTickets)
  );

  // 5. % số khách dùng combo
  const percentCustomersUsingCombo =
    totalTickets !== 0 ? (comboCustomersFinal / totalTickets) * 100 : 0;

  // 6. Số khách dùng combo / thợ / ngày
  const comboPerStaffPerDay =
    staff && days && staff > 0 && days > 0
      ? comboCustomersFinal / (staff * days)
      : 0;

  // 7. Doanh thu sau combo
  const aOnlyCustomers = totalTickets - comboCustomersFinal;
  const revenueAfterCombo =
    comboCustomersFinal * discountedPrice + aOnlyCustomers * priceA;

  let feasibilityStatus = {
    isFeasible: false,
    label: "Không Khả Thi",
    color: "red",
    message: "Không đạt mục tiêu doanh thu",
  };

  // Kiểm tra nếu cần >40% khách dùng combo → "Khó triển khai"
  if (percentCustomersUsingCombo > 40) {
    feasibilityStatus = {
      isFeasible: false,
      label: "Khó triển khai",
      color: "orange",
      message: `Cần ${percentCustomersUsingCombo.toFixed(
        1
      )}% khách dùng combo - Quá cao`,
    };
  }
  // Kiểm tra nếu đạt mục tiêu doanh thu
  else if (revenueAfterCombo >= goalRevenue) {
    feasibilityStatus = {
      isFeasible: true,
      label: "Khả Thi",
      color: "green",
      message: "Đạt mục tiêu doanh thu",
    };
  }
  // Không khả thi
  else {
    feasibilityStatus = {
      isFeasible: false,
      label: "Không Khả Thi",
      color: "red",
      message: `Thiếu ${formatCurrency(
        goalRevenue - revenueAfterCombo
      )} để đạt mục tiêu`,
    };
  }
  return {
    goalRevenue: goalRevenue,
    discountedPrice: discountedPrice,
    revenueAllTickets: revenueAllTickets,
    revenueGapNeeded: revenueGapNeeded,
    comboCustomersNeeded: comboCustomersFinal,
    percentCustomersUsingCombo: percentCustomersUsingCombo,
    comboPerStaffPerDay: comboPerStaffPerDay,
    revenueAfterCombo: revenueAfterCombo,
    feasibility: feasibilityStatus,
  };
};
