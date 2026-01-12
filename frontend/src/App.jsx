import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Activity,
  Brain,
  Moon,
  Heart,
  Smartphone,
  AlertCircle,
  BarChart3,
  User,
  Clock,
  CheckCircle2,
  ListTodo,
  Lightbulb
} from 'lucide-react';
import bgMain from './assets/bg-main.png';

const initialFormData = {
  Age: '',
  Gender: '',
  Academic_Level: '',
  Avg_Daily_Usage_Hours: '',
  Most_Used_Platform: '',
  Affects_Academic_Performance: '',
  Sleep_Hours_Per_Night: '',
  Relationship_Status: '',
  Conflicts_Over_Social_Media: ''
};

function App() {
  const [view, setView] = useState('landing');
  const [formData, setFormData] = useState(initialFormData);

  const [predictionData, setPredictionData] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="min-h-screen font-sans text-white overflow-hidden relative">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{ backgroundImage: `url(${bgMain})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-purple-950/85 to-black/90 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <LandingView key="landing" onStart={() => setView('form')} />
          )}
          {view === 'form' && (
            <FormView
              key="form"
              formData={formData}
              setFormData={setFormData}
              setPredictionData={setPredictionData}
              setAiData={setAiData}
              setLoading={setLoading}
              setError={setError}
              onComplete={() => setView('result')}
              onBack={() => setView('landing')}
            />
          )}
          {view === 'result' && (
            <ResultView
              key="result"
              prediction={predictionData}
              ai={aiData}
              loading={loading}
              error={error}
              onRetry={() => {
                setFormData(initialFormData);
                setView('form');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Views ---

const LandingView = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl w-full"
    >
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-medium tracking-wide">
              AI-Powered Mental Health Analysis
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Reclaim Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Digital Life
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Understand your relationship with social media through advanced behavioral analytics and receive a personalized wellness plan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={onStart}
              className="group relative px-10 py-5 bg-white text-indigo-950 rounded-full text-xl font-bold transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Assessment <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>

        <div className="hidden md:grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <FeatureCard icon={<Brain className="w-8 h-8 text-indigo-400" />} title="Neuro-Analytics" desc="Process behavioral patterns" delay={0.3} />
            <FeatureCard icon={<Activity className="w-8 h-8 text-pink-400" />} title="Health Impact" desc="Sleep & anxiety correlation" delay={0.4} />
          </div>
          <div className="grid grid-cols-2 gap-6 translate-x-8">
            <FeatureCard icon={<ListTodo className="w-8 h-8 text-emerald-400" />} title="Action Plans" desc="Step-by-step detox guides" delay={0.5} />
            <FeatureCard icon={<BarChart3 className="w-8 h-8 text-blue-400" />} title="Risk Scoring" desc="Precise addiction metrics" delay={0.6} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring' }}
    className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-2xl"
  >
    <div className="mb-5 bg-white/5 w-fit p-4 rounded-2xl border border-white/5">{icon}</div>
    <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const FormView = ({ formData, setFormData, setPredictionData, setAiData, setLoading, setError, onComplete, onBack }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Profile", icon: <User />, fields: ['Age', 'Gender', 'Relationship_Status', 'Academic_Level'] },
    { title: "Habits", icon: <Smartphone />, fields: ['Avg_Daily_Usage_Hours', 'Most_Used_Platform', 'Sleep_Hours_Per_Night'] },
    { title: "Impact", icon: <AlertCircle />, fields: ['Affects_Academic_Performance', 'Conflicts_Over_Social_Media'] }
  ];

  const handleNext = () => { if (validateStep(step)) setStep(prev => Math.min(prev + 1, steps.length - 1)); };
  const handlePrev = () => { if (step > 0) setStep(prev => prev - 1); else onBack(); };
  const validateStep = (currentStep) => {
    for (let field of steps[currentStep].fields) if (!formData[field]) return false;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setPredictionData(null);
    setAiData(null);
    onComplete();

    try {
      // Step 1: Get Risk Prediction
      const predResponse = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!predResponse.ok) throw new Error('Prediction service unavailable');
      const predResult = await predResponse.json();

      if (predResult.status === 'error') throw new Error(predResult.message);
      setPredictionData(predResult);

      // Step 2: Get AI Recommendation based on prediction
      const recResponse = await fetch('http://127.0.0.1:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: predResult.prediction_score,
          platform: formData.Most_Used_Platform,
          academics: formData.Affects_Academic_Performance
        }),
      });

      if (!recResponse.ok) throw new Error('AI Coach unavailable');
      const recResult = await recResponse.json();

      if (recResult.status === 'error') throw new Error(recResult.message);
      setAiData(recResult.recommendation);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl w-full"
    >
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-pink-500"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-5 mb-10 mt-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-blue-300 shadow-inner">
            {steps[step].icon}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Step {step + 1} / {steps.length}</p>
            <h2 className="text-3xl font-bold text-white">{steps[step].title}</h2>
          </div>
        </div>

        <div className="min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <StepContent step={step} formData={formData} setFormData={setFormData} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-10 pt-8 border-t border-white/5">
          <button onClick={handlePrev} className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition">
            <ChevronLeft size={20} /> Back
          </button>
          <button
            onClick={step < steps.length - 1 ? handleNext : handleSubmit}
            disabled={!validateStep(step)}
            className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all ${validateStep(step)
              ? 'bg-white text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
          >
            {step < steps.length - 1 ? 'Next Step' : 'Analyze Results'} {step < steps.length - 1 && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const StepContent = ({ step, formData, setFormData }) => {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const InputClass = "w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all [&>option]:text-black";
  const LabelClass = "block text-sm font-medium text-gray-300 mb-2 ml-1";

  if (step === 0) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div><label className={LabelClass}>Age</label><input type="number" name="Age" value={formData.Age} onChange={handleChange} className={InputClass} placeholder="24" /></div>
      <div><label className={LabelClass}>Gender</label><select name="Gender" value={formData.Gender} onChange={handleChange} className={InputClass}><option value="" disabled>Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
      <div className="md:col-span-2"><label className={LabelClass}>Status</label><div className="grid grid-cols-3 gap-3">{['Single', 'In a Relationship', 'Married'].map(opt => (<button key={opt} onClick={() => handleChange({ target: { name: 'Relationship_Status', value: opt } })} className={`p-4 rounded-2xl border transition-all font-medium ${formData.Relationship_Status === opt ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{opt}</button>))}</div></div>
      <div className="md:col-span-2"><label className={LabelClass}>Education</label><select name="Academic_Level" value={formData.Academic_Level} onChange={handleChange} className={InputClass}><option value="" disabled>Select Level</option><option value="School">School</option><option value="Undergraduate">Undergraduate</option><option value="Postgraduate">Postgraduate</option></select></div>
    </div>
  );
  if (step === 1) return (
    <div className="space-y-6">
      <div><label className={LabelClass}>Daily Usage (Hours)</label><div className="relative"><Clock className="absolute left-4 top-4 text-gray-500" size={20} /><input type="number" step="0.1" name="Avg_Daily_Usage_Hours" value={formData.Avg_Daily_Usage_Hours} onChange={handleChange} className={`${InputClass} pl-12`} placeholder="e.g. 6.5" /></div></div>
      <div><label className={LabelClass}>Most Used Platform</label><div className="grid grid-cols-2 lg:grid-cols-3 gap-3">{['Instagram', 'TikTok', 'Facebook', 'Twitter', 'YouTube', 'Snapchat'].map(p => (<button key={p} onClick={() => handleChange({ target: { name: 'Most_Used_Platform', value: p } })} className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.Most_Used_Platform === p ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{p}</button>))}</div></div>
      <div><label className={LabelClass}>Sleep Hours</label><div className="relative"><Moon className="absolute left-4 top-4 text-gray-500" size={20} /><input type="number" step="0.1" name="Sleep_Hours_Per_Night" value={formData.Sleep_Hours_Per_Night} onChange={handleChange} className={`${InputClass} pl-12`} placeholder="e.g. 7.5" /></div></div>
    </div>
  );
  if (step === 2) return (
    <div className="space-y-8">
      <div><label className={LabelClass}>Impact on Academics/Work?</label><div className="flex gap-4 mt-2">{['Yes', 'No'].map(opt => (<button key={opt} onClick={() => handleChange({ target: { name: 'Affects_Academic_Performance', value: opt } })} className={`flex-1 p-5 rounded-2xl border transition-all text-lg font-semibold ${formData.Affects_Academic_Performance === opt ? 'bg-pink-500 border-pink-500 text-white shadow-xl shadow-pink-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{opt}</button>))}</div></div>
      <div><label className={LabelClass}>Social Media Conflicts (0-10)</label><div className="flex items-center gap-6 mt-4"><span className="text-3xl font-bold w-12 text-center text-blue-400">{formData.Conflicts_Over_Social_Media || 0}</span><input type="range" min="0" max="10" name="Conflicts_Over_Social_Media" value={formData.Conflicts_Over_Social_Media} onChange={handleChange} className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" /></div></div>
    </div>
  );
};

const ResultView = ({ prediction, ai, loading, error, onRetry }) => {
  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
      <div className="relative w-32 h-32 mb-10">
        <motion.div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute inset-4 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full opacity-50" animate={{ rotate: -180 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
        <div className="absolute inset-0 flex items-center justify-center"><Brain className="w-12 h-12 text-white animate-pulse" /></div>
      </div>
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400 mb-3">Analyzing Biosignals</h2>
      <p className="text-gray-400">Consulting AI Wellness Model...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-md w-full bg-red-950/30 border border-red-500/30 p-10 rounded-3xl text-center backdrop-blur-xl">
      <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-red-100 mb-3">System Error</h2>
      <p className="text-red-200/60 mb-8">{error}</p>
      <button onClick={onRetry} className="bg-red-500/20 hover:bg-red-500/30 text-white px-8 py-3 rounded-xl transition border border-red-500/30">Try Again</button>
    </div>
  );

  if (!prediction || !ai) return null;

  const isHigh = prediction.risk_level.includes("High");
  const isMed = prediction.risk_level.includes("Medium");
  const riskColor = isHigh ? "text-red-400" : isMed ? "text-yellow-400" : "text-emerald-400";
  const riskBg = isHigh ? "bg-red-500" : isMed ? "bg-yellow-500" : "bg-emerald-500";
  const strokeColor = isHigh ? "#ef4444" : isMed ? "#eab308" : "#10b981";

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl w-full grid lg:grid-cols-12 gap-8">

      {/* Left Column: Score & Status */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          <div className={`absolute top-0 w-full h-1 ${riskBg} shadow-[0_0_40px_rgba(0,0,0,0.5)]`}></div>

          <h3 className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-8">Addiction Risk Score</h3>

          <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="112" cy="112" r="90" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
              <circle cx="112" cy="112" r="90" fill="transparent" stroke={strokeColor} strokeWidth="8" strokeDasharray={565} strokeDashoffset={565 - (565 * (prediction.prediction_score / 10))} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-black tracking-tighter text-white">{prediction.prediction_score}</span>
              <span className="text-lg text-gray-500 font-medium">/ 10</span>
            </div>
          </div>

          <div className={`py-2 px-6 rounded-full border border-white/10 bg-white/5 mb-2 ${riskColor} font-bold text-xl`}>
            {prediction.risk_level}
          </div>
          <p className="text-sm text-gray-400">{prediction.summary}</p>
        </div>

        <button onClick={onRetry} className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition flex items-center justify-center gap-2">
          <Activity size={18} /> Run New Analysis
        </button>
      </div>

      {/* Right Column: AI Analysis & Action Plan */}
      <div className="lg:col-span-8 flex flex-col gap-6">

        {/* Analysis Card */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-300 flex-shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Analysis for {ai.platform_type}</h3>
              <p className="text-gray-200 leading-relaxed text-lg">{ai.analysis_reason}</p>
            </div>
          </div>
        </div>

        {/* Execution Plan */}
        <div className="flex-1 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-emerald-500/20 p-2 rounded-lg text-emerald-300"><ListTodo size={24} /></span>
            Your Digital Wellness Plan
          </h3>

          <div className="space-y-4">
            {ai.execution_plan.map((step, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group">
                <div className="mt-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500/50 group-hover:text-emerald-500 transition" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200 group-hover:text-white transition">Action Step {i + 1}</h4>
                  <p className="text-gray-400 group-hover:text-gray-300 transition mt-1">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default App;
