export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import { getMockBlogData } from './mock';
const USE_MOCK = false;

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, style, tone = 'kind' } = await request.json();

    if(USE_MOCK) {
      const mockResult = getMockBlogData({
        topic,
        keywords,
        style,
        tone,
      });

      return NextResponse.json(mockResult);
    }

    const systemPrompt = getSystemPrompt(style, tone);
    const userPrompt = `
      주제: ${topic}
      키워드: ${keywords.join(', ')}

      위 주제와 키워드를 바탕으로 기술 블로그 글을 작성해주세요.
      `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: {type: 'json_object'},
      max_tokens: 2000,
      temperature: 0.7 // 검색
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || '{}');

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '요청이 많아 글 생성을 완료하지 못했어요. 잠시만 기다렸다가 다시 시도해 주세요.' },
      { status: 500 }
    );
  }
}

function getSystemPrompt(style: string, tone: string): string {


  const toneGuides: Record<string, string> = {
    kind: `
    모든 문장은 반드시 "~해요", "~입니다"로 끝나야 합니다.
    다른 종결어미(~다, ~함, ~이다 등)를 사용하면 안 됩니다.
    설명하듯 친절한 선생님 말투로 작성하세요.

    출력 문장에서 위 말투 규칙을 단 하나라도 어길 경우
    응답은 실패로 간주됩니다.
    다른 종결어미가 한 문장이라도 포함되면 안 돼요.
    예외 없습니다.
    `,

    minimal: `
    모든 문장은 반드시 명사형 또는 "~함", "~임"으로 끝나야 함.
    설명하는 글에서도 무조건 '~함', '~임'으로 끝나게 작성해야 함.
    설명하듯 말하지 말고, 문서 요약하듯 작성함.
    개요, 마무리가 있을 경우에도 무조건 '~함', '~임'으로 끝나게 작성해야 함.

    출력 문장에서 위 말투 규칙을 단 하나라도 어길 경우
    응답은 실패로 간주됨.
    다른 종결어미가 한 문장이라도 포함되면 안 됨.
    예외 없음.
    `,

    formal: `
    모든 문장은 반드시 과거형 서술체로 작성하세요.
    문장 끝은 "~했다", "~이다"로 통일합니다.
    회고록 또는 개발 일지 형식의 말투를 사용하세요.

    출력 문장에서 위 말투 규칙을 단 하나라도 어길 경우
    응답은 실패로 간주된다.
    다른 종결어미가 한 문장이라도 포함되면 안 된다.
    예외 없다.
    `
  };


  const styleGuides: Record<string, string> = {
    tutorial: `
      글 구조:
      1. 개요
        - 이 글에서 다루는 주제
        - 대상 독자 (예: React 초보자, 실무 1~2년 차 등)
        - 완성 후 얻게 되는 결과
      2. 사전 준비
        - 필요한 환경 (버전 명시)
        - 선수 지식
      3. 구현 과정
        - Step 1, 2, 3... 단계별 설명
        - 각 단계마다 코드 예시 + 설명
        - 왜 이렇게 작성하는지 이유 포함
      4. 자주 하는 실수 & 주의사항
        - 초보자가 헷갈리는 포인트 정리

      5. 마무리
        - 핵심 요약
        - 응용 아이디어 또는 다음 학습 방향`,
    til: `
      글 구조:
      1. 오늘 배운 핵심 요약
        - 한 문장 요약
        - 키워드 리스트

      2. 배경
        - 왜 이 내용을 학습하게 되었는지

      3. 상세 내용
        - 개념 설명
        - 코드 예시
        - 실제 사용 시 포인트

      4. 시행착오
        - 막혔던 부분
        - 처음에 잘못 생각했던 점

      5. 정리 & 회고
        - 오늘의 교훈
        - 다음에 비슷한 상황에서 어떻게 할지
      `,
    troubleshooting: `
      글 구조:
      1. 한 줄 요약
        - 에러 메시지
        - 해결 방법 요약

      2. 문제 상황
        - 발생한 에러/증상
        - 발생 환경 (OS, 버전, 라이브러리)

      3. 원인 분석
        - 왜 이 문제가 발생했는지
        - 잘못된 코드/설정 예시

      4. 해결 방법
        - 단계별 해결 과정
        - 수정된 코드

      5. 예방 방법
        - 같은 문제를 피하기 위한 체크리스트
      `,
  };

  const selectedStyle = styleGuides[style] || styleGuides.tutorial;
  const selectedTone = toneGuides[tone] || toneGuides.kind;

  const basePrompt = `당신은 기술 블로그 전문 작가입니다.
    사용자가 제공한 주제와 키워드를 바탕으로 기술 블로그 글을 작성합니다.
    
    반드시 JSON 형식으로만 응답해야 됩니다.

    [작성 가이드]
    - 말투: ${selectedTone}
    - 글 형식: ${selectedStyle}
    - 코드 작성 규칙:
      1. 모든 코드 예시는 반드시 코드 블록으로 작성하세요.
      2. 코드 블록은 반드시 언어명을 포함한 백틱 3개로 시작해야 합니다. (예: \`\`\`bash, \`\`\`ts)
      3. 코드 블록 시작 백틱은 코드 바로 위 줄에 단독으로 작성하세요.
      4. 코드 블록 종료는 반드시 백틱 3개(\`\`\`)를 단독 줄로 작성하세요.
      5. 코드 블록 내부에는 코드만 작성하고, 설명 문장은 절대 포함하지 마세요.
      6. 하나의 코드 블록이 끝나면 반드시 다음 줄에서 설명을 이어서 작성하세요.
      7. 중첩된 코드 블록, 틸드(~~~), 불완전한 코드 블록은 절대 사용하지 마세요.

    
    말투 규칙은 다른 모든 지침보다 최우선으로 적용해야 합니다. 
    글의 형식이나 구조가 어떻든, 말투 규칙을 어기면 안 됩니다.

    [응답 JSON 구조]
    {
      "title": "SEO에 최적화된 제목",
      "content": "마크다운 형식의 본문",
      "hashtags": ["태그1", "태그2", "태그3"],
      "metaDescription": "SEO 메타 설명 (160자 이내)"
    }
    
    [최종 검증 규칙]

    1. 응답을 생성하기 전에 문장 종결어미를 자체 검토하세요.
    2. 선택된 말투 규칙과 다른 종결어미가 포함되어 있으면 반드시 수정하세요.
    3. 말투 규칙 위반은 절대 허용되지 않습니다.
    4. 글 형식보다 말투 규칙이 항상 우선합니다.
    `;
  
  return basePrompt;
}