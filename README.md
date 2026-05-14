# 유니트 불량처리 가이드 (모바일 웹)

SK오앤에스 현장 직원용 유니트 불량처리 기준 조회 웹앱입니다.

## 1) 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 표시되는 주소(예: `http://localhost:5173`)를 휴대폰에서도 접속 가능한 네트워크 환경에서 사용하면 됩니다.

## 2) 필요한 설치 명령어

```bash
npm install
```

## 3) CSV 파일 위치

CSV는 아래 경로에 둡니다.

- `public/유니트 최종.csv`

현재 프로젝트는 해당 위치에서 `fetch('/유니트 최종.csv')`로 로딩합니다.

## 4) 빌드 방법

```bash
npm run build
npm run preview
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

## 5) 배포 방법

### 추천: Netlify (가장 간단)

1. GitHub에 프로젝트 푸시
2. Netlify에서 `New site from Git`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. 배포 완료 URL 접속

### GitHub Pages

- `gh-pages` 또는 GitHub Actions로 `dist` 배포
- Vite `base` 설정은 이미 상대경로(`./`)로 설정됨

### Vercel

- 프로젝트 import 후 프레임워크 `Vite` 자동 인식
- Build: `npm run build`, Output: `dist`

## 6) 휴대폰 홈화면에 추가

### iPhone (Safari)
1. 배포 URL 접속
2. 하단 공유 버튼
3. `홈 화면에 추가`

### Android (Chrome)
1. 배포 URL 접속
2. 메뉴(⋮)
3. `홈 화면에 추가` 또는 `앱 설치`

## 7) 구현 기능

- CSV 로딩 + 파싱(PapaParse)
- 한글 인코딩 폴백(UTF-8 실패 시 EUC-KR/CP949 대응)
- 필수 컬럼 누락 감지 및 누락 컬럼명 표시
- 통합 검색(유니트/구분/반납지/배송방법/비고/ACTA 절차 포함)
- 공백/기호 차이를 줄인 검색 정규화
- 구분 필터(전체 기본)
- 정렬(원본순/구분순/유니트명순)
- 카드 UI + ACTA 절차 접기/펼치기
- 배지 표시(ACTA/인수인계서/BOX스티커)
- 카드별 처리 기준 복사 + 토스트
- 즐겨찾기(localStorage)
- 최근 검색어 5개(localStorage)
- 데이터 새로고침 버튼
- 맨 위로 이동 버튼
- 빈 결과 안내, CSV 에러 안내

## 8) 참고

실제 CSV 헤더가 일부 다를 수 있어 아래 별칭을 자동 매핑합니다.

- `반납지` ← `불량반납(배송지)`
- `ACTA` ← `ACTA 수리등록`
- `BOX스티커` ← `BOX 스티커`, `BOX 스티커부착`
- `ACTA 절차` ← `ACTA 수리등록 절차`
