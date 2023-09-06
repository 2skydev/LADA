# 디렉토리 구조 설명 및 코드 스타일 가이드

일관적인 코드 스타일을 유지하기 위한 가이드입니다.<br/>
코드 스타일은 main, renderer, preload로 나누어져 있습니다.

## 공통사항

나머지 코드 스타일은 `.prettierrc` 파일을 참고 해주세요.

- 모든 상수 변수명은 `UPPER_SNAKE_CASE`로 작성합니다.
- 모든 변수, 함수명은 `camelCase`로 작성합니다.

## Main

electron 코드가 실행되는 main process입니다.

### 디렉토리 구조

- decorators: 공용 데코레이터
- modules: 특정 도메인이 있는 모듈들
- utils: 공용 유틸
- index.ts: entry point

### 모듈 구조 규칙

모듈은 `modules/{module-name}` 디렉토리 안에 있어야하고 파일명은 전부 `kebab-case (param-case)`로 작성합니다.

모듈 디렉토리 안에는 아래와 같은 파일들이 필수적으로 있어야 합니다.

- `{module-name}.module.ts`: 모듈 파일
- `{module-name}.service.ts`: 모듈 관련 기능들이 있는 서비스 파일

모듈 디렉토리 안에는 아래와 같은 디렉토리, 파일명 규칙을 따라야 합니다.

- 단일 파일: `{module-name}/{fileName}.{type}.ts`
- 복수 파일: `{module-name}/{fileName}s/{fileName}.{type}.ts`

> `{type}`에 복수명이 있는 경우 여러개의 export가 있는 경우입니다.<br/>
> ex) `rank.utils.ts` (랭크 관련 유틸 함수들이 여러개 있는 파일)

> 예시
>
> - 단일 파일
>   - `{module-name}.service.ts`
>   - `{module-name}.constants.ts`
> - 복수 파일
>   - `decorators/{file-name}.decorator.ts`
>   - `utils/{file-name}.utils.ts`
>   - `types/{file-name}.types.ts`

## Renderer

사용자가 보는 화면을 웹으로 렌더링하는 renderer process입니다.

### 디렉토리 구조

- public: 정적 파일
- index.html: entry html
- src/index.tsx: entry point
- src/assets: 이미지 같은 정적 파일
- src/components: 공용 컴포넌트 (앱 관련 레이아웃 컴포넌트 등 포함)
- src/hooks: 공용 hook
- src/styles: 공용 스타일
- src/stores: 공용 jotai stores, atoms
- src/features: 특정 도메인에 종속적인 컴포넌트, hook, util, atom 등
- src/pages: 페이지 (파일 시스템 라우팅 기반, `src/components/FileSystemRoutes` 참고)

### component, hook, atom, util, ...

- component, hook은 `export default`로 내보내야 합니다.
- 특정 도메인에 종속적인 코드는 `src/features` 디렉토리에 있어야 하며 아래 규칙에 맞게 작성해야 합니다.
  - component: `src/features/{domain}/{ComponentName}.ts`
  - styled: `src/features/{domain}/{ComponentName}/{StyledName}.styled.ts`
  - hook: `src/features/{domain}/{ComponentName}/hooks/use{HookName}.ts`
  - util: `src/features/{domain}/{ComponentName}/utils/{utilName}.utils.ts`
  - atom: `src/features/{domain}/{ComponentName}/atoms/{atomName}.atom.ts`
  - 위 항목에 없는 경우
    - 단일 파일: `src/features/{domain}/{ComponentName}/{fileName}.{type}.ts`
    - 복수 파일: `src/features/{domain}/{ComponentName}/{fileName}s/{fileName}.{type}.ts`

> `{type}`에 복수명이 있는 경우 여러개의 export가 있는 경우입니다.<br/>
> ex) `rank.utils.ts` (랭크 관련 유틸 함수들이 여러개 있는 파일)

## Preload

renderer process에서 사용할 수 있는 electron api를 제공하는 preload process입니다.

> 안전한 코드 실행을 위해 preload를 이용해 특정 코드만 주입합니다.

> 대부분의 코드는 자동 생성된 파일이며, `main/modules/electron/electron.service.ts/generateIpc{type}ContextPreloadFile()` 함수에서 생성합니다.

### 변수 및 함수명 규칙

전부 `camelCase` 로 작성합니다.
