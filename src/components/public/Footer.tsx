import React from 'react';
import { UmkmKuatLogo } from '../UmkmKuatLogo';
import { KELURAHAN_LIST } from '../../types';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openLoginModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <UmkmKuatLogo size="lg" variant="full" theme="light" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Wadah kolaborasi, pembinaan, legalitas usaha, dan pemasaran produk Usaha Mikro, Kecil, dan Menengah binaan Kecamatan Tangerang, Kota Tangerang.
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-teal-300">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Mitra Resmi Kecamatan Tangerang</span>
            </div>
          </div>

          {/* Col 2: 8 Kelurahan Binaan */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              8 Kelurahan Binaan
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {KELURAHAN_LIST.map((kel) => (
                <button
                  key={kel}
                  onClick={() => {
                    setCurrentTab('direktori');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left text-slate-400 hover:text-teal-300 transition-colors py-1 flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-teal-400"></span>
                  <span>{kel}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-3 italic">
              Menjangkau ribuan pelaku usaha lokal se-Kecamatan Tangerang.
            </p>
          </div>

          {/* Col 3: Navigasi Cepat */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Layanan Publik
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('profil');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Profil & Struktur Forum
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('direktori');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Katalog Direktori UMKM
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('event');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Jadwal Event & Pelatihan
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('berita');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Kabar Berita & Edukasi Usaha
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('kontak');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Pusat Bantuan & Pengaduan
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={openLoginModal}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5"
                >
                  <span>Portal Login Pengurus / Admin</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Sekretariat & Kontak */}
          <div className="space-y-3.5 text-sm">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Sekretariat Forum
            </h4>
            <div className="flex items-start gap-2.5 text-slate-400">
              <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
              <span>Gedung Kantor Kecamatan Tangerang, Jl. Daan Mogot No. 5, Kota Tangerang, Banten 15111</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>(021) 5523456 / WA 0812-8923-4111</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>umkmkectangerang@gmail.com</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400 text-xs">
              <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Senin - Jumat: 08.00 - 16.00 WIB</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Forum UMKM KUAT Kecamatan Tangerang. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Membangun UMKM Berdaya Saing &</span>
            <span className="text-orange-400 font-bold">KUAT</span>
            <span>untuk Tangerang Gemilang</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
