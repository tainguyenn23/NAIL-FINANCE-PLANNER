TÀI LIỆU MÔ TẢ CẤU TRÚC DỰ ÁN – NAIL FINANCE PLANNER (DEMO)
Phiên bản: 1.0 – Demo
Tech stack: React 18, Vite, Ant Design, TailwindCSS
1. MỤC ĐÍCH DỰ ÁN DEMO
Mục tiêu: Chuyển đổi file Excel tính toán tài chính tiệm nail sang web app, phục vụ:
Nhập liệu trực tiếp trên web thay cho Excel.
Tự động tính toán các chỉ số tài chính và kịch bản tăng trưởng.
Thử nghiệm kiến trúc Context + tính toán để chuẩn bị cho phiên bản production.
Phạm vi demo:
Mới hoàn thiện phần core logic: Context, utils tính toán.
UI mới ở mức cơ bản (chỉ có App.jsx với nội dung “Hello world”, các section component còn trống).
2. TỔNG QUAN KIẾN TRÚC FRONTEND
Kiểu kiến trúc:
React SPA với Vite.
State chia thành 2 lớp:
Lớp input state (giá trị người dùng nhập) trong FinanceContext.
Lớp derived state (kết quả tính toán) từ file src/utils/calculations.js, tính bằng useMemo.
Tách biệt logic:
Logic tính toán (business rules) tách riêng trong utils (không trộn với UI).
Logic format hiển thị số tiền/số liệu tách riêng trong utils/formatters.js.
UI components (forms, sections, bảng) đọc dữ liệu qua FinanceContext.
3. CẤU TRÚC THƯ MỤC CHÍNH
Gốc dự án
package.json: Định nghĩa dependencies (React, Vite, Ant Design, Tailwind, ESLint).
vite.config.js: Cấu hình Vite.
eslint.config.js: Quy tắc lint.
index.html: File HTML gốc để mount React.
Thư mục src/
main.jsx
App.jsx
index.css
assets/
components/
context/
utils/
Chi tiết từng phần bên dưới.
4. LUỒNG CHẠY CHÍNH CỦA ỨNG DỤNG
index.html:
Chứa <div id="root"></div> – nơi React mount app.
src/main.jsx:
Import CSS chung và Ant Design CSS reset.
Tạo root React với createRoot(document.getElementById('root')).
Bọc App trong:
StrictMode (debug).
StyleProvider của Ant Design (xử lý CSS-in-JS).
src/App.jsx:
Hiện tại demo chỉ hiển thị “Hello world” (chưa gắn layout dashboard và chưa bọc bởi FinanceProvider).
Trong bản hoàn chỉnh, file này sẽ:
Bọc layout chính bằng FinanceProvider.
Render Dashboard / các Section (NOW, CONTROL, GOAL, OPTIONS, CHECK).
src/context/FinanceContext.jsx:
Là trái tim của demo – nơi quản lý:
Toàn bộ input người dùng.
Tính toán real-time các output dựa trên utils/calculations.js.
Bên trong:
inputs (state): chứa các biến như revenue, staff, days, aveTicket, rent, payroll, supplies, utilities, marketing, goalRevenue, comboPriceA, comboPriceB, comboConversion,...
results (derived state):
Dùng useMemo để:
Gọi calculateCurrentState(inputs) → trạng thái NOW + CONTROL cơ bản.
Tính khoảng cách mục tiêu (gap = goalRevenue - revenue).
Gọi calculateOption1, calculateOption2, calculateComboAddon.
Trả về một object tổng hợp: { ...currentState, gap, option1, option2, option3 }.
updateInput(key, value): hàm tiện ích để các form component cập nhật input.
Vai trò:
Đóng vai trò single source of truth cho toàn bộ logic tài chính (đặc biệt quan trọng vì ~70% project là tính toán).
Giúp tất cả module (NOW, CONTROL, GOAL, OPTIONS, CHECK) đọc được cùng một bộ dữ liệu và cùng kết quả nhất quán.
5. THƯ MỤC utils/ – LOGIC TÍNH TOÁN & FORMAT
5.1. src/utils/calculations.js
Mục đích: Chứa toàn bộ business logic tách rời khỏi UI, gồm các hàm:
calculateCurrentState(data)
Input: revenue, staff, days, rent, payroll, supplies, utilities, marketing, aveTicket.
Tính:
totalExpense = tổng chi phí (Rent + Payroll + Supplies + Utilities + Marketing).
profit = Doanh thu – Tổng chi phí.
profitMargin = profit / revenue * 100.
riskAssessment (rule-based):
≤ 5% → RỦI RO CAO.
5–10% → CẢNH BÁO.
10–20% → KHÁ TỐT (HEALTHY).
>20% → GROWTH.
totalTickets ≈ revenue / aveTicket.
Phục vụ: Module 1 – NOW và một phần Module 2 – CONTROL.
calculateOption1(goalRevenue, currentAveTicket, staff, workingDays)
Mô phỏng Option 1 – Tăng số lượng khách (Volume).
Tính:
targetTotalTickets = goalRevenue / aveTicket.
currentTotalTickets = 65000 / aveTicket (demo, đang hard-code).
gapTickets = chênh lệch ticket cần tăng.
kpiPerStaff = gapTickets / (staff * workingDays) → số khách/thợ/ngày cần thêm.
calculateOption2(goalRevenue, currentTotalTickets, currentOwnerIncome)
Mô phỏng Option 2 – Upsell & W2 (demo đơn giản).
Tính:
targetAveTicket = goalRevenue / currentTotalTickets.
priceGap = targetAveTicket - currentPrice (currentPrice = 35$ giả định).
estimatedOwnerIncomeW2 = currentOwnerIncome * 1.2 (demo, giả định tăng 20%).
incomeGap = chênh lệch thu nhập chủ.
calculateComboAddon(priceA, priceB, totalTickets, percentConversion)
Mô phỏng Option 3 – Combo add-on.
Tính:
comboCustomers = totalTickets * (percentConversion / 100).
onlyACustomers = khách chỉ dùng dịch vụ A.
revenueCombo = comboCustomers * (priceA + priceB).
revenueOnlyA = onlyACustomers * priceA.
totalNewRevenue = tổng doanh thu mới sau khi áp dụng combo add-on.
> Lưu ý: Đây là phiên bản demo đơn giản hóa, chưa triển khai đầy đủ tất cả logic chi tiết từ tài liệu sản phẩm (CONTROL %, GOAL 2026, W2 vs 1099 full, CHECK & INSIGHT).
5.2. src/utils/formatters.js
Mục đích: Chuẩn hóa hiển thị số liệu.
formatCurrency(value)
Format số thành USD: 10000 → "$10,000".
Dùng Intl.NumberFormat với style: 'currency', currency: 'USD'.
formatNumber(value)
Format số nguyên: 1234.56 → "1,235".
formatDecimal(value)
Format số thập phân nhỏ cho KPI: 1.5 → "1.5" (1–2 decimal).
6. THƯ MỤC components/ – UI LAYOUT & MODULES
components/layout/dashboard.jsx
(Hiện đang trống trong demo.)
Dự kiến: layout chính, chứa các section: NOW, CONTROL, GOAL 2026, OPTIONS, CHECK.
components/sections/NowSection.jsx
(Trống – chưa implement.)
Dự kiến:
Form input các field Module 1 (Doanh thu, Số thợ, Ngày làm, Ave Ticket, Giờ làm, v.v.).
Hiển thị các chỉ số auto-calculated từ results.now.
components/sections/ControlSection.jsx
(Trống – chưa implement.)
Dự kiến:
Input chi phí Rent, Payroll, Supplies, Utilities, Marketing.
Hiển thị % từng chi phí, so sánh với target range.
Hiển thị Profit, Profit Margin, Risk level.
components/sections/GoalSection.jsx
(Trống – chưa implement.)
Dự kiến:
Hiển thị Doanh thu mục tiêu 2026.
Mức tăng thêm / tháng.
Tag chiến lược (BUỘC TĂNG INCOME, DUY TRÌ, v.v.).
components/sections/OptionsSection.jsx
(Trống – chưa implement.)
Dự kiến:
Tab / card cho Option 1, 2, 3.
Đọc dữ liệu từ results.options.
components/forms/inputCell.jsx
(Trống – placeholder.)
Dự kiến: component input chung theo style Excel cell (nhãn + input + tooltip).
components/footer.jsx, components/table.jsx
Hiện là placeholder, dùng cho layout / bảng kết quả trong bản hoàn chỉnh.
7. THƯ MỤC context/ – QUẢN LÝ TRẠNG THÁI TÀI CHÍNH
FinanceContext.jsx (đã mô tả ở mục 4):
Đóng vai trò Finance Store cho toàn bộ app.
Ưu điểm kiến trúc:
Tất cả module dùng chung một nguồn dữ liệu → tránh lệch số liệu.
Dễ mở rộng: chỉ cần thêm field input + hàm tính toán, UI đọc results là có số mới.
Dễ test logic: có thể test riêng các hàm trong utils và state trong context.
8. HẠN CHẾ & HƯỚNG PHÁT TRIỂN TỪ DEMO
Hạn chế hiện tại:
UI chưa được dựng (các section rỗng, App.jsx chưa kết nối FinanceProvider).
Logic tính toán mới là phiên bản rút gọn so với tài liệu sản phẩm.
Chưa có Module 5 (CHECK & INSIGHT) và Module 6 (EXPORT & SHARE).
Hướng phát triển:
Kết nối App.jsx với FinanceProvider và Dashboard.
Hoàn thiện tất cả section UI theo 4 module chính.
Bổ sung đầy đủ business rules cho:
CONTROL % so với target.
GOAL 2026 & tag chiến lược.
W2 vs 1099 comparison chi tiết.
Combo discount & feasibility check.
Insight engine (Module 5).
Thêm chức năng export PDF và share link (Module 6).
Nếu bạn muốn, tôi có thể viết thêm một mục “Giới thiệu nhanh cho nhà đầu tư/coach” hoặc bản tiếng Anh rút gọn của tài liệu này để đính kèm cùng file .docx.
à hiện tại tôi cần ảnh plaintext sơ đồ cấu trúc project này á để tôi thêm vào .md

Dưới đây là sơ đồ cấu trúc project dạng plaintext, bạn chỉ cần copy vào .md:
Nail_Finance_Demo/
├─ package.json
├─ vite.config.js
├─ eslint.config.js
├─ index.html
├─ README.md
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ index.css
│  ├─ assets/
│  │  └─ react.svg
│  ├─ context/
│  │  └─ FinanceContext.jsx
│  ├─ utils/
│  │  ├─ calculations.js
│  │  └─ formatters.js
│  ├─ components/
│  │  ├─ footer.jsx
│  │  ├─ table.jsx
│  │  ├─ comon/
│  │  ├─ forms/
│  │  │  └─ inputCell.jsx
│  │  ├─ layout/
│  │  │  └─ dashboard.jsx
│  │  └─ sections/
│  │     ├─ NowSection.jsx
│  │     ├─ ControlSection.jsx
│  │     ├─ GoalSection.jsx
│  │     └─ OptionsSection.jsx
└─ node_modules/  (auto-generated)