# 공주네

혁주와 가영이 같이 쓰는 커플 앱이에요. 캘린더, 버킷리스트, D-day, 더보기(랜덤 메뉴, 한 숟갈 타이머)가 들어 있어요.

- 서버비 0원: GitHub Pages(화면) + Supabase 무료 플랜(데이터)
- 아이폰 Safari에서 "홈 화면에 추가"하면 앱처럼 쓸 수 있어요 (PWA)
- GitHub에 올리면 다음에 앱을 열 때 바로 새 버전이 보여요

## 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 화면 구조와 디자인 |
| `app.js` | 기능 전부 (캘린더, 버킷리스트, D-day, 더보기, 로그인, 데이터 저장) |
| `config.js` | Supabase 연결 정보. 비워 두면 예시 데이터로 도는 미리보기 모드 |
| `supabase/schema.sql` | 데이터베이스 테이블과 보안 규칙 |
| `manifest.webmanifest`, `sw.js`, `icons/` | 홈 화면 앱(PWA) 설정 |

## 처음 한 번만 하는 설정

### 1. Supabase 프로젝트 만들기 (데이터 저장소)

1. https://supabase.com 에서 GitHub 계정으로 가입하고 **New project**를 만들어요.
   - 이름: `gongju` 같은 아무 이름
   - Region: **Northeast Asia (Seoul)**
   - 플랜: Free
2. 왼쪽 메뉴 **SQL Editor** → New query → `supabase/schema.sql` 내용을 전부 붙여 넣고 **Run**.

### 2. 두 사람 계정 만들기

1. **Authentication → Users → Add user → Create new user**
2. 아래 두 계정을 만들어요. **Auto Confirm User**는 꼭 체크해요.

| 사람 | 이메일 | 비밀번호 |
|---|---|---|
| 혁주 | `hyeokju@example.com` | `gongju-0402` |
| 가영 | `gayoung@example.com` | `gongju-0402` |

이메일은 실제로 메일을 받지 않으니 그대로 써도 돼요. 바꾸고 싶으면 `config.js`의 `emails`도 똑같이 바꿔요.
비밀번호는 `config.js`의 `passwordPrefix`(`gongju-`) 뒤에 로그인 화면에서 치는 숫자(`0402`)를 붙인 거예요. Supabase 비밀번호가 최소 6자라서 이렇게 해요.

3. **Authentication → Sign In / Providers**(또는 Settings)에서 **Allow new users to sign up**을 꺼요. 이러면 둘 말고는 아무도 계정을 만들 수 없어요.

### 3. config.js 채우기

**Project Settings → API**(또는 Data API / API Keys)에서 두 값을 복사해 `config.js`에 넣어요.

- `supabaseUrl`: Project URL (`https://xxxx.supabase.co`)
- `supabaseAnonKey`: `anon` `public` 키 또는 `publishable` 키

이 키는 웹페이지에 공개돼도 괜찮은 키예요. 데이터는 로그인한 두 사람만 볼 수 있게 보안 규칙이 막아 줘요.
`service_role`이나 `secret` 키는 절대 넣지 마세요.

### 4. GitHub Pages로 배포하기

1. GitHub에서 새 저장소를 만들어요 (예: `gongju`). GitHub Pages 무료 플랜은 **Public** 저장소에서 돼요. 코드에 비밀 값은 없어서 공개돼도 괜찮아요.
2. 이 폴더의 파일을 전부 올려요 (Add file → Upload files로 끌어다 놓아도 돼요).
3. 저장소 **Settings → Pages** → Source: **Deploy from a branch**, Branch: `main` / `/ (root)` → Save.
4. 1~2분 뒤 `https://<GitHub 아이디>.github.io/gongju/` 주소가 생겨요.

### 5. 아이폰에 설치하기

1. Safari로 위 주소를 열어요.
2. 공유 버튼 → **홈 화면에 추가**.
3. 홈 화면의 공주네 아이콘으로 들어가서 이름을 고르고 `0402`를 입력하면 끝이에요.

## 업데이트하는 법

파일을 고쳐서 GitHub에 올리면(push) 1~2분 안에 반영되고, 앱을 다시 열면 새 버전이 보여요. 앱을 지웠다 다시 깔 필요는 없어요.

## 알아 두면 좋은 것

- 비밀번호를 바꾸려면 Supabase **Authentication → Users**에서 두 계정 비밀번호를 `gongju-새숫자`로 바꾸면 돼요.
- Supabase 무료 프로젝트는 **일주일 동안 아무 요청이 없으면 일시정지**돼요. 둘이 자주 열면 문제없고, 멈추면 대시보드에서 Restore를 누르면 다시 켜져요.
- 한 숟갈 타이머 간격 설정은 각자 폰에 따로 저장돼요.
