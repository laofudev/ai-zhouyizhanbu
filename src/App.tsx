import { useState } from 'react';
import { 
  Coins, 
  Sparkles, 
  BookOpen, 
  RotateCcw, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Scroll,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  type DivinationStep, 
  type CoinResult, 
  type Yao, 
  type Gua,
  type DivinationResult 
} from '@/types';
import { 
  getGuaByCode, 
  getGuaCode, 
  getChangedGuaCode
} from '@/data/gua64';
import { analyzeWithDeepSeek } from '@/services/deepseek';
import './App.css';

// 硬币选择组件
const CoinSelector = ({ 
  index,
  value,
  onChange
}: { 
  index: number;
  value: CoinResult | null;
  onChange: (value: CoinResult | null) => void;
}) => {
  const cycleValue = () => {
    if (value === null) {
      // 未选 -> 正(字)
      onChange({ face: 'head', value: 3 });
    } else if (value.face === 'head') {
      // 正 -> 反(背)
      onChange({ face: 'tail', value: 2 });
    } else {
      // 反 -> 未选
      onChange(null);
    }
  };

  return (
    <motion.button
      className={`coin-selector ${value?.face || 'unset'}`}
      onClick={cycleValue}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="coin-display">
        {value === null ? (
          <span className="coin-placeholder">?</span>
        ) : value.face === 'head' ? (
          <span className="coin-face-text">字</span>
        ) : (
          <span className="coin-face-text">背</span>
        )}
      </div>
      <div className="coin-label">
        {value === null ? '点击选择' : value.face === 'head' ? '正面(字)' : '反面(背)'}
      </div>
      <div className="coin-value">
        {value === null ? '' : `${value.value}点`}
      </div>
    </motion.button>
  );
};

// 爻组件
const YaoLine = ({ 
  type, 
  isChanging,
  position 
}: { 
  type: 'yin' | 'yang'; 
  isChanging: boolean;
  position: number;
}) => {
  return (
    <motion.div 
      className="yao-line-container"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.1 }}
    >
      <div className={`yao-line ${type} ${isChanging ? 'changing' : ''}`}>
        {type === 'yin' ? (
          <>
            <div className="yao-segment" />
            <div className="yao-gap" />
            <div className="yao-segment" />
          </>
        ) : (
          <div className="yao-segment full" />
        )}
      </div>
      {isChanging && (
        <motion.span 
          className="changing-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          变
        </motion.span>
      )}
    </motion.div>
  );
};

// 卦象展示组件
const GuaDisplay = ({ 
  gua, 
  title,
  changingYaos 
}: { 
  gua: Gua; 
  title: string;
  changingYaos?: number[];
}) => {
  return (
    <div className="gua-display">
      <h4 className="gua-title">{title}</h4>
      <div className="gua-name">{gua.name} {gua.symbol}</div>
      <div className="yao-lines">
        {[5, 4, 3, 2, 1, 0].map((i) => (
          <YaoLine
            key={i}
            type={gua.yaos[i]}
            isChanging={changingYaos?.includes(i) || false}
            position={5 - i}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [step, setStep] = useState<DivinationStep>('input');
  const [question, setQuestion] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [coinResults, setCoinResults] = useState<(CoinResult | null)[]>([null, null, null]);
  const [yaosHistory, setYaosHistory] = useState<Yao[]>([]);
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAllYaos, setShowAllYaos] = useState(false);

  // 更新硬币状态
  const updateCoin = (index: number, value: CoinResult | null) => {
    const newResults = [...coinResults];
    newResults[index] = value;
    setCoinResults(newResults);
  };

  // 检查是否三个硬币都已选择
  const isAllCoinsSelected = () => {
    return coinResults.every(c => c !== null);
  };

  // 确认此爻
  const confirmYao = () => {
    if (!isAllCoinsSelected()) return;

    const validResults = coinResults as CoinResult[];
    const sum = validResults.reduce((acc, r) => acc + r.value, 0);
    const yaoType: 'yin' | 'yang' = sum % 2 === 0 ? 'yin' : 'yang';
    const isChanging = sum === 6 || sum === 9;

    const newYao: Yao = {
      type: yaoType,
      changed: isChanging,
      coinResult: validResults
    };

    const newYaosHistory = [...yaosHistory, newYao];
    setYaosHistory(newYaosHistory);

    // 重置硬币选择
    setCoinResults([null, null, null]);

    if (currentRound < 6) {
      setCurrentRound(prev => prev + 1);
    } else {
      // 完成6爻，生成结果
      completeDivination(newYaosHistory);
    }
  };

  // 完成占卜
  const completeDivination = (yaos: Yao[]) => {
    const yaoTypes = yaos.map(y => y.type);
    const changingIndices = yaos
      .map((y, i) => y.changed ? i : -1)
      .filter(i => i !== -1);

    const originalCode = getGuaCode(yaoTypes.map(t => t === 'yang'));
    const changedCode = getChangedGuaCode(yaoTypes.map(t => t === 'yang'), changingIndices);

    const originalGuaInfo = getGuaByCode(originalCode);
    const changedGuaInfo = getGuaByCode(changedCode);

    if (originalGuaInfo && changedGuaInfo) {
      const divinationResult: DivinationResult = {
        question,
        originalGua: {
          name: originalGuaInfo.name,
          symbol: originalGuaInfo.symbol,
          yaos: yaoTypes
        },
        changedGua: {
          name: changedGuaInfo.name,
          symbol: changedGuaInfo.symbol,
          yaos: changingIndices.length > 0 
            ? yaoTypes.map((t, i) => changingIndices.includes(i) ? (t === 'yin' ? 'yang' : 'yin') : t)
            : yaoTypes
        },
        yaos,
        changingYaoIndices: changingIndices,
        timestamp: Date.now()
      };

      setResult(divinationResult);
      setStep('result');
    }
  };

  // 获取DeepSeek分析
  const getAnalysis = async () => {
    if (!result) return;

    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeWithDeepSeek(result);
      setAnalysis(analysisResult);
      setStep('analysis');
    } catch (error) {
      console.error('分析失败:', error);
      alert('分析失败，请检查API配置');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 重新开始
  const reset = () => {
    setStep('input');
    setQuestion('');
    setCurrentRound(1);
    setCoinResults([null, null, null]);
    setYaosHistory([]);
    setResult(null);
    setAnalysis('');
    setShowAllYaos(false);
  };

  // 获取当前爻的信息
  const getCurrentYaoInfo = () => {
    if (!isAllCoinsSelected()) return null;
    const validResults = coinResults as CoinResult[];
    const sum = validResults.reduce((acc, r) => acc + r.value, 0);
    const yaoType = sum % 2 === 0 ? '阴爻' : '阳爻';
    const isChanging = sum === 6 || sum === 9;
    const sumMap: Record<number, string> = {
      6: '老阴(变)',
      7: '少阳',
      8: '少阴',
      9: '老阳(变)'
    };
    return {
      sum,
      type: yaoType,
      changing: isChanging,
      description: sumMap[sum]
    };
  };

  return (
    <div className="app-container">
      {/* 背景装饰 */}
      <div className="bg-decoration">
        <div className="bg-circle circle-1" />
        <div className="bg-circle circle-2" />
        <div className="bg-circle circle-3" />
      </div>

      {/* 头部 */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Sparkles className="logo-icon" />
            <h1 className="logo-text">易经占卜</h1>
          </div>
          <p className="header-subtitle">传统六爻 · 智慧指引</p>
        </div>
      </header>

      {/* 主内容 */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {/* 输入问题步骤 */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="step-container"
            >
              <Card className="input-card">
                <CardHeader>
                  <CardTitle className="card-title">
                    <Scroll className="card-icon" />
                    请写下您要占卜的事情
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="例如：我最近的工作发展如何？或者：这段感情是否合适？...

请诚心默念您的问题，然后点击开始占卜。"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="question-input"
                    rows={5}
                  />
                  <Button
                    onClick={() => setStep('tossing')}
                    disabled={!question.trim()}
                    className="start-btn"
                  >
                    <Coins className="btn-icon" />
                    开始占卜
                  </Button>
                </CardContent>
              </Card>

              <div className="intro-section">
                <h3 className="intro-title">占卜说明</h3>
                <div className="intro-grid">
                  <div className="intro-item">
                    <div className="intro-number">1</div>
                    <p>诚心默念您的问题</p>
                  </div>
                  <div className="intro-item">
                    <div className="intro-number">2</div>
                    <p>手动抛三枚硬币</p>
                  </div>
                  <div className="intro-item">
                    <div className="intro-number">3</div>
                    <p>选择正反结果</p>
                  </div>
                  <div className="intro-item">
                    <div className="intro-number">4</div>
                    <p>重复六次成卦</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 选择硬币步骤 */}
          {step === 'tossing' && (
            <motion.div
              key="tossing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="step-container"
            >
              <Card className="tossing-card">
                <CardHeader>
                  <CardTitle className="card-title">
                    <Coins className="card-icon" />
                    第 {currentRound}/6 爻
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="question-display">问：{question}</p>

                  <div className="toss-instruction">
                    <p>请抛掷三枚硬币，然后点击下方选择结果：</p>
                    <p className="toss-hint">字 = 正面(3点) &nbsp;&nbsp; 背 = 反面(2点)</p>
                  </div>

                  <div className="coins-selector-container">
                    {[0, 1, 2].map((i) => (
                      <CoinSelector
                        key={i}
                        index={i}
                        value={coinResults[i]}
                        onChange={(value) => updateCoin(i, value)}
                      />
                    ))}
                  </div>

                  {isAllCoinsSelected() && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="yao-result-preview"
                    >
                      {(() => {
                        const info = getCurrentYaoInfo();
                        return info ? (
                          <div className="yao-info">
                            <span className="yao-type">{info.description}</span>
                            <span className="yao-detail">
                              ({(coinResults as CoinResult[]).map(c => c.face === 'head' ? '字(3)' : '背(2)').join(' + ')} = {info.sum})
                            </span>
                          </div>
                        ) : null;
                      })()}
                    </motion.div>
                  )}

                  <Button
                    onClick={confirmYao}
                    disabled={!isAllCoinsSelected()}
                    className="confirm-btn"
                  >
                    <Check className="btn-icon" />
                    {currentRound === 6 ? '完成成卦' : '确认此爻'}
                  </Button>

                  {/* 已完成的爻 */}
                  {yaosHistory.length > 0 && (
                    <div className="yaos-history">
                      <button 
                        className="toggle-yaos-btn"
                        onClick={() => setShowAllYaos(!showAllYaos)}
                      >
                        已完成的爻 ({yaosHistory.length})
                        {showAllYaos ? <ChevronUp /> : <ChevronDown />}
                      </button>
                      <AnimatePresence>
                        {showAllYaos && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="yaos-list"
                          >
                            {[...yaosHistory].reverse().map((yao, idx) => {
                              const sum = yao.coinResult.reduce((acc, r) => acc + r.value, 0);
                              return (
                                <div key={idx} className={`history-yao ${yao.changed ? 'changing' : ''}`}>
                                  <span className="history-yao-position">
                                    {['初', '二', '三', '四', '五', '上'][yaosHistory.length - 1 - idx]}爻
                                  </span>
                                  <span className="history-yao-type">
                                    {yao.type === 'yang' ? '阳' : '阴'}
                                    {yao.changed && '(变)'}
                                  </span>
                                  <span className="history-yao-coins">
                                    {yao.coinResult.map(c => c.face === 'head' ? '字' : '背').join('')}
                                    ({sum}点)
                                  </span>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 结果展示步骤 */}
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="step-container"
            >
              <Card className="result-card">
                <CardHeader>
                  <CardTitle className="card-title">
                    <BookOpen className="card-icon" />
                    卦象结果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="question-display">问：{result.question}</p>

                  <div className="gua-comparison">
                    <GuaDisplay 
                      gua={result.originalGua} 
                      title="本卦"
                      changingYaos={result.changingYaoIndices}
                    />

                    {result.changingYaoIndices.length > 0 && (
                      <div className="gua-arrow">
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          →
                        </motion.div>
                        <span className="arrow-text">变卦</span>
                      </div>
                    )}

                    {result.changingYaoIndices.length > 0 && (
                      <GuaDisplay 
                        gua={result.changedGua} 
                        title="变卦"
                      />
                    )}
                  </div>

                  {/* 卦辞信息 */}
                  {(() => {
                    const originalCode = getGuaCode(result.originalGua.yaos.map(t => t === 'yang'));
                    const guaInfo = getGuaByCode(originalCode);
                    if (!guaInfo) return null;

                    return (
                      <div className="gua-details">
                        <div className="gua-detail-section">
                          <h4>卦辞</h4>
                          <p>{guaInfo.guaCi}</p>
                        </div>
                        <div className="gua-detail-section">
                          <h4>象曰</h4>
                          <p>{guaInfo.xiangYue}</p>
                        </div>

                        {/* 变爻爻辞 */}
                        {result.changingYaoIndices.length > 0 && (
                          <div className="gua-detail-section changing-yaos">
                            <h4>变爻辞</h4>
                            {result.changingYaoIndices.map(idx => (
                              <div key={idx} className="yao-ci">
                                <span className="yao-ci-position">
                                  {['初', '二', '三', '四', '五', '上'][idx]}爻：
                                </span>
                                <span className="yao-ci-text">{guaInfo.yaos[idx]}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="result-actions">
                    <Button
                      onClick={getAnalysis}
                      disabled={isAnalyzing}
                      className="analysis-btn"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="btn-icon spinning" />
                          AI解卦中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="btn-icon" />
                          AI智能解卦
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={reset}
                      variant="outline"
                      className="reset-btn"
                    >
                      <RotateCcw className="btn-icon" />
                      重新占卜
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 分析结果步骤 */}
          {step === 'analysis' && analysis && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="step-container"
            >
              <Card className="analysis-card">
                <CardHeader>
                  <CardTitle className="card-title">
                    <Sparkles className="card-icon" />
                    AI解卦分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="question-display">问：{result?.question}</p>

                  <div className="analysis-content">
                    <div 
                      className="analysis-text"
                      dangerouslySetInnerHTML={{ __html: analysis }}
                    />
                  </div>

                  <Button
                    onClick={reset}
                    variant="outline"
                    className="reset-btn"
                  >
                    <RotateCcw className="btn-icon" />
                    重新占卜
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 页脚 */}
      <footer className="app-footer">
        <p>易经占卜 · 传承千年智慧</p>
      </footer>
    </div>
  );
}

export default App;
