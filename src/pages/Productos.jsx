import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gasProducts, CATEGORIAS } from '../data/gasData';
import { useCart } from '../context/CartContext';

export const Productos = () => {
  const { addToCart, formatCLP } = useCart();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(CATEGORIAS.TODOS);
  const [busqueda, setBusqueda] = useState('');

  const productosFiltrados = useMemo(() => {
    return gasProducts.filter((p) => {
      const coincideCat =
        categoriaSeleccionada === CATEGORIAS.TODOS || p.categoria === categoriaSeleccionada;
      const coincideBusqueda =
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCat && coincideBusqueda;
    });
  }, [categoriaSeleccionada, busqueda]);

  return (
    <div className="bg-[#0D0D11] text-[#F5F5F8] min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F5F8]">
            Catálogo de <span className="text-[#FF3B00]">Gas & Accesorios</span>
          </h1>
          <p className="text-[#A0A0AB] mt-2">
            Selecciona tu cilindro, carga o accesorio con despacho rápido a domicilio.
          </p>
        </header>

        {/* Filtros de Categoría y Buscador */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#18181E] p-4 rounded-xl border border-[#2A2A35] mb-8">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {Object.values(CATEGORIAS).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSeleccionada(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  categoriaSeleccionada === cat
                    ? 'bg-[#FF3B00] text-white'
                    : 'bg-[#0D0D11] text-[#A0A0AB] hover:text-[#F5F5F8] hover:bg-[#2A2A35]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#0D0D11] border border-[#2A2A35] rounded-lg px-4 py-2 text-[#F5F5F8] placeholder-[#A0A0AB] focus:outline-none focus:border-[#FF8800] transition-colors"
            />
          </div>
        </div>

        {/* Lista de Productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-16 bg-[#18181E] rounded-xl border border-[#2A2A35]">
            <p className="text-[#A0A0AB] text-lg">No se encontraron productos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((prod) => (
              <article
                key={prod.id}
                className="bg-[#18181E] border border-[#2A2A35] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#FF3B00] transition-all duration-300 shadow-lg group"
              >
                <div className="relative">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.destacado && (
                    <span className="absolute top-3 left-3 bg-[#FF8800] text-black text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Destacado
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-[#0D0D11]/80 backdrop-blur-md text-[#A0A0AB] text-xs font-medium px-2 py-1 rounded border border-[#2A2A35]">
                    {prod.peso}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#FF8800] tracking-wider uppercase">
                      {prod.categoria}
                    </span>
                    <h3 className="text-lg font-bold text-[#F5F5F8] mt-1 line-clamp-2">
                      {prod.nombre}
                    </h3>
                    <p className="text-[#A0A0AB] text-sm mt-2 line-clamp-2">
                      {prod.descripcion}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#2A2A35]">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-xs text-[#A0A0AB]">Stock: {prod.stock} un.</span>
                      <span className="text-xl font-extrabold text-[#F5F5F8]">
                        {formatCLP(prod.precio)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/productos/${prod.id}`}
                        className="text-center px-3 py-2 bg-[#0D0D11] hover:bg-[#2A2A35] text-[#F5F5F8] border border-[#2A2A35] rounded-lg text-sm font-semibold transition-colors"
                      >
                        Ver Detalle
                      </Link>

                      <button
                        onClick={() => addToCart(prod)}
                        disabled={prod.stock === 0}
                        className="px-3 py-2 bg-[#FF3B00] hover:bg-[#FF8800] disabled:bg-[#2A2A35] disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
                      >
                        {prod.stock > 0 ? 'Añadir' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;