'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Menu, X, PawPrint,
  Heart, Shield, Stethoscope, Syringe, Scissors, Activity, Microscope,
  Star, Send, Check, ArrowRight, MessageCircle,
  Zap, Eye, BedDouble,
} from 'lucide-react'

/* ──────────────────────────── helpers ──────────────────────────── */

function useOnScreen(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useOnScreen()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* ──────────────────────────── data ──────────────────────────── */

const NAV = [
  { label: 'Услуги', id: 'services' },
  { label: 'Врачи', id: 'doctors' },
  { label: 'О клинике', id: 'about' },
  { label: 'Цены', id: 'prices' },
  { label: 'Контакты', id: 'contacts' },
]

const SERVICES = [
  { title: 'УЗИ', price: 'от 3 200 \u20BD', desc: 'Ультразвуковая диагностика на современном оборудовании', icon: Activity, photo: '/photos/DSC_0205.jpg' },
  { title: 'Вакцинация', price: 'от 2 800 \u20BD', desc: 'Комплексная вакцинация кошек и собак', icon: Syringe, photo: '/photos/DSC_0195.jpg' },
  { title: 'Стерилизация / Кастрация', price: 'от 5 000 \u20BD', desc: 'Безопасные операции под наркозом с послеоперационным наблюдением', icon: Scissors, photo: '/photos/DSC_0207.jpg' },
  { title: 'Терапия', price: 'от 1 800 \u20BD', desc: 'Приём терапевта, осмотр, назначение лечения', icon: Stethoscope, photo: '/photos/DSC_0185.jpg' },
  { title: 'Стоматология', price: 'от 3 300 \u20BD', desc: 'Лечение и удаление зубов, ультразвуковая чистка', icon: Star, photo: '/photos/DSC_0192.jpg' },
  { title: 'Хирургия', price: 'от 2 500 \u20BD', desc: 'Плановые и экстренные хирургические вмешательства', icon: Zap, photo: '/photos/DSC_0208.jpg' },
  { title: 'Стационар', price: 'от 2 500 \u20BD', desc: 'Круглосуточное наблюдение и уход за питомцем', icon: BedDouble, photo: '/photos/DSC_0198.jpg' },
  { title: 'Лабораторная диагностика', price: 'от 1 500 \u20BD', desc: 'Анализы крови, мочи и другие исследования', icon: Microscope, photo: '/photos/DSC_0200.jpg' },
]

const DOCTORS = [
  { name: 'Др. Александров Игорь', specialty: 'Терапевт, кардиолог', photo: '/photos/DSC_0190.jpg' },
  { name: 'Др. Воронова Елена', specialty: 'Специалист УЗИ-диагностики', photo: '/photos/DSC_0210.jpg' },
  { name: 'Анна Смирнова', specialty: 'Ветеринарный фельдшер', photo: '/photos/DSC_0220.jpg' },
  { name: 'Др. Медведева Ольга', specialty: 'Хирург, стоматолог', photo: '/photos/DSC_0225.jpg' },
]

const GALLERY_PHOTOS = [
  '/photos/DSC_0230.jpg', '/photos/DSC_0185.jpg', '/photos/DSC_0205.jpg', '/photos/DSC_0210.jpg',
  '/photos/DSC_0220.jpg', '/photos/DSC_0195.jpg', '/photos/DSC_0225.jpg', '/photos/DSC_0234.jpg',
]

const PRICES: { category: string; items: { name: string; price: string }[] }[] = [
  { category: 'Терапия', items: [{ name: 'Первичный приём', price: '1 800 \u20BD' }, { name: 'Повторный приём', price: '1 200 \u20BD' }, { name: 'Консультация', price: '1 000 \u20BD' }] },
  { category: 'Хирургия', items: [{ name: 'Кастрация кота', price: '5 000 \u20BD' }, { name: 'Кастрация кошки', price: '7 000 \u20BD' }, { name: 'Стерилизация собаки', price: '10 000 \u20BD' }] },
  { category: 'Диагностика', items: [{ name: 'УЗИ', price: '3 200 \u20BD' }, { name: 'Рентген', price: '2 800 \u20BD' }, { name: 'ОАК', price: '1 200 \u20BD' }, { name: 'БАК', price: '1 800 \u20BD' }] },
  { category: 'Вакцинация', items: [{ name: 'Комплексная вакцинация', price: '2 800 \u20BD' }, { name: 'Прививка от бешенства', price: '1 500 \u20BD' }] },
  { category: 'Стоматология', items: [{ name: 'Осмотр ротовой полости', price: '1 500 \u20BD' }, { name: 'Удаление зуба', price: '3 300 \u20BD' }, { name: 'Ультразвуковая чистка', price: '5 000 \u20BD' }] },
]

/* ──────────────────────────── PAGE ──────────────────────────── */

export default function HomePage() {
  /* ── state ── */
  const [mobileMenu, setMobileMenu] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [openPrice, setOpenPrice] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)

  /* appointment form */
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', comment: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  /* close mobile menu on nav */
  const nav = useCallback((id: string) => { setMobileMenu(false); setTimeout(() => scrollTo(id), 100) }, [])

  /* form submit */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setFormStatus('sending')
    try {
      const res = await fetch('/api/appointment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      setFormStatus('sent')
    } catch {
      setFormStatus('error')
    }
  }

  /* ── render ── */
  return (
    <div className="min-h-screen bg-white text-gray-800" style={{ scrollBehavior: 'smooth' }}>

      {/* ====== HEADER ====== */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-transparent'}`}>
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 lg:py-4">
          {/* logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 group">
            <PawPrint className={`w-8 h-8 transition-colors ${scrolled ? 'text-[#1e3a5f]' : 'text-white'} group-hover:text-[#4ade80]`} />
            <span className={`text-xl font-bold tracking-wide transition-colors ${scrolled ? 'text-[#1e3a5f]' : 'text-white'}`}>
              БЕРЛОГА
            </span>
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#4ade80] text-[#1e3a5f] leading-none">24/7</span>
          </button>

          {/* desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className={`text-sm font-medium transition-colors hover:text-[#4ade80] ${scrolled ? 'text-gray-700' : 'text-white/90'}`}>
                {n.label}
              </button>
            ))}
          </nav>

          {/* phone + cta (desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+74997573447" className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${scrolled ? 'text-[#1e3a5f]' : 'text-white'}`}>
              <Phone className="w-4 h-4" /> +7 (499) 757-34-47
            </a>
            <button onClick={() => scrollTo('appointment')} className="px-5 py-2.5 rounded-full bg-[#4ade80] text-[#1e3a5f] text-sm font-bold hover:bg-[#22c55e] transition-colors shadow-lg shadow-[#4ade80]/30">
              Записаться
            </button>
          </div>

          {/* hamburger */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden">
            {mobileMenu
              ? <X className={`w-7 h-7 ${scrolled ? 'text-[#1e3a5f]' : 'text-white'}`} />
              : <Menu className={`w-7 h-7 ${scrolled ? 'text-[#1e3a5f]' : 'text-white'}`} />
            }
          </button>
        </div>

        {/* mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-white ${mobileMenu ? 'max-h-[500px] shadow-xl' : 'max-h-0'}`}>
          <div className="px-4 py-4 flex flex-col gap-3">
            {NAV.map(n => (
              <button key={n.id} onClick={() => nav(n.id)} className="text-left text-gray-700 font-medium py-2 border-b border-gray-100 hover:text-[#1e3a5f]">
                {n.label}
              </button>
            ))}
            <a href="tel:+74997573447" className="flex items-center gap-2 py-2 text-[#1e3a5f] font-semibold">
              <Phone className="w-4 h-4" /> +7 (499) 757-34-47
            </a>
            <button onClick={() => nav('appointment')} className="mt-1 w-full py-3 rounded-full bg-[#4ade80] text-[#1e3a5f] font-bold">
              Записаться на приём
            </button>
          </div>
        </div>
      </header>

      {/* ====== HERO ====== */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image src="/photos/DSC_0210.jpg" alt="Ветеринарная клиника Берлога" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f]/70 via-[#1e3a5f]/50 to-[#1e3a5f]/80" />

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Ветеринарная клиника<br /><span className="text-[#4ade80]">Берлога</span>
            </h1>
          </FadeIn>
          <FadeIn delay={150}>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto">
              Круглосуточная ветеринарная помощь в Москве. Современное оборудование, опытные врачи, забота о каждом пациенте.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollTo('appointment')} className="px-8 py-4 rounded-full bg-[#4ade80] text-[#1e3a5f] font-bold text-lg hover:bg-[#22c55e] transition-all shadow-xl shadow-[#4ade80]/30 hover:scale-105">
                Записаться на приём
              </button>
              <button onClick={() => scrollTo('services')} className="px-8 py-4 rounded-full border-2 border-white/60 text-white font-bold text-lg hover:bg-white/10 transition-all hover:scale-105">
                Наши услуги
              </button>
            </div>
          </FadeIn>
        </div>

        {/* stats strip */}
        <div className="absolute bottom-0 inset-x-0 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="max-w-5xl mx-auto grid grid-cols-3 py-5 divide-x divide-white/20">
            {[
              { num: '9+', label: 'лет опыта' },
              { num: '22', label: 'специалиста' },
              { num: '24/7', label: 'без выходных' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#4ade80]">{s.num}</div>
                <div className="text-xs sm:text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section id="services" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-3">Наши услуги</h2>
            <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">Полный спектр ветеринарных услуг для кошек, собак и других животных</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => {
              const Icon = s.icon
              return (
                <FadeIn key={s.title} delay={i * 80}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <Image src={s.photo} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#4ade80] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#1e3a5f]" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-[#1e3a5f] mb-1">{s.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 flex-1">{s.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#4ade80]">{s.price}</span>
                        <span className="text-xs text-[#1e3a5f] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Подробнее <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== DOCTORS ====== */}
      <section id="doctors" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-3">Наши специалисты</h2>
            <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">Команда профессионалов, которая заботится о здоровье ваших питомцев</p>
          </FadeIn>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {DOCTORS.map((d, i) => (
              <FadeIn key={d.name} delay={i * 100} className="min-w-[260px] snap-start lg:min-w-0">
                <div className="bg-gray-50 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-72 overflow-hidden">
                    <Image src={d.photo} alt={d.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-[#1e3a5f] text-lg mb-1">{d.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{d.specialty}</p>
                    <button onClick={() => scrollTo('appointment')} className="w-full py-2.5 rounded-full border-2 border-[#1e3a5f] text-[#1e3a5f] text-sm font-bold hover:bg-[#1e3a5f] hover:text-white transition-colors">
                      Записаться
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====== ABOUT ====== */}
      <section id="about" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image src="/photos/DSC_0230.jpg" alt="Клиника Берлога" fill className="object-cover" />
              </div>
            </FadeIn>

            <div>
              <FadeIn>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a5f] mb-6">О клинике Берлога</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Уже более 9 лет мы заботимся о здоровье домашних животных в Москве. Наша клиника оснащена современным диагностическим оборудованием, а команда из 22 специалистов готова прийти на помощь круглосуточно.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Мы верим, что каждый питомец заслуживает лучшего лечения. Индивидуальный подход, внимательная диагностика и бережное отношение -- наши главные принципы работы.
                </p>
              </FadeIn>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: 'Современное оборудование', desc: 'УЗИ, рентген, лаборатория' },
                  { icon: Heart, title: 'Опытные врачи', desc: '22 специалиста в команде' },
                  { icon: Clock, title: 'Круглосуточно', desc: 'Работаем 24/7 без выходных' },
                  { icon: Microscope, title: 'Своя лаборатория', desc: 'Результаты за 30 минут' },
                ].map((f, i) => {
                  const Icon = f.icon
                  return (
                    <FadeIn key={f.title} delay={i * 100}>
                      <div className="p-4 bg-white rounded-xl shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5 text-[#1e3a5f]" />
                        </div>
                        <h4 className="font-bold text-[#1e3a5f] text-sm mb-1">{f.title}</h4>
                        <p className="text-xs text-gray-500">{f.desc}</p>
                      </div>
                    </FadeIn>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== GALLERY ====== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-3">Наша клиника</h2>
            <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">Загляните к нам -- уютная обстановка и современное оснащение</p>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {GALLERY_PHOTOS.map((p, i) => (
              <FadeIn key={p} delay={i * 60}>
                <button onClick={() => setLightbox(p)} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer w-full">
                  <Image src={p} alt={`Клиника Берлога - фото ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-[#1e3a5f]/0 group-hover:bg-[#1e3a5f]/30 transition-colors flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====== LIGHTBOX ====== */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl aspect-[3/2]" onClick={e => e.stopPropagation()}>
            <Image src={lightbox} alt="Фото клиники" fill className="object-contain" />
          </div>
        </div>
      )}

      {/* ====== APPOINTMENT FORM ====== */}
      <section id="appointment" className="py-20 lg:py-28 bg-[#1e3a5f]">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-white mb-3">Записаться на приём</h2>
            <p className="text-center text-white/60 mb-12">Оставьте заявку и мы перезвоним в течение 15 минут</p>
          </FadeIn>

          {formStatus === 'sent' ? (
            <FadeIn>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#4ade80] flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-8 h-8 text-[#1e3a5f]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Заявка отправлена!</h3>
                <p className="text-white/60">Мы перезвоним вам в ближайшее время</p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <form onSubmit={submit} className="bg-white/10 backdrop-blur rounded-2xl p-6 sm:p-10 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">Имя *</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#4ade80] transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">Телефон *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#4ade80] transition-colors"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#4ade80] transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">Услуга</label>
                    <select
                      value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4ade80] transition-colors appearance-none"
                    >
                      <option value="" className="text-gray-800">Выберите услугу</option>
                      {SERVICES.map(s => <option key={s.title} value={s.title} className="text-gray-800">{s.title}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Комментарий</label>
                  <textarea
                    rows={3}
                    value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#4ade80] transition-colors resize-none"
                    placeholder="Опишите проблему или пожелания"
                  />
                </div>

                {formStatus === 'error' && (
                  <p className="text-red-400 text-sm text-center">Произошла ошибка. Позвоните нам: +7 (499) 757-34-47</p>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full py-4 rounded-full bg-[#4ade80] text-[#1e3a5f] font-bold text-lg hover:bg-[#22c55e] transition-all shadow-xl shadow-[#4ade80]/20 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {formStatus === 'sending' ? (
                    <span className="inline-block w-5 h-5 border-2 border-[#1e3a5f]/30 border-t-[#1e3a5f] rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-5 h-5" /> Отправить заявку</>
                  )}
                </button>
              </form>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ====== PRICES ====== */}
      <section id="prices" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-3">Цены на услуги</h2>
            <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">Прозрачные цены без скрытых наценок</p>
          </FadeIn>

          <div className="space-y-3">
            {PRICES.map((cat, ci) => (
              <FadeIn key={cat.category} delay={ci * 80}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenPrice(openPrice === ci ? null : ci)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-[#1e3a5f]">{cat.category}</span>
                    <ChevronDown className={`w-5 h-5 text-[#1e3a5f] transition-transform duration-300 ${openPrice === ci ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${openPrice === ci ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-6 pb-4 space-y-2">
                      {cat.items.map(item => (
                        <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="text-gray-700 text-sm">{item.name}</span>
                          <span className="text-sm font-bold text-[#1e3a5f]">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <p className="text-center text-gray-400 text-sm mt-8">
              * Окончательная стоимость определяется после осмотра. Полный прайс-лист уточняйте по телефону.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ====== CONTACTS ====== */}
      <section id="contacts" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-14">Контакты</h2>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-10">
            <FadeIn>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] mb-0.5">Адрес</h4>
                    <p className="text-gray-600 text-sm">Москва, ул. Пилюгина, д. 6</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] mb-0.5">Телефон</h4>
                    <a href="tel:+74997573447" className="text-gray-600 text-sm hover:text-[#1e3a5f] transition-colors">+7 (499) 757-34-47</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] mb-0.5">Email</h4>
                    <a href="mailto:info@berloga.vet" className="text-gray-600 text-sm hover:text-[#1e3a5f] transition-colors">info@berloga.vet</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] mb-0.5">Режим работы</h4>
                    <p className="text-gray-600 text-sm">Ежедневно, круглосуточно</p>
                  </div>
                </div>

                {/* social links */}
                <div className="flex gap-3 pt-2">
                  {[
                    { label: 'Telegram', href: 'https://t.me/berloga_vet', icon: Send },
                    { label: 'WhatsApp', href: 'https://wa.me/74997573447', icon: MessageCircle },
                    { label: 'VK', href: 'https://vk.com/berloga_vet', icon: Heart },
                  ].map(s => {
                    const Icon = s.icon
                    return (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-[#1e3a5f] flex items-center justify-center hover:bg-[#2a4f7f] transition-colors"
                        title={s.label}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </a>
                    )
                  })}
                </div>

                <button onClick={() => scrollTo('appointment')} className="mt-4 px-8 py-3 rounded-full bg-[#4ade80] text-[#1e3a5f] font-bold hover:bg-[#22c55e] transition-colors shadow-lg shadow-[#4ade80]/20">
                  Записаться на приём
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-full min-h-[350px]">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=37.527826%2C55.677476&z=16&pt=37.527826%2C55.677476%2Cpm2rdm&text=%D0%91%D0%B5%D1%80%D0%BB%D0%BE%D0%B3%D0%B0%20%D0%B2%D0%B5%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%D1%80%D0%BD%D0%B0%D1%8F%20%D0%BA%D0%BB%D0%B8%D0%BD%D0%B8%D0%BA%D0%B0"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  title="Карта"
                  className="w-full h-full"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-[#1e3a5f] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* col 1: brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="w-7 h-7 text-[#4ade80]" />
                <span className="text-lg font-bold">БЕРЛОГА</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Круглосуточная ветеринарная клиника в Москве. Забота о вашем питомце -- наша работа.
              </p>
            </div>

            {/* col 2: nav */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/80">Навигация</h4>
              <ul className="space-y-2">
                {NAV.map(n => (
                  <li key={n.id}>
                    <button onClick={() => scrollTo(n.id)} className="text-sm text-white/60 hover:text-[#4ade80] transition-colors">
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* col 3: contacts */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/80">Контакты</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="tel:+74997573447" className="hover:text-[#4ade80] transition-colors">+7 (499) 757-34-47</a></li>
                <li><a href="mailto:info@berloga.vet" className="hover:text-[#4ade80] transition-colors">info@berloga.vet</a></li>
                <li>Москва, ул. Пилюгина, д. 6</li>
              </ul>
            </div>

            {/* col 4: payment + social */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/80">Способы оплаты</h4>
              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold">МИР</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold">СБП</span>
              </div>
              <div className="flex gap-2">
                <a href="https://t.me/berloga_vet" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Send className="w-4 h-4" />
                </a>
                <a href="https://wa.me/74997573447" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href="https://vk.com/berloga_vet" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Heart className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">ИП Медведева Александра Владимировна</p>
            <p className="text-xs text-white/40">&copy; 2026 Ветеринарная клиника Берлога. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* ====== FLOATING PHONE BUTTON (mobile) ====== */}
      <a
        href="tel:+74997573447"
        className="fixed bottom-6 right-6 z-40 lg:hidden w-14 h-14 rounded-full bg-[#4ade80] flex items-center justify-center shadow-xl shadow-[#4ade80]/30 animate-pulse"
      >
        <Phone className="w-6 h-6 text-[#1e3a5f]" />
      </a>
    </div>
  )
}
