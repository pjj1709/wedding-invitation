# 모바일 청첩장

React, TypeScript, Vite, ESLint로 구성한 모바일 청첩장 프로젝트입니다. 첫 화면에는 샘플 이름, 예식 일시, 장소가 표시됩니다. 샘플 정보는 `src/App.tsx`의 `invitation`에 있습니다. 청첩장 개발과 검증에는 가명과 가상의 예식 정보만 사용합니다.

목표 배포 주소는 [GitHub Pages 모바일 청첩장](https://pjj1709.github.io/wedding-invitation/)입니다.

## 운영 링크 모음

| 어디를 열면 되나요? | 여기서 하는 일 |
| --- | --- |
| [공개 청첩장](https://pjj1709.github.io/wedding-invitation/) | 하객에게 보내는 주소입니다. 수정한 사진, 문구, 지도와 방명록을 확인합니다. |
| [GitHub 저장소](https://github.com/pjj1709/wedding-invitation) | 청첩장의 코드와 수정 기록을 확인합니다. |
| [GitHub Actions 배포 기록](https://github.com/pjj1709/wedding-invitation/actions/workflows/deploy.yml) | 수정 사항이 공개 사이트에 배포됐는지 확인합니다. 초록색 체크는 성공입니다. |
| [GitHub Pages 설정](https://github.com/pjj1709/wedding-invitation/settings/pages) | 청첩장 주소와 배포 방식 설정을 확인합니다. |
| [GitHub Actions 변수 설정](https://github.com/pjj1709/wedding-invitation/settings/variables/actions) | 네이버 지도 Client ID와 방명록 API 주소를 관리합니다. |
| [Cloudflare 대시보드](https://dash.cloudflare.com/) | **Workers & Pages**에서 `wedding-invitation-guestbook` Worker를, **D1**에서 `wedding-guestbook` 데이터베이스를 찾습니다. 방명록 사용량과 저장 상태를 확인하는 곳입니다. |
| [방명록 API 연결 확인](https://wedding-invitation-guestbook.pjj1709-963.workers.dev/messages) | 방명록 서버의 공개 응답을 확인합니다. `[]`는 서버가 응답했고 현재 공개 메시지가 없다는 뜻입니다. 글이 있으면 목록이 표시됩니다. |
| [네이버 클라우드 Maps 콘솔](https://console.ncloud.com/maps/subscription) | **Application → wedding → Dynamic Map**에서 지도 인증 정보, 허용 웹 주소, 이용 한도를 확인합니다. |

공개 청첩장만 확인할 때는 로그인이 필요 없습니다. 설정을 볼 때는 각각 GitHub, Cloudflare, 네이버 클라우드 계정으로 로그인합니다. 장애가 의심되면 공개 청첩장과 방명록 API를 각각 열어보고, 해당 서비스 상태를 확인합니다. [GitHub 서비스 상태](https://www.githubstatus.com/) · [Cloudflare 서비스 상태](https://www.cloudflarestatus.com/services)

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

## 지도와 내비게이션 설정

GitHub 저장소의 **Settings → Secrets and variables → Actions → Variables**에서 `VITE_NAVER_MAP_KEY_ID`에 네이버 클라우드 Maps Web Dynamic Map의 Client ID를, `VITE_KAKAO_JAVASCRIPT_KEY`에 카카오 디벨로퍼스의 JavaScript 키를 등록합니다. 두 서비스의 웹 도메인에 `https://pjj1709.github.io`를 등록하고, 로컬에서 확인할 때는 개발 서버 주소도 등록합니다. 로컬 빌드는 같은 이름의 환경 변수를 사용합니다.

티맵과 네이버지도 버튼은 목적지 좌표가 포함된 모바일 앱 링크를 사용합니다. 카카오 SDK가 초기화되면 카카오내비 버튼이 표시되고, 초기화 전에는 예식장을 도착지로 지정한 카카오맵 길찾기 링크가 표시됩니다. 앱이 실행되지 않는 환경에서는 오시는 길 섹션의 네이버지도 웹 링크를 이용할 수 있습니다.

## 보안과 무료 운영

- **공개 빌드** `VITE_` 변수는 방문자가 브라우저에서 확인할 수 있습니다. 네이버 Maps Client ID와 공개 API 주소만 용도에 맞게 등록하고, `Client Secret`과 토큰은 저장소, 프런트엔드 변수, 배포 로그에 넣지 않습니다. `GUESTBOOK_SECRET`은 Cloudflare Worker 비밀값으로 관리합니다.
- **방명록** 작성자 이름과 메시지는 방문자에게 공개됩니다. 삭제용 비밀번호 검증은 Worker가 담당합니다. 공유 목록이나 배포 확인에는 샘플 메시지를 사용합니다.
- **네이버 지도** 콘솔의 **Maps → Application → 대표 계정 확인**에서 무료 적용 계정을 확인합니다. 청첩장 앱의 **Dynamic Map → 한도 및 알림 설정**에서 `일 5,000건`, `월 50,000건`, **한도 초과 사용 허용안함**을 권장 시작값으로 적용합니다. 무료 이용량은 대표 계정의 관련 사용량을 합산해 판단하므로 다른 애플리케이션 사용량도 확인합니다. [Maps 한도 설정](https://guide.ncloud-docs.com/docs/application-maps-app-vpc) · [무료 이용량 FAQ](https://www.ncloud.com/support/faq/all/2828)
- **Cloudflare** Workers는 Free 플랜을 사용합니다. 운영 시 Workers 요청 수와 D1 행 읽기·쓰기 및 저장량을 확인합니다. 한도로 요청이 제한되면 리소스 사용량을 확인한 뒤 다시 시도합니다. [Workers 및 D1 요금표](https://developers.cloudflare.com/workers/platform/pricing/)
- **비용 승인** 결제수단 등록, 유료 플랜 전환, 유료 리소스 생성, 초과 사용 허용을 진행하기 전에 비용 조건을 확인하고 사용자 승인을 받습니다.

## 공유 방명록 설정

청첩장 화면은 GitHub Pages에서 제공하고, 축하 메시지의 조회·등록·삭제는 Cloudflare Worker와 D1에서 처리합니다. 공개 목록에는 최근 100개의 메시지가 표시됩니다. 이전에 브라우저에 저장된 글은 기존 브라우저에 남아 있으며, 공유 목록으로 옮기려면 직접 다시 등록해야 합니다.

1. Cloudflare 계정으로 `npx.cmd wrangler login`을 실행하고, 프로젝트 루트에서 `npx.cmd wrangler d1 create wedding-guestbook --config guestbook/wrangler.jsonc`로 D1을 생성합니다. 생성된 ID로 `guestbook/wrangler.jsonc`의 `database_id`를 교체합니다.
2. `npx.cmd wrangler d1 migrations apply wedding-guestbook --remote --config guestbook/wrangler.jsonc`로 테이블을 생성합니다.
3. `npx.cmd wrangler deploy --config guestbook/wrangler.jsonc`로 Worker를 배포한 후 `npx.cmd wrangler secret put GUESTBOOK_SECRET --config guestbook/wrangler.jsonc`으로 충분히 긴 무작위 비밀값을 등록합니다. 이 값을 바꾸면 기존 글의 삭제 비밀번호 검증에 영향을 줍니다.
4. GitHub 저장소 **Settings → Secrets and variables → Actions → Variables**에서 `VITE_GUESTBOOK_API_URL`을 만들고 Worker의 `https://…workers.dev` 주소를 입력합니다. 이후 GitHub Actions 배포를 실행합니다.
5. 공개 청첩장에서 테스트 글을 작성하고, 별도 브라우저에서 같은 글을 읽고 삭제할 수 있는지 확인합니다.

Worker는 요청 본문을 8KB로 제한하고, 허용된 청첩장 출처에서만 브라우저의 등록·삭제 요청을 받습니다. IP별 조회 및 쓰기 요청과 메시지별 삭제 시도에 제한을 적용합니다. Cloudflare 요청 제한은 위치별로 집계되는 근사치입니다.

[Cloudflare D1 시작하기](https://developers.cloudflare.com/d1/get-started/) · [D1 마이그레이션](https://developers.cloudflare.com/d1/reference/migrations/)

[GitHub Pages 배포 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Vite 정적 사이트 배포 가이드](https://vite.dev/guide/static-deploy#github-pages)
