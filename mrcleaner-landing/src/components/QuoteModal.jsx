import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Camera, Sofa, Ruler } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function QuoteModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    length: '',
    width: '',
    cep: '',
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSelectType = (type) => {
    setFormData({ ...formData, type });
    nextStep();
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Pega apenas a string Base64
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
      if (!webhookUrl) {
        console.warn("Webhook URL não configurada. Simulando envio...");
        setTimeout(() => nextStep(), 800);
        return;
      }

      // Preparar payload em JSON
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        whatsapp: formData.whatsapp,
        email: formData.email,
        type: formData.type,
        length: formData.length,
        width: formData.width,
        cep: formData.cep,
        photoData: null,
        photoName: null,
        photoMimeType: null
      };

      // Processar foto se existir
      if (formData.photo) {
        payload.photoData = await fileToBase64(formData.photo);
        payload.photoName = formData.photo.name;
        payload.photoMimeType = formData.photo.type;
      }

      // Dispara requisição (Enviamos como text/plain para evitar erro de CORS no Google Apps Script)
      await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      nextStep();
    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      nextStep(); // Avança para a tela de sucesso para não frustrar o usuário
    }
  };

  if (!isOpen) return null;

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-lg bg-background/90 liquid-glass rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-grayLight/50">
            <div className="flex space-x-2">
              {[1, 2, 3].map(i => (
                <div 
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    step >= i ? "w-8 bg-accent" : "w-4 bg-grayLight"
                  )}
                />
              ))}
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-grayLight/50 transition-colors text-dark/70 hover:text-dark"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-heading font-bold mb-2">O que precisa de cuidado hoje?</h3>
                  <p className="text-dark/70 mb-8">Selecione o tipo de item para um orçamento preciso.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleSelectType('tapete')}
                      className={cn(
                        "group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden",
                        formData.type === 'tapete' ? "border-accent bg-accent/5" : "border-grayLight hover:border-accent/50"
                      )}
                    >
                      <Ruler className={cn("w-8 h-8 mb-4 transition-colors", formData.type === 'tapete' ? "text-accent" : "text-dark/50 group-hover:text-accent/70")} />
                      <h4 className="font-heading font-bold text-lg">Tapete</h4>
                      <p className="text-sm text-dark/60 mt-1">Limpeza e desodorização profunda.</p>
                    </button>
                    
                    <button 
                      onClick={() => handleSelectType('estofado')}
                      className={cn(
                        "group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden",
                        formData.type === 'estofado' ? "border-accent bg-accent/5" : "border-grayLight hover:border-accent/50"
                      )}
                    >
                      <Sofa className={cn("w-8 h-8 mb-4 transition-colors", formData.type === 'estofado' ? "text-accent" : "text-dark/50 group-hover:text-accent/70")} />
                      <h4 className="font-heading font-bold text-lg">Estofado</h4>
                      <p className="text-sm text-dark/60 mt-1">Renovação e impermeabilização.</p>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-heading font-bold mb-2">Detalhes do {formData.type === 'tapete' ? 'Tapete' : 'Estofado'}</h3>
                  <p className="text-dark/70 mb-6">Precisamos das dimensões para calcular o valor exato.</p>
                  
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-dark/80">Comprimento (m)</label>
                        <input type="number" step="0.1" name="length" value={formData.length} onChange={handleInput} placeholder="Ex: 2.5" className="w-full px-4 py-3 rounded-xl border border-grayLight focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-dark/80">Largura (m)</label>
                        <input type="number" step="0.1" name="width" value={formData.width} onChange={handleInput} placeholder="Ex: 1.8" className="w-full px-4 py-3 rounded-xl border border-grayLight focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-dark/80">CEP (Para validar atendimento local)</label>
                      <input type="text" name="cep" value={formData.cep} onChange={handleInput} placeholder="00000-000" className="w-full px-4 py-3 rounded-xl border border-grayLight focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                    </div>

                    {formData.type === 'tapete' && (
                      <div>
                        <label className="block text-sm font-medium mb-1 text-dark/80">Foto do Tapete (Opcional)</label>
                        <label className="border-2 border-dashed border-grayLight hover:border-accent transition-colors rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-grayLight/20 group relative overflow-hidden">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                          />
                          <Camera className="w-6 h-6 text-dark/40 group-hover:text-accent mb-2 transition-colors" />
                          <span className="text-sm text-dark/60 font-medium">
                            {formData.photo ? formData.photo.name : "Toque para fazer upload"}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button onClick={prevStep} className="px-6 py-3 rounded-full font-medium text-dark/70 hover:bg-grayLight transition-colors flex items-center">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                    </button>
                    <button onClick={nextStep} className="px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center btn-magnetic">
                      <span className="btn-content flex items-center">Próximo <ArrowRight className="w-4 h-4 ml-2" /></span>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-heading font-bold mb-2">Quase lá!</h3>
                  <p className="text-dark/70 mb-6">Para onde enviamos o seu orçamento personalizado?</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-dark/80">Nome</label>
                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleInput} placeholder="Seu nome" className="w-full px-4 py-3 rounded-xl border border-grayLight focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-dark/80">Sobrenome</label>
                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleInput} placeholder="Sobrenome" className="w-full px-4 py-3 rounded-xl border border-grayLight focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-dark/80">WhatsApp</label>
                      <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInput} placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border border-grayLight focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-dark/80">E-mail</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInput} placeholder="seu@email.com" className="w-full px-4 py-3 rounded-xl border border-grayLight focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                    </div>

                    <div className="flex justify-between mt-8">
                      <button type="button" onClick={prevStep} className="px-6 py-3 rounded-full font-medium text-dark/70 hover:bg-grayLight transition-colors flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                      </button>
                      <button type="submit" className="px-8 py-3 rounded-full bg-accent text-white font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center btn-magnetic">
                        <span className="btn-content">Enviar Pedido</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                      <Check className="w-10 h-10 text-secondary" />
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-2">Orçamento Solicitado!</h3>
                  <p className="text-dark/70 mb-8 max-w-sm">
                    Tudo certo, {formData.firstName}. Nossa equipe já está calculando o melhor valor e vai te chamar no WhatsApp em alguns minutos.
                  </p>
                  <button onClick={onClose} className="px-8 py-3 rounded-full border border-grayLight font-medium hover:bg-grayLight/50 transition-colors">
                    Fechar Janela
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
