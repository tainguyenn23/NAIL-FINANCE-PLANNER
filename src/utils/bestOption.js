// src/utils/bestOption.js

/**
 * Xác định option tốt nhất dựa trên feasibility và khả năng đạt mục tiêu
 */
export const getBestOption = (options) => {
  const { option1, option2, option3Addon, option3Discount } = options;

  // Điểm số cho mỗi option
  const scores = [];

  // Option 1: Tăng Ticket
  if (option1 && option1.feasibility) {
    let feasibilityScore = 0;
    const label = option1.feasibility.label;
    
    if (label === "RẤT KHẢ THI") {
      feasibilityScore = 10;
    } else if (label === "KHẢ THI") {
      feasibilityScore = 7;
    } else if (label === "CẦN NỖ LỰC LỚN") {
      feasibilityScore = 4;
    } else if (label === "QUÁ TẢI (CẦN THÊM THỢ)" || label === "KHÓ KHĂN (GẦN FULL)") {
      feasibilityScore = 1; // Điểm thấp vì không khả thi
    }
    
    scores.push({
      option: option1,
      name: "Option 1: Tăng Ticket",
      score: feasibilityScore,
      type: 'option1',
      label: label
    });
  }

  // Option 2: Upsell
  if (option2 && option2.priceInsight) {
    const priceScore = option2.priceInsight.type === "success" ? 8 : 5;
    scores.push({
      option: option2,
      name: "Option 2: Upsell",
      score: priceScore,
      type: 'option2',
      label: option2.priceInsight.type
    });
  }

  // Option 3: Combo Add-on
  if (option3Addon && option3Addon.feasibility) {
    let comboScore = 0;
    if (option3Addon.feasibility.isFeasible) {
      comboScore = 8;
    } else if (option3Addon.feasibility.label === "Khó triển khai") {
      comboScore = 4;
    } else {
      comboScore = 2; // Không khả thi
    }
    
    scores.push({
      option: option3Addon,
      name: "Option 3: Combo Add-on",
      score: comboScore,
      type: 'option3Addon',
      label: option3Addon.feasibility.label
    });
  }

  // Option 3: Combo Discount
  if (option3Discount && option3Discount.feasibility) {
    let discountScore = 0;
    if (option3Discount.feasibility.isFeasible) {
      discountScore = 7;
    } else if (option3Discount.feasibility.label === "Khó triển khai") {
      discountScore = 4;
    } else {
      discountScore = 2; // Không khả thi
    }
    
    scores.push({
      option: option3Discount,
      name: "Option 3: Combo Discount",
      score: discountScore,
      type: 'option3Discount',
      label: option3Discount.feasibility.label
    });
  }

  // Sắp xếp theo điểm số (cao nhất trước)
  scores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Nếu cùng điểm, ưu tiên Option 1 > Option 2 > Option 3
    const priority = { 'option1': 3, 'option2': 2, 'option3Addon': 1, 'option3Discount': 1 };
    return (priority[b.type] || 0) - (priority[a.type] || 0);
  });
  
  console.log('Best option scores:', scores);
  
  return scores.length > 0 ? scores[0] : null;
};