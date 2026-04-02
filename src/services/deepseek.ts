import type { DivinationResult } from '@/types';
import { getGuaByCode, getGuaCode, getChangedGuaCode } from '@/data/gua64';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function analyzeWithDeepSeek(result: DivinationResult): Promise<string> {
  const originalCode = getGuaCode(result.originalGua.yaos.map(t => t === 'yang'));
  const changedCode = getChangedGuaCode(result.originalGua.yaos.map(t => t === 'yang'), result.changingYaoIndices);
  
  const originalGuaInfo = getGuaByCode(originalCode);
  const changedGuaInfo = getGuaByCode(changedCode);
  
  if (!originalGuaInfo) {
    throw new Error('无法获取卦象信息');
  }

  // 构建变爻信息
  const changingYaoInfo = result.changingYaoIndices.map(idx => {
    const position = ['初', '二', '三', '四', '五', '上'][idx];
    return {
      position: `${position}爻`,
      text: originalGuaInfo.yaos[idx]
    };
  });

  const prompt = `你是一位精通《易经》的智者，请为以下占卜进行详细解读：

【占卜问题】
${result.question}

【本卦】${result.originalGua.name} ${result.originalGua.symbol}
- 上卦：${originalGuaInfo.upperGua}
- 下卦：${originalGuaInfo.lowerGua}
- 卦辞：${originalGuaInfo.guaCi}
- 象曰：${originalGuaInfo.xiangYue}

${result.changingYaoIndices.length > 0 ? `
【变爻】
${changingYaoInfo.map(y => `- ${y.position}：${y.text}`).join('\n')}

【变卦】${result.changedGua.name} ${result.changedGua.symbol}
- 卦辞：${changedGuaInfo?.guaCi || '无'}
` : '【无变爻，为静卦】'}

请从以下几个方面进行解读，用HTML格式输出（不要使用markdown代码块）：

<h3>一、卦象总论</h3>
<p>简要说明本卦的整体含义和象征意义。</p>

<h3>二、问题分析</h3>
<p>针对占卜者的问题，结合卦象进行分析。</p>

<h3>三、变爻解读</h3>
<p>${result.changingYaoIndices.length > 0 ? '详细解读各变爻的含义及其对整体卦象的影响。' : '本卦无变爻，说明事情发展较为稳定，以本卦卦辞为主进行解读。'}</p>

<h3>四、吉凶判断</h3>
<p>给出总体吉凶判断，并说明原因。</p>

<h3>五、行动建议</h3>
<p>根据卦象给出具体的建议和指导。</p>

要求：
1. 语言要古雅但不失通俗，体现易经智慧
2. 分析要有深度，不要流于表面
3. 建议要具体实用
4. 保持客观中立，不要危言耸听`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位精通《易经》的智者，擅长用通俗易懂的语言解读卦象，给出有深度的分析和实用的建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API错误:', errorData);
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // 清理可能的markdown代码块
    return content
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  } catch (error) {
    console.error('DeepSeek API调用失败:', error);
    throw error;
  }
}

// 备用分析函数（当API不可用时）
export function getLocalAnalysis(result: DivinationResult): string {
  const originalCode = getGuaCode(result.originalGua.yaos.map(t => t === 'yang'));
  const guaInfo = getGuaByCode(originalCode);
  
  if (!guaInfo) {
    return '<p>抱歉，无法获取卦象信息。</p>';
  }

  return `
<h3>一、卦象总论</h3>
<p>您占得<strong>${result.originalGua.name}</strong>，上卦为${guaInfo.upperGua}，下卦为${guaInfo.lowerGua}。
此卦${guaInfo.xiangYue}</p>

<h3>二、卦辞解读</h3>
<p>${guaInfo.guaCi}</p>

<h3>三、问题分析</h3>
<p>关于您的问题"${result.question}"，此卦显示当前局势${result.changingYaoIndices.length > 0 ? '有变化之象' : '相对稳定'}。
${result.changingYaoIndices.length > 0 ? '变爻提示事情发展会有转折，需要灵活应对。' : '无变爻说明事情发展较为平稳，可按计划进行。'}</p>

<h3>四、行动建议</h3>
<p>1. 保持诚心正念，顺应时势而为</p>
<p>2. ${result.changingYaoIndices.length > 0 ? '注意把握变化中的机遇，适时调整策略' : '稳扎稳打，不宜冒进'}</p>
<p>3. 多听取他人意见，集思广益</p>
<p>4. 保持谦虚谨慎的态度，方能趋吉避凶</p>

<p style="color: #666; font-size: 0.9rem; margin-top: 2rem;">
（注：当前使用本地解读，如需更详细的AI分析，请检查网络连接后重试。）
</p>
`;
}
