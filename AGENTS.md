# 모바일 청첩장 개발 지침

- React, TypeScript, Vite, ESLint 구성을 유지한다. 화면은 `src/App.tsx`, 스타일은 `src/App.css`와 `src/index.css`에서 관리한다.
- 개발과 검증에는 가명과 가상의 예식 정보 등 샘플 데이터만 사용한다.
- GitHub Pages 배포 경로는 `/wedding-invitation/`이다. JSX에서 `public/`의 파일을 참조할 때 `import.meta.env.BASE_URL`을 사용한다.
- 변경 후 `npm run lint`와 `npm run build`를 실행한다. 배포 설정을 바꾼 경우 `npm run preview`로 하위 경로의 정적 리소스도 확인한다.
- `.github/workflows/deploy.yml`은 `main`에 푸시될 때 `dist/`를 GitHub Pages로 배포한다. Git Push 전에는 사용자 승인을 받는다.

## 보안 원칙

- 공개 저장소와 정적 빌드 결과에는 공개가 승인된 정보만 넣는다. 토큰, Client Secret, Worker 비밀값, 하객 데이터는 소스와 빌드·배포 로그에 남기지 않는다. 서버용 비밀값은 해당 서비스의 비밀 저장소로 관리한다.
- `VITE_` 변수는 공개 정보로 취급한다. 웹 지도 SDK용 Client ID는 허용 도메인과 사용 한도를 설정한 뒤 사용한다.
- 방명록은 Worker에서 입력값, 요청 크기, 호출 빈도, 삭제 권한을 검증한다. 공개 응답에서 비밀번호와 검증값을 제외하고, SQL에는 바인딩된 파라미터를 사용한다. CORS와 출처 검사는 브라우저 요청 제어에 사용하며 직접 API 호출에 대한 인증 수단으로 간주하지 않는다.

## 무료 운영 원칙

- 기본 운영 목표는 월 0원이다. GitHub Pages, Cloudflare Workers·D1과 지도 API는 해당 무료 플랜과 무료 이용량 안에서 운영한다.
- 유료 플랜 전환, 유료 리소스 생성, 초과 사용 허용 등 비용이 발생할 수 있는 변경은 사전에 비용 조건을 설명하고 사용자 승인을 받는다.
- 배포나 운영 설정 변경 시 실제 플랜, 무료 적용 계정, 호출 한도와 같은 계정의 합산 사용량을 확인한다. 한도에 도달하면 사용량을 확인하고 무료 대체 링크나 재시도 안내를 제공한다.
