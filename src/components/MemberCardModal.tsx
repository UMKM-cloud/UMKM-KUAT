import React, { useState } from 'react';
import { Member } from '../types';
import { OFFICIAL_LOGO_URL } from './UmkmKuatLogo';
import {
  Printer,
  X,
  CreditCard,
  Download,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MemberCardModalProps {
  member: Member;
  onClose: () => void;
}

export const MemberCardModal: React.FC<MemberCardModalProps> = ({ member, onClose }) => {
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');

  // Compute Valid Thru (3 years from joinDate or today)
  const computeValidThru = () => {
    try {
      const baseDate = member.joinDate ? new Date(member.joinDate) : new Date();
      baseDate.setFullYear(baseDate.getFullYear() + 3);
      const day = String(baseDate.getDate()).padStart(2, '0');
      const month = String(baseDate.getMonth() + 1).padStart(2, '0');
      const year = baseDate.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return '26-10-2029';
    }
  };

  const validThru = computeValidThru();

  // Printable function using isolated iframe for 100% reliable printing/PDF generation
  const handlePrintKTA = () => {
    const printArea = document.getElementById('kta-cards-container');
    if (!printArea) {
      window.print();
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>KTA UMKM KUAT - ${member.memberNumber} - ${member.fullName}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            }
            body {
              background: #ffffff;
              color: #000000;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 25px;
              padding: 20px;
            }
            .kta-card {
              width: 480px;
              height: 300px;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              border: 1px solid #c2d4ec;
              position: relative;
              background: #ffffff;
              page-break-inside: avoid;
            }
            .header-bar {
              background: #143872;
              height: 68px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              padding-right: 20px;
            }
            .header-text {
              text-align: right;
              color: #ffffff;
            }
            .header-title-1 {
              font-size: 19px;
              font-weight: 800;
              letter-spacing: 0.5px;
            }
            .header-title-2 {
              font-size: 19px;
              font-weight: 800;
              letter-spacing: 0.5px;
            }
            .logo-circle {
              position: absolute;
              left: 20px;
              top: 8px;
              width: 82px;
              height: 82px;
              border-radius: 50%;
              background: #ffffff;
              border: 3.5px solid #143872;
              overflow: hidden;
              box-shadow: 0 3px 8px rgba(0,0,0,0.2);
              z-index: 10;
            }
            .logo-circle img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .stripe-line {
              height: 4px;
              background: #143872;
              border-top: 1.5px solid #ffffff;
            }
            .card-body {
              display: flex;
              padding: 16px 20px;
              gap: 16px;
              height: calc(100% - 68px - 4px - 14px);
              align-items: center;
              background: linear-gradient(135deg, #ffffff 60%, #edf4fc 100%);
            }
            .photo-box {
              width: 120px;
              height: 160px;
              border-radius: 14px;
              background: #d4e5f7;
              border: 2px solid #143872;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              font-weight: 800;
              font-size: 13px;
              color: #143872;
              overflow: hidden;
              flex-shrink: 0;
            }
            .photo-box img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .info-table {
              flex: 1;
              font-size: 13px;
              line-height: 1.55;
              color: #0f172a;
              font-weight: 600;
            }
            .info-row {
              display: flex;
              margin-bottom: 3px;
            }
            .info-label {
              width: 95px;
              font-weight: 700;
              color: #0f172a;
            }
            .info-colon {
              width: 12px;
              font-weight: 700;
            }
            .info-val {
              flex: 1;
              font-weight: 700;
              color: #000000;
            }
            .rules-list {
              font-size: 11px;
              line-height: 1.45;
              color: #1e293b;
              font-weight: 600;
              padding-left: 14px;
            }
            .rules-list li {
              margin-bottom: 5px;
            }
            .ttd-box {
              width: 150px;
              height: 160px;
              border-radius: 14px;
              background: #d4e5f7;
              border: 2px solid #143872;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding: 8px 6px;
              text-align: center;
              flex-shrink: 0;
            }
            .ttd-title {
              font-size: 10.5px;
              font-weight: 800;
              color: #143872;
              line-height: 1.2;
            }
            .stamp-area {
              position: relative;
              width: 60px;
              height: 60px;
              margin: 2px auto;
            }
            .stamp-circle {
              width: 58px;
              height: 58px;
              border: 2px dashed #1e40af;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #1e40af;
              font-size: 8px;
              font-weight: 800;
              text-align: center;
              transform: rotate(-8deg);
              opacity: 0.9;
            }
            .ttd-name {
              font-size: 10.5px;
              font-weight: 800;
              color: #0f172a;
              border-top: 1.5px solid #143872;
              width: 100%;
              padding-top: 4px;
            }
            .bottom-bar {
              height: 14px;
              background: #143872;
            }
            .print-note {
              font-size: 12px;
              color: #64748b;
              text-align: center;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <h2 style="font-size: 16px; color: #143872; font-weight: 800; text-align: center; margin-bottom: 5px;">
            KARTU TANDA ANGGOTA (KTA) RESMI FORUM UMKM KECAMATAN TANGERANG
          </h2>
          <div class="print-note">Ukuran standar kartu ID (PVC Card). Siap dipotong dan dilaminasi bolak-balik.</div>
          ${printArea.innerHTML}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-6 flex flex-col max-h-[94vh]">
        {/* Top Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Kartu Anggota UMK Kecamatan Tangerang
              </h3>
              <p className="text-[11px] text-teal-300 font-mono">
                {member.memberNumber} &bull; {member.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintKTA}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF KTA</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSide('both')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                activeSide === 'both' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Depan & Belakang
            </button>
            <button
              onClick={() => setActiveSide('front')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                activeSide === 'front' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hanya Depan
            </button>
            <button
              onClick={() => setActiveSide('back')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                activeSide === 'back' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hanya Belakang
            </button>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline font-medium">
            Desain Resmi Forum UMKM KUAT Kecamatan Tangerang
          </span>
        </div>

        {/* Card Canvas Scroll Area */}
        <div className="p-6 sm:p-10 bg-slate-200/70 overflow-y-auto flex flex-col items-center justify-center space-y-8">
          <div id="kta-cards-container" className="flex flex-col items-center gap-8 w-full">
            {/* 1. FRONT CARD (TAMPILAN DEPAN) */}
            {(activeSide === 'both' || activeSide === 'front') && (
              <div className="w-full max-w-[480px] h-[300px] bg-white rounded-[22px] overflow-hidden shadow-2xl border border-slate-300 relative flex flex-col justify-between select-none">
                {/* Header Blue Bar */}
                <div className="bg-[#143872] h-[68px] relative flex items-center justify-end px-5 text-white">
                  {/* Round Official Logo on Left */}
                  <div className="absolute left-[20px] top-[10px] w-[82px] h-[82px] rounded-full bg-white border-[3.5px] border-[#143872] overflow-hidden shadow-lg z-20 flex items-center justify-center">
                    <img
                      src={OFFICIAL_LOGO_URL}
                      alt="Logo UMKM KUAT"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Header Title */}
                  <div className="text-right leading-tight">
                    <div className="font-extrabold text-[17px] tracking-wide text-white">
                      KARTU ANGGOTA UMK
                    </div>
                    <div className="font-extrabold text-[17px] tracking-wide text-white">
                      KECAMATAN TANGERANG
                    </div>
                  </div>
                </div>

                {/* Separator Stripe Line */}
                <div className="h-[4px] bg-[#143872] border-t-[1.5px] border-white"></div>

                {/* Card Body */}
                <div className="flex-1 flex items-center px-5 py-3 gap-4 bg-gradient-to-br from-white via-white to-blue-50/40">
                  {/* Photo Frame (3x4 cm ratio) */}
                  <div className="w-[115px] h-[155px] rounded-[14px] bg-[#D4E5F7] border-2 border-[#143872] overflow-hidden flex flex-col items-center justify-center text-center flex-shrink-0 shadow-xs">
                    {member.memberPhoto ? (
                      <img
                        src={member.memberPhoto}
                        alt={member.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-2 text-[#143872] font-black leading-tight">
                        <div className="text-[13px] uppercase">FOTO</div>
                        <div className="text-[13px] uppercase">ANGGOTA</div>
                        <div className="text-[12px] font-bold mt-1 text-slate-700">3x4 CM</div>
                      </div>
                    )}
                  </div>

                  {/* Info Table */}
                  <div className="flex-1 text-[12.5px] text-slate-900 font-semibold space-y-1.5 leading-tight">
                    <div className="flex items-start">
                      <span className="w-[85px] text-slate-800 font-bold flex-shrink-0">No. Anggota</span>
                      <span className="w-[12px] font-bold">:</span>
                      <span className="flex-1 font-bold text-slate-950 font-mono text-[12px]">
                        {member.memberNumber}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-[85px] text-slate-800 font-bold flex-shrink-0">Nama Pemilik</span>
                      <span className="w-[12px] font-bold">:</span>
                      <span className="flex-1 font-bold text-slate-950 line-clamp-1">
                        {member.fullName}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-[85px] text-slate-800 font-bold flex-shrink-0">Nama Usaha</span>
                      <span className="w-[12px] font-bold">:</span>
                      <span className="flex-1 font-bold text-[#143872] line-clamp-1">
                        {member.businessName}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-[85px] text-slate-800 font-bold flex-shrink-0">NIB</span>
                      <span className="w-[12px] font-bold">:</span>
                      <span className="flex-1 font-bold text-slate-900 font-mono text-[12px] line-clamp-1">
                        {member.legalities && member.legalities.includes('NIB')
                          ? member.legalities
                          : member.nik || 'Terverifikasi OSS'}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-[85px] text-slate-800 font-bold flex-shrink-0">Jenis Usaha</span>
                      <span className="w-[12px] font-bold">:</span>
                      <span className="flex-1 font-bold text-slate-950">
                        {member.category}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-[85px] text-slate-800 font-bold flex-shrink-0">Valid Thru</span>
                      <span className="w-[12px] font-bold">:</span>
                      <span className="flex-1 font-bold text-slate-950 font-mono">
                        {validThru}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="h-[14px] bg-[#143872] w-full"></div>
              </div>
            )}

            {/* 2. BACK CARD (TAMPILAN BELAKANG) */}
            {(activeSide === 'both' || activeSide === 'back') && (
              <div className="w-full max-w-[480px] h-[300px] bg-white rounded-[22px] overflow-hidden shadow-2xl border border-slate-300 relative flex flex-col justify-between select-none">
                {/* Header Blue Bar */}
                <div className="bg-[#143872] h-[68px] relative flex items-center justify-end px-5 text-white">
                  {/* Round Official Logo on Left */}
                  <div className="absolute left-[20px] top-[10px] w-[82px] h-[82px] rounded-full bg-white border-[3.5px] border-[#143872] overflow-hidden shadow-lg z-20 flex items-center justify-center">
                    <img
                      src={OFFICIAL_LOGO_URL}
                      alt="Logo UMKM KUAT"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Header Title */}
                  <div className="text-right leading-tight">
                    <div className="font-extrabold text-[17px] tracking-wide text-white">
                      KARTU ANGGOTA UMK
                    </div>
                    <div className="font-extrabold text-[17px] tracking-wide text-white">
                      KECAMATAN TANGERANG
                    </div>
                  </div>
                </div>

                {/* Separator Stripe Line */}
                <div className="h-[4px] bg-[#143872] border-t-[1.5px] border-white"></div>

                {/* Card Body Back */}
                <div className="flex-1 flex items-center px-5 py-3 gap-4 bg-gradient-to-br from-white via-white to-blue-50/40">
                  {/* Signature and Stamp Box */}
                  <div className="w-[150px] h-[155px] rounded-[14px] bg-[#D4E5F7] border-2 border-[#143872] flex flex-col items-center justify-between p-2 text-center flex-shrink-0 shadow-xs">
                    <div className="text-[11px] font-black text-[#143872] leading-tight">
                      TTD & CAP<br />KETUA FORUM
                    </div>

                    {/* Stamp and digital sign mark */}
                    <div className="relative w-16 h-12 flex items-center justify-center">
                      {/* Stamp badge */}
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-blue-700 flex flex-col items-center justify-center text-[7.5px] font-black text-blue-800 rotate-[-8deg] opacity-80 leading-none">
                        <span>FORUM UMKM</span>
                        <span className="text-[9px] text-red-600 font-bold my-0.5">KUAT</span>
                        <span>KEC. TANGERANG</span>
                      </div>
                    </div>

                    {/* Official Name */}
                    <div className="w-full border-t-[1.5px] border-[#143872] pt-1">
                      <div className="font-black text-[11px] text-slate-900 tracking-wider">
                        EMUS MUSLIHANT
                      </div>
                    </div>
                  </div>

                  {/* Rules & Information */}
                  <div className="flex-1 text-[11px] text-slate-800 leading-snug font-medium pl-1">
                    <ol className="list-decimal pl-4 space-y-1.5">
                      <li>Kartu tanda anggota resmi Forum UMKM Kecamatan Tangerang.</li>
                      <li>Memperkuat identitas nama usaha binaan Kecamatan Tangerang.</li>
                      <li>Hak akses program pembinaan, pelatihan, perizinan, & bazar.</li>
                      <li>Kartu ini berlaku sah dan tidak dapat dipindahtangankan.</li>
                      <li>Menjunjung tinggi etika usaha & integritas UMKM Tangerang.</li>
                    </ol>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="h-[14px] bg-[#143872] w-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Format kartu ID Card standar (PVC / Cetak Kertas Foto)</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handlePrintKTA}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Cetak ke PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
