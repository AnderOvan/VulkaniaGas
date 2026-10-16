import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Carrito = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, formatCLP } = useCart();
  const navigate = useNavigate();

  // Desglose de precios
  const costoEnvio = cart.length > 0 ? 2500 : 0;
  const totalConEnvio = totalPrice + costoEnvio;

  if (cart.length === 0) {
    return (
      <div className="bg-[#0D0D11] text-[#F5F5F8] min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-[#18181E] border border-[#2A2A35] p-8 sm:p-12 rounded-2xl text-center max-w-lg w-full shadow-2xl">
          <div className="w-20 h-20 bg-[#0D0D11] border border-[#2A2A35] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F8] mb-3">
            Tu carrito está vacío
          </h2>
          <p className="text-[#A0A0AB] mb-8 text-sm sm:text-base leading-relaxed">
            Explora nuestro catálogo de cilindros, recargas y accesorios para solicitar tu pedido a domicilio.
          </p>
          <Link
            to="/productos"
            className="inline-block w-full sm:w-auto px-8 py-3.5 bg-[#FF3B00] hover:bg-[#FF8800] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-[#FF3B00]/20"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D11] text-[#F5F5F8] min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A35] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F5F8]">
              Carrito de <span className="text-[#FF3B00]">Compras</span>
            </h1>
            <p className="text-[#A0A0AB] text-sm mt-1">
              Revisa tus ítems seleccionados antes de proceder al pago.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="self-start sm:self-auto text-xs sm:text-sm text-[#A0A0AB] hover:text-red-400 border border-[#2A2A35] hover:border-red-900/50 bg-[#18181E] px-4 py-2 rounded-lg transition-colors"
          >
            Vaciar carrito
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Productos en el Carrito */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-[#18181E] border border-[#2A2A35] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 justify-between transition-colors hover:border-[#FF8800]/50"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-lg bg-[#0D0D11] border border-[#2A2A35] flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#FF8800] tracking-wider uppercase">
                      {item.categoria}
                    </span>
                    <h3 className="font-bold text-[#F5F5F8] text-base leading-snug">
                      {item.nombre}
                    </h3>
                    <p className="text-xs text-[#A0A0AB] mt-1">
                      Precio unitario: <span className="text-[#F5F5F8]">{formatCLP(item.precio)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#2A2A35] pt-3 sm:pt-0">
                  {/* Selector de cantidad */}
                  <div className="flex items-center border border-[#2A2A35] bg-[#0D0D11] rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      className="px-3 py-1 text-base font-bold text-[#A0A0AB] hover:text-white hover:bg-[#2A2A35] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold min-w-[2.5rem] text-center text-[#F5F5F8]">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                      className="px-3 py-1 text-base font-bold text-[#A0A0AB] hover:text-white hover:bg-[#2A2A35] disabled:opacity-30 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal por producto */}
                  <div className="text-right min-w-[5.5rem]">
                    <span className="text-xs text-[#A0A0AB] block">Subtotal</span>
                    <span className="font-extrabold text-[#F5F5F8] text-base">
                      {formatCLP(item.precio * item.cantidad)}
                    </span>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#A0A0AB] hover:text-red-400 p-2 rounded-lg hover:bg-[#0D0D11] transition-colors"
                    title="Eliminar producto"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de la Orden */}
          <div className="lg:col-span-1">
            <div className="bg-[#18181E] border border-[#2A2A35] rounded-xl p-6 sticky top-6 shadow-xl">
              <h2 className="text-xl font-bold text-[#F5F5F8] mb-6 border-b border-[#2A2A35] pb-4">
                Resumen de Compra
              </h2>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-[#A0A0AB]">
                  <span>Subtotal productos</span>
                  <span className="text-[#F5F5F8] font-semibold">{formatCLP(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[#A0A0AB]">
                  <span>Despacho estimado</span>
                  <span className="text-[#F5F5F8] font-semibold">{formatCLP(costoEnvio)}</span>
                </div>
                <div className="border-t border-[#2A2A35] pt-4 flex justify-between items-baseline">
                  <span className="text-base font-bold text-[#F5F5F8]">Total Final</span>
                  <span className="text-2xl font-black text-[#FF3B00]">
                    {formatCLP(totalConEnvio)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-[#FF3B00] hover:bg-[#FF8800] text-white font-extrabold rounded-xl transition-all duration-200 shadow-lg shadow-[#FF3B00]/20 text-center block"
              >
                Continuar al Checkout
              </button>

              <Link
                to="/productos"
                className="block text-center text-xs text-[#A0A0AB] hover:text-[#F5F5F8] mt-4 transition-colors"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;