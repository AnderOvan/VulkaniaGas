import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Checkout = () => {
  const { cart, totalPrice, clearCart, formatCLP } = useCart();
  const navigate = useNavigate();

  const costoEnvio = cart.length > 0 ? 2500 : 0;
  const totalConEnvio = totalPrice + costoEnvio;

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: 'Santiago',
    metodoPago: 'webpay',
    notas: ''
  });

  const [errores, setErrores] = useState({});
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [numeroOrden, setNumeroOrden] = useState('');

  if (cart.length === 0 && !compraExitosa) {
    return (
      <div className="bg-[#0D0D11] text-[#F5F5F8] min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-[#18181E] border border-[#2A2A35] p-8 rounded-xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#FF3B00] mb-2">No hay productos para pagar</h2>
          <p className="text-[#A0A0AB] mb-6 text-sm">Agrega productos al carrito antes de proceder al checkout.</p>
          <Link
            to="/productos"
            className="inline-block px-6 py-2.5 bg-[#FF3B00] hover:bg-[#FF8800] text-white font-bold rounded-lg transition-colors text-sm"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.nombreCompleto.trim()) nuevosErrores.nombreCompleto = 'El nombre es obligatorio';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) nuevosErrores.email = 'Correo electrónico inválido';
    if (!formData.telefono.trim() || formData.telefono.length < 8) nuevosErrores.telefono = 'Teléfono requerido (mín. 8 dígitos)';
    if (!formData.direccion.trim()) nuevosErrores.direccion = 'La dirección de despacho es obligatoria';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const ordenGenerada = `VULK-${Math.floor(100000 + Math.random() * 900000)}`;
    setNumeroOrden(ordenGenerada);
    setCompraExitosa(true);
    clearCart();
  };

  if (compraExitosa) {
    return (
      <div className="bg-[#0D0D11] text-[#F5F5F8] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="bg-[#18181E] border border-[#2A2A35] max-w-lg w-full p-8 rounded-2xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-[#FF3B00]/20 text-[#FF3B00] rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-4 border border-[#FF3B00]/40">
            ✓
          </div>
          <h1 className="text-3xl font-black text-[#F5F5F8] mb-2">¡Pedido Confirmado!</h1>
          <p className="text-[#A0A0AB] text-sm mb-6">
            Gracias por comprar en Vulkania Gas. Tu pedido ya está en preparación para despacho.
          </p>

          <div className="bg-[#0D0D11] border border-[#2A2A35] p-4 rounded-xl text-left space-y-2 mb-6 text-sm">
            <p><span className="text-[#A0A0AB]">N° de Orden:</span> <strong className="text-[#FF8800]">{numeroOrden}</strong></p>
            <p><span className="text-[#A0A0AB]">Cliente:</span> <span className="text-[#F5F5F8]">{formData.nombreCompleto}</span></p>
            <p><span className="text-[#A0A0AB]">Dirección:</span> <span className="text-[#F5F5F8]">{formData.direccion}, {formData.comuna}</span></p>
            <p><span className="text-[#A0A0AB]">Método de Pago:</span> <span className="text-[#F5F5F8] uppercase">{formData.metodoPago}</span></p>
          </div>

          <button
            onClick={() => navigate('/productos')}
            className="w-full py-3 bg-[#FF3B00] hover:bg-[#FF8800] text-white font-bold rounded-xl transition-colors text-sm"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D11] text-[#F5F5F8] min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F8] mb-8 border-b border-[#2A2A35] pb-4">
          Finalizar <span className="text-[#FF3B00]">Compra</span>
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de datos */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#18181E] border border-[#2A2A35] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#F5F5F8] border-b border-[#2A2A35] pb-3">
                1. Datos de Contacto y Despacho
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#A0A0AB] mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D11] border border-[#2A2A35] rounded-lg p-2.5 text-sm text-[#F5F5F8] focus:border-[#FF8800] outline-none"
                  placeholder="Juan Pérez"
                />
                {errores.nombreCompleto && <span className="text-red-400 text-xs">{errores.nombreCompleto}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A0A0AB] mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D11] border border-[#2A2A35] rounded-lg p-2.5 text-sm text-[#F5F5F8] focus:border-[#FF8800] outline-none"
                    placeholder="correo@ejemplo.cl"
                  />
                  {errores.email && <span className="text-red-400 text-xs">{errores.email}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A0A0AB] mb-1">Teléfono Móvil *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D11] border border-[#2A2A35] rounded-lg p-2.5 text-sm text-[#F5F5F8] focus:border-[#FF8800] outline-none"
                    placeholder="+56 9 1234 5678"
                  />
                  {errores.telefono && <span className="text-red-400 text-xs">{errores.telefono}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#A0A0AB] mb-1">Dirección de Entrega *</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D11] border border-[#2A2A35] rounded-lg p-2.5 text-sm text-[#F5F5F8] focus:border-[#FF8800] outline-none"
                    placeholder="Av. Principal 1234, Depto 502"
                  />
                  {errores.direccion && <span className="text-red-400 text-xs">{errores.direccion}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A0A0AB] mb-1">Comuna</label>
                  <select
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleChange}
                    className="w-full bg-[#0D0D11] border border-[#2A2A35] rounded-lg p-2.5 text-sm text-[#F5F5F8] focus:border-[#FF8800] outline-none"
                  >
                    <option value="Santiago">Santiago</option>
                    <option value="Maipú">Maipú</option>
                    <option value="Providencia">Providencia</option>
                    <option value="Las Condes">Las Condes</option>
                    <option value="Puente Alto">Puente Alto</option>
                    <option value="Cerrillos">Cerrillos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-[#18181E] border border-[#2A2A35] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#F5F5F8] border-b border-[#2A2A35] pb-3">
                2. Método de Pago
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'webpay', label: 'Webpay / Redcompra' },
                  { id: 'transferencia', label: 'Transferencia Bancaria' },
                  { id: 'efectivo', label: 'Pago contra Entrega' }
                ].map((metodo) => (
                  <label
                    key={metodo.id}
                    className={`border p-3 rounded-lg cursor-pointer flex items-center gap-2 text-xs font-semibold transition-colors ${
                      formData.metodoPago === metodo.id
                        ? 'border-[#FF3B00] bg-[#FF3B00]/10 text-[#F5F5F8]'
                        : 'border-[#2A2A35] bg-[#0D0D11] text-[#A0A0AB]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value={metodo.id}
                      checked={formData.metodoPago === metodo.id}
                      onChange={handleChange}
                      className="accent-[#FF3B00]"
                    />
                    {metodo.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen lateral */}
          <div className="lg:col-span-1">
            <div className="bg-[#18181E] border border-[#2A2A35] rounded-xl p-6 sticky top-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-[#F5F5F8] border-b border-[#2A2A35] pb-3">
                Resumen de la Orden
              </h2>

              <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-[#F5F5F8] line-clamp-1">{item.nombre}</p>
                      <p className="text-[#A0A0AB]">Cant: {item.cantidad}</p>
                    </div>
                    <span className="font-bold text-[#F5F5F8]">{formatCLP(item.precio * item.cantidad)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#2A2A35] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#A0A0AB]">
                  <span>Subtotal</span>
                  <span className="text-[#F5F5F8]">{formatCLP(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[#A0A0AB]">
                  <span>Despacho</span>
                  <span className="text-[#F5F5F8]">{formatCLP(costoEnvio)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#F5F5F8] pt-2 border-t border-[#2A2A35]">
                  <span>Total</span>
                  <span className="text-[#FF3B00]">{formatCLP(totalConEnvio)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FF3B00] hover:bg-[#FF8800] text-white font-extrabold rounded-xl transition-colors shadow-lg shadow-[#FF3B00]/20 text-sm"
              >
                Confirmar y Pagar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;