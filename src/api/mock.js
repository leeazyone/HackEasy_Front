// Mock API functions - Replace these with real backend API calls later

const MOCK_PROBLEMS = [
  {
    id: 1,
    title: 'SQL Injection Basics',
    difficulty: 'Easy',
    description: '취약한 로그인 폼을 SQL 인젝션으로 우회하는 방법을 배워보세요.',
    fullDescription: `당신의 과제는 SQL 인젝션 기법을 사용해 로그인 폼을 우회하는 것입니다.
이 애플리케이션은 사용자 입력을 제대로 정규화하지 않는 취약한 SQL 쿼리를 사용합니다.
사용자명(username) 필드에 특수한 SQL 문자를 입력해 쿼리를 조작해보세요.
힌트: WHERE 절이 항상 true가 되게 만드는 방법을 생각해보세요.
관리자 패널에 숨겨진 플래그를 찾아 제출하세요!`,
    correctFlag: 'flag{sql_injection_master}'
  },
  {
    id: 2,
    title: 'XSS Challenge',
    difficulty: 'Medium',
    description: '교차 사이트 스크립팅(XSS) 취약점을 이용해 세션 데이터를 탈취하세요.',
    fullDescription: `이 웹 애플리케이션은 댓글 섹션에 XSS 취약점이 있습니다.
목표는 다른 사용자의 브라우저에서 실행될 자바스크립트 코드를 주입하는 것입니다.
플래그는 관리자(admin)의 쿠키에 저장되어 있습니다. 이를 탈취할 수 있나요?
힌트: 사용자 입력을 그대로 반영하는 입력 필드를 찾아보세요.`,
    correctFlag: 'flag{xss_cookie_stealer}'
  },
  {
    id: 3,
    title: 'Caesar cipher',
    difficulty: 'Easy',
    description: '카이사르 암호로 인코딩된 메시지를 복호화하세요.',
    fullDescription: `다음 메시지는 카이사르 암호로 암호화되어 있습니다:
"synt{pnrfne_vf_gbb_rnfl}"
카이사르 암호는 알파벳의 각 문자를 고정된 자리 수만큼 이동시키는 암호입니다.
당신의 과제: 메시지를 복호화하고 플래그를 제출하세요.
힌트: 1부터 25까지 가능한 모든 쉬프트 값을 시도해보세요.`,
    correctFlag: 'flag{caesar_is_too_easy}'
  },
  {
    id: 4,
    title: 'Path Traversal',
    difficulty: 'Medium',
    description: '경로 탐색 기법을 사용해 접근이 제한된 파일에 접근하세요',
    fullDescription: `이 웹 서버는 파일 다운로드를 허용하지만 파일 경로를 제대로 검증하지 않습니다.
플래그는 서버의 /etc/flag.txt에 저장되어 있습니다.
의도된 디렉터리 외부의 파일에 접근할 수 있도록 ../ 같은 경로 탐색 문자를 사용하는 URL을 만들어보세요.
힌트: 루트로 가기 위해 디렉터리 구조에서 위로 올라가는 방법을 시도해보세요.`,
    correctFlag: 'flag{directory_traversal_found}'
  },
  {
    id: 5,
    title: 'Buffer Overflow',
    difficulty: 'Hard',
    description: 'C 프로그램의 버퍼 오버플로우 취약점을 악용하세요.',
    fullDescription: `버퍼 오버플로우 취약점을 가진 바이너리 실행 파일이 주어집니다.
프로그램은 경계 검사 없이 고정 크기 버퍼에 사용자 입력을 읽어들입니다.
목표: 리턴 주소를 덮어써서 숨겨진 win() 함수를 실행시키세요.
이 챌린지에는 다음 지식이 필요합니다: 메모리 레이아웃(스택 구조), x86 어셈블리, EIP/RIP를 덮어쓸 페이로드 제작 방법.
성공적으로 취약점을 악용하면 플래그가 출력됩니다.`,
    correctFlag: 'flag{buffer_overflow_pwned}'
  },
  {
    id: 6,
    title: 'JWT Tampering',
    difficulty: 'Hard',
    description: 'JSON Web Token을 위조하여 관리자 권한을 얻으세요.',
    fullDescription: `애플리케이션은 인증에 JWT(JSON Web Token)를 사용합니다.
유효한 사용자 토큰을 가로챘지만 관리자 권한이 필요합니다.
토큰의 페이로드는 {"username": "user123", "role": "user"} 입니다.
과제:
1. JWT를 디코드한다.
2. role을 "admin"으로 수정한다.
3. 토큰에 서명한다 (약한 시크릿 또는 알고리즘 혼동을 확인하세요).
4. 관리자 패널에 접근해 플래그를 가져오세요.
힌트: 알고리즘을 RS256에서 HS256으로 바꿔 보거나 "none" 알고리즘을 허용하는지 확인해보세요.`,
    correctFlag: 'flag{jwt_admin_forged}'
  }
];

export const fetchProblems = () => {
  // Simulate API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROBLEMS.map(p => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        description: p.description
      })));
    }, 300);
  });
};

export const fetchProblemById = (id) => {
  // Simulate API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const problem = MOCK_PROBLEMS.find(p => p.id === parseInt(id));
      resolve(problem || null);
    }, 300);
  });
};

export const submitFlag = (problemId, flag) => {
  // Simulate API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const problem = MOCK_PROBLEMS.find(p => p.id === parseInt(problemId));
      
      if (!problem) {
        resolve({ success: false, message: 'Problem not found.' });
        return;
      }

      if (flag.trim() === problem.correctFlag) {
        resolve({ success: true, message: '정답입니다!' });
      } else {
        resolve({ success: false, message: '정답이 아니에요, 다시 한번 시도해보세요.' });
      }
    }, 500);
  });
};

export const loginUser = (email, password) => {
  // Simulate API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock validation - replace with real API call
      resolve({ 
        success: true, 
        message: 'Login functionality will be connected to backend API.' 
      });
    }, 500);
  });
};

export const signupUser = (username, email, password) => {
  // Simulate API call with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock validation - replace with real API call
      resolve({ 
        success: true, 
        message: 'Account creation will be connected to backend API.' 
      });
    }, 500);
  });
};
