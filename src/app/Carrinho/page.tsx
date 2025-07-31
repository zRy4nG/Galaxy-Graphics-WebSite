'use client'

import Image from "next/image";
import { FaRegTrashAlt, FaPaypal } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { SiMercadopago } from "react-icons/si";
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function Carrinho() {
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [carrinhoItens, setCarrinhoItens] = useState([]);

  useEffect(() => {
    const carregarCarrinho = () => {
      if (typeof window !== 'undefined') {
        const carrinhoSalvo = localStorage.getItem('cart');
        if (carrinhoSalvo) {
          const itensCarrinho = JSON.parse(carrinhoSalvo);
          setCarrinhoItens(itensCarrinho);
        }
      }
    };

    carregarCarrinho();
  }, []);

  const handleSelecionarPagamento = (metodo) => {
    if (metodo == "paypal") {
      return toast.error('Método de pagamento indisponível!')
    }

    setMetodoPagamento(metodo);
    toast.success('Método de pagamento selecionado com sucesso!')
  };

  const removerItem = (id) => {
    if (typeof window !== 'undefined') {
      const carrinhoAtual = JSON.parse(localStorage.getItem('cart')) || [];
      const novoCarrinho = carrinhoAtual.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(novoCarrinho));
      setCarrinhoItens(novoCarrinho);
      toast.success('Produto removido com sucesso!')
    }
  };

  const calcularTotal = () => {
    return carrinhoItens.reduce((total, item) => total + (item.valor * (item.quantity || 1)), 0);
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />

      <div className='w-full min-h-screen bg-[url("https://i.imgur.com/DNxZ2m0.png")] bg-no-repeat bg-cover bg-center bg-amber-[#0B0B0F] pt-[25px]'>

        <div className="w-[90%] md:w-[80%] ml-auto mr-auto flex flex-col lg:flex-row justify-center mt-25">
          <div className="w-full lg:w-[65%] p-[15px] lg:p-[25px]">
            <h1 className="text-white/80 text-[20px] font-medium pb-[25px]">Meu carrinho ({carrinhoItens.length})</h1>

            {carrinhoItens.length === 0 ? (
              <div className="bg-white/2 border border-white/3 rounded-[8px] p-[22px] text-center">
                <p className="text-white/50">Seu carrinho está vazio</p>
              </div>
            ) : (
              carrinhoItens.map((item) => (
                <div key={item.id} className="bg-white/2 border border-white/3 rounded-[8px] p-[15px] lg:p-[22px] mb-[10px]">
                  <div className="flex items-center">
                    <Image 
                      className="w-[70px] h-[70px] lg:w-[90px] lg:h-[90px] rounded-[8px]" 
                      src={item.imagem || "/default-product.png"} 
                      width={90} 
                      height={90} 
                      alt={item.nome || "Produto sem nome"} 
                    />
                    <div className="ml-[15px] lg:ml-[20px]">
                      <h1 className="text-white/35 text-[16px] lg:text-[20px] font-medium">{item.nome || "Produto sem nome"}</h1>
                      <p className="text-white/20 text-[16px] lg:text-[20px] font-regular">
                        R$ {(item.valor || 0).toFixed(2)} {item.quantity > 1 && `x ${item.quantity}`}
                      </p>
                    </div>
                    <FaRegTrashAlt 
                      className="ml-auto w-[24px] h-[24px] lg:w-[28px] lg:h-[28px] mr-[10px] lg:mr-[20px] text-white/15 hover:text-[#A23D3D] transition-all cursor-pointer"
                      onClick={() => removerItem(item.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="w-full lg:w-[450px] h-[525px] mt-[25px] lg:mt-0 lg:ml-[25px] bg-white/1 border-white/2 border rounded-[10px] pb-[30px]">
            <h1 className="ml-[25px] mt-[25px]">Método de Pagamento</h1>

            <div className="flex flex-nowrap overflow-x-auto gap-2 p-[15px] lg:p-[25px] no-scrollbar">
              <div 
                className={`flex-shrink-0 w-[126px] h-[80px] ${metodoPagamento === 'pix' ? 'bg-[#7D67E8]' : 'bg-white/1'} border ${metodoPagamento === 'pix' ? 'border-[#7D67E8]' : 'border-white/2'} rounded-[8px] flex items-center justify-center group transition-all hover:bg-[#7D67E8] cursor-pointer`}
                onClick={() => handleSelecionarPagamento('pix')}
              >
                <div className="text-center transition-all">
                  <FaPix className={`w-[20px] h-[20px] ${metodoPagamento === 'pix' ? 'text-white' : 'text-[#7D67E8]'} group-hover:text-white transition-all`}/>
                  <h1 className={`mt-2 ${metodoPagamento === 'pix' ? 'text-white' : 'text-white'}`}>Pix</h1>
                </div>
              </div>
              <div 
                className={`flex-shrink-0 w-[126px] h-[80px] ${metodoPagamento === 'mercadopago' ? 'bg-[#7D67E8]' : 'bg-white/1'} border ${metodoPagamento === 'mercadopago' ? 'border-[#7D67E8]' : 'border-white/2'} rounded-[8px] flex items-center justify-center group transition-all hover:bg-[#7D67E8] cursor-pointer`}
                onClick={() => handleSelecionarPagamento('mercadopago')}
              >
                <div className="">
                  <SiMercadopago className={`w-[20px] h-[20px] ${metodoPagamento === 'mercadopago' ? 'text-white' : 'text-[#7D67E8]'} ml-auto mr-auto group-hover:text-white transition-all`}/>
                  <h1 className={`mt-2 ${metodoPagamento === 'mercadopago' ? 'text-white' : 'text-white'}`}>Mercado Pago</h1>
                </div>
              </div>
              <div 
                className={`flex-shrink-0 w-[126px] h-[80px] ${metodoPagamento === 'paypal' ? 'bg-[#7D67E8]' : 'bg-white/1'} border ${metodoPagamento === 'paypal' ? 'border-[#7D67E8]' : 'border-white/2'} rounded-[8px] flex items-center justify-center group transition-all hover:bg-[#7D67E8] cursor-no-drop`}
                onClick={() => handleSelecionarPagamento('paypal')}
              >
                <div className="">
                  <FaPaypal className={`w-[20px] h-[20px] ${metodoPagamento === 'paypal' ? 'text-white' : 'text-[#7D67E8]'} ml-auto mr-auto group-hover:text-white transition-all`}/>
                  <h1 className={`mt-2 ${metodoPagamento === 'paypal' ? 'text-white' : 'text-white'}`}>PayPal</h1>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/5"></div>

            <h1 className="ml-[25px] mt-[25px]">Cupom de desconto</h1>

            <div className="flex items-center justify-center pl-[15px] pr-[15px] lg:pl-[25px] lg:pr-[25px] mt-[15px] gap-2">
              <input type="text" placeholder="Digite seu Cupom" className="w-[70%] lg:w-[80%] bg-white/2 rounded-[5px] h-[48px] border border-white/2 pl-2" />
              <button className="w-[30%] lg:w-[105px] h-[48px] bg-[#7D67E8] rounded-[5px] h-[48px] border border-white/2 hover:opacity-70 transition-all cursor-pointer text-[14px] lg:text-[16px]">Aplicar</button>
            </div>

            <div className="w-full h-[1px] bg-white/5 mt-[15px]"></div>

            <div className="bg-white/1 border border-white/2 rounded-[8px] p-[12px] ml-[15px] mr-[15px] lg:ml-[25px] lg:mr-[25px] mt-[25px]">
              <div className="flex">
                <h1 className="text-white/25 text-[14px] lg:text-[16px]">Subtotal:</h1>
                <h1 className="ml-auto text-[14px] lg:text-[16px]">R$ {calcularTotal().toFixed(2)}</h1>
              </div>
              <div className="flex mt-2">
                <h1 className="text-white/25 text-[14px] lg:text-[16px]">Desconto:</h1>
                <h1 className="ml-auto text-[#27AE60] text-[14px] lg:text-[16px]">- R$ 0,00</h1>
              </div>
              <div className="w-full h-[1px] bg-white/5 mt-[15px]"></div>

              <button 
                className="w-full h-[48px] bg-[#7D67E8] rounded-[5px] h-[48px] border border-white/2 mt-[16px] hover:opacity-70 transition-all cursor-pointer text-[14px] lg:text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!metodoPagamento || carrinhoItens.length === 0}
              >
                {metodoPagamento 
                  ? 'Finalizar Compra' 
                  : carrinhoItens.length === 0 
                    ? 'Carrinho vazio' 
                    : 'Selecione um método de pagamento'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}