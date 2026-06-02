# 5개 파일 핵심 코드 (자기소개서 작성용)

## ① 백엔드: 에디터 이미지 업로드 (BoardController.java)
```java
@PostMapping("/editor/upload")
public String uploadEditorImage(@RequestParam("upfile") MultipartFile upfile) {
    if (upfile == null || upfile.isEmpty()) {
        throw new RuntimeException("업로드할 파일이 없습니다.");
    }

    File saveDir = new File(new File(root), "board/editor");
    if (!saveDir.exists()) {
        saveDir.mkdirs();
    }

    String fileName = FileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);
    return fileName;
}
```
**구현 내용**: 파일 null 체크 → board/editor 폴더 생성 → Firebase 업로드

---

## ② 프론트: 찜 목록 조회/삭제 (CartPage.jsx)
```jsx
useEffect(() => {
  const loadCart = async () => {
    if (!memberId) return;
    try {
      const res = await axios.get(`${BACKSERVER}/api/store/cart`, {
        params: { memberId },
      });
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setErrorMessage("장바구니 정보를 불러오지 못했습니다.");
    }
  };
  loadCart();
}, [memberId]);

const handleRemove = async (cartNo) => {
  try {
    await axios.delete(`${BACKSERVER}/api/store/cart/${cartNo}`, {
      params: { memberId },
    });
    setCartItems((prev) => prev.filter((item) => item.cartNo !== cartNo));
  } catch (error) {
    alert("삭제에 실패했습니다.");
  }
};
```
**구현 내용**: 회원별 찜 목록 조회 + 삭제 시 상태 즉시 업데이트

---

## ③ 유틸: Firebase URL 정규화 (getImageUrl.js)
```javascript
const getFirebaseUrl = (objectPath) => {
  const encodedObjectName = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET}/o/${encodedObjectName}?alt=media`;
};

export const normalizeImageUrl = (thumb, defaultPrefix = "board/editor") => {
  if (!thumb) return null;
  let trimmed = thumb.trim();

  if (trimmed.startsWith("https://")) return trimmed;
  
  const normalized = trimmed.replace(/^\//, "");
  
  if (normalized.startsWith("board/editor/")) {
    return getFirebaseUrl(normalized);
  }
  if (normalized.startsWith("member/thumb/")) {
    return getFirebaseUrl(normalized);
  }
  if (trimmed.startsWith("/")) {
    return `${BACKSERVER}${trimmed}`;
  }
  return `${BACKSERVER}/${defaultPrefix}/${trimmed}`;
};
```
**구현 내용**: 로컬경로/Firebase/HTTPS URL 자동 분류 및 변환

---

## ④ 상품 등록 이미지 압축 (productRegistration.jsx)
```jsx
const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // 이미지 크기 감소로 서버 전송량 최소화
  const compressedFile = await compressImageFile(file, {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.75,
  });
  
  const formData = new FormData();
  formData.append("upfile", compressedFile, compressedFile.name);

  try {
    const response = await axios.post(`${BACKSERVER}/boards/editor/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const fileUrl = normalizeImageUrl(response.data, "board/editor");
    setProductThumb(fileUrl || "");
  } catch (error) {
    alert("상품 이미지 업로드에 실패했습니다.");
    setProductThumb("");
  }
};
```
**구현 내용**: 이미지 압축 → FormData 전송 → 경로 정규화 후 상태 업데이트

---

## ⑤ 이미지 압축 유틸 (compressImage.js)
```javascript
export const compressImageFile = async (file, options = {}) => {
  const maxWidth = options.maxWidth || 1200;
  const maxHeight = options.maxHeight || 1200;
  const quality = options.quality || 0.75;
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        } else if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, file.type, quality);
      };
    };
  });
};
```
**구현 내용**: Canvas API로 이미지 리사이징 및 품질 조정 압축
