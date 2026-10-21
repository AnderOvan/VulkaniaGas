// src/data/gasData.js

export const CATEGORIAS = ['TODAS', 'Cilindros Completos', 'Recargas', 'Accesorios'];

export const gasProducts = [
  {
    id: 'gas-5kg-comp',
    nombre: 'Cilindro Gas Licuado 5kg',
    descripcion: 'Cilindro completo con carga de 5kg de gas licuado de alta eficiencia.',
    precio: 24990,
    categoria: 'Cilindros Completos',
    stock: 10,
    destacado: true,
    imagen: '/productos/gas-5kg.png'
  },
  {
    id: 'gas-11kg-comp',
    nombre: 'Cilindro Gas Licuado 11kg',
    descripcion: 'Cilindro completo ideal para hogares, estufas y cocina diaria.',
    precio: 42990,
    categoria: 'Cilindros Completos',
    stock: 8,
    destacado: true,
    imagen: '/productos/gas-11kg.png'
  },
  {
    id: 'gas-15kg-rec',
    nombre: 'Recarga Gas Licuado 15kg',
    descripcion: 'Recarga rápida de gas de 15kg entregando tu cilindro vacío en norma.',
    precio: 28500,
    categoria: 'Recargas',
    stock: 15,
    destacado: false,
    imagen: '/productos/gas-15kg.png'
  },
  {
    id: 'gas-45kg-comp',
    nombre: 'Cilindro Gas Licuado 45kg',
    descripcion: 'Cilindro de alta capacidad para alto consumo comercial o residencial.',
    precio: 105990,
    categoria: 'Cilindros Completos',
    stock: 5,
    destacado: true,
    imagen: '/productos/gas-45kg.png'
  },
  {
    id: 'regulador-gas',
    nombre: 'Regulador con Manguera SEC',
    descripcion: 'Kit de conexión segura con manguera reforzada y regulador certificado.',
    precio: 12990,
    categoria: 'Accesorios',
    stock: 20,
    destacado: false,
    imagen: '/productos/regulador.png'
  }
];