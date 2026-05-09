/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Gem,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  material: string;
  image: string;
  badge?: string;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Mock Data ---
const CATEGORIES = [
  { id: 'aneis', name: 'Anéis', count: 24, image: 'bg-gradient-to-br from-gray-200 to-[#F2B5A6]' },
  { id: 'colares', name: 'Colares', count: 18, image: 'bg-gradient-to-br from-gray-200 to-[#E8E4E0]' },
  { id: 'brincos', name: 'Brincos', count: 31, image: 'bg-gradient-to-br from-[#F2B5A6] to-gray-200' },
  { id: 'pulseiras', name: 'Pulseiras', count: 15, image: 'bg-gradient-to-br from-[#E8E4E0] to-gray-200' },
];

const PRODUCTS: Product[] = [
  { id: 1, name: 'Anel Solitário Éter', category: 'aneis', price: 4200, material: 'Ouro 18k e Diamante', image: 'bg-gradient-to-b from-[#F5F3F0] to-[#E8E4E0]', badge: 'NOVO' },
  { id: 2, name: 'Colar Cascata de Luz', category: 'colares', price: 8900, material: 'Ouro Branco e Safiras', image: 'bg-gradient-to-b from-[#F5F3F0] to-[#F2B5A6]', badge: 'EXCLUSIVO' },
  { id: 3, name: 'Brincos Aurora Gota', category: 'brincos', price: 2150, material: 'Prata 950 e Pérolas', image: 'bg-gradient-to-b from-[#F2B5A6] to-[#F5F3F0]' },
  { id: 4, name: 'Pulseira Vínculo Infinito', category: 'pulseiras', price: 3700, material: 'Ouro Rose 18k', image: 'bg-gradient-to-b from-[#E8E4E0] to-[#F5F3F0]' },
  { id: 5, name: 'Anel Aliança Singular', category: 'aneis', price: 1800, material: 'Platina e Esmeraldas', image: 'bg-gradient-to-b from-[#F5F3F0] to-gray-200', badge: 'NOVO' },
  { id: 6, name: 'Gargantilha Essência', category: 'colares', price: 5400, material: 'Ouro 18k', image: 'bg-gradient-to-b from-gray-100 to-[#E8E4E0]' },
  { id: 7, name: 'Brincos Prisma Real', category: 'brincos', price: 6200, material: 'Ouro Branco e Topázio', image: 'bg-gradient-to-b from-[#F5F3F0] to-[#F2B5A6]' },
  { id: 8, name: 'Pulseira Harmonia Ocre', category: 'pulseiras', price: 2900, material: 'Ouro 18k e Quartzos', image: 'bg-gradient-to-b from-[#E8E4E0] to-gray-50' },
];

const TESTIMONIALS = [
  { id: 1, name: 'Heloísa Santos', city: 'São Paulo, SP', initial: 'H', text: '"A qualidade da peça é surreal. Comprei o colar Cascata e recebo elogios onde quer que eu vá. Atendimento impecável."' },
  { id: 2, name: 'Mariana Costa', city: 'Curitiba, PR', initial: 'M', text: '"Meu anel de noivado foi da Aurum. É a joia mais linda que já vi, o brilho do diamante é único. Recomendo de olhos fechados."' },
  { id: 3, name: 'Bárbara Almeida', city: 'Rio de Janeiro, RJ', initial: 'B', text: '"A embalagem, o envio seguro e o certificado de garantia me deixaram muito tranquila. Uma experiência de luxo real."' },
];

// --- Components ---

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseEnter);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor hidden md:block ${isHovering ? 'active' : ''}`} 
    />
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('TODOS');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Filters
  const filteredProducts = useMemo(() => {
    if (activeTab === 'TODOS') return PRODUCTS;
    return PRODUCTS.filter(p => p.category.toUpperCase() === activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist logic
  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]);
  };

  return (
    <div className="relative overflow-x-hidden">
      <CustomCursor />
      <div className="progress-bar loading-line" />

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-sm py-3 shadow-sm' : 'bg-white py-6 border-border'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <div className="hidden md:flex flex-1 items-center gap-8">
            <a href="#" className="text-xs-spacing hover:text-salmon transition-colors">Coleções</a>
            <a href="#" className="text-xs-spacing hover:text-salmon transition-colors">Novidades</a>
          </div>

          <div className="flex-1 flex justify-center cursor-pointer">
            <img 
              src="https://i.ibb.co/S7mcHWJf/jewelry.png" 
              alt="AURUM Logo" 
              className="h-12 md:h-16 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex flex-1 justify-end items-center gap-6">
            <div className="hidden md:flex gap-8 mr-8">
              <a href="#" className="text-xs-spacing hover:text-salmon transition-colors">Sobre</a>
              <a href="#" className="text-xs-spacing hover:text-salmon transition-colors">Contato</a>
            </div>
            
            <button className="hover:text-salmon transition-colors"><Search size={22} strokeWidth={1.2} /></button>
            <button className="hover:text-salmon transition-colors relative">
              <Heart size={22} strokeWidth={1.2} className={wishlist.length > 0 ? 'fill-salmon text-salmon' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-salmon rounded-full" />
              )}
            </button>
            <button 
              className="hover:text-salmon transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={22} strokeWidth={1.2} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-salmon text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-[70] p-10 flex flex-col gap-12"
            >
              <button onClick={() => setIsMenuOpen(false)} className="self-end"><X size={32} strokeWidth={1} /></button>
              <div className="flex justify-start">
                <img 
                  src="https://i.ibb.co/S7mcHWJf/jewelry.png" 
                  alt="AURUM Logo" 
                  className="h-12 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col gap-8">
                <a href="#" className="text-lg font-serif">Coleções</a>
                <a href="#" className="text-lg font-serif">Novidades</a>
                <a href="#" className="text-lg font-serif">Sobre a Marca</a>
                <a href="#" className="text-lg font-serif">Contato</a>
              </div>
              <div className="mt-auto flex gap-6 text-gray-mid">
                <span className="text-xs-spacing">Instagram</span>
                <span className="text-xs-spacing">Pinterest</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-border">
                <h2 className="font-serif text-2xl">Sacola de Compras ({cartCount})</h2>
                <button onClick={() => setIsCartOpen(false)}><X size={24} strokeWidth={1} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                    <ShoppingBag size={48} className="text-gray-light" strokeWidth={1} />
                    <p className="text-gray-mid">Sua sacola está vazia.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-salmon px-8 py-3 text-white text-xs-spacing hover:bg-salmon-dark transition-all mt-4"
                    >
                      Ver Coleções
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div layout key={item.id} className="flex gap-4">
                      <div className={`w-24 h-32 ${item.image} flex-shrink-0`} />
                      <div className="flex-1 flex flex-col py-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-mid hover:text-salmon"><Trash2 size={16} /></button>
                        </div>
                        <p className="text-xs text-gray-mid mt-1 uppercase tracking-wider">{item.material}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-2 hover:bg-gray-light"><Minus size={12} /></button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-2 hover:bg-gray-light"><Plus size={12} /></button>
                          </div>
                          <span className="font-semibold text-salmon">R$ {(item.price * item.quantity).toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-gray-light">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-mid font-medium">Subtotal</span>
                    <span className="text-2xl font-serif text-black">R$ {cartTotal.toLocaleString('pt-BR')}</span>
                  </div>
                  <button className="w-full bg-salmon py-5 text-white text-xs-spacing font-bold hover:bg-salmon-dark transition-all flex items-center justify-center gap-2">
                    Finalizar Compra <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 md:pt-24 md:pb-12 md:min-h-screen flex items-center bg-white overflow-hidden relative">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12 py-12">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-[45%] flex flex-col items-center md:items-start text-center md:text-left z-10"
          >
            <span className="text-xs-spacing text-salmon mb-6 block">Fine Jewelry Collection</span>
            <h1 className="text-5xl lg:text-7xl xl:text-[80px] leading-[1.1] md:leading-[1] mb-8 font-serif font-light text-black">
              Joias que <br className="hidden lg:block" />
              <span className="italic font-normal">contam histórias</span>
            </h1>
            <p className="text-gray-dark font-light text-base md:text-lg mb-10 max-w-md">
              Descubra a eternidade através de design autoral e metais nobres certificados. Peças criadas para celebrar momentos únicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-salmon text-white px-10 py-5 text-xs-spacing hover:bg-salmon-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-salmon/20 whitespace-nowrap"
              >
                Comprar Coleção
              </button>
              <button className="border border-black px-10 py-5 text-xs-spacing hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 whitespace-nowrap">
                Sobre a Aurum
              </button>
            </div>
          </motion.div>

          {/* Image/Visual Part */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full md:w-[55%] aspect-square md:aspect-auto md:h-[600px] lg:h-[700px] relative px-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3F0] via-[#F2B5A6]/20 to-[#E8E4E0] rounded-[2px] overflow-hidden">
               {/* Aesthetic overlapping elements */}
               <motion.div 
                 animate={{ rotate: [0, 5, 0], y: [0, -10, 0] }}
                 transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                 className="absolute top-20 right-10 w-64 h-80 bg-white shadow-xl opacity-80"
                />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/30 backdrop-blur-[2px] border border-white/50" />
               <motion.div 
                 initial={{ y: 50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 0.8 }}
                 className="absolute inset-0 flex items-center justify-center"
               >
                 <Gem size={180} strokeWidth={0.2} className="text-salmon-light/60" />
               </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-border relative overflow-hidden">
            <motion.div 
              animate={{ top: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute w-full h-1/2 bg-salmon"
            />
          </div>
          <span className="text-[10px] text-gray-mid uppercase tracking-[0.2em] mt-2">Scroll</span>
        </motion.div>
      </section>

      {/* --- STRIP DE DIFERENCIAIS --- */}
      <section className="bg-gray-light py-16 border-y border-border">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { Icon: Gem, text: 'Ouro 18k certificado' },
            { Icon: ShieldCheck, text: 'Garantia vitalícia' },
            { Icon: Truck, text: 'Envio seguro' },
            { Icon: RotateCcw, text: 'Devolução 30 dias' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4 text-center group">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-salmon transition-transform duration-500 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm">
                <item.Icon size={20} strokeWidth={1.5} />
              </div>
              <span className="text-xs-spacing text-gray-dark">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- CATEGORIAS EM DESTAQUE --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="section-title">
            <span className="text-xs-spacing text-salmon mb-2">Curadoria Especial</span>
            <h2 className="text-black uppercase tracking-widest">Nossas Categorias</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <motion.div 
                key={cat.id} 
                className="relative aspect-square cursor-pointer group overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`absolute inset-0 ${cat.image} transition-transform duration-700 group-hover:scale-110`} />
                <div className="absolute inset-0 bg-salmon/0 group-hover:bg-salmon/40 transition-all duration-500 flex items-center justify-center">
                  <div className="text-center opacity-100 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-black md:group-hover:text-white transition-colors duration-500 font-serif text-2xl uppercase tracking-widest">{cat.name}</h3>
                    <p className="text-xs-spacing text-gray-mid md:group-hover:text-white/80 transition-colors duration-500 mt-2">{cat.count} peças</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRODUTOS EM DESTAQUE --- */}
      <section id="featured-products" className="py-24 bg-gray-light/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="text-left">
              <span className="text-xs-spacing text-salmon mb-2 block">Destaques da Temporada</span>
              <h2 className="font-serif text-4xl text-black">Coleção em Destaque</h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {['TODOS', 'ANÉIS', 'COLARES', 'BRINCOS', 'PULSEIRAS'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 text-xs-spacing transition-all rounded-[1px] ${activeTab === tab ? 'bg-salmon text-white border-salmon' : 'bg-transparent text-gray-mid border-transparent hover:text-black border hover:border-gray-mid'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => (
                <motion.div 
                  layout
                  key={p.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] bg-color-gray-light overflow-hidden mb-6">
                    <div className={`absolute inset-0 ${p.image} transform transition-transform duration-700 group-hover:scale-110`} />
                    
                    {p.badge && (
                      <span className={`absolute top-4 left-4 text-[10px] uppercase font-bold tracking-widest px-3 py-1 z-10 ${p.badge === 'NOVO' ? 'bg-salmon text-white' : 'bg-black text-white'}`}>
                        {p.badge}
                      </span>
                    )}

                    <button 
                      onClick={() => toggleWishlist(p.id)}
                      className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all ${wishlist.includes(p.id) ? 'text-salmon fill-salmon' : 'text-black hover:text-salmon'}`}
                    >
                      <Heart size={18} strokeWidth={1.5} />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-500 translate-y-full group-hover:translate-y-0">
                      <button 
                        onClick={() => addToCart(p)}
                        className="w-full bg-white py-4 text-xs-spacing font-bold text-black border border-border hover:bg-salmon hover:text-white hover:border-salmon transition-all flex items-center justify-center gap-2"
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>

                  <div className="text-center md:text-left space-y-1">
                    <p className="text-xs-spacing text-gray-mid font-light">{p.category}</p>
                    <h3 className="font-serif text-xl text-black">{p.name}</h3>
                    <p className="text-xs font-light text-gray-mid mb-2 italic">Em {p.material}</p>
                    <p className="font-medium text-lg text-black">R$ {p.price.toLocaleString('pt-BR')}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- BANNER EDITORIAL MID-PAGE --- */}
      <section className="relative h-[600px] overflow-hidden bg-black text-white flex items-center">
        <div className="absolute inset-0 opacity-40">
           {/* Dynamic abstract textures for high end look */}
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-salmon/40 to-transparent flex items-center justify-end p-20">
             <Gem size={400} strokeWidth={0.1} />
           </div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <span className="text-xs-spacing text-salmon-light mb-6 block">Legado e Paixão</span>
            <h2 className="text-6xl md:text-7xl font-serif leading-tight mb-8">
              Feito para <br />
              <span className="italic">durar gerações</span>
            </h2>
            <p className="text-salmon-light text-lg font-light mb-12 leading-relaxed">
              Cada joia Aurum é um investimento no amanhecer. Combinamos técnicas milenares com design contemporâneo para criar tesouros imortais.
            </p>
            <button className="border border-white/30 px-12 py-5 text-xs-spacing hover:bg-salmon hover:border-salmon transition-all">
              Conheça a Oficina
            </button>
          </div>
        </div>
      </section>

      {/* --- COLEÇÃO EM DESTAQUE --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-20">
            <div className="w-12 h-[1px] bg-salmon" />
            <span className="text-xs-spacing text-salmon">Editorial</span>
            <h2 className="font-serif text-3xl ml-4">Coleção <span className="italic">Eternidade</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div 
               whileInView={{ x: [-20, 0], opacity: [0, 1] }}
               viewport={{ once: true }}
               className="lg:col-span-7 aspect-[4/5] bg-gray-light relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 via-gray-100 to-white" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xs-spacing mb-4 block">Peça Central</span>
                    <h3 className="font-serif text-4xl mb-4 italic text-salmon-dark">Gargantilha Infinito</h3>
                    <p className="text-gray-mid uppercase text-[10px] tracking-widest border-y border-border py-2 px-8 inline-block">Série Limitada</p>
                  </div>
               </div>
               <div className="absolute bottom-10 left-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/20 p-8 backdrop-blur-sm">
                  <p className="font-serif text-2xl italic mb-4">"A simbiose perfeita entre metal e luz"</p>
                  <p className="text-xs uppercase tracking-widest">Aurum Collective, 2024</p>
               </div>
            </motion.div>

            <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
              <motion.div 
                whileInView={{ x: [20, 0], opacity: [0, 1] }}
                viewport={{ once: true }}
                className="h-[45%] bg-gray-light/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F2B5A6]/10 to-transparent" />
                <div className="p-10">
                   <h4 className="font-serif text-2xl mb-4">Par de Brincos Éter</h4>
                   <p className="text-gray-dark font-light text-sm mb-6 max-w-[200px]">Design minimalista que eleva a beleza natural da gema lapidada.</p>
                   <button className="text-xs-spacing text-salmon flex items-center gap-2 hover:gap-4 transition-all">Ver Detalhes <ArrowRight size={14} /></button>
                </div>
              </motion.div>

              <motion.div 
                whileInView={{ x: [20, 0], opacity: [0, 1] }}
                viewport={{ once: true }}
                className="h-[45%] bg-black text-white relative overflow-hidden"
              >
                <div className="p-10 relative z-10">
                   <span className="text-[10px] uppercase tracking-widest text-salmon mb-4 block">New Drop</span>
                   <h4 className="font-serif text-2xl mb-4 italic">Anel Solitário III</h4>
                   <p className="text-salmon-light/80 font-light text-sm mb-6 max-w-[200px]">Uma ode ao amor e ao compromisso eterno.</p>
                   <button className="text-xs-spacing hover:text-salmon transition-colors flex items-center gap-2">Explorar Joia <ArrowRight size={14} /></button>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-salmon/10 -rotate-12 translate-x-12 translate-y-12" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DEPOIMENTOS --- */}
      <section className="py-24 bg-gray-light/30">
        <div className="container mx-auto px-6">
          <div className="section-title">
            <span className="text-xs-spacing text-salmon mb-2">Comunidade Aurum</span>
            <h2 className="text-black uppercase tracking-widest">O que dizem nossas clientes</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
             <div className="overflow-hidden">
                <motion.div 
                  animate={{ x: `-${testimonialIndex * 100}%` }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  className="flex"
                >
                  {TESTIMONIALS.map((t) => (
                    <div key={t.id} className="min-w-full px-4 text-center space-y-8">
                       <div className="w-16 h-16 rounded-full bg-white border border-border mx-auto flex items-center justify-center text-xl font-medium text-salmon-dark shadow-sm">
                         {t.initial}
                       </div>
                       <div className="flex justify-center text-salmon">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                       </div>
                       <blockquote className="font-serif text-2xl italic font-light text-black leading-relaxed">
                         {t.text}
                       </blockquote>
                       <div>
                         <p className="font-bold text-sm text-black tracking-widest uppercase">{t.name}</p>
                         <p className="text-xs text-gray-mid mt-1 uppercase tracking-wider">{t.city}</p>
                       </div>
                    </div>
                  ))}
                </motion.div>
             </div>

             <div className="flex justify-center gap-8 mt-12">
               <button 
                 onClick={() => setTestimonialIndex(prev => Math.max(0, prev - 1))}
                 className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all ${testimonialIndex === 0 ? 'text-gray-light' : 'text-black hover:bg-white hover:border-salmon hover:text-salmon'}`}
               >
                 <ChevronLeft size={20} />
               </button>
               <button 
                 onClick={() => setTestimonialIndex(prev => Math.min(TESTIMONIALS.length - 1, prev + 1))}
                 className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all ${testimonialIndex === TESTIMONIALS.length - 1 ? 'text-gray-light' : 'text-black hover:bg-white hover:border-salmon hover:text-salmon'}`}
               >
                 <ChevronRight size={20} />
               </button>
             </div>

             <div className="flex justify-center gap-3 mt-8">
               {TESTIMONIALS.map((_, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setTestimonialIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${testimonialIndex === idx ? 'w-6 bg-salmon' : 'bg-border'}`}
                  />
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="py-24 bg-salmon relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 text-center text-white relative z-10">
          <h2 className="font-serif text-5xl mb-6">Mantenha-se <span className="italic">Inspirado</span></h2>
          <p className="font-light text-sm opacity-90 mb-12 max-w-lg mx-auto tracking-widest uppercase">Assine nosso Ateliê News e receba lançamentos exclusivos e histórias sobre o mundo da alta joalheria.</p>
          
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="e-mail" 
              className="flex-1 bg-white/10 border border-white/20 py-4 px-6 text-sm focus:outline-none focus:bg-white/20 transition-all placeholder:text-white/50 text-white"
            />
            <button className="bg-black text-white px-10 py-4 text-xs-spacing font-bold hover:bg-white hover:text-black transition-all">
              Assinar
            </button>
          </form>
          <p className="text-[10px] opacity-60 mt-6 tracking-[0.1em] uppercase">Respeitamos sua privacidade. Seus dados estão seguros conosco.</p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-light pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2">
              <img 
                src="https://i.ibb.co/S7mcHWJf/jewelry.png" 
                alt="AURUM Logo" 
                className="h-16 object-contain mb-8"
                referrerPolicy="no-referrer"
              />
              <p className="text-gray-mid font-light italic max-w-sm leading-relaxed">
                "Curadoria de momentos, metais que transcendem o tempo." A Aurum é o destino para quem valoriza a beleza nos detalhes e a pureza nos materiais.
              </p>
              <div className="flex gap-4 mt-8">
                {['Instagram', 'Pinterest', 'Facebook'].map(s => (
                  <a key={s} href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-gray-mid hover:text-salmon hover:border-salmon transition-colors">
                    <span className="sr-only">{s}</span>
                    <div className="w-1.5 h-1.5 bg-current rounded-full" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs-spacing text-black font-bold mb-8">Navegação</h4>
              <ul className="space-y-4">
                {['Coleções', 'Novidades', 'Outlet', 'Sobre Nós'].map(l => (
                   <li key={l}><a href="#" className="text-sm text-gray-mid hover:text-salmon transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs-spacing text-black font-bold mb-8">Atendimento</h4>
              <ul className="space-y-4">
                {['Envios e Prazos', 'Trocas e Devoluções', 'Guia de Medidas', 'FAQ'].map(l => (
                   <li key={l}><a href="#" className="text-sm text-gray-mid hover:text-salmon transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <h4 className="text-xs-spacing text-black font-bold mb-8">Nossa Boutique</h4>
              <p className="text-sm text-gray-mid leading-relaxed">
                Av. das Araras, 1200 <br />
                Vila Mariana, São Paulo - SP <br />
                <span className="block mt-4">boutique@aurum.com.br</span>
                <span>(11) 98888-7777</span>
              </p>
            </div>
          </div>

          <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-gray-mid uppercase tracking-[0.2em]">© 2024 AURUM FINE JEWELRY. Todos os direitos reservados.</p>
            <div className="flex gap-8">
              <a href="#" className="text-[10px] text-gray-mid uppercase tracking-[0.2em] hover:text-salmon">Termos de Uso</a>
              <a href="#" className="text-[10px] text-gray-mid uppercase tracking-[0.2em] hover:text-salmon">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

