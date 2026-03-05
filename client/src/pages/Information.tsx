import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/ui/Layout";
import {
  Info, BookOpen, ShieldAlert, LifeBuoy, CheckCircle2, Eye,
  Sun, User, Activity, Move, Apple, Heart, Stethoscope,
  ChevronRight, RefreshCcw, LayoutGrid, ArrowLeft, Trophy, Play, RotateCcw,
  Zap, MousePointer2, Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Components & Data ---

const eyeExercises = [
  {
    title: "Relaksasi Palming",
    desc: "Tutup mata dan tutupi dengan telapak tangan hangat selama 1 menit.",
    icon: <Heart className="w-5 h-5 text-red-400" />
  },
  {
    title: "Fokus Dekat-Jauh",
    desc: "Ganti fokus mata antara objek dekat (30cm) dan jauh (6m) secara bergantian.",
    icon: <Move className="w-5 h-5 text-blue-400" />
  },
  {
    title: "Rolling Mata",
    desc: "Putar bola mata searah jarum jam dan sebaliknya secara perlahan.",
    icon: <RefreshCcw className="w-5 h-5 text-green-400" />
  }
];

const nutritionGuide = [
  {
    food: "Wortel & Labu",
    nutrient: "Vitamin A / Beta Karoten",
    benefit: "Menjaga kornea dan penglihatan malam.",
    icon: "🥕"
  },
  {
    food: "Bayam & Brokoli",
    nutrient: "Lutein & Zeaxanthin",
    benefit: "Melindungi mata dari kerusakan sinar biru.",
    icon: "🥬"
  },
  {
    food: "Ikan Berlemak (Salmon)",
    nutrient: "Omega-3",
    benefit: "Mencegah mata kering dan menjaga kesehatan retina.",
    icon: "🐟"
  },
  {
    food: "Telur",
    nutrient: "Zink & Vitamin E",
    benefit: "Melindungi makula dan kejernihan lensa.",
    icon: "🥚"
  }
];

const cataractInfo = {
  symptoms: [
    { title: "Penglihatan Kabur", desc: "Seperti melihat melalui kaca yang berkabut tertutup uap." },
    { title: "Sensitif Cahaya", desc: "Silau saat melihat lampu mobil di malam hari atau sinar matahari." },
    { title: "Warna Memudar", desc: "Warna tampak kurang cerah atau kekuningan." },
    { title: "Pandangan Ganda", desc: "Melihat objek ganda pada satu mata." },
  ],
  risks: [
    { icon: <User className="w-4 h-4" />, text: "Penuaan (Usia > 60)" },
    { icon: <Activity className="w-4 h-4" />, text: "Diabetes" },
    { icon: <Sun className="w-4 h-4" />, text: "Paparan Sinar UV Berlebih" },
    { icon: <Eye className="w-4 h-4" />, text: "Riwayat Trauma Mata" },
  ]
};

const faqs = [
  {
    question: "Seberapa akurat hasil screening AI ini?",
    answer: "Model AI kami (MobileNetV2) memberikan screening awal dengan tingkat akurasi tinggi. Namun, hasil ini BUKAN diagnosis medis. Selalu konsultasikan dengan dokter mata untuk diagnosis pasti."
  },
  {
    question: "Kapan saya harus ke dokter?",
    answer: "Segera hubungi dokter jika Anda mengalami perubahan penglihatan mendadak, nyeri mata terus-menerus, atau jika hasil screening menunjukkan 'Cataract Detected' (Terdeteksi Katarak)."
  },
  {
    question: "Apakah katarak bisa disembuhkan?",
    answer: "Ya, katarak umumnya dapat diatasi dengan operasi yang aman dan efektif. Lensa yang keruh akan diganti dengan lensa buatan (IOL) untuk mengembalikan penglihatan yang jernih."
  }
];

// --- GAME 1: FOCUS MASTER (Contrast) ---

const ColorGame = ({ onBack }: { onBack: () => void }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'over'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gridSize, setGridSize] = useState(2);
  const [targetIndex, setTargetIndex] = useState(0);
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [diffColor, setDiffColor] = useState('#60a5fa');

  const generateLevel = useCallback(() => {
    const size = score < 2 ? 2 : score < 5 ? 3 : score < 10 ? 4 : score < 20 ? 5 : score < 35 ? 6 : 7;
    setGridSize(size);
    setTargetIndex(Math.floor(Math.random() * (size * size)));

    // Generate random color
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 60; // 60-90%
    const l = Math.floor(Math.random() * 20) + 40; // 40-60%

    const base = `hsl(${h}, ${s}%, ${l}%)`;
    const diffFactor = Math.max(1, 25 - Math.floor(score / 2));
    const diff = `hsl(${h}, ${s}%, ${l + diffFactor}%)`;

    setBaseColor(base);
    setDiffColor(diff);
  }, [score]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameState('over');
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameState('playing');
    generateLevel();
  };

  const handleSquareClick = (index: number) => {
    if (index === targetIndex) {
      setScore(prev => prev + 1);
      setTimeLeft(prev => Math.min(prev + 2, 20));
      generateLevel();
    } else {
      setTimeLeft(prev => Math.max(prev - 3, 0));
    }
  };

  return (
    <Card className="border-none shadow-xl bg-white dark:bg-card overflow-hidden relative">
      <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/20">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Menu
          </Button>
          <div className="text-center flex-1">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Focus Master
            </CardTitle>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-primary leading-none">{score}</div>
            <div className="text-[10px] uppercase font-bold text-gray-400">Poin</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 flex flex-col items-center justify-center min-h-[420px]">
        {gameState === 'start' && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full w-fit mx-auto ring-8 ring-blue-50 dark:ring-blue-900/10">
              <Eye className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Uji Mata Fokus</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-2">
                Temukan satu kotak dengan warna berbeda sebelum waktu habis!
              </p>
            </div>
            <Button onClick={startGame} className="w-full py-7 text-lg rounded-2xl shadow-lg bg-blue-600 hover:bg-blue-700">
              <Play className="w-5 h-5 mr-2" /> Mulai Sekarang
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-sm space-y-6">
            <div className="flex justify-between items-center px-4 bg-gray-50 dark:bg-muted py-2 rounded-full">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <RefreshCcw className="w-3.5 h-3.5" /> Sisa Waktu:
              </span>
              <Badge variant={timeLeft < 5 ? "destructive" : "secondary"} className="text-lg px-4 py-0">
                {timeLeft}s
              </Badge>
            </div>

            <div
              className="grid gap-2 aspect-square w-full bg-gray-100 dark:bg-muted p-2 rounded-2xl shadow-inner"
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
              {[...Array(gridSize * gridSize)].map((_, i) => (
                <button
                  key={i}
                  className="rounded-xl shadow-sm active:scale-95 transition-all duration-200 border-2 border-transparent hover:border-white/50"
                  style={{ backgroundColor: i === targetIndex ? diffColor : baseColor }}
                  onClick={() => handleSquareClick(i)}
                />
              ))}
            </div>
          </div>
        )}

        {gameState === 'over' && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none py-1 px-4">Game Over</Badge>
            <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100">Skor Anda:</h3>
            <div className="text-7xl font-black text-blue-600 dark:text-blue-400 py-4 drop-shadow-md">{score}</div>
            <div className="bg-gray-50 dark:bg-muted p-4 rounded-xl border border-gray-100 dark:border-border">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Kemampuan fokus mata Anda sangat baik!</p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={startGame} className="py-7 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg">
                <RotateCcw className="w-5 h-5 mr-2" /> Main Lagi
              </Button>
              <Button variant="ghost" onClick={onBack} className="text-gray-400">Pilih Game Lain</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- GAME 2: SWIFT SIGHT (Reaction) ---

const ReactionGame = ({ onBack }: { onBack: () => void }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'over'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [targetSize, setTargetSize] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveTarget = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const margin = 50;
    const x = Math.random() * (width - margin * 2) + margin;
    const y = Math.random() * (height - margin * 2) + margin;
    setTargetPos({ x, y });

    // Target gets smaller as score increases
    const newSize = Math.max(25, 60 - Math.floor(score / 3) * 2);
    setTargetSize(newSize);
  }, [score]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameState('over');
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setGameState('playing');
    setTimeout(moveTarget, 100);
  };

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScore(prev => prev + 1);
    moveTarget();
  };

  return (
    <Card className="border-none shadow-xl bg-white dark:bg-card overflow-hidden relative">
      <CardHeader className="bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-900/20">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Menu
          </Button>
          <div className="text-center flex-1">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              Swift Sight
            </CardTitle>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-600 leading-none">{score}</div>
            <div className="text-[10px] uppercase font-bold text-gray-400">Target</div>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="p-0 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden bg-gray-50/30 dark:bg-muted/30"
        ref={containerRef}
      >
        {gameState === 'start' && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300 p-8">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full w-fit mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/10">
              <Target className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kecepatan Penglihatan</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-2">
                Tangkap ikon yang muncul secepat mungkin! Uji reaksi dan koordinasi mata Anda.
              </p>
            </div>
            <Button onClick={startGame} className="w-full py-7 text-lg rounded-2xl shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white">
              <Zap className="w-5 h-5 mr-2" /> Mulai Berburu
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full h-full absolute inset-0 cursor-crosshair" onClick={() => setTimeLeft(prev => Math.max(0, prev - 1))}>
            <div className="absolute top-4 left-4 bg-white/80 dark:bg-card/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Mata Anda Harus Cepat!</span>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant={timeLeft < 5 ? "destructive" : "secondary"} className="text-lg px-4 border-none shadow-md">
                {timeLeft}s
              </Badge>
            </div>

            <button
              onClick={handleTargetClick}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out active:scale-75"
              style={{
                left: `${targetPos.x}px`,
                top: `${targetPos.y}px`,
                width: `${targetSize}px`,
                height: `${targetSize}px`,
              }}
            >
              <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse ring-4 ring-white">
                <Eye className="text-white w-2/3 h-2/3" />
              </div>
            </button>
          </div>
        )}

        {gameState === 'over' && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300 p-8">
            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none py-1 px-4">Selesai!</Badge>
            <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100">Target Didapat:</h3>
            <div className="text-7xl font-black text-emerald-600 dark:text-emerald-400 py-4 drop-shadow-md">{score}</div>
            <div className="bg-emerald-50/50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
              <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Reaksi mata Anda luar biasa tajam!</p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={startGame} className="py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg text-white">
                <RotateCcw className="w-5 h-5 mr-2" /> Main Lagi
              </Button>
              <Button variant="ghost" onClick={onBack} className="text-gray-400">Pilih Game Lain</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- MAIN PAGE ---

export default function Information() {
  const [simulationActive, setSimulationActive] = useState(false);
  const [activeGame, setActiveGame] = useState<'none' | 'focus' | 'swift'>('none');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">

        {/* Navigation & Back Button */}
        <div className="flex justify-start pt-4 animate-in fade-in slide-in-from-left-4 duration-500">
          <Link href="/">
            <Button variant="outline" className="hover:bg-primary/5 text-gray-500 group border-gray-200">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 dark:bg-primary/10 rounded-full border border-primary/10 dark:border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Eye Health Hub
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3 justify-center md:justify-start">
            <Info className="w-10 h-10 text-primary" />
            Edukasi & Informasi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-2xl leading-relaxed">
            Pusat edukasi interaktif untuk menjaga kesehatan penglihatan Anda melalui alat screening mandiri dan simulasi AI.
          </p>
        </div>

        <Tabs defaultValue="screening" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-10 bg-gray-100/70 dark:bg-muted/50 p-1.5 rounded-2xl h-auto">
            <TabsTrigger value="screening" className="rounded-xl py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-md transition-all">
              <Eye className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Katarak</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="rounded-xl py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-md transition-all">
              <LayoutGrid className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Tes Mandiri</span>
            </TabsTrigger>
            <TabsTrigger value="game" className="rounded-xl py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-md transition-all active:ring-2 active:ring-primary/20">
              <Trophy className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Mini Games</span>
            </TabsTrigger>
            <TabsTrigger value="wellness" className="rounded-xl py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-md transition-all">
              <Apple className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Wellness</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CATARACT & SIMULATION */}
          <TabsContent value="screening" className="space-y-8 animate-in zoom-in-95 duration-500">
            <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-white dark:from-card via-white dark:via-card to-primary/5 dark:to-primary/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2 dark:text-gray-100">
                      Simulasi Penglihatan
                    </CardTitle>
                    <CardDescription className="text-base mt-1 dark:text-gray-400">
                      Visualisasi bagaimana katarak mengaburkan pandangan nyata.
                    </CardDescription>
                  </div>
                  <Badge variant={simulationActive ? "destructive" : "secondary"} className="animate-pulse px-4">
                    {simulationActive ? "Katarak Aktif" : "Normal"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="relative rounded-2xl overflow-hidden aspect-[16/9] group cursor-pointer shadow-inner border-4 border-white dark:border-background"
                  onClick={() => setSimulationActive(!simulationActive)}
                >
                  <img
                    src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop"
                    alt="Pemandangan Alam"
                    className={`w-full h-full object-cover transition-all duration-1000 ${simulationActive ? "blur-[4px] sepia-[45%] brightness-90 contrast-75 saturate-50" : ""}`}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-sm font-bold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Klik gambar untuk beralih mode penglihatan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg border-l-4 border-l-primary overflow-hidden hover:shadow-xl transition-shadow dark:bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2 text-primary">
                    <Stethoscope className="w-5 h-5" />
                    Gejala Umum
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {cataractInfo.symptoms.map((sym, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors shrink-0">
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{sym.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{sym.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg border-l-4 border-l-destructive overflow-hidden hover:shadow-xl transition-shadow dark:bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2 text-destructive">
                    <ShieldAlert className="w-5 h-5" />
                    Faktor Risiko
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {cataractInfo.risks.map((risk, i) => (
                    <div key={i} className="flex items-center gap-4 p-3.5 bg-red-50/50 dark:bg-destructive/10 rounded-2xl border border-red-100/50 dark:border-destructive/20 hover:bg-red-50 dark:hover:bg-destructive/20 transition-colors">
                      <div className="text-destructive bg-white dark:bg-background p-2.5 rounded-full shadow-sm">
                        {risk.icon}
                      </div>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{risk.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: SELF-TEST TOOLS */}
          <TabsContent value="tools" className="space-y-8 animate-in zoom-in-95 duration-500">
            <Card className="border-none shadow-2xl bg-white dark:bg-card overflow-hidden">
              <CardHeader className="bg-gray-900 border-b border-gray-800 text-white p-8">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <LayoutGrid className="w-6 h-6 text-primary" />
                  Tes Kisi Amsler (Amsler Grid)
                </CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Metode standar medis untuk mendeteksi gangguan makula di rumah.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-12 px-6">
                <div className="relative w-80 h-80 border border-gray-200 bg-white grid grid-cols-20 grid-rows-20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)",
                      backgroundSize: "16px 16px"
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-full ring-8 ring-black/10" />
                  </div>
                </div>

                <div className="mt-10 max-w-lg text-center bg-gray-50 dark:bg-muted p-6 rounded-3xl border border-gray-100 dark:border-border">
                  <h4 className="font-black text-gray-900 dark:text-gray-100 text-xl mb-3">Panduan Penggunaan:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                    <li>1. Gunakan kacamata baca jika Anda memakainya.</li>
                    <li>2. Tutup mata kiri, fokuskan mata kanan ke **titik hitam tengah**.</li>
                    <li>3. Pastikan semua garis terlihat **lurus dan sejajar**.</li>
                    <li>4. Ulangi untuk mata kiri.</li>
                  </ul>

                  <div className="bg-destructive/5 dark:bg-destructive/10 p-5 rounded-2xl border border-destructive/10 text-left">
                    <p className="text-xs text-destructive font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Perhatian Medis:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      Jika ada garis yang tampak **bergelombang, miring, atau terdistorsi**, segera buat janji temu dengan dokter mata.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl dark:bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center gap-2 dark:text-gray-100">
                  <Move className="w-6 h-6 text-primary" />
                  Senam Mata (Eye Health)
                </CardTitle>
                <CardDescription className="text-base dark:text-gray-400">
                  Kurangi mata lelah (digital eye strain) dengan latihan 3 menit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-6 pt-4">
                  {eyeExercises.map((ex, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-gray-100 dark:bg-muted border border-gray-200/50 dark:border-border flex flex-col items-center text-center hover:bg-white dark:hover:bg-card hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/20 transition-all group">
                      <div className="p-4 rounded-2xl bg-white dark:bg-background shadow-md mb-4 group-hover:scale-110 transition-transform">
                        {ex.icon}
                      </div>
                      <h5 className="font-black text-gray-900 dark:text-gray-100 mb-2">{ex.title}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{ex.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: MINI GAMES */}
          <TabsContent value="game" className="animate-in zoom-in-95 duration-500 min-h-[500px]">
            {activeGame === 'none' ? (
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="group border-none shadow-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white overflow-hidden cursor-pointer hover:scale-[1.02] transition-all" onClick={() => setActiveGame('focus')}>
                  <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                    <div className="p-6 bg-white/20 rounded-full backdrop-blur-md">
                      <Trophy className="w-16 h-16" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black">Focus Master</h3>
                      <p className="text-blue-100 mt-2 font-medium">Tes sensitivitas kontras dan ketajaman warna mata Anda.</p>
                    </div>
                    <Button className="w-full bg-white text-blue-600 hover:bg-white/90 font-bold rounded-2xl py-6">
                      Mainkan Sekarang
                    </Button>
                  </CardContent>
                </Card>

                <Card className="group border-none shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white overflow-hidden cursor-pointer hover:scale-[1.02] transition-all" onClick={() => setActiveGame('swift')}>
                  <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                    <div className="p-6 bg-white/20 rounded-full backdrop-blur-md">
                      <Zap className="w-16 h-16" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black">Swift Sight</h3>
                      <p className="text-emerald-100 mt-2 font-medium">Uji kecepatan reaksi penglihatan dan koordinasi mata Anda.</p>
                    </div>
                    <Button className="w-full bg-white text-emerald-600 hover:bg-white/90 font-bold rounded-2xl py-6">
                      Mulai Berburu
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : activeGame === 'focus' ? (
              <ColorGame onBack={() => setActiveGame('none')} />
            ) : (
              <ReactionGame onBack={() => setActiveGame('none')} />
            )}
          </TabsContent>

          {/* TAB 4: WELLNESS & NUTRITION */}
          <TabsContent value="wellness" className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100 px-2 flex items-center gap-3">
                  <Apple className="w-8 h-8 text-green-500" />
                  Nutrisi Super
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  {nutritionGuide.map((item, i) => (
                    <Card key={i} className="border-none shadow-lg overflow-hidden group hover:shadow-2xl transition-all border border-gray-50 dark:border-border dark:bg-card">
                      <div className="flex">
                        <div className="w-24 bg-gray-50 dark:bg-muted/50 flex items-center justify-center text-5xl group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors">
                          {item.icon}
                        </div>
                        <CardContent className="p-6">
                          <h4 className="font-black text-gray-900 dark:text-gray-100 text-lg mb-1">{item.food}</h4>
                          <p className="text-xs text-primary font-black uppercase tracking-tighter mb-2">{item.nutrient}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight font-medium">{item.benefit}</p>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100 px-2 flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  Protokol Harian
                </h3>
                <div className="space-y-6">
                  <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/20 shadow-none p-8 rounded-[2rem] hover:bg-primary/10 transition-colors">
                    <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-black text-primary text-xl mb-3 flex items-center gap-2">
                      Metode 20-20-20
                    </h4>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      Setiap <strong>20 menit</strong> menatap layar, lihat objek berjarak <strong>20 kaki</strong> (6m) selama <strong>20 detik</strong>.
                    </p>
                  </Card>
                  <Card className="bg-blue-50 dark:bg-blue-900/10 shadow-none p-8 rounded-[2rem] border-blue-100 dark:border-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
                    <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                      <ShieldAlert className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-black text-blue-700 dark:text-blue-400 text-xl mb-3 flex items-center gap-2">
                      Filter Sinar UV
                    </h4>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      Paparan sinar matahari kronis adalah faktor risiko katarak. Gunakan kacamata hitam berkualitas saat di luar ruangan.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <section className="space-y-8 pt-16 border-t border-gray-100 dark:border-border">
          <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-4">
            <LifeBuoy className="w-10 h-10 text-primary" />
            Pusat Bantuan
          </h2>
          <Accordion type="single" collapsible className="w-full bg-white dark:bg-card rounded-[2.5rem] shadow-2xl border-none p-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className={idx === faqs.length - 1 ? "border-none" : "border-b border-gray-50 dark:border-border"}>
                <AccordionTrigger className="text-left font-black py-8 px-6 hover:no-underline text-gray-800 dark:text-gray-200 text-xl hover:text-primary transition-all">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 dark:text-gray-400 px-6 pb-8 leading-relaxed text-lg font-medium">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Premium Disclaimer Footer */}
        <div className="relative overflow-hidden bg-gray-950 text-white rounded-[2.5rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.2)]">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-white/10 p-6 rounded-[1.5rem] backdrop-blur-xl border border-white/10 ring-1 ring-white/20">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3">Penyangkalan Medis Resmi</h3>
              <p className="text-gray-400 text-lg leading-relaxed font-medium italic opacity-80">
                Fitur ini disediakan hanya untuk edukasi. Mini-game dan simulasi bukan merupakan alat diagnostik medis. Segera konsultasikan ke spesialis mata untuk keluhan medis serius.
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>
    </Layout>
  );
}
