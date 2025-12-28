# 💅 Nail Finance Planner Demo

Ứng dụng web tính toán tài chính cho tiệm nail, chuyển đổi từ Excel sang web app với tính toán real-time và xuất báo cáo PDF.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng chính](#tính-năng-chính)
- [Cài đặt](#cài-đặt)
- [Cách sử dụng](#cách-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Tech Stack](#tech-stack)
- [Hướng dẫn chi tiết](#hướng-dẫn-chi-tiết)

## 🎯 Giới thiệu

**Nail Finance Planner** là ứng dụng web giúp chủ tiệm nail:
- Quản lý và phân tích tài chính tiệm nail
- Tính toán tự động các chỉ số tài chính quan trọng
- Đánh giá rủi ro và đề xuất chiến lược tăng trưởng
- So sánh các kịch bản tăng trưởng khác nhau
- Xuất báo cáo PDF chuyên nghiệp

## ✨ Tính năng chính

### 1. **Module NOW - Tình trạng hiện tại**
- Nhập liệu doanh thu, số thợ, ngày làm việc, average ticket
- Tính toán tự động: tổng số ticket, giờ làm việc, KPI
- Hiển thị trực quan các chỉ số quan trọng cần điền

### 2. **Module CONTROL - Quản lý chi phí**
- Nhập và theo dõi các loại chi phí:
  - Rent (Tiền thuê)
  - Payroll (Lương thợ)
  - Supplies (Vật tư)
  - Utilities (Tiện ích)
  - Marketing (Marketing)
- Tính toán tự động:
  - Tổng chi phí
  - Lợi nhuận
  - Profit Margin (%)
  - Đánh giá rủi ro (RỦI RO CAO, CẢNH BÁO, KHÁ TỐT, GROWTH)
- So sánh % chi phí với mục tiêu

### 3. **Module GOAL 2026 - Mục tiêu tăng trưởng**
- Tự động tính toán doanh thu mục tiêu dựa trên:
  - Lợi nhuận hiện tại
  - Tỷ lệ lạm phát
  - Đánh giá rủi ro
- Hiển thị:
  - Doanh thu mục tiêu năm 2026
  - % tăng trưởng cần thiết
  - Gap (khoảng cách cần tăng thêm/tháng)
  - Tag chiến lược: **BUỘC TĂNG INCOME**, **CẦN TĂNG INCOME**, **ỔN NHƯNG KHÔNG BỀN VỮNG**, **DUY TRÌ**

### 4. **Module OPTIONS - Kịch bản tăng trưởng**

#### **Option 1: Tăng Ticket (Volume)**
- Tính toán số ticket cần tăng để đạt mục tiêu
- KPI per staff (số khách/thợ/ngày)
- Đánh giá khả thi: RẤT KHẢ THI, KHẢ THI, KHÓ KHĂN, QUÁ TẢI

#### **Option 2: Upsell & W2**
- So sánh Payroll 1099 vs W2
- Tính toán upsell cần thiết
- Lợi nhuận chủ tiệm (hiện tại và mục tiêu)
- Tổng lợi nhuận chủ (12 tháng)
- Bảng so sánh chi tiết W2 vs 1099

#### **Option 3: Combo Add-on / Discount**
- Tính toán doanh thu từ combo add-on
- Tính toán doanh thu từ combo discount
- Conversion rate và feasibility

### 5. **Best Option - Đề xuất tốt nhất**
- Hệ thống tự động đánh giá và chọn kịch bản tốt nhất
- Dựa trên: khả thi, feasibility, và các yếu tố khác

### 6. **Export PDF**
- Xuất báo cáo PDF bao gồm:
  - Snapshot NOW (Tình trạng hiện tại)
  - Goal 2026 (Mục tiêu tăng trưởng)
  - Best Option (Kịch bản đề xuất tốt nhất)
- File PDF được tối ưu và dễ đọc

### 7. **Sticky Footer**
- Hiển thị thông tin tóm tắt quan trọng:
  - Doanh thu mục tiêu
  - % tăng trưởng
  - Gap cần tăng
  - Tag chiến lược

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.x
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository**
git clone <repository-url>
cd Nail_Finance_Demo2. **Cài đặt dependencies**
npm install3. **Chạy ứng dụng**
npm run dev4. **Mở trình duyệt**

npm installcho productionh
npm run build## 📖 Cách sử dụng

### Bước 1: Nhập dữ liệu hiện tại (Module NOW)
1. Nhập **Doanh thu/tháng** (Revenue)
2. Nhập **Tổng số thợ**
3. Nhập **Tổng số ngày làm/tháng**
4. Nhập **Average Ticket** (Giá trung bình mỗi dịch vụ)
5. Nhập **Tổng giờ làm việc/ngày**

Hệ thống sẽ tự động tính:
- Tổng số ticket
- Giờ làm việc tổng
- KPI per staff

### Bước 2: Nhập chi phí (Module CONTROL)
1. Nhập các loại chi phí:
   - **Rent**: Tiền thuê mặt bằng
   - **Payroll**: Tổng lương thợ
   - **Supplies**: Chi phí vật tư
   - **Utilities**: Tiện ích (điện, nước, internet...)
   - **Marketing**: Chi phí marketing

Hệ thống sẽ tự động:
- Tính tổng chi phí
- Tính lợi nhuận
- Tính Profit Margin (%)
- Đánh giá mức độ rủi ro
- So sánh % chi phí với mục tiêu

### Bước 3: Xem mục tiêu tăng trưởng (Module GOAL 2026)
- Hệ thống tự động tính toán doanh thu mục tiêu 2026
- Hiển thị:
  - Doanh thu hiện tại → Doanh thu mục tiêu
  - % tăng trưởng cần thiết
  - Gap (số tiền cần tăng thêm/tháng)
  - Tag chiến lược

### Bước 4: Xem các kịch bản tăng trưởng (Module OPTIONS)
Xem 3 kịch bản khác nhau:

**Option 1: Tăng Ticket**
- Xem số ticket cần tăng
- KPI per staff
- Đánh giá khả thi

**Option 2: Upsell & W2**
- So sánh Payroll 1099 vs W2
- Tính toán upsell
- Lợi nhuận chủ tiệm

**Option 3: Combo**
- Combo Add-on
- Combo Discount
- Conversion rate

### Bước 5: Xuất báo cáo PDF
1. Click nút **"XUẤT BÁO CÁO"** ở header
2. Hệ thống sẽ:
   - Tự động chọn option tốt nhất
   - Tạo PDF với 3 sections: NOW, GOAL 2026, Best Option
   - Tải file PDF về máy

## 📁 Cấu trúc dự án
