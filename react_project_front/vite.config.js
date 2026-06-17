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
    // 도커 환경이면 기본 'dist', 로컬 환경이면 스프링 부트 static 폴더로 지정
    outDir: isDocker ? "dist" : "../src/main/resources/static",
    emptyOutDir: true,
  },
});
