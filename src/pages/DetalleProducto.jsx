import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gasProducts } from '../data/gasData';
import { useCart } from '../context/CartContext';

export const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, formatCLP } = useCart();
  const [cantidad, setCantidad] = useState(1);

  // Buscar el producto coincidente en los datos
  const producto = gasProducts.find((p) => p.id === id);

  if (!producto) {
    return (
      <div className="bg-[#0D0D11] text-[#F5F5F8] min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-[#18181E] border border-[#2A2A35] p-8 rounded-xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#FF3B00]">Producto no encontrado</h2>
          <p className="text-[#A0A0AB] mt-2 mb-6">El producto que buscas no existe o fue retirado del catálogo.</p>
          <Link
            to="/productos"
            className="inline-block px-5 py-2.5 bg-[#FF3B00] hover:bg-[#FF8800] text-white font-semibold rounded-lg transition-colors"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const decrementar = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const incrementar = () => {
    if (cantidad < producto.stock) setCantidad(cantidad + 1);
  };

  const handleAddToCart = () => {
    addToCart(producto, cantidad);
  };

  return (
    <div className="bg-[#0D0D11] text-[#F5F5F8] min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-[#A0A0AB] hover:text-[#F5F5F8] text-sm font-medium mb-6 inline-flex items-center gap-1 transition-colors"
        >
          ← Volver atrás
        </button>

        <div className="bg-[#18181E] border border-[#2A2A35] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Imagen y badges */}
          <div className="relative rounded-xl overflow-hidden bg-[#0D0D11] flex items-center justify-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-80 sm:h-96 object-cover"
            />
            {producto.destacado && (
              <span className="absolute top-4 left-4 bg-[#FF8800] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Destacado
              </span>
            )}
          </div>

          {/* Detalles e interacción */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#FF8800] tracking-wider uppercase">
                {producto.categoria}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F8] mt-1 mb-3">
                {producto.nombre}
              </h1>
              <p className="text-3xl font-black text-[#FF3B00] mb-4">
                {formatCLP(producto.precio)}
              </p>

              <p className="text-[#A0A0AB] leading-relaxed text-sm sm:text-base mb-6">
                {producto.descripcion}
              </p>

              <div className="space-y-3 border-t border-b border-[#2A2A35] py-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A0A0AB]">Peso neto:</span>
                  <span className="font-semibold text-[#F5F5F8]">{producto.peso}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A0A0AB]">Disponibilidad:</span>
                  <span
                    className={`font-semibold ${
                      producto.stock > 0 ? 'text-emerald-400' : 'text-red-500'
                    }`}
                  >
                    {producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Selector de cantidad y botones de compra */}
            {producto.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A0A0AB] font-medium">Cantidad:</span>
                  <div className="flex items-center border border-[#2A2A35] bg-[#0D0D11] rounded-lg overflow-hidden">
                    <button
                      onClick={decrementar}
                      disabled={cantidad <= 1}
                      className="px-3 py-1.5 text-lg font-bold hover:bg-[#2A2A35] disabled:opacity-40 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-bold min-w-[3rem] text-center">
                      {cantidad}
                    </span>
                    <button
                      onClick={incrementar}
                      disabled={cantidad >= producto.stock}
                      className="px-3 py-1.5 text-lg font-bold hover:bg-[#2A2A35] disabled:opacity-40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 px-4 bg-[#2A2A35] hover:bg-[#3A3A48] text-[#F5F5F8] font-bold rounded-xl transition-colors text-sm"
                  >
                    Añadir al Carrito
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart();
                      navigate('/carrito');
                    }}
                    className="w-full py-3 px-4 bg-[#FF3B00] hover:bg-[#FF8800] text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    Comprar Ahora
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;