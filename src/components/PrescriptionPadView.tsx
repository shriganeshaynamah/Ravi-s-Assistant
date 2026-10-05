import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Phone,
  MapPin,
  HeartPulse,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import type { MedicalAnalysisResult } from '../services/geminiMedical';

interface PrescriptionPadViewProps {
  result: MedicalAnalysisResult;
  patientName?: string;
  patientAddress?: string;
  patientContact?: string;
  patientAge: string | number;
  patientGender: string;
  patientPrakriti: string;
  patientAgni: string;
  patientKostha: string;
  diseaseInput: string;
  confirmedMedicines: Record<string, boolean>;
  confirmedShodhana: Record<string, boolean>;
  confirmedInvestigations: Record<string, boolean>;
  confirmedModernMedicines: Record<string, boolean>;
  selectedAcharya?: string;
  onBack: () => void;
  isDark?: boolean;
}

export const PrescriptionPadView: React.FC<PrescriptionPadViewProps> = ({
  result,
  patientName = '',
  patientAddress = '',
  patientContact = '',
  patientAge,
  patientGender,
  patientPrakriti,
  patientAgni,
  patientKostha,
  diseaseInput,
  confirmedMedicines,
  confirmedShodhana,
  confirmedInvestigations,
  confirmedModernMedicines,
  selectedAcharya = 'charaka',
  onBack,
}) => {
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [fitToScreen, setFitToScreen] = useState<boolean>(true);
  const [mobileScale, setMobileScale] = useState<number>(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Automatically compute scale factor so complete A4 page is visible on mobile & tablet/PC
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      if (vw < 640 && fitToScreen) {
        // Scale 720px virtual A4 sheet down to mobile screen width (vw - 16px padding)
        const availWidth = Math.max(300, vw - 16);
        const calculated = Math.min(1, availWidth / 700);
        setMobileScale(Number(calculated.toFixed(3)));
      } else {
        setMobileScale(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [fitToScreen]);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Check if Acharya protocol is active
  const acharyaProto = selectedAcharya
    ? result.ayurvedicAnalysis.acharyaProtocols?.[selectedAcharya]
    : undefined;

  // Use the selected Acharya's Shamana & Shodhana protocols directly when available
  const allShamana =
    acharyaProto && acharyaProto.shamanaChikitsa && acharyaProto.shamanaChikitsa.length > 0
      ? acharyaProto.shamanaChikitsa
      : result.ayurvedicAnalysis.shamanaChikitsa;

  const allShodhana =
    acharyaProto && acharyaProto.shodhanaChikitsa && acharyaProto.shodhanaChikitsa.length > 0
      ? acharyaProto.shodhanaChikitsa
      : result.ayurvedicAnalysis.shodhanaChikitsa;

  // Filter ticked items
  const activeShamana = allShamana.filter(
    (m) => confirmedMedicines[m.medicineName] !== false
  );

  const activeShodhana = allShodhana.filter(
    (s) => confirmedShodhana[s.procedure] !== false
  );

  const activeInvestigations = result.modernMedicineAnalysis.recommendedInvestigations.filter(
    (inv) => {
      const key = typeof inv === 'string' ? inv : inv.testName;
      return confirmedInvestigations[key] !== false;
    }
  );

  const activeModern = result.modernMedicineAnalysis.pharmacotherapyStandard.filter(
    (pharm) => confirmedModernMedicines[pharm.genericName] !== false
  );

  const activeShloka =
    acharyaProto?.shlokaReference || result.ayurvedicAnalysis.shlokaReference;

  // Clean investigation name helper (removes any ★ or Must Perform tags)
  const cleanInvestigationName = (raw: string): string => {
    return raw
      .replace(/^★\s*/g, '')
      .replace(/\[MUST PERFORM\]/gi, '')
      .replace(/\(Mandatory\)/gi, '')
      .trim();
  };

  /**
   * Pure HTML5 2D Canvas renderer that draws the complete official
   * Ayurveez Healthcare Prescription Pad at high resolution (2x A4)
   * with zero dependency on CSS oklch parsing.
   */
  const renderPrescriptionCanvasNative = (): HTMLCanvasElement => {
    const scale = 2;
    const width = 900;
    const pad = 44;
    const contentWidth = width - pad * 2;

    // Estimate height dynamically based on active items so there's no wasted whitespace
    const invRows = Math.ceil(activeInvestigations.length / 2);
    const estHeight =
      460 +
      activeShamana.length * 52 +
      activeShodhana.length * 46 +
      activeModern.length * 44 +
      invRows * 28 +
      220;
    const height = Math.max(920, estHeight);

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);

    // White background & outer border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Subtle Watermark
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
    ctx.font = '900 92px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AYURVEEZ', width / 2, height / 2);
    ctx.restore();

    const wrapText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
      font: string,
      color: string
    ): number => {
      ctx.font = font;
      ctx.fillStyle = color;
      const words = (text || '').split(/\s+/);
      let line = '';
      let curY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, curY);
          line = words[n] + ' ';
          curY += lineHeight;
        } else {
          line = testLine;
        }
      }
      if (line.trim()) {
        ctx.fillText(line.trim(), x, curY);
        curY += lineHeight;
      }
      return curY;
    };

    let y = 48;

    // Header Left: Clinic Branding
    ctx.fillStyle = '#065f46';
    ctx.font = '900 23px sans-serif';
    ctx.fillText('AYURVEEZ HEALTHCARE', pad, y);

    // Header Right: Doctor Name & Qualification
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 17px sans-serif';
    ctx.fillText('Dr. Ravi Shankar Kumar', width - pad, y - 2);
    ctx.fillStyle = '#065f46';
    ctx.font = '700 13px sans-serif';
    ctx.fillText('BAMS (U.A.U, U.K)', width - pad, y + 17);
    ctx.textAlign = 'left';

    y += 17;
    ctx.fillStyle = '#475569';
    ctx.font = '700 11px sans-serif';
    ctx.fillText('CLASSICAL AYURVEDIC CLINIC, PANCHAKARMA & RESEARCH CENTER', pad, y);

    y += 17;
    ctx.fillStyle = '#475569';
    ctx.font = '500 11px sans-serif';
    ctx.fillText(
      'Address: Vishnupuri Colony Near Bengali Ashram, Gaya (823001), Bihar, INDIA',
      pad,
      y
    );

    y += 15;
    ctx.fillStyle = '#1e293b';
    ctx.font = '700 11px sans-serif';
    ctx.fillText('Contact / Appointment: +91-8271890090', pad, y);

    y += 14;
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();

    // Patient Vitals Bar
    y += 12;
    const hasExtraPatientInfo = Boolean(patientAddress.trim() || patientContact.trim());
    const vitalsBoxHeight = hasExtraPatientInfo ? 62 : 42;
    ctx.fillStyle = '#ecfdf5';
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 1;
    ctx.fillRect(pad, y, contentWidth, vitalsBoxHeight);
    ctx.strokeRect(pad, y, contentWidth, vitalsBoxHeight);

    ctx.fillStyle = '#065f46';
    ctx.font = '700 9.5px sans-serif';
    ctx.fillText('PATIENT DETAILS', pad + 14, y + 15);
    ctx.fillText('PRAKRITI & AGNI / KOSTHA', pad + 260, y + 15);
    ctx.textAlign = 'right';
    ctx.fillText('DATE OF CONSULTATION', width - pad - 14, y + 15);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#0f172a';
    ctx.font = '800 11.5px sans-serif';
    const namePrefix = patientName.trim() ? `${patientName.trim()} • ` : '';
    ctx.fillText(
      `${namePrefix}${patientAge ? `${patientAge} Yrs` : 'Adult'} / ${patientGender || 'Unspecified'}`,
      pad + 14,
      y + 32
    );
    ctx.fillText(
      `${patientPrakriti || 'Vata-Pitta'} • ${patientAgni || 'Vishamagni'} • ${
        patientKostha || 'Krura Kostha'
      }`,
      pad + 260,
      y + 32
    );
    ctx.textAlign = 'right';
    ctx.fillText(currentDate, width - pad - 14, y + 32);
    ctx.textAlign = 'left';

    if (hasExtraPatientInfo) {
      ctx.fillStyle = '#334155';
      ctx.font = '600 10.5px sans-serif';
      const extraParts = [
        patientContact.trim() ? `Contact: ${patientContact.trim()}` : null,
        patientAddress.trim() ? `Address: ${patientAddress.trim()}` : null,
      ].filter(Boolean);
      ctx.fillText(extraParts.join('   |   '), pad + 14, y + 50);
    }

    y += vitalsBoxHeight + 18;

    // Clinical Diagnosis
    ctx.fillStyle = '#065f46';
    ctx.font = '800 11px sans-serif';
    ctx.fillText('CLINICAL DIAGNOSIS:', pad, y);
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 13.5px sans-serif';
    ctx.fillText(result.ayurvedicAnalysis.vyadhiVinischaya, pad + 132, y);

    if (activeShloka) {
      y += 15;
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 10.5px sans-serif';
      ctx.fillText(
        `Classical Reference: ${activeShloka.sourceBook} (${activeShloka.chapterAndVerse})${
          acharyaProto ? ` • ${acharyaProto.acharyaName}` : ''
        }`,
        pad,
        y
      );
    }

    y += 26;
    ctx.fillStyle = '#065f46';
    ctx.font = '900 26px serif';
    ctx.fillText('℞', pad, y);
    y += 12;

    // 1. Shamana Chikitsa
    if (activeShamana.length > 0) {
      ctx.fillStyle = '#065f46';
      ctx.font = '800 11.5px sans-serif';
      ctx.fillText('1. CLASSICAL AYURVEDIC FORMULATIONS (SHAMANA CHIKITSA)', pad, y);
      y += 7;
      ctx.strokeStyle = '#d1fae5';
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(width - pad, y);
      ctx.stroke();
      y += 16;

      activeShamana.forEach((med, idx) => {
        ctx.fillStyle = '#0f172a';
        ctx.font = '700 12px sans-serif';
        const refText = med.reference ? ` [${med.reference}]` : '';
        ctx.fillText(`${idx + 1}. ${med.medicineName} (${med.category})${refText}`, pad, y);
        y += 15;
        ctx.fillStyle = '#334155';
        ctx.font = '600 11px sans-serif';
        ctx.fillText(
          `   Dose: ${med.dosage}   |   Anupana: ${med.anupana}   |   Timing: ${med.timing}`,
          pad,
          y
        );
        y += 18;
      });
      y += 5;
    }

    // 2. Shodhana Chikitsa
    if (activeShodhana.length > 0) {
      ctx.fillStyle = '#065f46';
      ctx.font = '800 11.5px sans-serif';
      ctx.fillText('2. PANCHAKARMA & UPAKRAMA PROTOCOLS (SHODHANA)', pad, y);
      y += 15;
      activeShodhana.forEach((shodh, idx) => {
        ctx.fillStyle = '#0f172a';
        ctx.font = '700 11.5px sans-serif';
        ctx.fillText(`${idx + 1}. ${shodh.procedure}:`, pad, y);
        y += 14;
        y = wrapText(
          shodh.details,
          pad + 14,
          y,
          contentWidth - 18,
          14,
          '500 10.5px sans-serif',
          '#475569'
        );
        y += 5;
      });
      y += 5;
    }

    // 3. Modern Pharmacotherapy (Drug class labels like CSDMARD removed as requested)
    if (activeModern.length > 0) {
      ctx.fillStyle = '#1e3a8a';
      ctx.font = '800 11.5px sans-serif';
      ctx.fillText('3. SUPPORTIVE MODERN PHARMACOTHERAPY', pad, y);
      y += 15;
      activeModern.forEach((m, idx) => {
        ctx.fillStyle = '#0f172a';
        ctx.font = '700 11.5px sans-serif';
        ctx.fillText(`${idx + 1}. ${m.genericName} — ${m.standardRegimen}`, pad, y);
        y += 17;
      });
      y += 5;
    }

    // 4. Diagnostic Investigations (Only show investigation name; Must Perform & Clinical Purpose removed)
    if (activeInvestigations.length > 0) {
      ctx.fillStyle = '#1e293b';
      ctx.font = '800 11.5px sans-serif';
      ctx.fillText('4. ESSENTIAL DIAGNOSTIC LABORATORY INVESTIGATIONS ORDERED', pad, y);
      y += 16;

      const colWidth = contentWidth / 2;
      activeInvestigations.forEach((item, idx) => {
        const rawName = typeof item === 'string' ? item : item.testName;
        const cleanName = cleanInvestigationName(rawName);
        const col = idx % 2;
        const xPos = pad + col * colWidth;
        ctx.fillStyle = '#0f172a';
        ctx.font = '700 11px sans-serif';
        ctx.fillText(`✓ ${cleanName}`, xPos, y);
        if (col === 1 || idx === activeInvestigations.length - 1) {
          y += 18;
        }
      });
      y += 6;
    }

    // 5. Pathya - Apathya
    ctx.fillStyle = '#065f46';
    ctx.font = '800 11.5px sans-serif';
    ctx.fillText('5. PATHYA - APATHYA (DIET & LIFESTYLE GUIDELINES)', pad, y);
    y += 15;
    y = wrapText(
      `✓ Pathya (Beneficial): ${result.ayurvedicAnalysis.pathyaApathya.pathyaAhara
        .slice(0, 5)
        .join(', ')}`,
      pad,
      y,
      contentWidth,
      14,
      '600 10.5px sans-serif',
      '#065f46'
    );
    y += 3;
    y = wrapText(
      `✕ Apathya (Avoid): ${result.ayurvedicAnalysis.pathyaApathya.apathyaAhara
        .slice(0, 5)
        .join(', ')}`,
      pad,
      y,
      contentWidth,
      14,
      '600 10.5px sans-serif',
      '#9f1239'
    );
    y += 3;
    y = wrapText(
      `• Vihara (Lifestyle): ${result.ayurvedicAnalysis.pathyaApathya.viharaRules
        .slice(0, 4)
        .join(', ')}`,
      pad,
      y,
      contentWidth,
      14,
      '500 10.5px sans-serif',
      '#334155'
    );

    // Footer Signature
    const footerY = Math.max(y + 42, height - 64);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad, footerY - 22);
    ctx.lineTo(width - pad, footerY - 22);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '500 9.5px sans-serif';
    ctx.fillText(
      'Official Clinical Prescription • Ayurveez Healthcare, Gaya (+91-8271890090)',
      pad,
      footerY
    );

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 12.5px sans-serif';
    ctx.fillText('Dr. Ravi Shankar Kumar', width - pad, footerY - 4);
    ctx.fillStyle = '#065f46';
    ctx.font = '700 10.5px sans-serif';
    ctx.fillText('BAMS (U.A.U, U.K) • Authorized Signatory', width - pad, footerY + 11);
    ctx.textAlign = 'left';

    return canvas;
  };

  const getFilename = () => {
    const safeDisease = (diseaseInput || 'Prescription').replace(/[^a-zA-Z0-9]/g, '_');
    return `Ayurveez_Rx_${safeDisease}_${new Date().toISOString().slice(0, 10)}.png`;
  };

  /**
   * Converts any modern CSS color function (oklch, oklab, color-mix, lab, lch)
   * into standard rgb(...) / rgba(...) strings so html2canvas never fails.
   */
  const createColorSanitizer = () => {
    const cache = new Map<string, string>();
    const pxCanvas = document.createElement('canvas');
    pxCanvas.width = 1;
    pxCanvas.height = 1;
    const pxCtx = pxCanvas.getContext('2d', { willReadFrequently: true });

    const toRgbString = (rawColor: string): string => {
      const trimmed = rawColor.trim();
      if (cache.has(trimmed)) return cache.get(trimmed)!;
      if (!pxCtx) return 'rgb(15, 23, 42)';
      try {
        pxCtx.clearRect(0, 0, 1, 1);
        pxCtx.fillStyle = 'rgba(0,0,0,0)';
        pxCtx.fillStyle = trimmed;
        pxCtx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = pxCtx.getImageData(0, 0, 1, 1).data;
        const res =
          a === 0
            ? 'rgba(0, 0, 0, 0)'
            : a === 255
            ? `rgb(${r}, ${g}, ${b})`
            : `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})`;
        cache.set(trimmed, res);
        return res;
      } catch {
        return 'rgb(15, 23, 42)';
      }
    };

    const sanitizeCssString = (val: string): string => {
      if (!val || typeof val !== 'string') return val;
      if (
        !/(oklch|oklab|color-mix|lch|lab|color)\s*\(/i.test(val) &&
        !/\s+in\s+(oklab|oklch|srgb)/i.test(val)
      ) {
        return val;
      }
      let out = val;
      const fnRegex = /\b(color-mix|oklch|oklab|lch|lab|color)\s*\(/i;
      let guard = 0;
      while (guard < 100) {
        guard++;
        const match = fnRegex.exec(out);
        if (!match) break;
        const start = match.index;
        const openIdx = start + match[0].length - 1;
        let depth = 0;
        let end = -1;
        for (let i = openIdx; i < out.length; i++) {
          if (out[i] === '(') depth++;
          else if (out[i] === ')') {
            depth--;
            if (depth === 0) {
              end = i;
              break;
            }
          }
        }
        if (end === -1) break;
        const fnToken = out.slice(start, end + 1);
        out = out.slice(0, start) + toRgbString(fnToken) + out.slice(end + 1);
      }
      out = out.replace(
        /\s+in\s+(oklab|oklch|srgb|srgb-linear|display-p3|hsl|hwb|lab|lch)\b/gi,
        ''
      );
      return out;
    };

    return { sanitizeCssString };
  };

  const captureExactPrescriptionCanvas = async (): Promise<HTMLCanvasElement> => {
    if (!prescriptionRef.current) {
      return renderPrescriptionCanvasNative();
    }
    await document.fonts?.ready;
    const { sanitizeCssString } = createColorSanitizer();
    const origGetComputedStyle = window.getComputedStyle.bind(window);

    // Wrap window.getComputedStyle in a Proxy so html2canvas never receives oklch/oklab strings
    const wrapComputedStyle = (cs: CSSStyleDeclaration): CSSStyleDeclaration =>
      new Proxy(cs, {
        get(target, prop) {
          if (prop === 'getPropertyValue') {
            return (name: string) => sanitizeCssString(target.getPropertyValue(name));
          }
          const value = (target as any)[prop];
          if (typeof value === 'function') {
            return value.bind(target);
          }
          if (typeof value === 'string') {
            return sanitizeCssString(value);
          }
          return value;
        },
      });

    window.getComputedStyle = ((elt: Element, pseudoElt?: string | null) =>
      wrapComputedStyle(origGetComputedStyle(elt, pseudoElt))) as typeof window.getComputedStyle;

    try {
      const targetEl = prescriptionRef.current;
      const canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 960,
        onclone: (clonedDoc, clonedElement) => {
          const clonedWin = clonedDoc.defaultView as (Window & typeof globalThis) | null;
          if (clonedWin && clonedWin.getComputedStyle) {
            const origCloneGcs = clonedWin.getComputedStyle.bind(clonedWin);
            clonedWin.getComputedStyle = ((elt: Element, pseudoElt?: string | null) =>
              wrapComputedStyle(origCloneGcs(elt, pseudoElt))) as typeof window.getComputedStyle;
          }
          // Ensure any mobile transform scale on parent wrapper is reset in the clone so full A4 width is captured
          if (clonedElement && clonedElement.parentElement) {
            clonedElement.parentElement.style.transform = 'none';
            clonedElement.parentElement.style.width = '840px';
            clonedElement.parentElement.style.marginBottom = '0px';
          }
          clonedDoc.querySelectorAll('style').forEach((s) => {
            if (s.textContent) s.textContent = sanitizeCssString(s.textContent);
          });
        },
      });
      return canvas;
    } finally {
      window.getComputedStyle = origGetComputedStyle;
    }
  };

  const handleSaveToGallery = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const filename = getFilename();
      // Capture the exact on-screen Prescription Pad DOM design via html2canvas
      const canvas = await captureExactPrescriptionCanvas();
      const dataUrl = canvas.toDataURL('image/png', 0.98);
      setPreviewImageUrl(dataUrl);

      // Trigger direct browser file download immediately
      canvas.toBlob(
        (blob) => {
          if (blob) {
            try {
              const blobUrl = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = filename;
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              setTimeout(() => {
                if (document.body.contains(link)) {
                  document.body.removeChild(link);
                }
                URL.revokeObjectURL(blobUrl);
              }, 2500);
            } catch {
              const a = document.createElement('a');
              a.href = dataUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          }
          setSavedSuccess(true);
          setIsSaving(false);
        },
        'image/png',
        0.98
      );
    } catch (err) {
      console.error('Error saving prescription:', err);
      setIsSaving(false);
    }
  };

  const handleDirectDownloadFromModal = () => {
    if (!previewImageUrl) return;
    const a = document.createElement('a');
    a.href = previewImageUrl;
    a.download = getFilename();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleNativeShareFromModal = async () => {
    try {
      if (!previewImageUrl) return;
      const res = await fetch(previewImageUrl);
      const blob = await res.blob();
      const filename = getFilename();
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Ayurveez Healthcare Prescription - ${diseaseInput}`,
          text: `Prescription for ${diseaseInput} by Dr. Ravi Shankar Kumar, BAMS`,
        });
      } else {
        handleDirectDownloadFromModal();
      }
    } catch {
      handleDirectDownloadFromModal();
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-2 sm:pt-4 px-1.5 sm:px-4 space-y-3">
      {/* Top Action Bar (Non-printable) */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 print:hidden flex-wrap px-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medicos Area</span>
        </button>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mobile Fit-to-Page Toggle */}
          <button
            type="button"
            onClick={() => setFitToScreen(!fitToScreen)}
            className="sm:hidden inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-bold cursor-pointer"
            title="Toggle Full Page Fit vs Zoom Mode"
          >
            {fitToScreen ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Zoom 100%</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Fit Full Page</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToGallery}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Prescription'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="max-w-4xl mx-auto p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between gap-2 print:hidden animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Prescription PNG generated &amp; download triggered!</span>
          </div>
          {previewImageUrl && (
            <button
              type="button"
              onClick={handleDirectDownloadFromModal}
              className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold cursor-pointer shrink-0"
            >
              Download PNG
            </button>
          )}
        </div>
      )}

      {/* Instant Saved Prescription Preview & Share Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs print:hidden animate-in fade-in">
          <div className="bg-white rounded-3xl p-4 sm:p-5 max-w-lg w-full space-y-3 text-center shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 text-left">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    Prescription Ready to Save / Share
                  </h4>
                  <p className="text-[10.5px] text-slate-500">
                    High-resolution A4 clinical prescription image generated
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-1">
              <img
                src={previewImageUrl}
                alt="Ayurveez Prescription Pad"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            <p className="text-[10.5px] text-slate-500">
              Tip: On mobile, you can tap <strong>Download PNG</strong>, <strong>Share</strong>, or touch &amp; hold the prescription image above to save directly to Photos.
            </p>

            <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
              <button
                type="button"
                onClick={handleDirectDownloadFromModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                onClick={handleNativeShareFromModal}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share / Save to Phone</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= OFFICIAL PRESCRIPTION PAD CONTAINER ================= */}
      {/* Adapts automatically so complete page is visible on mobile, tablet, and PC */}
      <div
        ref={wrapperRef}
        className="max-w-4xl mx-auto w-full overflow-x-hidden flex justify-center"
      >
        <div
          style={
            mobileScale < 1
              ? {
                  width: '700px',
                  transform: `scale(${mobileScale})`,
                  transformOrigin: 'top center',
                  marginBottom: `-${Math.round((1 - mobileScale) * 760)}px`,
                }
              : { width: '100%' }
          }
        >
          <div
            ref={prescriptionRef}
            className="w-full bg-white text-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-9 shadow-xl border border-slate-200 relative overflow-hidden"
            style={{ fontFamily: '"Merriweather", "Georgia", serif' }}
          >
            {/* Subtle Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-[72px] sm:text-[110px] font-black tracking-widest text-slate-900 uppercase">
                AYURVEEZ
              </span>
            </div>

            {/* CLINICAL LETTERHEAD HEADER */}
            <div className="border-b-2 border-emerald-700 pb-3 sm:pb-4">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                {/* Clinic Branding */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                      <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-wide text-emerald-800 uppercase font-sans leading-tight">
                        AYURVEEZ HEALTHCARE
                      </h1>
                      <p className="text-[9.5px] sm:text-[11px] font-semibold text-slate-600 tracking-wider font-sans uppercase">
                        Classical Ayurvedic Clinic, Panchakarma &amp; Research Center
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 text-[9.5px] sm:text-[11px] text-slate-600 space-y-0.5 font-sans">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>
                        Vishnupuri Colony Near Bengali Ashram, Gaya (823001), Bihar, INDIA
                      </span>
                    </p>
                    <p className="flex items-center gap-1 font-bold text-slate-800">
                      <Phone className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>Contact / Appointment: +91-8271890090</span>
                    </p>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="text-right space-y-0.5 shrink-0 font-sans">
                  <h2 className="text-xs sm:text-base font-black text-slate-900">
                    Dr. Ravi Shankar Kumar
                  </h2>
                  <p className="text-[10px] sm:text-xs font-bold text-emerald-800">
                    BAMS (U.A.U, U.K)
                  </p>
                </div>
              </div>
            </div>

            {/* PATIENT DEMOGRAPHICS & CLINICAL VITALS BAR */}
            <div className="my-2.5 sm:my-3.5 py-2 px-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 font-sans text-[10px] sm:text-xs flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div>
                  <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                    Patient Details
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {patientName.trim() ? `${patientName.trim()} • ` : ''}
                    {patientAge ? `${patientAge} Yrs` : 'Adult'} /{' '}
                    {patientGender || 'Unspecified'}
                  </span>
                </div>
                {patientContact.trim() && (
                  <>
                    <div className="h-5 w-px bg-emerald-200" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                        Contact
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {patientContact.trim()}
                      </span>
                    </div>
                  </>
                )}
                {patientAddress.trim() && (
                  <>
                    <div className="h-5 w-px bg-emerald-200" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                        Address
                      </span>
                      <span className="font-semibold text-slate-800">
                        {patientAddress.trim()}
                      </span>
                    </div>
                  </>
                )}
                <div className="h-5 w-px bg-emerald-200" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                    Prakriti
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {patientPrakriti || 'Vata-Pitta'}
                  </span>
                </div>
                <div className="h-5 w-px bg-emerald-200" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                    Agni &amp; Kostha
                  </span>
                  <span className="font-semibold text-slate-800">
                    {patientAgni || 'Vishamagni'} • {patientKostha || 'Krura Kostha'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                  Date
                </span>
                <span className="font-extrabold text-slate-900">{currentDate}</span>
              </div>
            </div>

            {/* CLINICAL DIAGNOSIS LINE */}
            <div className="mb-3 pb-2 border-b border-slate-200 font-sans flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-white font-black text-[9.5px] tracking-wider uppercase">
                  Diagnosis
                </span>
                <h3 className="font-black text-xs sm:text-sm text-slate-900">
                  {result.ayurvedicAnalysis.vyadhiVinischaya}
                </h3>
              </div>
              {acharyaProto ? (
                <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 italic">
                  {acharyaProto.acharyaName} • Disease Ref:{' '}
                  {acharyaProto.isDirectlyMentioned === false || acharyaProto.shlokaReference?.shlokaSanskrit === 'NA'
                    ? 'NA'
                    : `${acharyaProto.shlokaReference.sourceBook} (${acharyaProto.shlokaReference.chapterAndVerse})`}{' '}
                  | Chikitsa Ref:{' '}
                  {acharyaProto.chikitsaSutra === 'NA' || acharyaProto.chikitsaSutraReference === 'NA'
                    ? 'NA'
                    : acharyaProto.chikitsaSutraReference}
                </p>
              ) : (
                activeShloka && (
                  <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 italic">
                    Ref: {activeShloka.sourceBook} ({activeShloka.chapterAndVerse})
                  </p>
                )
              )}
            </div>

            {/* PRESCRIPTION SYMBOL (℞) */}
            <div className="mb-2">
              <span className="text-2xl sm:text-3xl font-serif font-black text-emerald-800 leading-none">
                ℞
              </span>
            </div>

            {/* ================= 1. AYURVEDIC SHAMANA AUSHADHA ================= */}
            {activeShamana.length > 0 && (
              <div className="mb-3.5 space-y-1.5 font-sans">
                <h4 className="text-[10.5px] sm:text-xs font-black text-emerald-800 uppercase tracking-wider pb-1 border-b border-emerald-100 flex items-center justify-between">
                  <span>1. Classical Ayurvedic Formulations (Shamana Chikitsa)</span>
                  {acharyaProto && (
                    <span className="text-[9.5px] font-bold text-emerald-700">
                      {acharyaProto.acharyaName} Protocol
                    </span>
                  )}
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10.5px] sm:text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[9.5px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-1 pr-1.5 w-6">#</th>
                        <th className="py-1 pr-2">Medicine / Yoga Name</th>
                        <th className="py-1 pr-2">Dosage</th>
                        <th className="py-1 pr-2">Anupana (Vehicle)</th>
                        <th className="py-1 pr-1">Timing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeShamana.map((med, idx) => (
                        <tr key={idx}>
                          <td className="py-1.5 pr-1.5 font-bold text-slate-400">
                            {idx + 1}.
                          </td>
                          <td className="py-1.5 pr-2">
                            <strong className="text-slate-900 font-bold">
                              {med.medicineName}
                            </strong>{' '}
                            <span className="text-[9px] uppercase font-bold text-emerald-700">
                              ({med.category})
                            </span>
                          </td>
                          <td className="py-1.5 pr-2 font-semibold text-slate-800">
                            {med.dosage}
                          </td>
                          <td className="py-1.5 pr-2 text-slate-700">{med.anupana}</td>
                          <td className="py-1.5 pr-1 font-bold text-emerald-900">
                            {med.timing}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= 2. SHODHANA / PANCHAKARMA ================= */}
            {activeShodhana.length > 0 && (
              <div className="mb-3.5 space-y-1.5 font-sans">
                <h4 className="text-[10.5px] sm:text-xs font-black text-emerald-800 uppercase tracking-wider pb-1 border-b border-emerald-100">
                  2. Panchakarma &amp; Upakrama Protocols (Shodhana)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[10.5px] sm:text-xs">
                  {activeShodhana.map((shodh, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5"
                    >
                      <strong className="text-slate-900 font-bold block">
                        {shodh.procedure}
                      </strong>
                      <p className="text-[10px] sm:text-[11px] text-slate-600 leading-snug">
                        {shodh.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= 3. MODERN PHARMACOTHERAPY (NO DRUG CLASS LABELS) ================= */}
            {activeModern.length > 0 && (
              <div className="mb-3.5 space-y-1.5 font-sans">
                <h4 className="text-[10.5px] sm:text-xs font-black text-blue-900 uppercase tracking-wider pb-1 border-b border-blue-100">
                  3. Supportive Modern Pharmacotherapy
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[10.5px] sm:text-xs">
                  {activeModern.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-blue-50/50 border border-blue-200 space-y-0.5"
                    >
                      <strong className="text-slate-900 font-bold block">
                        {m.genericName}
                      </strong>
                      <p className="text-[10px] sm:text-[11px] text-slate-700">
                        {m.standardRegimen}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= 4. DIAGNOSTIC INVESTIGATIONS ORDERED (ONLY TEST NAME) ================= */}
            {activeInvestigations.length > 0 && (
              <div className="mb-3.5 space-y-1.5 font-sans">
                <h4 className="text-[10.5px] sm:text-xs font-black text-slate-800 uppercase tracking-wider pb-1 border-b border-slate-200">
                  4. Essential Diagnostic Laboratory Investigations Ordered
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {activeInvestigations.map((item, idx) => {
                    const rawName = typeof item === 'string' ? item : item.testName;
                    const name = cleanInvestigationName(rawName);
                    return (
                      <div
                        key={idx}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10.5px] sm:text-xs flex items-center gap-1.5"
                      >
                        <span className="text-emerald-700 font-extrabold">✓</span>
                        <span className="text-slate-900 font-bold">{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= 5. PATHYA - APATHYA & VIHARA ================= */}
            <div className="mb-4 space-y-1.5 font-sans">
              <h4 className="text-[10.5px] sm:text-xs font-black text-slate-800 uppercase tracking-wider pb-1 border-b border-slate-200">
                5. Dietary Rules &amp; Lifestyle Regimen (Pathya - Apathya &amp; Vihara)
              </h4>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs">
                {/* Pathya */}
                <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-800 uppercase block mb-0.5">
                    ✓ Pathya (Take)
                  </span>
                  <ul className="text-[9.5px] sm:text-[10.5px] space-y-0.5 text-slate-700 list-disc pl-3">
                    {result.ayurvedicAnalysis.pathyaApathya.pathyaAhara
                      .slice(0, 4)
                      .map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                  </ul>
                </div>

                {/* Apathya */}
                <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-200">
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-rose-800 uppercase block mb-0.5">
                    ✕ Apathya (Avoid)
                  </span>
                  <ul className="text-[9.5px] sm:text-[10.5px] space-y-0.5 text-slate-700 list-disc pl-3">
                    {result.ayurvedicAnalysis.pathyaApathya.apathyaAhara
                      .slice(0, 4)
                      .map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                  </ul>
                </div>

                {/* Vihara */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-700 uppercase block mb-0.5">
                    🧘 Vihara (Habits)
                  </span>
                  <ul className="text-[9.5px] sm:text-[10.5px] space-y-0.5 text-slate-700 list-disc pl-3">
                    {result.ayurvedicAnalysis.pathyaApathya.viharaRules
                      .slice(0, 4)
                      .map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* PRESCRIPTION FOOTER SIGNATURE & DISCLAIMER */}
            <div className="mt-4 pt-3 border-t-2 border-slate-200 font-sans">
              <div className="flex items-end justify-between gap-3">
                <div className="max-w-md">
                  <p className="text-[9px] sm:text-[9.5px] text-slate-500 leading-tight">
                    <strong>Clinical Note:</strong> Follow regular follow-up in 14 days or as advised.
                  </p>
                  <p className="text-[8.5px] sm:text-[9px] text-slate-400 mt-1 font-mono leading-tight">
                    Note: this is computer generated suggestion and not prescription please consult to your nearest doctor before taking these medications.
                  </p>
                </div>

                {/* Signature Stamp */}
                <div className="text-right space-y-0.5 shrink-0">
                  <div className="w-28 sm:w-36 h-6 sm:h-8 border-b border-dashed border-slate-400 ml-auto" />
                  <p className="font-extrabold text-[11px] sm:text-xs text-slate-900">
                    Dr. Ravi Shankar Kumar
                  </p>
                  <p className="text-[9px] sm:text-[9.5px] font-semibold text-emerald-800">
                    BAMS (U.A.U, U.K)
                  </p>
                  <p className="text-[8px] sm:text-[8.5px] text-slate-500">
                    Ayurveez Healthcare, Gaya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
