# 다른 PC에서 이어서 작업하기

이 문서는 Mood Critters SVG 프로토타입을 새 PC에서 설치하고 수정·검수하는 절차를 설명합니다. 프로젝트는 React와 Vite만 사용하며 별도의 백엔드나 환경 변수는 필요하지 않습니다.

## 1. 준비 사항

- Git
- Node.js `20.19.0` 이상 또는 `22.12.0` 이상
- npm `10` 이상 권장
- Chrome, Edge, Firefox 또는 Safari의 최신 버전

Node.js 버전을 확인합니다.

```bash
node --version
npm --version
```

Vite 8의 Node.js 요구 버전보다 낮다면 Node.js LTS를 먼저 설치하거나 nvm, fnm 같은 버전 관리 도구로 전환합니다.

## 2. 최초 설치

```bash
git clone https://github.com/13eta0mega/NE5-Deskpet_SVG_Prototype.git
cd NE5-Deskpet_SVG_Prototype
npm ci
npm run dev
```

터미널에 표시되는 로컬 주소를 브라우저에서 엽니다. 현재 개발 서버는 기본적으로 `http://127.0.0.1:5173/`을 사용합니다.

`npm ci`는 `package-lock.json`에 고정된 의존성을 그대로 설치합니다. 의존성을 의도적으로 변경할 때만 `npm install <package>`를 사용하고 변경된 잠금 파일을 함께 커밋합니다.

## 3. 자주 사용하는 명령

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드 검증
npm run build

# 생성된 빌드 로컬 확인
npm run preview
```

`npm run build` 결과는 `dist/`에 생성됩니다. `dist/`와 `node_modules/`는 재생성 가능한 파일이므로 Git에 올리지 않습니다.

## 4. 프로젝트 구조

```text
.
├─ src/
│  ├─ main.jsx          # 캐릭터·감정 데이터와 SVG 전환 엔진
│  └─ styles.css        # 스튜디오 UI와 호흡·듣기·립싱크 모션
├─ index.html           # Vite 진입 HTML
├─ package.json         # 실행 명령과 의존성
├─ package-lock.json    # 재현 가능한 의존성 버전
├─ README.md            # 프로젝트 요약
├─ REFERENCE_ANALYSIS.md# 참고 프로젝트 상세 분석
└─ DEVELOPMENT_GUIDE.md # 이 문서
```

## 5. 캐릭터 구조

모든 캐릭터는 같은 200×200 SVG 캔버스와 다음 10개 파츠를 사용합니다.

- `legL`, `legR`
- `earL`, `earR`
- `body`
- `eyeL`, `eyeR`
- `mouth`
- `handL`, `handR`

표정이 바뀔 때 DOM 요소를 추가하거나 제거하지 않습니다. 눈·입·손·귀의 좌표와 transform만 보간하기 때문에 이전 감정의 장식이 남지 않습니다. 눈물, 하트, 볼, 눈썹처럼 특정 감정에서만 나타나는 파츠를 추가하면 이 보장이 깨지므로, 꼭 필요하다면 별도의 라이프사이클 규칙과 회귀 테스트를 먼저 설계합니다.

## 6. 캐릭터 추가 또는 수정

`src/main.jsx`의 `SPECIES` 배열에서 작업합니다.

1. `body`, `earL`, `earR`의 SVG path를 200×200 좌표계로 준비합니다.
2. 몸은 하나의 크고 불규칙한 색면으로 유지합니다.
3. `base`에 눈, 입, 손, 발의 기준 좌표를 지정합니다.
4. 귀는 몸보다 먼저 렌더링되어 뒤쪽에 놓인다는 점을 고려합니다.
5. 손과 발은 해부학적 디테일보다 단순한 덩어리 형태를 유지합니다.

Critters 스타일의 핵심은 파츠를 늘리는 것이 아니라 귀의 실루엣과 몸 외곽선, 작은 색 차이로 종을 구분하는 것입니다.

## 7. 감정 추가 또는 수정

`EMOTIONS` 배열의 각 항목은 공통 기본값 `P` 위에 변경값을 덮어씁니다.

주요 값은 다음과 같습니다.

- `rigX`, `rigY`, `rigRot`, `rigSX`, `rigSY`: 몸 전체 자세
- `earLRot`, `earRRot`, `earLY`, `earRY`: 귀 방향
- `eye*DX`, `eye*DY`, `eye*RX`, `eye*RY`, `eye*Rot`: 눈 위치와 형태
- `mouthDX`, `mouthY`, `mouthW`, `mouthCurve`, `mouthTilt`: 단일 입 곡선
- `hand*DX`, `hand*DY`, `hand*Rot`: 양손 제스처
- `leg*DX`, `leg*DY`, `leg*Rot`: 양발 위치

입은 모든 감정에서 동일한 `M C` 명령 구조를 유지해야 합니다. `mouthW`와 `mouthCurve` 중심으로 조절하면 미소와 찡그림 사이의 보간이 안정적입니다.

감정을 추가했다면 UI의 숫자를 직접 수정할 필요는 없지만, 총 감정 수를 설명하는 헤더 문구와 README는 함께 갱신합니다.

## 8. 모션 합성 규칙

SVG transform은 다음 순서의 중첩 레이어로 합성됩니다.

1. `breath-layer`: 항상 유지되는 호흡
2. `activity-layer`: 듣기, 밝은 감정의 bob, 긴장 감정의 micro-shake
3. `morph-rig`: 선택한 감정의 몸 자세
4. 개별 파츠 transform
5. `mouth-motion`: 현재 입 모양을 유지하는 작은 립싱크

듣기 모드는 감정 에너지 애니메이션보다 우선해야 합니다. CSS selector 우선순위를 바꾸거나 같은 요소에 새 animation을 추가할 때 `listening` 상태가 덮어써지지 않는지 확인합니다.

감정 전환은 `requestAnimationFrame`으로 실행됩니다. 새 감정을 누르면 진행 중인 프레임을 취소하고 마지막으로 화면에 그린 수치를 시작점으로 사용합니다. 이 동작을 React state 기반 프레임 렌더링으로 바꾸면 빠른 연속 입력에서 끊김과 불필요한 재렌더가 생길 수 있습니다.

## 9. 작업 전 검수 체크리스트

변경 후 아래 항목을 직접 확인합니다.

- 강아지, 여우, 곰, 토끼, 고양이가 각각 실루엣으로 구분되는가
- 16개 감정 버튼을 빠르게 연속 선택해도 이전 표정이 남지 않는가
- 전환 도중 다른 감정을 선택했을 때 중립으로 튀지 않는가
- 평상시 호흡과 눈 깜빡임이 과하지 않은가
- 듣기 모드에서 몸 기울기와 양쪽 귀 twitch가 모두 작동하는가
- 립싱크가 선택한 감정의 입 모양을 크게 훼손하지 않는가
- 390px 정도의 모바일 너비에서 가로 스크롤이나 잘린 버튼이 없는가
- 키보드 Tab 이동과 focus ring이 보이는가
- 운영체제의 동작 줄이기 설정에서 반복 모션이 억제되는가
- `npm run build`가 경고나 오류 없이 완료되는가

표정 잔상 회귀를 확인할 때 `.critter-svg` 내부 요소 수가 항상 아래와 같은지도 검사합니다.

```text
path: 4
ellipse: 4
rect: 2
```

## 10. Git 작업 흐름

작업 전 원격 변경을 먼저 받습니다.

```bash
git switch main
git pull --ff-only
git switch -c feature/작업이름
```

변경 후 검증하고 커밋합니다.

```bash
npm ci
npm run build
git status
git add src README.md DEVELOPMENT_GUIDE.md package.json package-lock.json
git commit -m "feat: describe the change"
git push -u origin feature/작업이름
```

실제 변경 파일만 `git add`하고, `node_modules/`, `dist/`, 개인 에디터 설정은 커밋하지 않습니다.

## 11. 문제 해결

### 개발 서버 포트가 사용 중인 경우

```bash
npm run dev -- --port 5174
```

### 설치 후 실행 오류가 나는 경우

Node.js 버전을 먼저 확인합니다. 버전이 올바른데 잠금 파일과 설치 결과가 어긋났다면 `node_modules`를 제거한 다음 `npm ci`를 다시 실행합니다.

### 캐릭터가 전환 순간 튀는 경우

- 새 pose 속성이 `P` 기본값에도 정의되어 있는지 확인합니다.
- `applyPose`가 매 프레임 같은 속성을 적용하는지 확인합니다.
- SVG transform을 CSS와 `transform` 속성에서 동시에 같은 요소에 적용하지 않았는지 확인합니다.

### 이전 감정이 남는 경우

감정별 조건부 SVG 요소가 추가됐는지 먼저 확인합니다. 현재 설계에서는 모든 감정이 같은 10개 파츠만 사용해야 합니다.

## 12. 참고와 라이선스

구현 원리와 조형 분석은 `REFERENCE_ANALYSIS.md`에 정리되어 있습니다. 참고 저장소의 예제 아트워크에는 CC BY-NC 4.0 조건이 있으므로 상업 프로젝트에서는 이 저장소의 자체 제작 path를 유지하고 원본 예제 path를 직접 복사하지 않습니다.

