// 공주네 연결 설정
// supabaseUrl과 supabaseAnonKey를 비워 두면 예시 데이터로 도는 "미리보기 모드"가 돼요.
// 둘 다 채우면 두 사람 폰이 같은 데이터를 보는 "실제 모드"가 돼요.
window.GONGJU_CONFIG = {
  // Supabase → Project Settings → API (Data API)에 있는 Project URL
  supabaseUrl: 'https://beyjjarjrmbvnoybftxc.supabase.co',

  // 같은 곳에 있는 anon(public) 키 또는 publishable 키. 공개돼도 괜찮은 키예요.
  // (service_role / secret 키는 절대 넣지 마세요)
  supabaseAnonKey: 'sb_publishable_Y1hx_try_1_JdWXjsQPNDA_AGbubvId',

  // Supabase에 만든 두 계정의 이메일 (실제로 메일을 받을 필요는 없어요)
  emails: {
    hj: 'hyeokju@example.com',
    gy: 'gayoung@example.com',
  },

  // 계정 비밀번호 = passwordPrefix + 로그인 화면에서 입력하는 숫자
  // Supabase 비밀번호는 최소 6자라서 앞부분을 붙여요. 예: 'gongju-' + '0402' = 'gongju-0402'
  passwordPrefix: 'gongju-',
};
