// 易经占卜类型定义

// 阴阳爻
export type YaoType = 'yin' | 'yang'; // 阴爻(0) 阳爻(1)

// 爻的变化状态
export type YaoChange = 'unchanged' | 'changed'; // 不变 | 变爻

// 单爻结构
export interface Yao {
  type: YaoType;
  changed: boolean;
  coinResult: CoinResult[]; // 三枚硬币的结果
}

// 硬币结果
export type CoinFace = 'head' | 'tail'; // 正面(字/3) 反面(背/2)

export interface CoinResult {
  face: CoinFace;
  value: number; // 正面=3，反面=2
}

// 卦象
export interface Gua {
  name: string;
  symbol: string; // 卦符号
  yaos: YaoType[]; // 从下到上 6爻
}

// 完整卦象结果
export interface DivinationResult {
  question: string;
  originalGua: Gua; // 本卦
  changedGua: Gua; // 变卦
  yaos: Yao[]; // 6爻详细信息
  changingYaoIndices: number[]; // 变爻位置(0-5, 0为初爻)
  timestamp: number;
}

// 占卜步骤
export type DivinationStep = 'input' | 'tossing' | 'result' | 'analysis';

// 硬币投掷状态
export interface TossState {
  isTossing: boolean;
  currentRound: number; // 当前第几爻(1-6)
  coins: CoinResult[];
}

// 六十四卦数据
export interface GuaData {
  name: string;
  symbol: string;
  upperGua: string; // 上卦
  lowerGua: string; // 下卦
  description: string;
  yaosText: string[]; // 六爻辞
}
