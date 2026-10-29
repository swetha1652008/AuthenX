import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCode, 
  Upload, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  UserCheck,
  FileText,
  StopCircle
} from 'lucide-react';
import jsQR from 'jsqr';
import { isTrustedIssuingDomain, issuingAuthorityService } from '../../services/issuingAuthorityService';
import type { QRCodeVerificationDetails } from '../../types/issuingAuthority';
import type { UserAccount } from '../../types/auth';

interface QRCodeVerificationWorkspaceProps {
  currentUser: UserAccount | null;
  onSendForManualReview: (reason: string, details?: string) => void;
  onVerificationComplete?: (result: QRCodeVerificationDetails) => void;
}

export const QRCodeVerificationWorkspace: React.FC<QRCodeVerificationWorkspaceProps> = ({
  currentUser: _currentUser,
  onSendForManualReview,
  onVerificationComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [qrResult, setQrResult] = useState<QRCodeVerificationDetails | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setQrResult(null);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const executeDecode = async () => {
    if (!selectedFile) return;
    setIsDecoding(true);
    setCameraActive(false);

    try {
      const result = await issuingAuthorityService.decodeQRCodeFromImageFile(selectedFile);
      setQrResult(result);
      if (onVerificationComplete) {
        onVerificationComplete(result);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to decode QR code';
      setQrResult({
        hasQrCode: false,
        decoded: false,
        isDomainTrusted: false,
        queryStatus: 'FAILED',
        sourceName: 'Local High-Speed QR Parser',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        details: `Decoding error: ${msg}`,
      });
    } finally {
      setIsDecoding(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraActive(false);
  };

  const scanVideoFrame = React.useCallback(function scan() {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scan);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      stopCamera();
      const domainCheck = isTrustedIssuingDomain(code.data);
      const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      let certNo: string | undefined;
      try {
        const parsed = new URL(code.data);
        certNo = parsed.searchParams.get('cert') || parsed.searchParams.get('ref') || undefined;
      } catch {
        const match = code.data.match(/(?:cert|ref|no)[:=]\s*([A-Za-z0-9\-_/]+)/i);
        if (match) certNo = match[1];
      }

      const res: QRCodeVerificationDetails = {
        hasQrCode: true,
        decoded: true,
        rawPayload: code.data,
        certificateNumber: certNo,
        verificationUrl: code.data.startsWith('http') ? code.data : undefined,
        isDomainTrusted: domainCheck.trusted,
        matchedDomain: domainCheck.matchedDomain,
        queryStatus: domainCheck.trusted ? 'VERIFIED' : 'SOURCE_NOT_CONFIGURED',
        sourceName: 'Realtime Device Camera Barcode Scanner (jsQR)',
        timestamp: now,
        details: `Live QR optical stream decoded successfully. Domain trust: ${domainCheck.trusted ? 'Trusted statutory portal (' + domainCheck.matchedDomain + ')' : 'Untrusted external URL'}.`,
        matchesSubmittedRecord: true,
      };

      setQrResult(res);
      if (onVerificationComplete) {
        onVerificationComplete(res);
      }
      return;
    }

    animationFrameRef.current = requestAnimationFrame(scan);
  }, [onVerificationComplete]);

  const startCamera = async () => {
    setCameraError(null);
    setSelectedFile(null);
    setFilePreview(null);
    setQrResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        scanVideoFrame();
      }
    } catch {
      setCameraError('Camera access was denied or device is not supported. Please use the file upload option.');
      setCameraActive(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CFE2FE] shadow-card space-y-5">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 rounded border border-[#CFE2FE]">
            Method 1 Workspace
          </span>
          <h3 className="text-base sm:text-lg font-black text-[#102B4E] mt-0.5 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#2563EB]" />
            QR Code Verification & Payload Inspector
          </h3>
          <p className="text-xs text-slate-500">
            Extract certificate references from supported QR codes and verify them against trusted statutory issuing authorities.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Upload Certificate</span>
          </button>

          {!cameraActive ? (
            <button
              type="button"
              onClick={startCamera}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-slate-500" />
              <span>Scan QR Code</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCamera}
              className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <StopCircle className="w-4 h-4 text-rose-600" />
              <span>Stop Camera</span>
            </button>
          )}

          <button
            type="button"
            onClick={executeDecode}
            disabled={!selectedFile || isDecoding}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isDecoding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
            <span>{isDecoding ? 'Decoding Matrix...' : 'Decode QR Code'}</span>
          </button>
        </div>
      </div>

      {/* Camera Live Scanning Canvas */}
      {cameraActive && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-bold text-teal-400">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              Live Camera Optical Scanner Active
            </span>
            <span className="text-slate-400">Align QR code inside viewfinder</span>
          </div>

          <div className="relative rounded-xl overflow-hidden max-w-md mx-auto aspect-video bg-black flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {/* Viewfinder Target Box */}
            <div className="absolute inset-8 border-2 border-dashed border-teal-400/80 rounded-2xl pointer-events-none" />
          </div>
        </div>
      )}

      {cameraError && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Selected File Card */}
      {selectedFile && !cameraActive && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {filePreview ? (
              <img src={filePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div>
              <h4 className="text-xs font-bold text-slate-800">{selectedFile.name}</h4>
              <p className="text-[11px] text-slate-500">
                Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Type: {selectedFile.type || 'Document'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={executeDecode}
            disabled={isDecoding}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify QR Reference</span>
          </button>
        </div>
      )}

      {/* QR Decoding Results Display */}
      {qrResult && (
        <div className="space-y-4 pt-2">
          {/* Top Status Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            qrResult.decoded && qrResult.isDomainTrusted
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : qrResult.decoded
              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
              : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                qrResult.decoded && qrResult.isDomainTrusted
                  ? 'bg-emerald-100 text-emerald-700'
                  : qrResult.decoded
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                {qrResult.decoded && qrResult.isDomainTrusted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
                  QR Decoding & Authority Domain Analysis
                </span>
                <h4 className="text-sm font-bold mt-0.5">
                  {qrResult.decoded && qrResult.isDomainTrusted
                    ? 'QR Decoded — Trusted Statutory Issuing Domain Confirmed'
                    : qrResult.decoded
                    ? 'QR Decoded — External / Untrusted Domain (Manual Review Required)'
                    : 'QR Decoding Failed or Inconclusive'}
                </h4>
                <p className="text-xs opacity-90 mt-1">
                  {qrResult.details}
                </p>
              </div>
            </div>

            {/* Inconclusive / Failed Action */}
            {(!qrResult.decoded || !qrResult.isDomainTrusted) && (
              <button
                type="button"
                onClick={() => onSendForManualReview(
                  !qrResult.decoded ? 'QR code unreadable' : 'Source mismatch',
                  qrResult.rawPayload
                )}
                className="px-3.5 py-2 rounded-xl bg-[#102B4E] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span>Send for Manual Review</span>
              </button>
            )}
          </div>

          {/* Extracted QR Content Ledger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Raw QR Decoded Payload
              </span>
              <div className="font-mono text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 break-all select-all">
                {qrResult.rawPayload || 'No payload extracted.'}
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Security notice: AuthenX does not follow untrusted URLs automatically to prevent SSRF and unsafe redirects.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Authority Domain Evaluation
              </span>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium">Domain Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    qrResult.isDomainTrusted 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {qrResult.isDomainTrusted ? 'TRUSTED STATUTORY DOMAIN' : 'UNVERIFIED DOMAIN'}
                  </span>
                </div>
                {qrResult.matchedDomain && (
                  <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">Matched Whitelist:</span>
                    <span className="font-mono font-bold text-[#2563EB]">*.{qrResult.matchedDomain}</span>
                  </div>
                )}
                {qrResult.certificateNumber && (
                  <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">Extracted Cert ID:</span>
                    <span className="font-mono font-bold text-slate-900">{qrResult.certificateNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Notice */}
      <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <ExternalLink className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Security & Compliance Safeguards: </strong>
          Optical QR code decoding proves that a matrix was read, but does not independently prove statutory authenticity. 
          AuthenX verifies candidate links against authorized issuing-authority domains (<code className="font-mono text-[#2563EB]">aicte-india.org</code>, <code className="font-mono text-[#2563EB]">*.gov.in</code>, <code className="font-mono text-[#2563EB]">*.nic.in</code>) and alerts officers when manual scrutiny is required.
        </div>
      </div>
    </div>
  );
};
