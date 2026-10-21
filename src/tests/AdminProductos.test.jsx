// src/tests/AdminProductos.test.jsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminProductos from '../pages/admin/AdminProductos';
import * as store from '../data/productosStore';
import { gasProducts } from '../data/gasData';

// Spies (vi.fn) sobre las funciones del store, conservando su comportamiento real
vi.mock('../data/productosStore', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    agregarProducto: vi.fn(real.agregarProducto),
    actualizarProducto: vi.fn(real.actualizarProducto),
    eliminarProducto: vi.fn(real.eliminarProducto)
  };
});

describe('AdminProductos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lista el catálogo y alerta los productos con stock crítico', () => {
    render(<AdminProductos />);
    expect(screen.getAllByRole('row')).toHaveLength(gasProducts.length + 1); // + encabezado
    // Estufa (stock 5) y cilindro 45kg (stock 8) son críticos
    expect(screen.getByRole('status')).toHaveTextContent(/stock crítico/i);
    expect(screen.getByRole('status')).toHaveTextContent(/Calefactor Volcánico/);
  });

  it('muestra errores y NO llama a agregarProducto si el formulario es inválido', async () => {
    const user = userEvent.setup();
    render(<AdminProductos />);
    await user.click(screen.getByRole('button', { name: /nuevo producto/i }));
    await user.click(screen.getByRole('button', { name: /crear producto/i }));

    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('El precio es obligatorio.')).toBeInTheDocument();
    expect(store.agregarProducto).not.toHaveBeenCalled();
  });

  it('crea un producto válido, llama al spy y lo muestra en la tabla', async () => {
    const user = userEvent.setup();
    render(<AdminProductos />);
    await user.click(screen.getByRole('button', { name: /nuevo producto/i }));

    await user.type(screen.getByLabelText('Nombre'), 'Cilindro 3kg Camping');
    await user.type(screen.getByLabelText('Peso'), '3 kg');
    await user.type(screen.getByLabelText('Precio (CLP)'), '19990');
    await user.type(screen.getByLabelText('Stock'), '12');
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Cilindros Completos');
    await user.click(screen.getByRole('button', { name: /crear producto/i }));

    expect(store.agregarProducto).toHaveBeenCalledTimes(1);
    expect(store.agregarProducto).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Cilindro 3kg Camping' }));
    expect(screen.getByText('Cilindro 3kg Camping')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(store.STORAGE_KEY))).toHaveLength(gasProducts.length + 1);
  });

  it('edita un producto existente', async () => {
    const user = userEvent.setup();
    render(<AdminProductos />);
    const tabla = () => within(screen.getByRole('table'));
    const fila = tabla().getByText(/Recarga de Gas 11kg/).closest('tr');
    await user.click(within(fila).getByRole('button', { name: /editar/i }));

    const stock = screen.getByLabelText('Stock');
    await user.clear(stock);
    await user.type(stock, '3');
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    expect(store.actualizarProducto).toHaveBeenCalledWith('recarga-11kg', expect.objectContaining({ stock: '3' }));
    const filaNueva = tabla().getByText(/Recarga de Gas 11kg/).closest('tr');
    expect(within(filaNueva).getByText(/Crítico/)).toBeInTheDocument();
  });

  it('elimina solo si el usuario confirma', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    render(<AdminProductos />);
    const fila = () => screen.getByText(/Regulador de Gas Premium/).closest('tr');

    confirmSpy.mockReturnValueOnce(false);
    await user.click(within(fila()).getByRole('button', { name: /eliminar/i }));
    expect(store.eliminarProducto).not.toHaveBeenCalled();

    confirmSpy.mockReturnValueOnce(true);
    await user.click(within(fila()).getByRole('button', { name: /eliminar/i }));
    expect(store.eliminarProducto).toHaveBeenCalledWith('valvula-regulador');
    expect(screen.queryByText(/Regulador de Gas Premium/)).not.toBeInTheDocument();
  });

  it('filtra por nombre', async () => {
    const user = userEvent.setup();
    render(<AdminProductos />);
    await user.type(screen.getByLabelText('Buscar producto'), 'calefactor');
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });
});

describe('validarProducto (función pura)', () => {
  const ok = { nombre: 'Nuevo', precio: '1000', stock: '0', categoria: 'Calefacción', peso: '1 kg', imagen: '' };

  it('acepta datos válidos (stock 0 permitido)', () => {
    expect(store.validarProducto(ok, [])).toEqual({});
  });

  it('rechaza precio decimal, negativo o stock negativo', () => {
    expect(store.validarProducto({ ...ok, precio: '10.5' }, []).precio).toBeDefined();
    expect(store.validarProducto({ ...ok, precio: '-5' }, []).precio).toBeDefined();
    expect(store.validarProducto({ ...ok, stock: '-1' }, []).stock).toBeDefined();
  });

  it('rechaza nombre duplicado pero permite conservar el propio al editar', () => {
    const existente = [{ id: 'a', nombre: 'Gas 5kg' }];
    expect(store.validarProducto({ ...ok, nombre: 'gas 5kg' }, existente).nombre).toMatch(/ya existe/i);
    expect(store.validarProducto({ ...ok, nombre: 'gas 5kg' }, existente, 'a').nombre).toBeUndefined();
  });

  it('rechaza URL de imagen inválida', () => {
    expect(store.validarProducto({ ...ok, imagen: 'foto.png' }, []).imagen).toBeDefined();
  });
});
