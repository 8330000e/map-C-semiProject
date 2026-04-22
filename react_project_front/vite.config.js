import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // 5173이 이미 사용 중이면 실패(다른 포트로 자동 변경 안 함)
    host: true,
  },
  optimizeDeps: {
    include: ["@mui/icons-material"],
  },
});
