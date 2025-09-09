# Hướng Dẫn Tùy Chỉnh Portfolio 3D Tương Tác

Chào mừng bạn đến với "bảng điều khiển" (control panel) của portfolio. Dự án này được thiết kế để bạn có thể dễ dàng cập nhật và tùy chỉnh nội dung mà không cần phải can thiệp sâu vào logic phức tạp của mã nguồn.

Hầu hết mọi tùy chỉnh bạn cần sẽ chỉ tập trung ở 2 tệp chính:
1.  `src/app.component.ts`: Để quản lý các "card" thông tin (thêm, sửa, xóa, thay đổi vị trí).
2.  `src/guide.service.ts`: Để thay đổi lời bình của AI "Witness" cho mỗi card.

---

## 1. Quản lý Card Portfolio (`src/app.component.ts`)

Mở tệp `src/app.component.ts` và tìm đến mảng `CARD_DATA`. Đây là nơi chứa toàn bộ dữ liệu cho các card hiển thị trong không gian 3D.

### Cách thêm một card mới

Để thêm một card, hãy sao chép một đối tượng có sẵn trong mảng `CARD_DATA`, dán nó vào vị trí bạn muốn và chỉnh sửa các thuộc tính.

**Mẫu một card cơ bản:**
```typescript
{
  id: 'unique-card-id', // (Bắt buộc) ID định danh, không được trùng lặp
  title: 'Tiêu đề chính của Card', // Chữ lớn nhất
  meta: 'Tiêu đề phụ hoặc mô tả ngắn', // Chữ nhỏ bên dưới tiêu đề chính
  body: `Nội dung chính của card, có thể chứa HTML.`, // Nội dung chi tiết
  opts: { noexpand: true, style: { width: '840px' } }, // Tùy chọn nâng cao (không bắt buộc)
  layout: { 
    scale: 0.25, // Kích thước của card (1 = 100%)
    position: { x: 0, y: 0, z: 0 } // Vị trí trong không gian 3D
  } 
},
```

### Cách điều chỉnh vị trí (Trục X, Y, Z) và Kích thước

Trong thuộc tính `layout` của mỗi card:
*   `scale`: Thay đổi giá trị này để làm card to hơn hoặc nhỏ hơn. Ví dụ: `0.5` là 50% kích thước gốc.
*   `position`:
    *   `x`: Di chuyển card sang trái (số âm) hoặc phải (số dương).
    *   `y`: Di chuyển card lên trên (số dương) hoặc xuống dưới (số âm).
    *   `z`: **Điều chỉnh độ sâu**. Đẩy card ra xa (số âm) hoặc lại gần (số dương). `z: 0` là vị trí mặc định trên vòng tròn.

**Ví dụ:**
```typescript
position: { x: 0, y: 240, z: -666 } 
// Card này sẽ được đẩy lên trên 240 đơn vị và lùi về phía sau 666 đơn vị.
```

### Cách nhúng Video

Để nhúng video từ YouTube hoặc Google Drive, hãy sử dụng thẻ `<iframe>` bên trong thuộc tính `body`.

**Mẫu nhúng video (nên đặt `opts.style` để có kích thước phù hợp):**
```typescript
{
  id: 'my-video-card',
  title: 'Tên dự án Video',
  meta: 'Vai trò: Post-Production Supervisor',
  body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe src="LINK_VIDEO_CUA_BAN" ... ></iframe></div>`,
  opts: { noexpand: true, style: { width: '1280px', padding: '32px 16px' } },
  layout: { scale: 0.25, position: { x: 0, y: 0, z: 0 } }
}
```
*   **Lưu ý:** Đối với link Google Drive, hãy đảm bảo bạn lấy link ở chế độ "preview". Ví dụ: `https://drive.google.com/file/d/FILE_ID/preview`.

---

## 2. Tùy chỉnh Lời bình của AI (`src/guide.service.ts`)

Khi người dùng nhấp vào một card, AI "Witness" sẽ hiện ra và đưa ra lời bình. Bạn có thể thay đổi những lời bình này trong tệp `src/guide.service.ts`.

Mở tệp và tìm đến đối tượng `witnessTexts`.

```typescript
private witnessTexts: Record<string, string> = {
  'personal-info-card': "Lời bình cho card thông tin cá nhân...",
  'harmony-card': "Lời bình cho video Harmony...",
  // ...
};
```

*   **Cách hoạt động:** `key` (phần bên trái, ví dụ: `'personal-info-card'`) chính là `id` của card mà bạn đã định nghĩa trong `CARD_DATA`. `value` (phần văn bản bên phải) là nội dung lời bình sẽ hiển thị.
*   **Để sửa lời bình:** Chỉ cần tìm đến `id` của card tương ứng và thay đổi nội dung văn bản.
*   **Để thêm lời bình cho card mới:** Thêm một cặp `key: value` mới vào đối tượng `witnessTexts`.

---

## 3. Tùy chỉnh Nâng cao

### Thay đổi kích thước Kaomoji

Khi một card được chọn, một Kaomoji sẽ xuất hiện phía trên card "Witness". Bạn có thể điều chỉnh kích thước của nó.

1.  Mở tệp `src/app.component.ts`.
2.  Tìm đến phương thức `spawnKaomojiAt(sourceObject: any)`.
3.  Tìm dòng code sau và thay đổi giá trị số `0.5` để Kaomoji to hơn hoặc nhỏ hơn.

```typescript
// TỰ ĐIỀU CHỈNH Ở ĐÂY ------------------
// Thay đổi giá trị 0.5 để Kaomoji to hoặc nhỏ hơn.
// Ví dụ: 0.3 (nhỏ hơn nữa), 1.0 (kích thước gốc).
obj.scale.set(0.5, 0.5, 0.5);
// -----------------------------------------
```

---

## Các cập nhật trong tương lai

*(Nơi để ghi chú lại những thay đổi hoặc hướng dẫn mới sau này)*
