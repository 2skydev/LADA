# LADA - League of Legends Assistant Desktop App

리그 오브 레전드 전적 검색 및 챔피언 티어, 룬, 아이템 자동설정 등 여러 기능이 있는 데스크탑 앱 입니다.<br />
해당 프로젝트는 개인 토이 프로젝트로 개발 기간은 마구잡이일 경우가 있습니다.<br />

<br/>

## i18n support
The default language is set by detecting which language you use, and you can also change it directly on the Settings page.

<br/>

## Features
- 챔피언 티어, 듀오 시너지 같은 기본적인 통계 정보
- 챔피언 선택 시 자동 룬, 스펠 설정
- 챔피언 검색 시 별칭 검색 가능 (트리스타나 = 트타)
- 인 게임 정보
- 매칭 자동 수락
- 다국어 지원 i18n (한국어, English)

<br/>

## Screenshots

![image](https://github.com/2skydev/LADA/assets/43225384/d3d9a37c-3b26-4d2d-ad58-782c37b95240)
![image](https://github.com/2skydev/LADA/assets/43225384/d1fdfd9b-338f-42bb-8aec-44c5997e5495)
![image](https://github.com/2skydev/LADA/assets/43225384/842dbbc4-3d9b-452e-9b71-e52e66930b4e)
![image](https://github.com/2skydev/LADA/assets/43225384/9a0deb72-934b-4643-9e9a-56a6d6616a01)
![image](https://github.com/2skydev/LADA/assets/43225384/cb186443-6477-4942-933a-5b639cb8cc34)
![image](https://github.com/2skydev/LADA/assets/43225384/804708fb-256f-4883-9542-5c8f3a5a97b6)
![image](https://github.com/2skydev/LADA/assets/43225384/71a44a18-f6e5-4908-92d6-989fdd9f4d6a)

## Architecture

> [Figma link](https://www.figma.com/file/qJrFt4YVAZX5UdbeKLx6xA/LADA?type=whiteboard&t=oozV2tgJvZuRd6S4-1)

![image](https://github.com/2skydev/LADA/assets/43225384/a4de6e74-4788-424c-a3f0-a329c853789a)

## Github workflow

> [Figma link](https://www.figma.com/file/qJrFt4YVAZX5UdbeKLx6xA/LADA?type=whiteboard&t=oozV2tgJvZuRd6S4-1)

![image](https://github.com/2skydev/LADA/assets/43225384/69dc01b1-0fab-4305-9e69-6821555119fe)

<br/>

## Code style guide

[Code style guide markdown](https://github.com/2skydev/LADA/blob/main/CODE_STYLES.md)

<br/>

## Start develop

#### dev mode

```bash
yarn dev
```

#### vite & electron build

```bash
yarn build
```

<br/>

## Overview framework & library

- App framework: [`electron`](https://www.electronjs.org/)
- App build tool: [`electron-builder`](https://www.electron.build/)
- App storage: [`electron-store`](https://github.com/sindresorhus/electron-store)
- App auto updater: [`electron-updater`](https://www.electron.build/auto-update)
- Bundle tool: [`vite`](https://vitejs.dev/) + [`electron-vite`](https://electron-vite.org/)
- Main process framework: [`nestjs`](https://nestjs.com/)
- Renderer process framework: [`react`](https://react.dev/) + [`typescript`](https://www.typescriptlang.org/)
- Code style: `eslint` + `prettier` + [`@trivago/prettier-plugin-sort-imports`](https://github.com/trivago/prettier-plugin-sort-imports)
- File system based router: [`react-router-dom v6`](https://reactrouter.com/docs/en/v6) + custom (src/components/FileSystemRoutes)
- CSS: [`styled-components`](https://styled-components.com/)
- State management library: [`jotai`](https://jotai.org/)
- Date: [`dayjs`](https://day.js.org/)
- i18n: [`i18next`](https://www.i18next.com/) + [`react-i18next`](https://react.i18next.com/)

<br/>

## Todo

- [x] 챔피언 티어 리스트
- [x] 현재 롤 클라이언트 로그인 한 유저 불러오기
- [x] 매칭 자동 수락 기능
- [x] 챔피언 상세 페이지
- [x] 챔피언 룬 자동 설정
- [ ] 챔피언 아이템 자동 설정
- [ ] 전적 검색 페이지
- [x] 인게임 정보 페이지
- [ ] 오버레이 기능 추가
