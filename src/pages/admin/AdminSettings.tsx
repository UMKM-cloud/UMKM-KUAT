import React, { useState, useEffect, useRef } from 'react';
import { ActivityLog, UserRole, OrgStructureMember } from '../../types';
import { dbService, INITIAL_ORG_STRUCTURE } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  ShieldCheck,
  UserCheck,
  Database,
  Download,
  Upload,
  RefreshCw,
  Clock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Users2,
  Edit3,
  Plus,
  Trash2,
  Camera,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Award,
} from 'lucide-react';

interface AdminSettingsProps {
  logs: ActivityLog[];
  onRefreshAll: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ logs, onRefreshAll }) => {
  const { profile, simulateRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'struktur' | 'rbac' | 'database' | 'logs'>('struktur');

  // Backup & restore state
  const [backupSuccess, setBackupSuccess] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [clearStatus, setClearStatus] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  // Organization Structure State
  const [orgList, setOrgList] = useState<OrgStructureMember[]>(INITIAL_ORG_STRUCTURE);
  const [editingMember, setEditingMember] = useState<OrgStructureMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isSavingOrg, setIsSavingOrg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load org structure
  useEffect(() => {
    loadOrgStructure();
  }, []);

  const loadOrgStructure = async () => {
    try {
      const data = await dbService.getOrgStructure();
      if (data && data.length > 0) {
        setOrgList(data);
      }
    } catch (err) {
      console.warn('Failed loading org structure:', err);
    }
  };

  // Clear all membership and financial data
  const handleClearAllData = async () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin MENGOSONGKAN SELURUH DATA KEANGGOTAAN dan DATA KEUANGAN? Semua data anggota UMKM dan transaksi kas akan dihapus bersih.')) {
      setIsClearing(true);
      try {
        await dbService.clearAllMembersAndTransactions();
        await dbService.addLog({
          userId: profile?.uid || 'usr-admin',
          userName: profile?.displayName || 'Admin',
          action: 'Kosongkan Data Sistem',
          target: 'Keanggotaan & Keuangan',
          details: 'Mengosongkan semua data anggota dan riwayat transaksi kas',
        });
        onRefreshAll();
        setClearStatus('Seluruh data keanggotaan dan keuangan berhasil dikosongkan!');
        setTimeout(() => setClearStatus(null), 5000);
      } catch (e: any) {
        alert('Gagal mengosongkan data: ' + (e?.message || 'Terjadi kesalahan sistem'));
      } finally {
        setIsClearing(false);
      }
    }
  };

  // RBAC descriptions
  const rolesInfo: Array<{
    role: UserRole;
    name: string;
    description: string;
    permissions: string[];
  }> = [
    {
      role: 'super_admin',
      name: 'Super Admin',
      description: 'Pemegang kewenangan tertinggi sistem Forum UMKM KUAT.',
      permissions: ['Akses Semua Modul', 'Kelola Pengguna & Hak Akses', 'Buku Kas & Keuangan', 'Cadangkan & Pulihkan Database', 'Edit Struktur Organisasi'],
    },
    {
      role: 'pengurus_kecamatan',
      name: 'Pengurus Kecamatan',
      description: 'Unsur pimpinan eksekutif Forum tingkat Kecamatan Tangerang.',
      permissions: ['Dashboard Eksekutif', 'Melihat & Verifikasi Keanggotaan', 'Laporan Lengkap & Statistik', 'Publikasi Event Resmi'],
    },
    {
      role: 'admin_keanggotaan',
      name: 'Admin Keanggotaan',
      description: 'Petugas pendataan dan kurasi legalitas pelaku usaha UMKM.',
      permissions: ['Input & Edit Anggota Baru', 'Verifikasi Dokumen NIB & Halal', 'Kelola Direktori Publik', 'Ekspor Data Keanggotaan'],
    },
    {
      role: 'bendahara',
      name: 'Bendahara',
      description: 'Pengelola arus kas keuangan, iuran anggota, dan sponsor.',
      permissions: ['Pencatatan Pemasukan & Pengeluaran', 'Kelola Buku Kas Umum (BKU)', 'Rekap Iuran Bulanan Anggota', 'Ekspor Laporan Keuangan'],
    },
    {
      role: 'admin_informasi',
      name: 'Admin Informasi & Publikasi',
      description: 'Pengelola konten berita, edukasi wirausaha, dan agenda bazar.',
      permissions: ['Buat & Publikasikan Agenda Kegiatan', 'Tulis & Sunting Kabar Berita', 'Kelola Dokumentasi Bazar', 'Arsip Konten'],
    },
    {
      role: 'pengurus_kelurahan',
      name: 'Pengurus Kelurahan',
      description: 'Koordinator UMKM di salah satu dari 8 kelurahan.',
      permissions: ['Mendaftarkan UMKM di Wilayah Kelurahannya', 'Melihat Status Binaan Lokal', 'Akses Data Publik'],
    },
  ];

  // Open modal to add or edit
  const handleOpenEdit = (member?: OrgStructureMember) => {
    if (member) {
      setEditingMember({ ...member });
    } else {
      setEditingMember({
        id: 'org-' + Date.now(),
        role: 'Pengurus',
        name: '',
        title: '',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        order: orgList.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (editingMember && event.target?.result) {
        setEditingMember({
          ...editingMember,
          image: event.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Org Member
  const handleSaveMember = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!editingMember) return;

    const trimmedName = (editingMember.name || '').trim();
    const trimmedRole = (editingMember.role || '').trim();

    if (!trimmedName) {
      alert('Mohon isi nama lengkap pengurus.');
      return;
    }
    if (!trimmedRole) {
      alert('Mohon isi jabatan atau posisi pengurus.');
      return;
    }

    setIsSavingOrg(true);
    try {
      const memberToSave: OrgStructureMember = {
        ...editingMember,
        name: trimmedName,
        role: trimmedRole,
        title: (editingMember.title || '').trim(),
        image: (editingMember.image || '').trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        order: Number(editingMember.order) || orgList.length + 1,
      };

      await dbService.saveOrgStructureMember(memberToSave);
      await dbService.addLog({
        userId: profile?.uid || 'usr-admin',
        userName: profile?.displayName || 'Admin',
        action: 'Perbarui Struktur Organisasi',
        target: memberToSave.name,
        details: `${memberToSave.role}: ${memberToSave.name} (${memberToSave.title})`,
      });

      await loadOrgStructure();
      setIsModalOpen(false);
      setEditingMember(null);
      onRefreshAll();
      setSaveSuccess(`Data pengurus "${memberToSave.name}" (${memberToSave.role}) berhasil disimpan!`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      console.error('Error saving org member:', err);
      alert('Gagal menyimpan pengurus: ' + (err?.message || 'Terjadi kesalahan sistem'));
    } finally {
      setIsSavingOrg(false);
    }
  };

  // Delete Org Member
  const handleDeleteMember = async (member: OrgStructureMember) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${member.name}" (${member.role}) dari struktur kepengurusan?`)) {
      await dbService.deleteOrgStructureMember(member.id);
      await dbService.addLog({
        userId: profile?.uid || 'usr-admin',
        userName: profile?.displayName || 'Admin',
        action: 'Hapus Pengurus Organisasi',
        target: member.name,
        details: `Menghapus ${member.role}: ${member.name}`,
      });
      await loadOrgStructure();
      onRefreshAll();
    }
  };

  // Reset to default 6 members
  const handleResetOrgStructure = async () => {
    if (confirm('Kembalikan struktur kepengurusan ke susunan resmi 6 pimpinan Forum UMKM KUAT?')) {
      for (const m of INITIAL_ORG_STRUCTURE) {
        await dbService.saveOrgStructureMember(m);
      }
      await loadOrgStructure();
      onRefreshAll();
      alert('Struktur organisasi berhasil dikembalikan ke susunan resmi!');
    }
  };

  // Backup data
  const handleBackup = async () => {
    try {
      const json = await dbService.exportFullBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Backup_UMKM_KUAT_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupSuccess('Pencadangan berhasil diunduh ke perangkat Anda.');
      setTimeout(() => setBackupSuccess(null), 5000);
    } catch (e) {
      alert('Gagal membuat file cadangan.');
    }
  };

  // Restore data from JSON
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const ok = await dbService.importBackup(text);
        if (ok) {
          setRestoreStatus('Data berhasil dipulihkan dari file cadangan.');
          await loadOrgStructure();
          onRefreshAll();
        } else {
          setRestoreStatus('Format file tidak valid.');
        }
      } catch (err) {
        setRestoreStatus('Gagal membaca file.');
      }
      setTimeout(() => setRestoreStatus(null), 5000);
    };
    reader.readAsText(file);
  };

  // Reset to demo data
  const handleResetDemo = () => {
    if (confirm('Apakah Anda yakin ingin memuat ulang data percontohan (Demo Data) Forum UMKM KUAT?')) {
      dbService.resetDemoData();
      loadOrgStructure();
      onRefreshAll();
      alert('Data demo berhasil dimuat ulang!');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengaturan Sistem & Struktur Organisasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola struktur kepengurusan resmi, peran RBAC pengurus, pencadangan basis data, dan audit log.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('struktur')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'struktur'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>Struktur Organisasi</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
            activeTab === 'struktur' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {orgList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'rbac'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Hak Akses Peran (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'database'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Cadangan & Pulihkan Database</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Trail Log</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
            activeTab === 'logs' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {logs.length}
          </span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
          <span className="font-semibold">{saveSuccess}</span>
        </div>
      )}

      {/* TAB 1: STRUKTUR ORGANISASI */}
      {activeTab === 'struktur' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                  Kepengurusan Resmi
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  Daftar Pimpinan & Pengurus Forum UMKM KUAT
                </h3>
                <p className="text-xs text-slate-500">
                  Data ini ditampilkan langsung di Halaman Profil Organisasi publik. Anda dapat memperbarui foto, nama, jabatan, serta urutan kepengurusan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetOrgStructure}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Kembalikan ke struktur default 6 orang"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Resmi</span>
                </button>
                <button
                  onClick={() => handleOpenEdit()}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pengurus</span>
                </button>
              </div>
            </div>

            {/* List of structure members */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orgList.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={m.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={m.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-teal-500/30 shadow-xs"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <span className="absolute -top-2 -left-2 bg-slate-900 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {m.order}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="inline-block bg-teal-100 text-teal-800 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {m.role}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm truncate" title={m.name}>
                        {m.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2" title={m.title}>
                        {m.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-slate-200/80">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    {orgList.length > 1 && (
                      <button
                        onClick={() => handleDeleteMember(m)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Pengurus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HAK AKSES PERAN (RBAC) */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                Role-Based Access Control (RBAC)
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                Daftar 6 Peran & Hak Akses Pengurus
              </h3>
              <p className="text-xs text-slate-500">
                Hak akses diberlakukan secara ketat pada basis data dan antarmuka dashboard admin.
              </p>
            </div>
            <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-xl font-bold text-slate-700">
              Peran Anda Sekarang:{' '}
              <span className="text-teal-700 uppercase">{profile?.role.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rolesInfo.map((r) => {
              const isCurrent = profile?.role === r.role;
              return (
                <div
                  key={r.role}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-teal-500 bg-teal-50/30 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-sm">{r.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] bg-teal-600 text-white font-bold px-2 py-0.5 rounded">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{r.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Kewenangan:
                    </span>
                    {r.permissions.map((perm, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80">
                    <button
                      onClick={() => simulateRole(r.role)}
                      className="w-full text-center py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                    >
                      Beralih ke Peran Ini
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CADANGAN & PEMULIHAN */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded">
              Keamanan Data & Pemulihan
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Pencadangan & Pemulihan Database (Backup & Restore)
            </h3>
            <p className="text-xs text-slate-500">
              Simpan seluruh data keanggotaan, riwayat keuangan, event, berita, dan struktur organisasi dalam bentuk file JSON ke penyimpanan lokal Anda.
            </p>
          </div>

          {backupSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{backupSuccess}</span>
            </div>
          )}

          {restoreStatus && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{restoreStatus}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Backup Button */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Cadangkan Data (Backup)</h4>
                <p className="text-xs text-slate-500">
                  Unduh file cadangan lengkap database JSON ke komputer atau ponsel Anda.
                </p>
              </div>
              <button
                onClick={handleBackup}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Cadangan JSON</span>
              </button>
            </div>

            {/* Restore Button */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Pulihkan Data (Restore)</h4>
                <p className="text-xs text-slate-500">
                  Pulihkan data dari file cadangan JSON yang pernah Anda simpan sebelumnya.
                </p>
              </div>
              <label className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Unggah File Cadangan</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset Demo Button */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-2">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Muat Data Demo</h4>
                <p className="text-xs text-slate-500">
                  Kembalikan data percontohan lengkap Forum UMKM KUAT untuk 8 kelurahan.
                </p>
              </div>
              <button
                onClick={handleResetDemo}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-orange-700 border border-orange-300 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset ke Data Demo</span>
              </button>
            </div>
          </div>

          {/* Section: Kosongkan Data Keanggotaan & Keuangan */}
          <div className="p-5 rounded-2xl border border-red-200 bg-red-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-red-900 text-sm flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>Kosongkan Seluruh Data Keanggotaan & Keuangan</span>
                </h4>
                <p className="text-xs text-red-700 mt-1">
                  Menghapus bersih seluruh data anggota UMKM dan transaksi buku kas agar basis data kosong dan siap digunakan dari awal.
                </p>
              </div>
              <button
                disabled={isClearing}
                onClick={handleClearAllData}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs"
              >
                {isClearing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{isClearing ? 'Mengosongkan...' : 'Kosongkan Data Sekarang'}</span>
              </button>
            </div>
            {clearStatus && (
              <div className="p-2.5 bg-green-100 border border-green-300 text-green-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>{clearStatus}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <h3 className="font-black text-slate-900 text-lg">
                Audit Trail & Riwayat Aktivitas Sistem
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {logs.length} aktivitas tercatat
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span>{log.userName}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-teal-700 font-semibold">{log.action}</span>
                  </div>
                  <div className="text-xs text-slate-600">{log.details}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Target: {log.target}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('id-ID', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL FORM EDIT / TAMBAH PENGURUS */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-teal-800 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-teal-300" />
                <h3 className="font-black text-base">
                  {editingMember.id.startsWith('org-') && orgList.some(o => o.id === editingMember.id)
                    ? 'Edit Profil Pengurus'
                    : 'Tambah Pengurus Baru'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMember(null);
                }}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveMember} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Photo preview and upload */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="relative">
                  <img
                    src={editingMember.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-teal-600 hover:bg-teal-700 text-white p-1.5 rounded-full shadow-md cursor-pointer"
                    title="Ganti Foto"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  <label className="block font-bold text-slate-800">
                    Foto Pengurus Resmi (3x4 / Persegi)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Foto</span>
                    </button>
                    {editingMember.image && (
                      <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Foto terpasang
                      </span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <p className="text-[10px] text-slate-400">
                    Format: JPG, PNG, WebP (Maks 2 MB).
                  </p>
                </div>
              </div>

              {/* URL Foto (Opsional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Atau Masukkan URL Foto Eksternal (Opsional)
                </label>
                <input
                  type="text"
                  value={editingMember.image?.startsWith('data:') ? '' : (editingMember.image || '')}
                  onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                  placeholder="https://... atau path gambar"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-teal-500 font-mono"
                />
              </div>

              {/* Peran / Jabatan & Urutan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Jabatan / Posisi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.role || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    placeholder="Contoh: Pelindung, Ketua, Bendahara"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Urutan Tampilan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={editingMember.order || 1}
                    onChange={(e) => setEditingMember({ ...editingMember, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-teal-500 text-center font-bold"
                  />
                </div>
              </div>

              {/* Nama Lengkap & Gelar */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Beserta Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="Contoh: Riswan Setyo Kardinto, S.STP"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-teal-500 font-bold"
                />
              </div>

              {/* Keterangan Jabatan / Instansi */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan Jabatan / Instansi
                </label>
                <textarea
                  rows={2}
                  value={editingMember.title || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                  placeholder="Contoh: Camat Kecamatan Tangerang / Ketua Forum UMKM KUAT"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-teal-500 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isSavingOrg}
                  onClick={(e) => handleSaveMember(e)}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  {isSavingOrg ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
