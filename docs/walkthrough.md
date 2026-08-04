# Walkthrough: Agentic Cinema Hackathon Project

> [!TIP]
> Dự án đã được thiết lập thành công tại thư mục `scratch/agentic-cinema-clickhouse`. 
> 
> Bạn có thể chạy ứng dụng bằng cách mở terminal ở thư mục trên và dùng lệnh `npm run dev`.

## Các Thay đổi Đã Thực hiện

### 1. Cấu trúc Dự án (Next.js)
- Khởi tạo Next.js App Router (không dùng Tailwind).
- Giao diện được xây dựng bằng Vanilla CSS cao cấp với ngôn ngữ thiết kế Glassmorphism, nền Dark Mode và hiệu ứng chuyển động mượt mà (micro-animations). File CSS tại [globals.css](file:///C:/Users/Kei/.gemini/antigravity/scratch/agentic-cinema-clickhouse/src/app/globals.css).

### 2. Các Thành phần Giao diện (Components)
- [PersonaSelector.tsx](file:///C:/Users/Kei/.gemini/antigravity/scratch/agentic-cinema-clickhouse/src/components/PersonaSelector.tsx): Cho phép người dùng chọn vai trò của mình (Biên kịch, Đạo diễn, Hậu trường, Fan) để AI Agent có thể điều chỉnh ngữ cảnh và logic định tuyến (routing logic).
- [ChatInterface.tsx](file:///C:/Users/Kei/.gemini/antigravity/scratch/agentic-cinema-clickhouse/src/components/ChatInterface.tsx): Cửa sổ chat tương tác tích hợp hiệu ứng loading và tự động cuộn (auto-scroll) mượt mà.

### 3. Tích hợp AI (API Route)
- [route.ts](file:///C:/Users/Kei/.gemini/antigravity/scratch/agentic-cinema-clickhouse/src/app/api/chat/route.ts): Endpoint nhận tin nhắn và định tuyến logic tùy vào *Persona*. Mô phỏng việc tích hợp Agent Builder, mô hình Gemini và truy vấn từ máy chủ Clickhouse (giả lập kết quả trả về của MCP Server).

## Kết quả Kiểm tra
- **Thiết kế & Bố cục:** Giao diện Responsive chia 2 cột (Desktop) và xếp chồng (Mobile) hiển thị đúng như mong đợi. Theme màu neon trên nền tối hoạt động hoàn hảo.
- **Tính năng AI Routing:** Khi chuyển đổi giữa các vai trò khác nhau, Agent trả về thông tin giả lập từ mô hình Gemini và nguồn dữ liệu nội bộ đặc thù cho vai trò đó (giả lập backend từ Clickhouse).

## Các bước tiếp theo
- Kết nối ứng dụng trực tiếp tới Google Cloud Agent Builder thật.
- Thay thế đoạn giả lập trong `route.ts` bằng các cuộc gọi API MCP thực thụ (thông qua SDK của Clickhouse).
- Bổ sung tài liệu vào repository theo đúng tiêu chuẩn mã nguồn mở của Hackathon.
