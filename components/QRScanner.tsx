
import React, { useState, useRef, useEffect } from 'react';

interface QRScannerProps {
  onScanSuccess: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsScanning(false);
    }
  };

  const simulateScan = () => {
    setHasScanned(true);
    onScanSuccess();
    // In a real app, we would process the video frames here.
    // For this demo, clicking the 'Simulate Scan' overlay triggers the reward.
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  if (hasScanned) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto animate-bounce">
          🎉
        </div>
        <h2 className="text-2xl font-black text-slate-800">Success!</h2>
        <p className="text-slate-500 font-medium">+2 Points added to your balance</p>
        <button 
          onClick={() => setHasScanned(false)}
          className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100"
        >
          Scan Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-800">Bin Scanner</h2>
        <p className="text-slate-400 text-sm">Scan the QR code on any bin to earn points</p>
      </div>

      <div className="relative aspect-square w-full rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl border-4 border-white">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Scanner UI */}
        <div className="absolute inset-0 border-[40px] border-slate-900/40 flex items-center justify-center">
          <div className="w-full h-full border-4 border-emerald-400 rounded-3xl relative">
             {/* Corners */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-emerald-500 -mt-2 -ml-2"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-emerald-500 -mt-2 -mr-2"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-emerald-500 -mb-2 -ml-2"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-emerald-500 -mb-2 -mr-2"></div>
             
             {/* Scanning Line */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        <button 
          onClick={simulateScan}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white text-xs font-black uppercase tracking-widest border border-white/30"
        >
          Found QR? Click to Scan
        </button>
      </div>

      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
        <span className="text-xl">ℹ️</span>
        <p className="text-xs text-emerald-800 font-medium leading-relaxed">
          Ensure the QR code is centered and well-lit. Every scan contributes to your carbon footprint offset!
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
