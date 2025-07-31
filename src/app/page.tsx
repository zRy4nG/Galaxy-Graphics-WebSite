'use client'

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoMdCart, IoMdMenu, IoMdClose } from "react-icons/io";
import { FaRegCopy, FaGithub, FaYoutube } from "react-icons/fa6";
import { FaDiscord, FaInstagram, FaInstagramSquare } from "react-icons/fa";
import { VscEye, VscClose } from "react-icons/vsc";
import { GoPerson } from "react-icons/go";
import { FiBox } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown, MdDashboard, MdLogout, MdAdminPanelSettings } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  key: string;
  image: string;
  name: string;
  price: number;
  description?: string;
  video?: string;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  id: string;
  key: string;
  imagem: string;
  nome: string;
  valor: number;
  quantity: number;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Home() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://galaxy-graphics-web-site-zs4i.vercel.app/api/produtos/getProduct');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      toast.error('Este produto já está no seu carrinho!');
      return;
    }
    
    const simplifiedProduct: CartItem = {
      id: product.id,
      key: product.key,
      imagem: product.image,
      nome: product.name,
      valor: product.price,
      quantity: 1
    };
    
    setCart([...cart, simplifiedProduct]);
    toast.success(`${product.name} adicionado ao carrinho!`);
    
    if (isModalOpen) {
      closeProductModal();
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setIsProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    toast.success('Você foi desconectado com sucesso!');
  };

  const navigateToDashboard = () => {
    setIsProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/dashboard');
  };

  const navigateToAdmin = () => {
    setIsProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/admin');
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const faqs: FAQ[] = [
    {
      question: "Onde posso obter suporte?",
      answer: "Acesse o nosso Discord e crie um ticket. Nossa equipe irá atendê-lo imediatamente.",
    },
    {
      question: "Como posso alterar minha senha?",
      answer: "Vá até as configurações da sua conta e clique em 'Alterar Senha'.",
    },
    {
      question: "Quais são os métodos de pagamento aceitos?",
      answer: "Aceitamos Pix, Boleto, Cartão de Crédito e PayPal.",
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-black gap-4">
        <div className="w-16 h-16 border-4 border-[#7939FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  function getYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />

      {isModalOpen && selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeProductModal();
            }
          }}
        >
            <button 
              onClick={closeProductModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#7939FF]"
              aria-label="Fechar modal"
            >
              <VscClose className="w-6 h-6 text-white/70" />
            </button>
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-xl max-w-4xl w-[600px] max-h-[90vh] overflow-y-auto">
            
            <div className="p-6">
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                {selectedProduct.video ? (
                  <div className="w-full h-0 pb-[56.25%] relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(selectedProduct.video)}`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="relative w-full h-64 md:h-80">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedProduct.name}</h2>
                <p className="text-[#7939FF] text-xl mt-2">R$ {selectedProduct.price.toFixed(2)}</p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-white/80 text-lg font-medium">Descrição</h3>
                <p className="text-white/50 mt-2">{selectedProduct.description || "Este produto não possui descrição detalhada."}</p>
              </div>
              
              <button 
                onClick={() => addToCart(selectedProduct)}
                className="w-full mt-6 py-3 bg-[#7939FF] rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-auto py-2 px-4 bg-[var(--primary)] flex flex-col md:flex-row items-center justify-center text-center gap-3">
        <h1 className="text-black/50 text-base md:text-xl">Ganhe 50% de desconto em nossa loja utilizando o cupom</h1>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-black/10 rounded-sm">
            <h1 className="text-black/50 text-lg">GALAXY35%</h1>
          </div>
          <FaRegCopy className="w-[22px] h-[22px] text-black/50 hover:bg-[var(--primary)] hover:cursor-pointer" />
        </div>
      </div>

      <div className='w-full min-h-screen bg-[url("https://i.imgur.com/Mv8p14f.png")] bg-no-repeat bg-cover bg-center'>
        <nav className="w-full h-[80px] backdrop-blur-md flex items-center border-b border-white/20 px-4 md:px-0">
          <div className="flex items-center justify-between w-[90%] mx-auto">
            <Image src="/favicon.ico" width={40} height={40} alt="Logo" />

            <div className="hidden md:flex gap-10 text-[#5F5F5F] text-lg items-center">
              <a className="text-[var(--primary)]" href="#">Início</a>
              <a className="hover:text-[var(--primary)] transition-all" href="#sobre">Sobre</a>
              <a className="hover:text-[var(--primary)] transition-all" href="#produtos">Produtos</a>
              <a className="hover:text-[var(--primary)] transition-all" href="#avaliacao">Avaliação</a>
              <a className="hover:text-[var(--primary)] transition-all" href="#faq">FAQ</a>
              <div className="flex gap-3 items-center">
                <a href="/Carrinho" className="relative">
                  <div className="w-[46px] h-[46px] bg-white/2 flex items-center justify-center rounded-full border border-white/10 hover:cursor-pointer hover:bg-[var(--primary)] transition-all group">
                    <IoMdCart className="group-hover:text-black" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#7939FF] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </div>
                </a>

                {status === "authenticated" ? (
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={toggleProfileDropdown}
                      className="focus:outline-none flex items-center gap-1"
                    >
                      <Image
                        src={session?.user?.image || "https://i.imgur.com/ygBhNv8.png"}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="rounded-full hover:ring-2 hover:ring-[#7939FF] transition-all cursor-pointer"
                      />
                      <MdOutlineKeyboardArrowDown 
                        className={`text-white/60 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white/6 border border-white/5 rounded-md shadow-lg z-50 overflow-hidden">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b border-white/5 bg-white/2">
                            <p className="text-sm text-white/80 font-medium">{session?.user?.name}</p>
                            <p className="text-xs text-white/50 truncate">{session?.user?.email}</p>
                          </div>
                          
                          <button
                            onClick={navigateToDashboard}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                          >
                            <MdDashboard className="text-lg" />
                            Dashboard
                          </button>
                          
                          {status === "authenticated" && session.user?.name === 'zryang' && (
                            <button
                              onClick={navigateToAdmin}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                            >
                              <MdAdminPanelSettings className="text-lg" />
                              Admin
                            </button>
                          )}
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                          >
                            <MdLogout className="text-lg" />
                            Sair
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => signIn("discord")}
                    className="w-[144px] h-[46px] bg-[var(--primary)] text-white rounded-full hover:cursor-pointer hover:opacity-85 transition-all"
                  >
                    Conectar
                  </button>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center gap-3">
              <a href="/Carrinho" className="relative">
                <div className="w-[40px] h-[40px] bg-white/2 flex items-center justify-center rounded-full border border-white/10 hover:cursor-pointer hover:bg-[var(--primary)] transition-all group">
                  <IoMdCart className="group-hover:text-black text-white/70" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#7939FF] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div>
              </a>
              
              <button 
                onClick={toggleMobileMenu}
                className="mobile-menu-button w-[40px] h-[40px] flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-all"
              >
                {mobileMenuOpen ? (
                  <IoMdClose className="text-white/70 w-6 h-6" />
                ) : (
                  <IoMdMenu className="text-white/70 w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-sm pt-20 px-4"
          >
            <div className="flex flex-col items-center space-y-6 py-6">
              <a 
                href="#" 
                className="text-white text-xl font-medium hover:text-[var(--primary)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </a>
              <a 
                href="#sobre" 
                className="text-white text-xl font-medium hover:text-[var(--primary)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </a>
              <a 
                href="#produtos" 
                className="text-white text-xl font-medium hover:text-[var(--primary)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produtos
              </a>
              <a 
                href="#avaliacao" 
                className="text-white text-xl font-medium hover:text-[var(--primary)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Avaliação
              </a>
              <a 
                href="#faq" 
                className="text-white text-xl font-medium hover:text-[var(--primary)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>

              {status === "authenticated" ? (
                <div className="flex flex-col items-center space-y-4 mt-6 w-full max-w-xs">
                  <div className="flex items-center gap-3">
                    <Image
                      src={session?.user?.image || "https://i.imgur.com/ygBhNv8.png"}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="text-white font-medium">{session?.user?.name}</span>
                  </div>

                  <button
                    onClick={navigateToDashboard}
                    className="w-full py-3 px-6 bg-white/5 rounded-lg text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
                  >
                    <MdDashboard className="text-lg" />
                    Dashboard
                  </button>

                  {status === "authenticated" && session.user?.name === 'zryang' && (
                    <button
                      onClick={navigateToAdmin}
                      className="w-full py-3 px-6 bg-white/5 rounded-lg text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
                    >
                      <MdAdminPanelSettings className="text-lg" />
                      Admin
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-6 bg-white/5 rounded-lg text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
                  >
                    <MdLogout className="text-lg" />
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn("discord");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full max-w-xs py-3 bg-[var(--primary)] text-white rounded-lg text-lg font-medium hover:opacity-85 transition-all"
                >
                  Conectar
                </button>
              )}
            </div>
          </div>
        )}

        <section className="flex flex-col w-[90%] md:w-[80%] mx-auto items-center text-center mt-20 md:mt-[160px]">
          <div className="max-w-[756px]">
            <div className="flex flex-wrap justify-center gap-2">
              {["#GALAXY35%", "#TOP 1", "#BR"].map((tag, i) => (
                <div key={i} className="px-4 py-2 border border-white/20 rounded-lg">
                  <h2 className="text-white/35">{tag}</h2>
                </div>
              ))}
            </div>
            <h1 className="text-[var(--primary)] text-[40px] sm:text-[50px] md:text-[65px] font-bold mt-4">GALAXY RESOURCES</h1>
            <p className="text-base md:text-lg text-white/35 mt-2">
              Não sabe aonde achar produtos de alta qualidade? compre conosco os resources exclusivos com detalhes únicos.
            </p>
            <div className="flex flex-col items-center sm:flex-row gap-4 justify-center mt-6">
                <button className="w-[90%] h-[56px] md:w-[239px] md:h-[68px] bg-[var(--primary)] rounded-full text-lg font-medium hover:opacity-80 transition-all cursor-pointer"><a href="#produtos">Produtos</a></button>
                <button className="w-[90%] h-[56px] md:w-[239px] md:h-[68px] rounded-full text-lg font-medium border border-[var(--primary)] text-[var(--primary)] hover:opacity-80 transition-all cursor-pointer">Encomendas</button>
            </div>

            <div className="flex gap-4 mt-8 justify-center">
              {[FaDiscord, FaInstagram, FaGithub, FaYoutube].map((Icon, i) => (
                <div key={i} className="w-[45px] h-[45px] border border-white/10 rounded-lg flex items-center justify-center hover:bg-[var(--primary)] group transition-all">
                  <Icon className="w-6 h-6 text-white/25 group-hover:text-black" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div id="sobre" className="w-full bg-white/1 border-y border-white/5 py-12 px-4">
        <div className="w-full max-w-[1240px] mx-auto text-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold">SOBRE NÓS</h1>
          <p className="text-white/35 text-base sm:text-lg md:text-xl mt-4">
            Somos especialistas no desenvolvimento de resources para MTA, com anos de experiência e centenas de clientes satisfeitos.
          </p>

          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mt-10">
            {[
              { Icon: GoPerson, title: "Clientes", desc: "Atualmente estamos com", value: "12 clientes" }, 
              { Icon: FiBox, title: "Produtos", desc: "Temos disponíveis", value: "18 produtos" }, 
              { Icon: IoMdCart, title: "Vendas", desc: "Realizamos mais de", value: "95 vendas" }
            ].map(({ Icon, title, desc, value }, i) => (
              <div key={i} className="w-[95%] max-w-[360px] p-6 border border-white/10 rounded-lg text-left">
                <Icon className="w-10 h-10 text-[var(--primary)]" />
                <h2 className="text-white text-xl font-medium mt-4">{title}</h2>
                <p className="text-white/35 text-base mt-2">
                  {desc} <span className="text-[var(--primary)]">{value}</span>.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> 

      <div id="produtos" className="max-w-screen-xl mx-auto mt-16 px-4 flex flex-col">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold text-center">PRODUTOS</h1>

        <div className="mt-12 grid gap-8 grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))]">
          {products.map((product) => (
            <div key={product.id} className="border-[1.7px] border-white/10 rounded-[18px] p-[17px]">
              <Image
                src={product.image}
                alt={product.name}
                width={399}
                height={224}
                className="w-full h-[224px] object-cover rounded-lg"
              />

              <div className="flex items-center mt-7">
                <h1 className="text-white text-[28px] font-medium">{product.name}</h1>

                {product.createdAt === product.updatedAt && (
                  <div className="w-[100px] h-[50px] bg-[var(--primary)] rounded-full flex items-center justify-center ml-3">
                    <h1 className="text-white text-[24px] font-medium">NEW</h1>
                  </div>
                )}
              </div>

              <h1 className="text-white/35 text-[20px] font-medium mt-2">por apenas</h1>
              <h1 className="text-[var(--primary)] text-[46px] font-medium mt-3">R$ {product.price.toFixed(2)}</h1>

              <div className="flex items-center justify-between mt-7">
                <button 
                  onClick={() => addToCart(product)}
                  className="w-[78%] h-[64px] bg-[var(--primary)] rounded-full hover:opacity-90 text-[24px] font-medium"
                >
                  Comprar
                </button>
                <button 
                  onClick={() => openProductModal(product)}
                  className="w-[64px] h-[64px] bg-white/5 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <VscEye className="group-hover:text-white/40 w-[32px] h-[32px] text-white/35" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div id="avaliacao" className="bg-white py-12 md:py-20 px-4 sm:px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-black text-3xl sm:text-4xl md:text-5xl font-bold">AVALIAÇÕES</h1>
            <p className="text-black/50 text-base md:text-lg mt-3 md:mt-4 max-w-2xl mx-auto">
              Veja o que nossos clientes tem a dizer sobre nossos produtos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="border-2 border-black/20 rounded-xl p-6 md:p-8 hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image 
                    src="https://i.imgur.com/GlEJYzN.png" 
                    alt="Avatar do cliente"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                
                <div className="flex flex-col">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Image
                        key={i}
                        className="w-5 h-5 md:w-6 md:h-6"
                        src={i < 4 ? "https://i.imgur.com/CMUOPg5.png" : "https://i.imgur.com/uvUB7HD.png"}
                        width={24}
                        height={24}
                        alt={i < 4 ? "Estrela preenchida" : "Estrela vazia"}
                      />
                    ))}
                  </div>
                  <h3 className="text-black text-lg md:text-xl font-bold">Ana Costa</h3>
                </div>
              </div>
              <p className="text-black/50 mt-4 md:mt-5 text-sm md:text-base">
                "O serviço perfeito, resources funcionando excepcionalmente."
              </p>
            </div>

            <div className="border-2 border-black/20 rounded-xl p-6 md:p-8 hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image 
                    src="https://i.imgur.com/GlEJYzN.png" 
                    alt="Avatar do cliente"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                
                <div className="flex flex-col">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Image
                        key={i}
                        className="w-5 h-5 md:w-6 md:h-6"
                        src={i < 5 ? "https://i.imgur.com/CMUOPg5.png" : "https://i.imgur.com/uvUB7HD.png"}
                        width={24}
                        height={24}
                        alt={i < 5 ? "Estrela preenchida" : "Estrela vazia"}
                      />
                    ))}
                  </div>
                  <h3 className="text-black text-lg md:text-xl font-bold">Carlos Silva</h3>
                </div>
              </div>
              <p className="text-black/50 mt-4 md:mt-5 text-sm md:text-base">
                "Produtos de alta qualidade e suporte rápido. Recomendo!"
              </p>
            </div>

            <div className="border-2 border-black/20 rounded-xl p-6 md:p-8 hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image 
                    src="https://i.imgur.com/GlEJYzN.png" 
                    alt="Avatar do cliente"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                
                <div className="flex flex-col">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Image
                        key={i}
                        className="w-5 h-5 md:w-6 md:h-6"
                        src={i < 5 ? "https://i.imgur.com/CMUOPg5.png" : "https://i.imgur.com/uvUB7HD.png"}
                        width={24}
                        height={24}
                        alt={i < 5 ? "Estrela preenchida" : "Estrela vazia"}
                      />
                    ))}
                  </div>
                  <h3 className="text-black text-lg md:text-xl font-bold">João Santos</h3>
                </div>
              </div>
              <p className="text-black/50 mt-4 md:mt-5 text-sm md:text-base">
                "Melhor loja de resources para MTA que já comprei."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div id="faq" className="bg-white/1 mt-[100px] border-t border-b border-white/6">
        <div className="flex flex-col w-[90%] md:w-[80%] mx-auto items-center text-center pb-[40px]">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mt-[40px]">PERGUNTAS FREQUENTES</h1>
          <div className="w-[80%] ml-auto mr-auto mt-[20px]">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                onClick={() => toggle(index)} 
                className="bg-white/2 border border-white/2 rounded-[20px] w-full p-[22px] mt-[20px] cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center gap-2 ml-[10px]">
                  <div className={`w-[36px] h-[4px] rounded-full transition-colors duration-300 ${openIndex === index ? "bg-[#7939FF]" : "bg-white/15"}`}></div>
                  <h1 className="text-white text-[20px] font-medium ml-[10px]">{faq.question}</h1>
                  <MdOutlineKeyboardArrowDown className={`w-[30px] h-[30px] ml-auto mr-[20px] text-white/40 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
                </div>
                {openIndex === index && <p className="text-left mt-[10px] text-white/35 text-[18px] font-medium ml-[10px]">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="bg-[#0e0e0e] border-t border-white/10 mt-[100px]">
        <div className="flex flex-col md:flex-row justify-between items-center w-[90%] md:w-[80%] mx-auto py-6 text-white/40 text-sm">
          <div className="mb-4 md:mb-0 text-white/50 text-[15px] font-medium">Galaxy Resources © 2025 — A referência em vendas e serviços para o MTA</div>
          <div className="flex gap-4 text-white/40 text-xl">
            <a className="hover:text-[#7939FF] text-white/25 transition-all" href="#"><FaInstagramSquare /></a>
            <a className="hover:text-[#7939FF] text-white/25 transition-all" href="#"><FaInstagramSquare /></a>
            <a className="hover:text-[#7939FF] text-white/25 transition-all" href="#"><FaInstagramSquare /></a>
            <a className="hover:text-[#7939FF] text-white/25 transition-all" href="#"><FaInstagramSquare /></a>
          </div>
        </div>
        <div className="bg-[#7939FF] text-center py-2 h-[42px] flex items-center justify-center">
          <p className="text-black text-[17px] font-medium">Desenvolvido com carinho por zRy4nG.</p>
        </div>
      </footer>
    </>
  );
}
