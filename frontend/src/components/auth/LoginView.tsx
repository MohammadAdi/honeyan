import React, {useState} from 'react';
import {Building2, Eye, EyeOff, LockKeyhole, Mail} from 'lucide-react';
import {ApiError} from '../../auth/authClient';
import {useAuth} from '../../auth/AuthContext';

export function LoginView() {
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        setError('Email atau password tidak valid.');
      } else if (cause instanceof ApiError && cause.status === 429) {
        setError('Terlalu banyak percobaan. Coba lagi sebentar.');
      } else {
        setError('Tidak dapat terhubung ke layanan Honey-an.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F1F5F9] px-4 py-10 dark:bg-[#1A222C]">
      <section className="w-full max-w-md rounded-sm border border-[#E2E8F0] bg-white p-7 shadow-sm dark:border-[#2E3A47] dark:bg-[#24303F] sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#3C50E0] text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1C2434] dark:text-white">Honey-an</h1>
            <p className="text-xs text-[#64748B] dark:text-[#8A99AD]">Internal property backoffice</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-[#1C2434] dark:text-white">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-sm text-[#1C2434] outline-hidden focus:border-[#3C50E0] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-[#1C2434] dark:text-white">Password</label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-10 text-sm text-[#1C2434] outline-hidden focus:border-[#3C50E0] dark:border-[#2E3A47] dark:bg-[#1A222C] dark:text-white" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p role="alert" className="rounded-sm border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-400">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full rounded-sm bg-[#3C50E0] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2E40C7] disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
