# 모바일 청첩장

React, TypeScript, Vite, ESLint로 구성한 모바일 청첩장 프로젝트입니다. 첫 화면에는 샘플 이름, 예식 일시, 장소가 표시됩니다. 샘플 정보는 `src/App.tsx`의 `invitation`에 있습니다. 청첩장 개발과 검증에는 가명과 가상의 예식 정보만 사용합니다.

목표 배포 주소는 [GitHub Pages 모바일 청첩장](https://pjj1709.github.io/wedding-invitation/)입니다.

## 로컬 개발

워크플로는 Node.js LTS와 npm을 사용합니다. Windows PowerShell에서 아래 명령을 실행합니다.

```powershell
npm.cmd ci
npm.cmd run dev
```

터미널에 표시되는 로컬 URL을 엽니다. Vite의 기본 경로는 `/wedding-invitation/`입니다.

## 검증

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

빌드는 TypeScript를 검사한 뒤 `dist/`를 생성합니다. 미리보기의 기본 주소는 `http://localhost:4173/wedding-invitation/`입니다.

## GitHub Pages 배포

1. 저장소의 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
2. 사용자 승인 후 변경 사항을 `main`에 푸시합니다. **Deploy Wedding Invitation** 워크플로는 `npm ci`, ESLint 검사, 빌드를 실행한 뒤 `dist/`를 배포합니다.
3. 저장소의 **Actions** 탭에서 실행 결과와 배포 URL을 확인합니다. 같은 워크플로에서 **Run workflow**를 눌러 수동으로 실행할 수도 있습니다.

Vite의 `base`는 `vite.config.ts`에서 `/wedding-invitation/`으로 설정합니다. JSX에서 `public/` 파일을 참조할 때는 `import.meta.env.BASE_URL`을 사용합니다.

[GitHub Pages 배포 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Vite 정적 사이트 배포 가이드](https://vite.dev/guide/static-deploy#github-pages)
