import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 도커 빌드 환경인지 체크 (IS_DOCKER=true)
const isDocker = process.env.IS_DOCKER === "true";

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
  build: {
    outDir: isDocker ? "dist" : "../react_project_back/src/main/resources/static",
    emptyOutDir: true,
  },
});
