![image](https://user-images.githubusercontent.com/43225384/222410194-65a82855-a48c-4abf-9fef-f1f4e3d500d9.png)

# LOL.PS Desktop

LOL.PS에서 데스크탑 앱을 내주지 않아서 직접 만들게 되었습니다.<br />
해당 프로젝트는 개인 토이 프로젝트로 개발 기간은 마구잡이일 경우가 있습니다.<br />

> 해당 데스크탑 앱은 공식 앱이 아니며, LOL.PS에서 제공하는 API를 사용합니다.<br />

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

![image](https://user-images.githubusercontent.com/43225384/222410194-65a82855-a48c-4abf-9fef-f1f4e3d500d9.png)
