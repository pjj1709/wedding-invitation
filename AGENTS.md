# 모바일 청첩장 개발 지침

- React, TypeScript, Vite, ESLint 구성을 유지한다. 화면은 `src/App.tsx`, 스타일은 `src/App.css`와 `src/index.css`에서 관리한다.
- 개발과 검증에는 가명과 가상의 예식 정보 등 샘플 데이터만 사용한다.
- GitHub Pages 배포 경로는 `/wedding-invitation/`이다. JSX에서 `public/`의 파일을 참조할 때 `import.meta.env.BASE_URL`을 사용한다.
- 변경 후 `npm run lint`와 `npm run build`를 실행한다. 배포 설정을 바꾼 경우 `npm run preview`로 하위 경로의 정적 리소스도 확인한다.
- `.github/workflows/deploy.yml`은 `main`에 푸시될 때 `dist/`를 GitHub Pages로 배포한다. Git Push 전에는 사용자 승인을 받는다.
