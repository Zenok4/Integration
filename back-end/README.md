
## Cấu trúc thư mục phần Back-End
- app.py: file tạo router cho api
- config.py: file cấu hình server và lưu trữ JWT Secret key
- database.py: file tạo connection đến sql server và mysql
- **models:** thư mục chứa các file quy định kiểu dữ liệu của bảng để sử dụng
- **services:** thư mục chứa các file xử lý logic cho api
- **security:** thư mục chứa file về xử lý bảo mật (như xác thực và phân quyền )
- **endpoints:** thư mục chứa các file tổng hợp các endpoint của api

## Luồng chạy dữ liệu trong toàn bộ thư mục Back-End

1. `app.py` sẽ chạy để tạo live server và kết nối đến database

2. Tùy vào địa chỉ đang truy cập mà `app.py` sẽ đưa đến route đã đăng ký (chưa có thì sẽ bị lỗi ) và từ route đó mà sẽ đưa đến biến đã được import từ thư mục `endpoints`
3. Từ file đã trỏ vào từ định tuyến bên `app.py` mà sẽ tiếp tục trỏ qua route khác vào tùy vào chức năng đang sử dụng với service được import từ thư mục `services`
4. Service đang được sẽ xử lý logic với việc lấy model của bảng dữ liệu thông qua file chứa định nghĩa model trong thư mục `models` và trả về file json cho bên Front-End làm việc

