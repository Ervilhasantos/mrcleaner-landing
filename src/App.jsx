import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ShieldCheck, Droplets, Clock, ChevronRight, Activity } from 'lucide-react';
import QuoteModal from './components/QuoteModal';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar scroll effect
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: { className: 'bg-background/80 backdrop-blur-xl border-grayLight/50 shadow-sm', targets: '.navbar' }
      });

      // Hero Animation
      gsap.fromTo('.hero-text', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );

      // Philosophy Animation
      gsap.fromTo('.philo-line',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.philosophy-section',
            start: 'top 70%',
          }
        }
      );

      // Protocol Stacking
      const cards = gsap.utils.toArray('.protocol-card');
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          pin: true,
          pinSpacing: false,
          id: `pin-${i}`,
          end: 'max',
        });
      });

      // Shuffler Animation (Card 1)
      const shuffleInterval = setInterval(() => {
        const items = document.querySelectorAll('.shuffler-item');
        if(items.length > 0) {
          gsap.to(items[0], { y: -20, opacity: 0, scale: 0.9, duration: 0.4, onComplete: () => {
            const parent = items[0].parentNode;
            parent.appendChild(items[0]);
            gsap.set(items[0], { y: 20, opacity: 0, scale: 0.9 });
            gsap.to(items[0], { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
            
            // Re-animate the rest
            Array.from(parent.children).slice(0, 2).forEach((el, idx) => {
               gsap.to(el, { y: idx * 8, scale: 1 - idx * 0.05, opacity: 1 - idx * 0.2, zIndex: 10 - idx, duration: 0.4 });
            });
          }});
        }
      }, 3000);

      // Typewriter Animation (Card 2)
      let textIndex = 0;
      const texts = ["Blindagem Total.", "Respira Normalmente.", "Não Altera a Cor."];
      const typeInterval = setInterval(() => {
        const el = document.querySelector('.typewriter-text');
        if(el) {
          el.textContent = texts[textIndex];
          textIndex = (textIndex + 1) % texts.length;
          // simple blink simulation via css class later
        }
      }, 2500);

      // Custom cursor logic
      const cursorDot = document.querySelector('.cursor-dot');
      const cursorRing = document.querySelector('.cursor-ring');
      
      window.addEventListener('mousemove', (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.3 });
      });

      const interactiveEls = document.querySelectorAll('a, button, input, [role="button"]');
      interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });

      return () => {
        clearInterval(shuffleInterval);
        clearInterval(typeInterval);
      };
    }, mainRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="relative min-h-screen selection:bg-accent/20">
      {/* Custom Cursor */}
      <div className="cursor-dot hidden md:block" />
      <div className="cursor-ring hidden md:block" />
      
      {/* NAVBAR */}
      <nav className="navbar fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-6 py-4 flex items-center justify-between w-[90%] max-w-5xl transition-all duration-300 liquid-glass border-white/20">
        <div className="font-heading font-black text-xl tracking-tight text-dark uppercase flex items-center gap-2">
          <img src="https://mrcleaner.com.br/wp-content/uploads/2020/05/cropped-logo_mrr.png" alt="Mr. Cleaner" className="h-8 object-contain" />
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-dark">
          <a href="#servicos" className="hover:text-accent transition-colors hover:-translate-y-[1px]">Serviços</a>
          <a href="#diferenciais" className="hover:text-accent transition-colors hover:-translate-y-[1px]">Diferenciais</a>
          <a href="#protocolo" className="hover:text-accent transition-colors hover:-translate-y-[1px]">Protocolo</a>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-accent/20 btn-magnetic"
        >
          <span className="btn-content">Orçamento</span>
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] w-full flex items-end pb-24 md:pb-32 px-6 md:px-12 lg:px-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Using image from the site */}
          <img 
            src="https://mrcleaner.com.br/wp-content/uploads/2020/07/Capa.jpg" 
            alt="Interior elegante" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="hero-text text-white mb-6">
            <span className="block font-heading font-bold text-3xl md:text-5xl lg:text-6xl mb-2 tracking-tight">
              O conforto verdadeiro exige
            </span>
            <span className="block font-drama italic text-6xl md:text-8xl lg:text-9xl text-primary leading-none">
              precisão absoluta.
            </span>
          </h1>
          <p className="hero-text text-white/80 text-lg md:text-xl max-w-xl mb-10 font-light">
            O spa do seu sofá. Higienização profunda e impermeabilização inovadora para proteger o que importa.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hero-text bg-accent text-white px-8 py-4 rounded-full font-bold text-lg flex items-center shadow-2xl shadow-accent/30 btn-magnetic"
          >
            <span className="btn-content flex items-center">
              Solicitar Orçamento <ArrowRight className="ml-3 w-5 h-5" />
            </span>
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="servicos" className="py-32 px-6 md:px-12 lg:px-24 bg-background relative">
        {/* Background elements for liquid glass to blur */}
        <div className="absolute top-40 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Diagnostic Shuffler */}
            <div className="liquid-glass rounded-[2rem] p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-3 text-dark">Higienização Profunda</h3>
              <p className="text-dark/70 text-sm leading-relaxed mb-8">
                Elimina 99% dos ácaros, bactérias e odores. Revitaliza cor e textura do seu estofado ou tapete.
              </p>
              
              <div className="relative h-24 mt-4 perspective-1000">
                <div className="shuffler-item absolute top-0 left-0 right-0 bg-background border border-grayLight p-3 rounded-xl shadow-sm z-[10]">
                  <p className="font-mono text-xs text-primary font-bold">1. Extração de Ácaros</p>
                </div>
                <div className="shuffler-item absolute top-2 left-0 right-0 bg-background border border-grayLight p-3 rounded-xl shadow-sm z-[9] scale-[0.95] opacity-80">
                  <p className="font-mono text-xs text-primary font-bold">2. Desodorização</p>
                </div>
                <div className="shuffler-item absolute top-4 left-0 right-0 bg-background border border-grayLight p-3 rounded-xl shadow-sm z-[8] scale-[0.90] opacity-60">
                  <p className="font-mono text-xs text-primary font-bold">3. Revitalização UV</p>
                </div>
              </div>
            </div>

            {/* Card 2: Telemetry Typewriter */}
            <div className="liquid-glass rounded-[2rem] p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-6">
                <Droplets className="text-accent w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-3 text-dark">Impermeabilização</h3>
              <p className="text-dark/70 text-sm leading-relaxed mb-8">
                Encapsulamento de fibras. Seu estofado respira normalmente, sem alterar toque ou cor original.
              </p>
              
              <div className="bg-dark rounded-xl p-4 mt-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  <span className="font-mono text-[10px] text-white/50 tracking-wider">LIVE FEED</span>
                </div>
                <p className="font-mono text-sm text-accent h-6 typewriter-text flex items-center">
                  Blindagem Total.
                </p>
              </div>
            </div>

            {/* Card 3: Cursor Protocol Scheduler */}
            <div className="liquid-glass rounded-[2rem] p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="text-secondary w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-3 text-dark">Atendimento Premium</h3>
              <p className="text-dark/70 text-sm leading-relaxed mb-8">
                Profissionais uniformizados, equipamentos modernos e produtos biodegradáveis na sua casa.
              </p>
              
              <div className="grid grid-cols-7 gap-1 mt-auto">
                {['S','M','T','W','T','F','S'].map((day, i) => (
                  <div key={i} className="aspect-square rounded-md border border-grayLight flex items-center justify-center relative">
                    <span className="text-[10px] text-dark/40 font-mono">{day}</span>
                    {i === 2 && (
                      <div className="absolute inset-0 bg-secondary/20 rounded-md animate-pulse border border-secondary" />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section id="diferenciais" className="philosophy-section py-32 px-6 md:px-12 lg:px-24 bg-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://mrcleaner.com.br/wp-content/uploads/elementor/thumbs/higienizacao-min2-qni7eauh9svjyg2t0whozspwsspe0wqkpjy590uz3g.jpg" alt="Textura Orgânica" className="w-full h-full object-cover mix-blend-overlay" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="philo-line text-lg md:text-2xl text-white/50 font-light mb-8">
            A maioria das empresas foca em: <span className="line-through">limpeza superficial e estética.</span>
          </p>
          <h2 className="philo-line text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
            Nós focamos em: <br />
            <span className="font-drama italic text-accent">Saúde respiratória</span> <br />e renovação absoluta.
          </h2>
        </div>
      </section>

      {/* PROTOCOL SECTION */}
      <section id="protocolo" className="relative bg-background">
        {[
          {
            num: "01",
            title: "Diagnóstico Têxtil",
            desc: "Analisamos o tecido para aplicar a química exata sem danos.",
            color: "bg-background"
          },
          {
            num: "02",
            title: "Extração Profunda",
            desc: "Remoção de sujidades a nível molecular com maquinário de alta sucção.",
            color: "bg-grayLight"
          },
          {
            num: "03",
            title: "Blindagem e Secagem",
            desc: "Aplicação de barreira protetora e secagem em estufa ou natural assistida.",
            color: "bg-white"
          }
        ].map((step, i) => (
          <div key={i} className={`protocol-card h-screen w-full flex items-center justify-center p-6 ${step.color} border-b border-dark/5`}>
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="font-mono text-accent text-xl font-bold mb-4 block">Fase // {step.num}</span>
                <h2 className="font-heading font-black text-5xl md:text-7xl mb-6 text-dark tracking-tight">{step.title}</h2>
                <p className="text-xl text-dark/70 font-light">{step.desc}</p>
              </div>
              <div className="relative aspect-square w-full max-w-md mx-auto flex items-center justify-center">
                {/* Abstract Visual Representation */}
                <div className="absolute inset-0 border border-dark/10 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 border border-accent/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="w-24 h-24 bg-dark rounded-full flex items-center justify-center">
                  <Activity className="text-white w-10 h-10" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white rounded-t-[4rem] pt-24 pb-12 px-6 md:px-12 lg:px-24 mt-[-4rem] relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-b border-white/10 pb-16">
          <div>
            <h3 className="font-heading font-black text-2xl mb-4">MR. CLEANER</h3>
            <p className="text-white/60 font-light max-w-sm">
              Inovamos na prestação de serviços de impermeabilização e higienização de estofados e tapetes.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-sm text-accent mb-6 font-bold uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-4 text-white/70 font-light">
              <li><a href="#servicos" className="hover:text-white transition-colors">Nossos Serviços</a></li>
              <li><a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a></li>
              <li><button onClick={() => setIsModalOpen(true)} className="hover:text-white transition-colors">Solicitar Orçamento</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-sm text-accent mb-6 font-bold uppercase tracking-wider">Contato</h4>
            <ul className="space-y-4 text-white/70 font-light">
              <li>Rio de Janeiro, RJ</li>
              <li>Atendimento em Domicílio</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
          <p>© 2026 Mr. Cleaner. O Spa do seu Sofá.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 bg-white/5 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-mono tracking-widest text-xs">SYSTEM.OPERATIONAL</span>
          </div>
        </div>
      </footer>

      {/* MODAL ORÇAMENTO */}
      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
