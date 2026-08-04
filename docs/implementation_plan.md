# Kế hoạch Triển khai: Agentic Cinema Hackathon

## Mô tả Mục tiêu
Xây dựng một ứng dụng web để tham gia **Agentic Cinema: The Blockbuster Hackathon**, đáp ứng đầy đủ các yêu cầu của ban tổ chức. 
Dựa trên cuộc phỏng vấn, dự án sẽ có cấu trúc như sau:
- **Partner Track:** Clickhouse (Sử dụng Clickhouse MCP server).
- **Đối tượng:** Phục vụ tất cả các nhóm (Biên kịch, Đạo diễn, Hậu trường, Người hâm mộ).
- **Nền tảng:** Web App (Sử dụng Next.js).
- **Kiến trúc AI:** Một Agent trung tâm (Single Routing Agent) được xây dựng bằng **Google Cloud Agent Builder** và mô hình **Gemini**, làm nhiệm vụ phân loại yêu cầu và gọi các công cụ (như truy vấn dữ liệu từ Clickhouse) tương ứng với từng nhóm người dùng.

> [!NOTE]
> Dự án sẽ được khởi tạo tại thư mục `C:\Users\Kei\.gemini\antigravity\scratch\agentic-cinema-clickhouse`.

## Đánh giá từ Người dùng (User Review Required)
> [!IMPORTANT]
> - Vui lòng xác nhận việc sử dụng framework **Next.js** kết hợp với **Vanilla CSS** (nhằm đảm bảo giao diện cao cấp, ấn tượng, theo đúng nguyên tắc thiết kế).
> - Bạn có đồng ý với cấu trúc thư mục khởi tạo dự án không?

## Câu hỏi Mở (Open Questions)
> [!WARNING]
> 1. **Dữ liệu Clickhouse:** Bạn muốn sử dụng Clickhouse Cloud hay chạy một instance cục bộ (Docker) để làm cơ sở dữ liệu mẫu cho Agent?
> 2. **Tài khoản Google Cloud:** Bạn đã thiết lập sẵn Google Cloud Project và kích hoạt Agent Builder API cùng tài khoản thanh toán chưa?

## Các Thay đổi Đề xuất (Proposed Changes)

### 1. Khởi tạo Dự án
- [NEW] Khởi tạo Next.js App tại thư mục `scratch/agentic-cinema-clickhouse`.
- [NEW] Cấu trúc thư mục chuẩn cho Next.js (App Router, components, lib, styles).

### 2. Thiết kế Giao diện (UI/UX)
- [NEW] `app/globals.css`: Triển khai hệ thống CSS cao cấp, hỗ trợ dark mode, hiệu ứng glassmorphism và micro-animations.
- [NEW] `components/ChatInterface.tsx`: Giao diện tương tác với Agent trung tâm dành cho người dùng.
- [NEW] `components/PersonaSelector.tsx`: Thành phần để người dùng chọn vai trò (Biên kịch, Đạo diễn, v.v.), giúp Agent có bối cảnh tốt hơn.

### 3. Tích hợp AI và Backend
- [NEW] `app/api/chat/route.ts`: API Route giao tiếp với Google Cloud Agent Builder.
- [NEW] Cấu hình tích hợp Clickhouse MCP để Agent có khả năng trích xuất dữ liệu (ví dụ: truy vấn ngân sách cho Studio Crews, hoặc số liệu doanh thu/fan theories cho Fans).

## Kế hoạch Kiểm thử (Verification Plan)
### Kiểm thử Tự động (Automated Tests)
- Chạy `npm run lint` và `npm run build` để đảm bảo không có lỗi biên dịch.

### Kiểm thử Thủ công (Manual Verification)
- Khởi chạy môi trường phát triển cục bộ (`npm run dev`).
- Chọn từng persona và đặt câu hỏi để kiểm tra khả năng định tuyến (routing) của Agent trung tâm.
- Kiểm tra kết nối với Clickhouse qua những truy vấn dữ liệu lớn mô phỏng ngành điện ảnh.
