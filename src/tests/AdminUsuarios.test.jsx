// src/tests/AdminUsuarios.test.jsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import * as store from '../data/usuariosStore';

vi.mock('../data/usuariosStore', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    agregarUsuario: vi.fn(real.agregarUsuario),
    actualizarUsuario: vi.fn(real.actualizarUsuario),
    eliminarUsuario: vi.fn(real.eliminarUsuario)
  };
});

const fila = (nombre) => screen.getByText(nombre).closest('tr');

describe('AdminUsuarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lista los usuarios iniciales', () => {
    render(<AdminUsuarios />);
    expect(screen.getAllByRole('row')).toHaveLength(store.usuariosIniciales.length + 1);
  });

  it('rechaza RUT con guion o con dígito verificador incorrecto y no llama al spy', async () => {
    const user = userEvent.setup();
    render(<AdminUsuarios />);
    await user.click(screen.getByRole('button', { name: /nuevo usuario/i }));
    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Díaz');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@correo.cl');

    await user.type(screen.getByLabelText(/RUT/), '19876543-0');
    await user.click(screen.getByRole('button', { name: /crear usuario/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/sin puntos ni guion/i);

    await user.clear(screen.getByLabelText(/RUT/));
    await user.type(screen.getByLabelText(/RUT/), '198765431');
    await user.click(screen.getByRole('button', { name: /crear usuario/i }));
    expect(screen.getByText('El RUT ingresado no es válido.')).toBeInTheDocument();
    expect(store.agregarUsuario).not.toHaveBeenCalled();
  });

  it('crea un usuario válido', async () => {
    const user = userEvent.setup();
    render(<AdminUsuarios />);
    await user.click(screen.getByRole('button', { name: /nuevo usuario/i }));
    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Díaz');
    await user.type(screen.getByLabelText(/RUT/), '198765430');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@correo.cl');
    await user.click(screen.getByRole('button', { name: /crear usuario/i }));

    expect(store.agregarUsuario).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Ana Díaz')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(store.STORAGE_KEY))).toHaveLength(store.usuariosIniciales.length + 1);
  });

  it('rechaza correo duplicado', async () => {
    const user = userEvent.setup();
    render(<AdminUsuarios />);
    await user.click(screen.getByRole('button', { name: /nuevo usuario/i }));
    await user.type(screen.getByLabelText('Nombre completo'), 'Otra Persona');
    await user.type(screen.getByLabelText(/RUT/), '198765430');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ADMIN@vulkania.cl');
    await user.click(screen.getByRole('button', { name: /crear usuario/i }));
    expect(screen.getByText('Ya existe un usuario con ese correo.')).toBeInTheDocument();
  });

  it('activa/desactiva un usuario', async () => {
    const user = userEvent.setup();
    render(<AdminUsuarios />);
    await user.click(within(fila('María González')).getByRole('button', { name: /desactivar/i }));
    expect(store.actualizarUsuario).toHaveBeenCalledTimes(1);
    expect(within(fila('María González')).getByText('Inactivo')).toBeInTheDocument();
  });

  it('no deja desactivar ni eliminar al único administrador activo', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<AdminUsuarios />);
    const f = () => fila('Administrador Vulkania');

    await user.click(within(f()).getByRole('button', { name: /desactivar/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/al menos un administrador activo/i);
    expect(store.actualizarUsuario).not.toHaveBeenCalled();

    await user.click(within(f()).getByRole('button', { name: /eliminar/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/único administrador/i);
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(store.eliminarUsuario).not.toHaveBeenCalled();
  });

  it('elimina un usuario tras confirmar', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<AdminUsuarios />);
    await user.click(within(fila('Pedro Soto')).getByRole('button', { name: /eliminar/i }));
    expect(store.eliminarUsuario).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Pedro Soto')).not.toBeInTheDocument();
  });

  it('filtra por rol y por texto', async () => {
    const user = userEvent.setup();
    render(<AdminUsuarios />);
    await user.selectOptions(screen.getByLabelText('Filtrar por rol'), 'admin');
    expect(screen.getAllByRole('row')).toHaveLength(2);
    await user.selectOptions(screen.getByLabelText('Filtrar por rol'), '');
    await user.type(screen.getByLabelText('Buscar usuario'), 'camila');
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });
});
