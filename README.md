# Website Quản Lý Lịch Trực Bệnh Viện Đa Khoa

## 📋 Mô tả dự án
Website Quản Lý Lịch Trực Bệnh Viện Đa Khoa là một giải pháp quản lý toàn diện cho lịch trực của bệnh viện. Dự án cung cấp các chức năng tối ưu hóa việc sắp xếp lịch trực, quản lý thông tin bác sĩ, phòng ban, chuyên khoa và nhiều tính năng hữu ích khác nhằm hỗ trợ quy trình làm việc hiệu quả trong môi trường bệnh viện.

## 🚀 Demo
Link GitHub Repository: [WebsiteXepLichBVDK](https://github.com/huutoanzz/WebsiteXepLichBVDK)

## 👥 Thành viên nhóm
Số lượng thành viên: **03**

## 🛠 Công nghệ sử dụng
- **Front-end**: React TypeScript
- **Back-end**: .NET Webcore API
- **Database**: MongoDB

## ✨ Các chức năng chính
- **CRUD**:
  - Quản lý thông tin Bác sĩ, Phòng ban, Chuyên khoa, Ca trực, Lịch trực...
- **Quản lý ngày nghỉ**:
  - Cho phép bác sĩ đăng ký và quản lý ngày nghỉ phép.
- **Xếp lịch tự động**:
  - Hệ thống xếp lịch thông minh, tối ưu hóa thời gian và nguồn lực.
- **Tính ngày công**:
  - Hỗ trợ tính toán công việc của bác sĩ chi tiết.
- **Xuất lịch trực**:
  - Xuất file lịch trực hàng tuần/tháng dễ dàng.

## 📂 Cấu trúc dự án
### **Front-end**
- **Công nghệ**: ReactTS
- **Thư mục chính**:
  - `/src/components`: Chứa các thành phần giao diện (UI).
  - `/src/pages`: Các trang chính của ứng dụng.
  - 
### **Back-end**
- **Công nghệ**: .NET Webcore API
- **Thư mục chính**:
  - `/Controllers`: Chứa các controller để xử lý API.
  - `/Models`: Chứa các model dữ liệu.
  - `/Repositories`: Chứa các logic nghiệp vụ liên quan đến database.
  - `/Interfaces`: Chứa các interface để định nghĩa

## 📈 Hướng dẫn cài đặt và chạy dự án
### Yêu cầu:
1. **Node.js** và **npm** hoặc **yarn**.
2. **.NET Core SDK**.
3. **MongoDB** được cài đặt và cấu hình.

### Cài đặt Front-end:
1. Clone repository.
2. Điều hướng đến thư mục Front-end:
   cd /UngDungXepLichBenhVienDaKhoa
3. Cài đặt dependencies:
  npm install
4. Chạy ứng dụng:
  npm run dev

### Cài đặt Back-end:
1. Clone repository.
2. Điều hướng đến thư mục Backend-end:
   cd / BVDK_API_backend
3. Chạy ứng dụng:
  Nhấn chạy hoặc dùng lệnh
    cd BVĐK_API
    dotnet watch run

