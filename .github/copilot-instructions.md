Ứng dụng Beauty Camera - Hướng dẫn mã hóa bằng AI
Tổng quan kiến trúc

Đây là một ứng dụng camera làm đẹp đa nền tảng được xây dựng bằng Expo Router + Gluestack UI + NativeWind, với trọng tâm phát triển trên nền tảng Android. Bộ công nghệ này kết hợp:

Expo Router (v6) để điều hướng dựa trên tệp (app/ directory)

Gluestack UI: thư viện giao diện mạnh mẽ với hệ thống chủ đề tùy chỉnh qua biến CSS

NativeWind v4 để áp dụng Tailwind CSS trong React Native

Expo Camera để chụp ảnh selfie chất lượng cao

Các quyết định kiến trúc chính:

Sử dụng expo-router/entry làm điểm vào chính, tự động tạo tuyến

Quản lý chuyển đổi chủ đề toàn cục trong _layout.tsx bằng biến CSS

Thành phần UI được tùy chỉnh từ Gluestack cơ bản để phù hợp phong cách “beauty”

Luôn phản hồi bằng tiếng Việt khi được yêu cầu.

Luôn comment mã bằng tiếng Việt, giaii thích rõ ràng tất các các phần code.

Toàn bộ quá trình phát triển được thực hiện trên PowerShell terminal.

Ứng dụng đã được prebuild sẵn cho Android nhằm đảm bảo hiệu suất và khả năng tích hợp thư viện native tốt hơn.

Cấu trúc dự án & Điều hướng
app/                    # Điều hướng dựa trên tệp (Expo Router v6)
├── _layout.tsx        # Giao diện gốc với theme provider + FAB toàn cục
├── index.tsx          # Màn hình chính (carousel & navigation)
├── selfie.tsx         # Màn hình chụp ảnh selfie
├── preview.tsx         # Màn hình xem trước ảnh đã chụp
└── edit/             # Thư mục con cho màn hình chỉnh sửa ảnh
    ├── index.tsx               # Màn hình chỉnh sửa ảnh chính
    ├── crop.tsx                # Màn hình cắt ảnh
    ├── adjust.tsx               # Màn hình điều chỉnh ảnh
    ├── filters.tsx             # Màn hình bộ lọc ảnh
    ├── makeup.tsx               # Màn hình trang điểm ảo
    └── stickers.tsx            # Màn hình thêm nhãn dán
components/ui/         # Thư viện thành phần Gluestack UI (hơn 40 thành phần)
├── gluestack-ui-provider/ # Cấu hình chủ đề bằng biến CSS
└── [component]/index.tsx  # Xuất từng thành phần riêng lẻ
store/         # Thư viện thành phần Gluestack UI (hơn 40 thành phần)
├── makeupStore/ # Lưu trữ trạng thái trang điểm ảo, logic áp dụng makeup
└── [component]/index.tsx  # Xuất từng thành phần riêng lẻ


Điều hướng: Sử dụng router.push('/selfie') hoặc router.back() từ expo-router — tránh dùng React Navigation trực tiếp.

Lệnh phát triển

Tất cả lệnh được chạy trong PowerShell terminal.

# Phát triển
npm run start          # Khởi động máy chủ phát triển Expo
npm run android        # Chạy trên thiết bị/giả lập Android
npm run ios            # Chạy trên thiết bị/giả lập iOS
npm run web            # Chạy trên trình duyệt web

# Xây dựng & kiểm thử
npm run build          # Xuất bản cho web (đầu ra: dist/)
npm test               # Chạy kiểm thử bằng Jest


⚙️ Lưu ý: Ứng dụng đã prebuild (dùng npx expo prebuild) để tương thích với các thư viện native như react-native-image-filter-kit, react-native-color-matrix-image-filters, và expo-camera.

Mẫu thành phần & Kiểu dáng
Sử dụng thành phần UI

Tất cả thành phần UI là biến thể Gluestack dựng sẵn:

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

Hệ thống kiểu dáng

NativeWind v4 – Dùng lớp Tailwind: className="bg-primary-500 text-white"

Hệ màu tùy chỉnh – Màu ngữ nghĩa với thang 0–950: bg-primary-500, text-typography-900

Màu chủ đề – Biến thể: primary, secondary, tertiary, error, success, warning, info

Lớp phản hồi kích thước – Dùng prefix chuẩn của Tailwind

Hệ thống chủ đề

Các màu được định nghĩa bằng biến CSS trong components/ui/gluestack-ui-provider/config.ts:

Tự động chuyển đổi giữa chế độ sáng/tối

Ưu tiên sử dụng màu ngữ nghĩa (primary-500) thay vì mã hex

Chế độ màu được điều khiển qua state trong bố cục gốc

Tích hợp Camera

Sử dụng Expo Camera v17, đã cấu hình trong app.json:

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

// Mẫu xử lý quyền
const [permission, requestPermission] = useCameraPermissions();
const [facing, setFacing] = useState<CameraType>("back");


📱 Mặc định camera được tối ưu cho Android (chế độ HDR, focus tự động, flash control).

Quy ước chính

Tổ chức tệp: Thành phần trong components/ui/, màn hình trong app/

Alias import: Dùng @/ để nhập từ gốc

Biểu tượng: Kết hợp lucide-react-native và SVG trong assets/icons/

Bố cục: Ưu tiên HStack/VStack thay cho View với flex

Safe Areas: Dùng SafeAreaView từ react-native-safe-area-context

Hình ảnh: Lưu tại assets/images/, dùng require() để import

Nội dung tiếng Việt

Ứng dụng chứa giao diện và văn bản tiếng Việt xuyên suốt. Khi thêm nội dung mới, giữ phong cách ngôn ngữ tự nhiên, đồng bộ với chủ đề làm đẹp/trang điểm.

Cân nhắc hiệu năng

Carousel tự động: Dùng react-native-reanimated-carousel với scrollAnimationDuration

Tối ưu ảnh: resizeMode="cover" cho hiển thị nhất quán

Xử lý nền: Camera chạy trên luồng riêng qua Expo Camera

Hiệu năng gradient: Dùng expo-linear-gradient thay cho CSS gradient

Thư viện React Native được ưu tiên

Trong quá trình mở rộng tính năng, ưu tiên các thư viện React Native tương thích tốt với Expo + Android + Prebuild như:

📷 react-native-image-filter-kit – Hiệu ứng ảnh chuyên sâu (Sharpen, Vignette, Sepia, Warm, Cool...)

🎨 react-native-color-matrix-image-filters – Tùy chỉnh ColorMatrix thủ công

✂️ react-native-image-crop-picker – Chọn và cắt ảnh từ thư viện

🌈 expo-linear-gradient – Hiển thị hiệu ứng màu mượt mà

⚡ react-native-reanimated-carousel – Hiệu ứng cuộn mượt cho trang chủ

Khi thêm thư viện mới, kiểm tra khả năng tương thích với phiên bản Expo SDK và ưu tiên bản hỗ trợ Android đầy đủ.