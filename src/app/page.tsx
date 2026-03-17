'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Phone, Mail, MapPin, Clock, ChevronDown, ChevronRight, Menu, X, PawPrint,
  Heart, Shield, Stethoscope, Syringe, Scissors, Activity, Microscope,
  Star, Send, Check, ArrowRight, MessageCircle, Zap, Eye, BedDouble,
  Award, Sparkles, Sun, Moon, ThumbsUp, Quote, ChevronLeft,
  Wifi, MonitorSmartphone, Cpu, HelpCircle, CalendarCheck,
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

function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration, start])
  return count
}

/* ──────────────────────────── data ──────────────────────────── */

const NAV = [
  { label: 'Акции', id: 'promos' },
  { label: 'Услуги', id: 'services' },
  { label: 'Врачи', id: 'doctors' },
  { label: 'Оборудование', id: 'equipment' },
  { label: 'Отзывы', id: 'reviews' },
  { label: 'Цены', id: 'prices' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Контакты', id: 'contacts' },
]

const PROMOS = [
  { title: 'Чек-ап для кошки', desc: 'Комплексное обследование со скидкой 20%', badge: '-20%', color: 'from-emerald-500 to-teal-600', photo: '/stock/cat_checkup.jpg' },
  { title: 'Вакцинация щенков', desc: 'Первая вакцинация + осмотр бесплатно', badge: 'Акция', color: 'from-blue-500 to-indigo-600', photo: '/stock/puppy_vaccine.jpg' },
  { title: 'УЗИ + консультация', desc: 'УЗИ брюшной полости + консультация врача', badge: '-15%', color: 'from-purple-500 to-pink-600', photo: '/stock/ultrasound.jpg' },
  { title: 'Стоматология', desc: 'Ультразвуковая чистка зубов со скидкой', badge: '-25%', color: 'from-orange-500 to-red-500', photo: '/stock/dental.jpg' },
]

const SERVICE_CATEGORIES = [
  { key: 'all', label: 'Все услуги' },
  { key: 'diagnostics', label: 'Диагностика' },
  { key: 'therapy', label: 'Терапия' },
  { key: 'surgery', label: 'Хирургия' },
  { key: 'prevention', label: 'Профилактика' },
]

const SERVICES = [
  { title: 'УЗИ', price: 'от 3 200 ₽', nightPrice: 'от 4 500 ₽', desc: 'Ультразвуковая диагностика на аппарате экспертного класса', icon: Activity, photo: '/stock/ultrasound.jpg', cat: 'diagnostics' },
  { title: 'Вакцинация', price: 'от 2 800 ₽', nightPrice: 'от 2 800 ₽', desc: 'Комплексная вакцинация кошек и собак по протоколу WSAVA', icon: Syringe, photo: '/stock/puppy_vaccine.jpg', cat: 'prevention' },
  { title: 'Стерилизация', price: 'от 5 000 ₽', nightPrice: 'от 7 000 ₽', desc: 'Лапароскопическая стерилизация с газовой анестезией', icon: Scissors, photo: '/stock/surgery.jpg', cat: 'surgery' },
  { title: 'Терапия', price: 'от 1 800 ₽', nightPrice: 'от 2 500 ₽', desc: 'Приём терапевта, осмотр, назначение лечения', icon: Stethoscope, photo: '/stock/vet_exam.jpg', cat: 'therapy' },
  { title: 'Стоматология', price: 'от 3 300 ₽', nightPrice: 'от 4 600 ₽', desc: 'Лечение и удаление зубов, ультразвуковая санация', icon: Star, photo: '/stock/dental.jpg', cat: 'surgery' },
  { title: 'Хирургия', price: 'от 2 500 ₽', nightPrice: 'от 3 500 ₽', desc: 'Плановые и экстренные хирургические вмешательства', icon: Zap, photo: '/stock/operating.jpg', cat: 'surgery' },
  { title: 'Стационар', price: 'от 2 500 ₽', nightPrice: 'от 2 500 ₽', desc: 'Круглосуточное наблюдение и интенсивная терапия', icon: BedDouble, photo: '/stock/hospital.jpg', cat: 'therapy' },
  { title: 'Лабораторная диагностика', price: 'от 1 500 ₽', nightPrice: 'от 2 000 ₽', desc: 'Анализы крови, мочи — результаты за 30 минут', icon: Microscope, photo: '/stock/lab.jpg', cat: 'diagnostics' },
]

const DOCTORS = [
  { name: 'Медведева Александра Владимировна', specialty: 'Генеральный директор, УЗИ-диагностика', experience: '12 лет опыта', photo: '/stock/doctor1.jpg' },
  { name: 'Шилина Мария Александровна', specialty: 'Главный врач, нефролог, уролог', experience: '10 лет опыта', photo: '/stock/doctor2.jpg' },
  { name: 'Минасян Гайк Эдуардович', specialty: 'Хирург-стоматолог, абдоминальный хирург', experience: '9 лет опыта', photo: '/stock/doctor3.jpg' },
  { name: 'Черныш Мария Сергеевна', specialty: 'Зав. терапевтическим отделением', experience: '8 лет опыта', photo: '/stock/doctor4.jpg' },
]

const DOCTORS_ON_SHIFT = [
  { name: 'Шилина Мария Александровна', specialty: 'Нефролог, уролог', photo: '/stock/doctor2.jpg', cabinet: 'Кабинет 1', shift: '09:00 – 21:00', status: 'accepting' as const },
  { name: 'Медведева Александра Владимировна', specialty: 'УЗИ-диагностика', photo: '/stock/doctor1.jpg', cabinet: 'Кабинет УЗИ', shift: '10:00 – 22:00', status: 'accepting' as const },
  { name: 'Черныш Мария Сергеевна', specialty: 'Терапевт', photo: '/stock/doctor4.jpg', cabinet: 'Процедурный', shift: '08:00 – 20:00', status: 'busy' as const },
  { name: 'Минасян Гайк Эдуардович', specialty: 'Хирург', photo: '/stock/doctor3.jpg', cabinet: 'Кабинет 3', shift: '12:00 – 00:00', status: 'accepting' as const },
]

const EQUIPMENT = [
  {
    key: 'ultrasound',
    label: 'УЗИ',
    title: 'УЗИ экспертного класса',
    desc: 'Аппарат Mindray DC-80 с конвексным и линейным датчиками. Позволяет проводить полное абдоминальное УЗИ, ЭхоКГ, а также УЗИ мелких органов с высочайшей детализацией.',
    features: ['Исследование в реальном времени', '3D/4D визуализация', 'Допплер сосудов', 'Запись видео'],
    photo: '/stock/ultrasound.jpg',
  },
  {
    key: 'xray',
    label: 'Рентген',
    title: 'Цифровой рентген',
    desc: 'Цифровая рентгенографическая система с минимальной лучевой нагрузкой. Результат — через 30 секунд на экране. Возможность отправки снимков коллегам для консультации.',
    features: ['Минимальная доза облучения', 'Мгновенный результат', 'Высокое разрешение', 'Телеконсультации'],
    photo: '/stock/xray.jpg',
  },
  {
    key: 'lab',
    label: 'Лаборатория',
    title: 'Собственная лаборатория',
    desc: 'Автоматический гематологический и биохимический анализаторы. Результаты ОАК за 3 минуты, биохимии — за 15 минут. Не нужно ждать — всё на месте.',
    features: ['ОАК за 3 минуты', 'Биохимия за 15 минут', 'Микроскопия', 'Коагулограмма'],
    photo: '/stock/lab.jpg',
  },
  {
    key: 'surgery',
    label: 'Операционная',
    title: 'Современная операционная',
    desc: 'Оборудована газовым наркозным аппаратом, мониторами витальных функций и электрохирургическим блоком. Лапароскопические операции — минимум травматизации.',
    features: ['Газовая анестезия', 'Мониторинг пульсоксиметрии', 'Электрокоагуляция', 'Лапароскопия'],
    photo: '/stock/operating.jpg',
  },
]

const REVIEWS = [
  { name: 'Мария И.', text: 'Привезли кота ночью с отравлением. Врачи сразу приняли, поставили капельницу. Через 2 дня Барсик был дома. Спасибо огромное!', rating: 5, source: 'Яндекс', pet: 'кот Барсик' },
  { name: 'Сергей П.', text: 'Делали УЗИ собаке. Елена Воронова всё подробно объяснила, показала на экране. Очень профессионально и по-человечески.', rating: 5, source: '2ГИС', pet: 'собака Рекс' },
  { name: 'Анна К.', text: 'Ходим только сюда. Кошке делали стерилизацию — лапароскопически. Через день уже бегала как ни в чём не бывало!', rating: 5, source: 'Яндекс', pet: 'кошка Муся' },
  { name: 'Дмитрий В.', text: 'Отличная клиника. Самое главное — честные врачи. Не назначают лишнего, объясняют каждый шаг лечения.', rating: 5, source: 'Google', pet: 'пёс Чарли' },
  { name: 'Ольга М.', text: 'Попугая лечили здесь — найти хорошего врача для птиц в Москве сложно, но в Берлоге нашли. Кеша здоров!', rating: 5, source: 'Zoon', pet: 'попугай Кеша' },
  { name: 'Елена Т.', text: 'Приятная атмосфера, чисто, не пахнет. Коты не нервничают. Всегда записываемся к Александрову — лучший терапевт.', rating: 5, source: '2ГИС', pet: 'кот Симба' },
]

const GALLERY_PHOTOS = [
  '/stock/clinic1.jpg', '/stock/clinic2.jpg', '/stock/cat_vet.jpg', '/stock/vet_exam.jpg',
  '/stock/dog_happy.jpg', '/stock/stethoscope.jpg', '/stock/clinic3.jpg', '/stock/clinic4.jpg',
]

const PRICES: { category: string; items: { name: string; day: string; night: string }[] }[] = [
  { category: 'Терапия', items: [{ name: 'Первичный приём', day: '1 800 ₽', night: '2 500 ₽' }, { name: 'Повторный приём', day: '1 200 ₽', night: '1 700 ₽' }, { name: 'Консультация', day: '1 000 ₽', night: '1 400 ₽' }] },
  { category: 'Хирургия', items: [{ name: 'Кастрация кота', day: '5 000 ₽', night: '7 000 ₽' }, { name: 'Стерилизация кошки', day: '7 000 ₽', night: '9 800 ₽' }, { name: 'Стерилизация собаки', day: '10 000 ₽', night: '14 000 ₽' }] },
  { category: 'Диагностика', items: [{ name: 'УЗИ', day: '3 200 ₽', night: '4 500 ₽' }, { name: 'Рентген', day: '2 800 ₽', night: '3 900 ₽' }, { name: 'ОАК', day: '1 200 ₽', night: '1 700 ₽' }, { name: 'Биохимия крови', day: '1 800 ₽', night: '2 500 ₽' }] },
  { category: 'Вакцинация', items: [{ name: 'Комплексная вакцинация', day: '2 800 ₽', night: '2 800 ₽' }, { name: 'Прививка от бешенства', day: '1 500 ₽', night: '1 500 ₽' }] },
  { category: 'Стоматология', items: [{ name: 'Осмотр ротовой полости', day: '1 500 ₽', night: '2 100 ₽' }, { name: 'Удаление зуба', day: '3 300 ₽', night: '4 600 ₽' }, { name: 'Ультразвуковая чистка', day: '5 000 ₽', night: '7 000 ₽' }] },
]

const FAQ = [
  { q: 'Работаете ли вы ночью?', a: 'Да, клиника работает круглосуточно, 24/7, без выходных и праздников. Ночью действует ночной тариф (+40%).' },
  { q: 'Можно ли приехать без записи?', a: 'Да, мы принимаем без записи. Однако по записи вы гарантированно попадёте на приём без ожидания.' },
  { q: 'Какие животные принимаются?', a: 'Мы лечим кошек, собак, грызунов, кроликов, хорьков, птиц и рептилий. Для экзотических животных рекомендуем предварительно позвонить.' },
  { q: 'Есть ли парковка?', a: 'Да, рядом с клиникой есть бесплатная парковка. Также удобно добраться на метро — станция «Беляево» в 10 минутах пешком.' },
  { q: 'Как долго ждать результаты анализов?', a: 'ОАК — 3 минуты, биохимия — 15 минут. У нас собственная лаборатория, результаты не нужно ждать из внешней лаборатории.' },
  { q: 'Есть ли рассрочка на лечение?', a: 'Да, при лечении на сумму от 15 000 ₽ доступна рассрочка до 3 месяцев. Также принимаем оплату по СБП и картами МИР.' },
]

const TRUST_BADGES = [
  { icon: Shield, label: 'Лицензированная клиника', desc: 'Лицензия на ветеринарную деятельность' },
  { icon: Heart, label: 'Pet Friendly', desc: 'Зона комфорта для питомцев' },
  { icon: Award, label: '9+ лет практики', desc: 'Опыт работы с 2017 года' },
  { icon: Wifi, label: 'Онлайн-запись', desc: 'Записывайтесь круглосуточно' },
]

/* ──────────────────────────── PAGE ──────────────────────────── */

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [openPrice, setOpenPrice] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [serviceCat, setServiceCat] = useState('all')
  const [equipTab, setEquipTab] = useState('ultrasound')
  const [reviewIdx, setReviewIdx] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [pricingMode, setPricingMode] = useState<'day' | 'night'>('day')
  const [promoIdx, setPromoIdx] = useState(0)

  /* appointment form */
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', comment: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  /* counter animation */
  const { ref: statsRef, visible: statsVisible } = useOnScreen(0.3)
  const c1 = useCountUp(9, 1500, statsVisible)
  const c2 = useCountUp(22, 1500, statsVisible)
  const c3 = useCountUp(15000, 1500, statsVisible)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  /* auto-advance promos */
  useEffect(() => {
    const t = setInterval(() => setPromoIdx(i => (i + 1) % PROMOS.length), 5000)
    return () => clearInterval(t)
  }, [])

  /* auto-advance reviews */
  useEffect(() => {
    const t = setInterval(() => setReviewIdx(i => (i + 1) % REVIEWS.length), 6000)
    return () => clearInterval(t)
  }, [])

  /* detect day/night for pricing hint */
  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 22 || h < 9) setPricingMode('night')
  }, [])

  const nav = useCallback((id: string) => { setMobileMenu(false); setTimeout(() => scrollTo(id), 100) }, [])

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

  const filteredServices = serviceCat === 'all' ? SERVICES : SERVICES.filter(s => s.cat === serviceCat)
  const activeEquip = EQUIPMENT.find(e => e.key === equipTab) || EQUIPMENT[0]

  return (
    <div className="min-h-screen bg-white text-gray-800" style={{ scrollBehavior: 'smooth' }}>

      {/* ====== HEADER ====== */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
        {/* top bar */}
        <div className={`transition-all duration-300 overflow-hidden ${scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-1.5 text-[11px] text-white/70">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><MapPin size={10} /> Москва, ул. Пилюгина, 6</span>
              <span className="hidden sm:flex items-center gap-1"><Clock size={10} /> Круглосуточно</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://t.me/berloga_vet" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
              <a href="https://wa.me/79037963447" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 lg:py-3.5">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/berloga-logo.svg" alt="Берлога" className={`h-9 w-auto transition-all ${scrolled ? '' : 'brightness-0 invert'}`} />
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-400 text-[#1e3a5f] leading-none">24/7</span>
          </button>

          <nav className="hidden xl:flex items-center gap-5">
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className={`text-sm font-medium transition-colors hover:text-emerald-400 ${scrolled ? 'text-gray-700' : 'text-white/90'}`}>
                {n.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+74997573447" className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${scrolled ? 'text-[#1e3a5f]' : 'text-white'}`}>
              <Phone className="w-4 h-4" /> +7 (499) 757-34-47
            </a>
            <button onClick={() => scrollTo('appointment')} className="px-5 py-2.5 rounded-full bg-emerald-400 text-[#1e3a5f] text-sm font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-400/30">
              Записаться
            </button>
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="xl:hidden">
            {mobileMenu
              ? <X className={`w-7 h-7 ${scrolled ? 'text-[#1e3a5f]' : 'text-white'}`} />
              : <Menu className={`w-7 h-7 ${scrolled ? 'text-[#1e3a5f]' : 'text-white'}`} />}
          </button>
        </div>

        {/* mobile menu */}
        <div className={`xl:hidden overflow-hidden transition-all duration-300 bg-white ${mobileMenu ? 'max-h-[600px] shadow-xl' : 'max-h-0'}`}>
          <div className="px-4 py-4 flex flex-col gap-2">
            {NAV.map(n => (
              <button key={n.id} onClick={() => nav(n.id)} className="text-left text-gray-700 font-medium py-2.5 border-b border-gray-100 hover:text-[#1e3a5f]">
                {n.label}
              </button>
            ))}
            <a href="tel:+74997573447" className="flex items-center gap-2 py-2 text-[#1e3a5f] font-semibold">
              <Phone className="w-4 h-4" /> +7 (499) 757-34-47
            </a>
            <button onClick={() => nav('appointment')} className="mt-1 w-full py-3 rounded-full bg-emerald-400 text-[#1e3a5f] font-bold">
              Записаться на приём
            </button>
          </div>
        </div>
      </header>

      {/* ====== HERO ====== */}
      <section className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden">
        <Image src="/stock/clinic1.jpg" alt="Ветеринарная клиника Берлога" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f]/70 via-[#1e3a5f]/40 to-[#0f1f33]/90" />

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Круглосуточная ветеринарная помощь в Москве</span>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-5">
              Ветеринарная<br />клиника <span className="text-emerald-400">Берлога</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Современное оборудование, опытные врачи, бережное отношение к каждому пациенту. Работаем без выходных.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollTo('appointment')} className="px-8 py-4 rounded-full bg-emerald-400 text-[#1e3a5f] font-bold text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-400/25 hover:scale-105 hover:shadow-emerald-400/40">
                <CalendarCheck className="w-5 h-5 inline mr-2 -mt-0.5" />Записаться на приём
              </button>
              <a href="tel:+74997573447" className="px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-all hover:scale-105 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Позвонить
              </a>
            </div>
          </FadeIn>
        </div>

        {/* animated stats */}
        <div ref={statsRef} className="absolute bottom-0 inset-x-0 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="max-w-5xl mx-auto grid grid-cols-3 py-5 divide-x divide-white/20">
            {[
              { num: `${c1}+`, label: 'лет опыта' },
              { num: `${c2}`, label: 'специалиста' },
              { num: `${c3.toLocaleString('ru-RU')}+`, label: 'пациентов' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{s.num}</div>
                <div className="text-xs sm:text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TRUST BADGES ====== */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_BADGES.map((b, i) => {
              const Icon = b.icon
              return (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1e3a5f]">{b.label}</p>
                    <p className="text-xs text-gray-500">{b.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== DOCTORS ON SHIFT ====== */}
      <section className="py-10 lg:py-14 bg-gradient-to-br from-[#1e3a5f] via-[#243f65] to-[#1a2d4a]">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Сегодня на смене</h2>
            </div>
            <p className="text-center text-white/50 text-sm mb-8">
              {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOCTORS_ON_SHIFT.map((doc, i) => (
              <FadeIn key={doc.name} delay={i * 100}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20 shrink-0">
                      <Image src={doc.photo} alt={doc.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">{doc.name}</h3>
                      <p className="text-white/50 text-xs">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <MapPin size={12} /><span>{doc.cabinet}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Clock size={12} /><span>{doc.shift}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${doc.status === 'accepting' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className={`text-xs font-medium ${doc.status === 'accepting' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {doc.status === 'accepting' ? 'Принимает' : 'На приёме'}
                      </span>
                    </div>
                    <button onClick={() => scrollTo('appointment')} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors">
                      Записаться
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PROMOS ====== */}
      <section id="promos" className="py-14 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1e3a5f]">Акции и спецпредложения</h2>
                <p className="text-gray-500 text-sm mt-1">Выгодные предложения для ваших питомцев</p>
              </div>
              <div className="hidden sm:flex gap-2">
                <button onClick={() => setPromoIdx(i => (i - 1 + PROMOS.length) % PROMOS.length)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={() => setPromoIdx(i => (i + 1) % PROMOS.length)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROMOS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 h-52 ${i === promoIdx ? 'ring-2 ring-emerald-400 scale-[1.02]' : 'hover:scale-[1.01]'}`}
                  onClick={() => setPromoIdx(i)}
                >
                  <Image src={p.photo} alt={p.title} fill className="object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-80`} />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold">{p.badge}</div>
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <h3 className="text-white font-bold text-lg mb-0.5">{p.title}</h3>
                    <p className="text-white/80 text-sm">{p.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* dots */}
          <div className="flex justify-center gap-2 mt-6 sm:hidden">
            {PROMOS.map((_, i) => (
              <button key={i} onClick={() => setPromoIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === promoIdx ? 'bg-emerald-500 w-6' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== SERVICES WITH CATEGORIES ====== */}
      <section id="services" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-3">Наши услуги</h2>
            <p className="text-center text-gray-500 mb-8 max-w-xl mx-auto">Полный спектр ветеринарных услуг для кошек, собак, птиц и экзотических животных</p>
          </FadeIn>

          {/* category tabs */}
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {SERVICE_CATEGORIES.map(c => (
                <button
                  key={c.key}
                  onClick={() => setServiceCat(c.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${serviceCat === c.key ? 'bg-[#1e3a5f] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* day/night toggle */}
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-8">
              <button
                onClick={() => setPricingMode('day')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${pricingMode === 'day' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Sun className="w-4 h-4" /> Дневной тариф <span className="text-xs opacity-60">09:00–22:00</span>
              </button>
              <button
                onClick={() => setPricingMode('night')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${pricingMode === 'night' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Moon className="w-4 h-4" /> Ночной тариф <span className="text-xs opacity-60">22:00–09:00</span>
              </button>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredServices.map((s, i) => {
              const Icon = s.icon
              return (
                <FadeIn key={s.title} delay={i * 70}>
                  <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <Image src={s.photo} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg">
                          <Icon className="w-4 h-4 text-[#1e3a5f]" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                        {pricingMode === 'day' ? s.price : s.nightPrice}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-[#1e3a5f] mb-1">{s.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 flex-1 leading-relaxed">{s.desc}</p>
                      <button onClick={() => scrollTo('appointment')} className="text-sm text-emerald-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Записаться <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== EQUIPMENT / TECHNOLOGY ====== */}
      <section id="equipment" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-3">Наше оборудование</h2>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">Современная техника для точной диагностики и безопасного лечения</p>
          </FadeIn>

          <FadeIn>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {EQUIPMENT.map(eq => (
                <button
                  key={eq.key}
                  onClick={() => setEquipTab(eq.key)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${equipTab === eq.key ? 'bg-[#1e3a5f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {eq.label}
                </button>
              ))}
            </div>
          </FadeIn>

          <FadeIn>
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <div className="grid lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto min-h-[300px]">
                  <Image src={activeEquip.photo} alt={activeEquip.title} fill className="object-cover" />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Технологии</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-[#1e3a5f] mb-4">{activeEquip.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{activeEquip.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {activeEquip.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-sm text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ====== DOCTORS ====== */}
      <section id="doctors" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-3">Наши специалисты</h2>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">Команда профессионалов с многолетним опытом в ветеринарной медицине</p>
          </FadeIn>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {DOCTORS.map((d, i) => (
              <FadeIn key={d.name} delay={i * 100} className="min-w-[260px] snap-start lg:min-w-0">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-72 overflow-hidden">
                    <Image src={d.photo} alt={d.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                        <Award className="w-3 h-3" /> {d.experience}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-[#1e3a5f] text-lg mb-1">{d.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{d.specialty}</p>
                    <button onClick={() => scrollTo('appointment')} className="w-full py-2.5 rounded-full bg-[#1e3a5f] text-white text-sm font-bold hover:bg-[#2a5280] transition-colors">
                      Записаться
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====== ABOUT + GALLERY ====== */}
      <section id="about" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <FadeIn>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image src="/stock/clinic2.jpg" alt="Клиника Берлога" fill className="object-cover" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30">
                  <p className="text-white text-sm font-medium text-center">Просторная ресепшн-зона с зоной комфорта для питомцев</p>
                </div>
              </div>
            </FadeIn>

            <div>
              <FadeIn>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-4">
                  <Heart className="w-3 h-3" /> О КЛИНИКЕ
                </span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a5f] mb-6">Берлога — клиника,<br />где любят животных</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Уже более 9 лет мы заботимся о здоровье домашних животных в Москве. Наша клиника оснащена современным диагностическим оборудованием, а команда из 22 специалистов готова прийти на помощь круглосуточно.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Мы верим, что каждый питомец заслуживает лучшего лечения. Индивидуальный подход, внимательная диагностика и бережное отношение — наши главные принципы.
                </p>
              </FadeIn>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: 'Современное оборудование', desc: 'УЗИ, рентген, лаборатория' },
                  { icon: Heart, title: 'Бережный подход', desc: 'Pet Friendly клиника' },
                  { icon: Clock, title: 'Круглосуточно', desc: 'Работаем 24/7 без выходных' },
                  { icon: MonitorSmartphone, title: 'Онлайн-запись', desc: 'Запись через сайт и Telegram' },
                ].map((f, i) => {
                  const Icon = f.icon
                  return (
                    <FadeIn key={f.title} delay={i * 80}>
                      <div className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5 text-emerald-600" />
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

          {/* gallery */}
          <FadeIn>
            <h3 className="text-2xl font-bold text-center text-[#1e3a5f] mb-8">Фотографии клиники</h3>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {GALLERY_PHOTOS.map((p, i) => (
              <FadeIn key={p} delay={i * 50}>
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

      {/* ====== REVIEWS ====== */}
      <section id="reviews" className="py-16 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-3">Отзывы наших клиентов</h2>
            <p className="text-center text-gray-500 mb-4 max-w-xl mx-auto">Нам доверяют тысячи владельцев домашних животных</p>
          </FadeIn>

          {/* platform badges */}
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { name: 'Яндекс', rating: '4.9', count: '247' },
                { name: '2ГИС', rating: '4.8', count: '189' },
                { name: 'Google', rating: '4.9', count: '312' },
                { name: 'Zoon', rating: '4.7', count: '98' },
              ].map(p => (
                <div key={p.name} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-[#1e3a5f]">{p.rating}</span>
                  <span className="text-xs text-gray-400">{p.name} · {p.count} отзывов</span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* review cards carousel */}
          <div className="relative">
            <div className="grid md:grid-cols-3 gap-5">
              {[0, 1, 2].map(offset => {
                const idx = (reviewIdx + offset) % REVIEWS.length
                const r = REVIEWS[idx]
                return (
                  <FadeIn key={`${idx}-${reviewIdx}`} delay={offset * 100}>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-full flex flex-col">
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: r.rating }, (_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 text-gray-200 mb-2" />
                      <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-4">{r.text}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-sm font-bold text-[#1e3a5f]">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.pet}</p>
                        </div>
                        <span className="text-xs text-gray-400 bg-white px-2.5 py-1 rounded-full">{r.source}</span>
                      </div>
                    </div>
                  </FadeIn>
                )
              })}
            </div>

            {/* nav */}
            <div className="flex justify-center gap-2 mt-6">
              {REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === reviewIdx ? 'bg-emerald-500 w-6' : 'bg-gray-300 hover:bg-gray-400'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== APPOINTMENT FORM ====== */}
      <section id="appointment" className="py-16 lg:py-24 bg-gradient-to-br from-[#1e3a5f] via-[#243f65] to-[#1a2d4a]">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-white mb-3">Записаться на приём</h2>
            <p className="text-center text-white/50 mb-10">Оставьте заявку и мы перезвоним в течение 15 минут</p>
          </FadeIn>

          {formStatus === 'sent' ? (
            <FadeIn>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-10 text-center border border-white/10">
                <div className="w-16 h-16 rounded-full bg-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-8 h-8 text-[#1e3a5f]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Заявка отправлена!</h3>
                <p className="text-white/60">Мы перезвоним вам в ближайшее время</p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <form onSubmit={submit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-10 space-y-5 border border-white/10">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">Имя *</label>
                    <input
                      required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">Телефон *</label>
                    <input
                      required type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition-colors"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">Email</label>
                    <input
                      type="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">Услуга</label>
                    <select
                      value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-emerald-400 transition-colors appearance-none"
                    >
                      <option value="" className="text-gray-800">Выберите услугу</option>
                      {SERVICES.map(s => <option key={s.title} value={s.title} className="text-gray-800">{s.title}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Комментарий</label>
                  <textarea
                    rows={3} value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition-colors resize-none"
                    placeholder="Опишите проблему или пожелания"
                  />
                </div>

                {formStatus === 'error' && (
                  <p className="text-red-400 text-sm text-center">Произошла ошибка. Позвоните нам: +7 (499) 757-34-47</p>
                )}

                <button
                  type="submit" disabled={formStatus === 'sending'}
                  className="w-full py-4 rounded-full bg-emerald-400 text-[#1e3a5f] font-bold text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-400/20 disabled:opacity-60 flex items-center justify-center gap-2"
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
      <section id="prices" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-3">Цены на услуги</h2>
            <p className="text-center text-gray-500 mb-4 max-w-xl mx-auto">Прозрачные цены без скрытых наценок</p>
          </FadeIn>

          {/* day/night price toggle */}
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-10">
              <button
                onClick={() => setPricingMode('day')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${pricingMode === 'day' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Sun className="w-4 h-4" /> День
              </button>
              <div className="w-px h-5 bg-gray-200" />
              <button
                onClick={() => setPricingMode('night')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${pricingMode === 'night' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Moon className="w-4 h-4" /> Ночь (+40%)
              </button>
            </div>
          </FadeIn>

          <div className="space-y-3">
            {PRICES.map((cat, ci) => (
              <FadeIn key={cat.category} delay={ci * 60}>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                  <button
                    onClick={() => setOpenPrice(openPrice === ci ? null : ci)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="font-bold text-[#1e3a5f]">{cat.category}</span>
                    <ChevronDown className={`w-5 h-5 text-[#1e3a5f]/60 transition-transform duration-300 ${openPrice === ci ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${openPrice === ci ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-6 pb-4 space-y-2">
                      {cat.items.map(item => (
                        <div key={item.name} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                          <span className="text-gray-700 text-sm">{item.name}</span>
                          <span className="text-sm font-bold text-[#1e3a5f]">{pricingMode === 'day' ? item.day : item.night}</span>
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
              * Окончательная стоимость определяется после осмотра. С 22:00 до 09:00 действует ночной тариф.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section id="faq" className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 mb-3">
              <HelpCircle className="w-6 h-6 text-emerald-500" />
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a5f]">Частые вопросы</h2>
            </div>
            <p className="text-center text-gray-500 mb-10">Ответы на популярные вопросы наших клиентов</p>
          </FadeIn>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-100/50 transition-colors"
                  >
                    <span className="font-semibold text-[#1e3a5f] text-sm pr-4">{item.q}</span>
                    <ChevronDown className={`w-5 h-5 text-emerald-500 transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${openFaq === i ? 'max-h-60' : 'max-h-0'}`}>
                    <p className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CONTACTS ====== */}
      <section id="contacts" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1e3a5f] mb-12">Как нас найти</h2>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-10">
            <FadeIn>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="space-y-6">
                  {[
                    { icon: MapPin, title: 'Адрес', text: 'Москва, ул. Пилюгина, д. 6', sub: 'м. Новые Черемушки — 10 мин пешком' },
                    { icon: Phone, title: 'Телефон', text: '+7 (499) 757-34-47', href: 'tel:+74997573447' },
                    { icon: Mail, title: 'Email', text: 'info@berloga.vet', href: 'mailto:info@berloga.vet' },
                    { icon: Clock, title: 'Режим работы', text: 'Ежедневно, круглосуточно', sub: 'Ночной тариф с 22:00 до 09:00' },
                  ].map((c, i) => {
                    const Icon = c.icon
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1e3a5f] mb-0.5 text-sm">{c.title}</h4>
                          {c.href ? (
                            <a href={c.href} className="text-gray-600 text-sm hover:text-emerald-600 transition-colors">{c.text}</a>
                          ) : (
                            <p className="text-gray-600 text-sm">{c.text}</p>
                          )}
                          {c.sub && <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* social */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                  {[
                    { label: 'Telegram', href: 'https://t.me/berloga_vet', icon: Send },
                    { label: 'WhatsApp', href: 'https://wa.me/79037963447', icon: MessageCircle },
                    { label: 'VK', href: 'https://vk.com/berloga_vet', icon: Heart },
                  ].map(s => {
                    const Icon = s.icon
                    return (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-[#1e3a5f] flex items-center justify-center hover:bg-[#2a5280] transition-colors" title={s.label}>
                        <Icon className="w-5 h-5 text-white" />
                      </a>
                    )
                  })}
                </div>

                <button onClick={() => scrollTo('appointment')} className="mt-6 w-full py-3.5 rounded-full bg-emerald-400 text-[#1e3a5f] font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-400/20">
                  Записаться на приём
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-full min-h-[400px] border border-gray-100">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=37.527826%2C55.677476&z=16&pt=37.527826%2C55.677476%2Cpm2rdm&text=%D0%91%D0%B5%D1%80%D0%BB%D0%BE%D0%B3%D0%B0%20%D0%B2%D0%B5%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%D1%80%D0%BD%D0%B0%D1%8F%20%D0%BA%D0%BB%D0%B8%D0%BD%D0%B8%D0%BA%D0%B0"
                  width="100%" height="100%" frameBorder="0" allowFullScreen title="Карта" className="w-full h-full"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-[#0f1f33] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/berloga-logo.svg" alt="Берлога" className="h-8 w-auto brightness-0 invert" />
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                Круглосуточная ветеринарная клиника в Москве. Забота о вашем питомце — наша работа.
              </p>
              <div className="flex gap-2">
                {[
                  { label: 'Telegram', href: 'https://t.me/berloga_vet', icon: Send },
                  { label: 'WhatsApp', href: 'https://wa.me/79037963447', icon: MessageCircle },
                  { label: 'VK', href: 'https://vk.com/berloga_vet', icon: Heart },
                ].map(s => {
                  const Icon = s.icon
                  return (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" title={s.label}>
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/70">Навигация</h4>
              <ul className="space-y-2">
                {NAV.map(n => (
                  <li key={n.id}>
                    <button onClick={() => scrollTo(n.id)} className="text-sm text-white/50 hover:text-emerald-400 transition-colors">{n.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/70">Контакты</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="tel:+74997573447" className="hover:text-emerald-400 transition-colors">+7 (499) 757-34-47</a></li>
                <li><a href="mailto:info@berloga.vet" className="hover:text-emerald-400 transition-colors">info@berloga.vet</a></li>
                <li>Москва, ул. Пилюгина, д. 6</li>
                <li className="text-white/30">Круглосуточно, без выходных</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-white/70">Оплата</h4>
              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold">МИР</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold">СБП</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold">Наличные</span>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">Рассрочка от 15 000 ₽</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/30">ИП Медведева Александра Владимировна · ОГРНИП 317774600000000</p>
            <p className="text-xs text-white/30">&copy; 2026 Ветеринарная клиника Берлога. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* ====== FLOATING BUTTONS ====== */}
      {/* Telegram — desktop */}
      <a
        href="https://t.me/berloga_vet"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-40 hidden lg:flex w-14 h-14 rounded-full bg-[#229ED9] items-center justify-center shadow-xl shadow-[#229ED9]/30 hover:scale-110 transition-transform"
        title="Написать в Telegram"
      >
        <Send className="w-6 h-6 text-white" />
      </a>

      {/* Phone — mobile */}
      <a
        href="tel:+74997573447"
        className="fixed bottom-6 right-6 z-40 lg:hidden w-14 h-14 rounded-full bg-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-400/30"
      >
        <Phone className="w-6 h-6 text-[#1e3a5f]" />
      </a>

      {/* WhatsApp — mobile */}
      <a
        href="https://wa.me/79037963447"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-40 lg:hidden w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl shadow-[#25D366]/30"
        title="WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </a>

      {/* Telegram — mobile */}
      <a
        href="https://t.me/berloga_vet"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[136px] right-6 z-40 lg:hidden w-12 h-12 rounded-full bg-[#229ED9] flex items-center justify-center shadow-xl shadow-[#229ED9]/30"
        title="Telegram"
      >
        <Send className="w-5 h-5 text-white" />
      </a>
    </div>
  )
}
