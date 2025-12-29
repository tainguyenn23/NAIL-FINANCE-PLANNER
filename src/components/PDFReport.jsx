import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"; 
import { formatCurrency, roundNumber } from "../utils/formatters";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/Roboto-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/Roboto-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/fonts/Roboto-Medium.ttf",
      fontWeight: "medium",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
  },
  header: {
    backgroundColor: "#9333ea",
    padding: 20,
    marginBottom: 20,
    borderRadius: 5,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#ffffff",
    fontSize: 11,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4b5563",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "2px solid #e5e7eb",
  },
  card: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    border: "1px solid #e5e7eb",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "bold", // Font Roboto đã đăng ký bản bold nên sẽ hiển thị đậm được
  },
  value: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
  },
  goalCard: {
    backgroundColor: "#fdf2f8",
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    border: "2px solid #fce7f3",
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  goalLabel: {
    fontSize: 9,
    color: "#6b7280",
    textTransform: "uppercase",
  },
  goalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  tag: {
    backgroundColor: "#9333ea",
    color: "#ffffff",
    padding: "5px 10px",
    borderRadius: 3,
    fontSize: 9,
    fontWeight: "bold",
    marginRight: 5,
  },
  summaryBox: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 5,
    border: "1px solid #9333ea",
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4b5563",
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 10,
    color: "#374151",
    marginBottom: 6,
    paddingLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTop: "1px solid #e5e7eb",
    paddingTop: 10,
  },
});

const PDFReport = ({ inputs, results, bestOption }) => {
  // ... (Phần code logic giữ nguyên không đổi)
  const { now, control, goal } = results;
  const option = bestOption?.option;

   console.log('Option object:', option);
  console.log('extraTicketsNeeded:', option?.extraTicketsNeeded)
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ... Nội dung bên trong giữ nguyên ... */}
        {/* Copy lại toàn bộ nội dung JSX bên trong Page từ file cũ của bạn */}
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💅 NAIL FINANCE PLANNER</Text>
          <Text style={styles.headerSubtitle}>
            Báo cáo tài chính & Kế hoạch tăng trưởng 2026
          </Text>
        </View>

        {/* Section 1: NOW */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. TÌNH TRẠNG HIỆN TẠI (NOW)</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Doanh thu / Tháng:</Text>
              <Text style={styles.value}>{formatCurrency(inputs.revenue)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tổng số thợ:</Text>
              <Text style={styles.value}>{inputs.staff}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Số ngày làm/tháng:</Text>
              <Text style={styles.value}>{inputs.days}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Average Ticket:</Text>
              <Text style={styles.value}>
                {formatCurrency(inputs.aveTicket)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tổng số ticket:</Text>
              <Text style={styles.value}>{roundNumber(now.totalTickets)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>KPI per staff:</Text>
              <Text style={styles.value}>{roundNumber(now.kpiPerStaff)}</Text>
            </View>
          </View>
        </View>

        {/* Section 2: CONTROL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. QUẢN LÝ CHI PHÍ (CONTROL)</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Tổng chi phí:</Text>
              <Text style={styles.value}>
                {formatCurrency(control.totalExpenses)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Lợi nhuận:</Text>
              <Text style={styles.value}>{formatCurrency(control.profit)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Profit Margin:</Text>
              <Text style={styles.value}>{control.profitMargin}%</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Đánh giá rủi ro:</Text>
              <Text style={styles.value}>
                {control.riskAssessment?.label || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: GOAL 2026 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. MỤC TIÊU TĂNG TRƯỞNG 2026</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalRow}>
              <View>
                <Text style={styles.goalLabel}>Hiện tại</Text>
                <Text style={styles.goalValue}>
                  {formatCurrency(inputs.revenue)}
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: "#ec4899" }}>→</Text>
              <View>
                <Text style={styles.goalLabel}>Mục tiêu 2026</Text>
                <Text style={styles.goalValue}>
                  {formatCurrency(inputs.goalRevenue || goal.targetRevenue)}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cần tăng thêm/tháng:</Text>
              <Text style={[styles.value, { color: "#ec4899" }]}>
                +{formatCurrency(goal.gap)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>% Tăng trưởng:</Text>
              <Text style={styles.value}>{goal.growthPercent}%</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View style={styles.tag}>
                <Text>{goal.strategyTag}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 4: BEST OPTION */}
        {bestOption && option && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              4. KỊCH BẢN ĐỀ XUẤT TỐT NHẤT
            </Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Tên kịch bản:</Text>
                <Text style={styles.value}>{bestOption.name}</Text>
              </View>
              {bestOption.label && (
                <View style={styles.row}>
                  <Text style={styles.label}>Đánh giá:</Text>
                  <Text style={styles.value}>{bestOption.label}</Text>
                </View>
              )}
            </View>

            {/* Chi tiết theo từng option */}
            {bestOption.type === "option1" && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>
                  Chi tiết Option 1: Tăng Ticket
                </Text>
                <Text style={styles.summaryItem}>
                  • Số ticket cần tăng: {roundNumber(option.extraTicketsNeeded ?? 0)}{" "}
                  ticket/tháng
                </Text>
                <Text style={styles.summaryItem}>
                  • KPI per staff: {roundNumber(option.kpiPerStaff)}{" "}
                  ticket/thợ/ngày
                </Text>
                <Text style={styles.summaryItem}>
                  • Đánh giá khả thi: {option.feasibility?.label || "N/A"}
                </Text>
              </View>
            )}

            {bestOption.type === "option2" && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>
                  Chi tiết Option 2: Upsell
                </Text>
                <Text style={styles.summaryItem}>
                  • Upsell cần thiết: {formatCurrency(option.targetAveTicket)}
                  /ticket
                </Text>
                <Text style={styles.summaryItem}>
                  • Lợi nhuận chủ/tháng:{" "}
                  {formatCurrency(option.targetOwnerProfit)}
                </Text>
                <Text style={styles.summaryItem}>
                  • Tổng lợi nhuận chủ (12 tháng):{" "}
                  {formatCurrency(option.targetOwnerProfit * 12)}
                </Text>
                {option.priceInsight && (
                  <Text style={styles.summaryItem}>
                    • Đánh giá: {option.priceInsight.message}
                  </Text>
                )}
              </View>
            )}

            {(bestOption.type === "option3Addon" ||
              bestOption.type === "option3Discount") && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>
                  Chi tiết Option 3:{" "}
                  {bestOption.type === "option3Addon"
                    ? "Combo Add-on"
                    : "Combo Discount"}
                </Text>
                <Text style={styles.summaryItem}>
                  • Doanh thu từ combo:{" "}
                  {formatCurrency(option.revenueFromCombo)}
                </Text>
                {bestOption.type === "option3Addon" && (
                  <Text style={styles.summaryItem}>
                    • Conversion rate cần: {option.conversionPercent || 0}%
                  </Text>
                )}
                {bestOption.type === "option3Discount" && (
                  <Text style={styles.summaryItem}>
                    • Discount: {option.discountPercent || 0}%
                  </Text>
                )}
                <Text style={styles.summaryItem}>
                  • Đánh giá: {option.feasibility?.label || "N/A"}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer} fixed>
          Tạo ngày: {new Date().toLocaleDateString("vi-VN")} | NAIL FINANCE
          PLANNER
        </Text>
      </Page>
    </Document>
  );
};

export default PDFReport;
