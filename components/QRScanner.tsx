
import React, { useState, useRef, useEffect } from 'react';

interface QRScannerProps {
  onScanSuccess: () => void;
}

const VALID_QR_URL = "https://your-app.com/redeem?id=123";

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const [hasScanned, setHasScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.play();
        requestRef.current = requestAnimationFrame(tick);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied. Please enable permissions.");
    }
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.height = videoRef.current.videoHeight;
      canvas.width = videoRef.current.videoWidth;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // @ts-ignore
      const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        processScan(code.data);
      }
    }
    if (!hasScanned) {
        requestRef.current = requestAnimationFrame(tick);
    }
  };

  const processScan = (scannedData: string) => {
    if (scannedData === VALID_QR_URL) {
      setHasScanned(true);
      setError(null);
      onScanSuccess();
    } else {
      if (!error) {
        setError("Invalid QR Code. This bin is not registered.");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [hasScanned]);

  if (hasScanned) {
    return (
      <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner">
          ✨
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Points Earned!</h2>
          <p className="text-slate-500 font-medium">Successfully verified Bin #123</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm inline-block">
            <span className="text-emerald-600 font-black text-xl">+50 POINTS</span>
        </div>
        <button 
          onClick={() => {
              setHasScanned(false);
              setError(null);
          }}
          className="block w-full max-w-[200px] mx-auto bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
        >
          Scan Next Bin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-800">Bin Authenticator</h2>
        <p className="text-slate-400 text-sm">Validating Bin ID: <span className="font-mono bg-slate-100 px-1 rounded">123</span></p>
      </div>

      <div className="relative aspect-square w-full rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl border-8 border-white">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover grayscale brightness-75"
        />
        
        {/* Overlay Scanner UI */}
        <div className="absolute inset-0 border-[50px] border-slate-900/40 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full border-2 border-white/30 rounded-3xl relative">
             {/* Corners */}
             <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1"></div>
             <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1"></div>
             <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1"></div>
             <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1"></div>
             
             {/* Scanning Line */}
             <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] animate-[scan_3s_linear_infinite]"></div>
          </div>
        </div>

        {/* Error Notification inside Viewfinder */}
        {error && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-center shadow-2xl border border-rose-400 animate-in fade-in zoom-in-90">
                ⚠️ {error}
            </div>
        )}

        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
             <p className="text-white/60 text-[10px] font-black uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                Point camera at QR code
             </p>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl shrink-0">📍</div>
            <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Target Location</p>
                <p className="text-sm font-bold">Smart Bin Terminal - ID 123</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Points only granted for this specific terminal.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
