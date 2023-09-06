# LADA - League of Legends Assistant Desktop App

리그 오브 레전드 전적 검색 및 챔피언 티어, 룬, 아이템 자동설정 등 여러 기능이 있는 데스크탑 앱 입니다.<br />
해당 프로젝트는 개인 토이 프로젝트로 개발 기간은 마구잡이일 경우가 있습니다.<br />

<br />

## 스크린샷들

![image](https://github.com/2skydev/LADA/assets/43225384/d3d9a37c-3b26-4d2d-ad58-782c37b95240)
![image](https://github.com/2skydev/LADA/assets/43225384/842dbbc4-3d9b-452e-9b71-e52e66930b4e)
![image](https://github.com/2skydev/LADA/assets/43225384/9a0deb72-934b-4643-9e9a-56a6d6616a01)
![image](https://github.com/2skydev/LADA/assets/43225384/cb186443-6477-4942-933a-5b639cb8cc34)
![image](https://github.com/2skydev/LADA/assets/43225384/7ce5494d-9677-43ed-b686-29bb82a0bbca)
![image](https://github.com/2skydev/LADA/assets/43225384/71a44a18-f6e5-4908-92d6-989fdd9f4d6a)

<br />

## Architecture

> [figma 링크](https://www.figma.com/file/qJrFt4YVAZX5UdbeKLx6xA/LADA?type=whiteboard&t=oozV2tgJvZuRd6S4-1)

![image](https://github.com/2skydev/LADA/assets/43225384/a4de6e74-4788-424c-a3f0-a329c853789a)


## Github workflow

> [figma 링크](https://www.figma.com/file/qJrFt4YVAZX5UdbeKLx6xA/LADA?type=whiteboard&t=oozV2tgJvZuRd6S4-1)

![image](https://github.com/2skydev/LADA/assets/43225384/69dc01b1-0fab-4305-9e69-6821555119fe)

<br />

## Code Style Guide

[코드 스타일 가이드 Markdown](https://github.com/2skydev/LADA/blob/main/CODE_STYLES.md)

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
- State management library: [`jotai`](https://jotai.org/)
- Date: [`dayjs`](https://day.js.org/)

<br />

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
