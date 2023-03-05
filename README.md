![image](https://user-images.githubusercontent.com/43225384/222954627-046f316f-967c-4059-b5d6-e35362f68631.png)

# LADA - League of Legends Assistant Desktop App

리그 오브 레전드 전적 검색 및 챔피언 티어, 룬, 아이템 자동설정 등 여러 기능이 있는 데스크탑 앱 입니다.<br />
해당 프로젝트는 개인 토이 프로젝트로 개발 기간은 마구잡이일 경우가 있습니다.<br />

<br />

## Todo

- [x] 챔피언 티어 리스트
- [x] 현재 롤 클라이언트 로그인 한 유저 불러오기
- [x] 매칭 자동 수락 기능
- [ ] 챔피언 상세 페이지
- [ ] 챔피언 룬 자동 설정
- [ ] 챔피언 아이템 자동 설정
- [ ] 전적 검색 페이지
- [ ] 인게임 정보 페이지
- [ ] 오버레이 기능 추가

<br />

## 사용한 프레임워크, 라이브러리

- App framework: [`electron`](https://www.electronjs.org/)
- App build tool: [`electron-builder`](https://www.electron.build/)
- App storage: [`electron-store`](https://github.com/sindresorhus/electron-store)
- App auto updater: [`electron-updater`](https://www.electron.build/auto-update)
- Bundle tool: [`vite`](https://vitejs.dev/)
- Frontend framework: `react` + `typescript`
- Code style: `eslint` + `prettier` + [`@trivago/prettier-plugin-sort-imports`](https://github.com/trivago/prettier-plugin-sort-imports)
- File system based router: [`react-router-dom v6`](https://reactrouter.com/docs/en/v6) + custom (src/components/FileSystemRoutes)
- CSS: [`styled-components`](https://styled-components.com/)
- State management library: [`recoil`](https://hookstate.js.org/)
- Date: [`dayjs`](https://day.js.org/)

<br />

## 시작하기

#### dev mode

```bash
yarn dev
```

#### vite & electron build (현재 OS기준)

```bash
yarn build
```

#### vite & electron build (모든 OS기준)

```bash
yarn build:all
```

<br />

## 스크린샷들

![image](https://user-images.githubusercontent.com/43225384/222954627-046f316f-967c-4059-b5d6-e35362f68631.png)
