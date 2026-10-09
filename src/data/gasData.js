// src/data/gasData.js

export const CATEGORIAS = {
  TODOS: 'Todos',
  CILINDROS: 'Cilindros Completos',
  CARGAS: 'Cargas / Recargas',
  ACCESORIOS: 'Válvulas y Accesorios',
  CALEFACCION: 'Calefacción'
};

export const gasProducts = [
  {
    id: 'gas-5kg-comp',
    nombre: 'Cilindro Gas Licuado 5kg (Envase + Carga)',
    descripcion: 'Cilindro portátil ideal para camping, parrilladas y espacios reducidos. Incluye carga completa.',
    precio: 28990,
    categoria: CATEGORIAS.CILINDROS,
    peso: '5 kg',
    stock: 15,
    destacado: false,
    imagen: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'gas-11kg-comp',
    nombre: 'Cilindro Gas Licuado 11kg (Envase + Carga)',
    descripcion: 'Formato estándar para cocina familiar y calefacción moderada. Alta durabilidad y seguridad.',
    precio: 42990,
    categoria: CATEGORIAS.CILINDROS,
    peso: '11 kg',
    stock: 25,
    destacado: true,
    imagen: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'gas-15kg-comp',
    nombre: 'Cilindro Gas Licuado 15kg (Envase + Carga)',
    descripcion: 'El cilindro más vendido para alto consumo en el hogar y calefacción continua.',
    precio: 51990,
    categoria: CATEGORIAS.CILINDROS,
    peso: '15 kg',
    stock: 20,
    destacado: true,
    imagen: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'gas-45kg-comp',
    nombre: 'Cilindro Gas Licuado 45kg (Envase + Carga)',
    descripcion: 'Gran capacidad para restaurantes, comercios o sistemas de calefacción central.',
    precio: 109900,
    categoria: CATEGORIAS.CILINDROS,
    peso: '45 kg',
    stock: 8,
    destacado: false,
    imagen: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'recarga-11kg',
    nombre: 'Recarga de Gas 11kg (Sólo Carga)',
    descripcion: 'Recarga rápida a domicilio entregando tu envase vacío en buen estado.',
    precio: 21490,
    categoria: CATEGORIAS.CARGAS,
    peso: '11 kg',
    stock: 50,
    destacado: true,
    imagen: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'recarga-15kg',
    nombre: 'Recarga de Gas 15kg (Sólo Carga)',
    descripcion: 'Recarga de gas propano/butano para envase de 15kg con despacho prioritario.',
    precio: 27990,
    categoria: CATEGORIAS.CARGAS,
    peso: '15 kg',
    stock: 45,
    destacado: false,
    imagen: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'valvula-regulador',
    nombre: 'Regulador de Gas Premium con Manguera y Abrazaderas',
    descripcion: 'Kit de seguridad certificado SEC con válvula de paso rápido y manguera reforzada de 1 metro.',
    precio: 14990,
    categoria: CATEGORIAS.ACCESORIOS,
    peso: '0.8 kg',
    stock: 30,
    destacado: false,
    imagen: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'estufa-volcanica-infrarroja',
    nombre: 'Calefactor Volcánico Infrarrojo 15kg',
    descripcion: 'Estufa a gas con encendido piezoeléctrico, analizador de atmósfera y triple sistema de seguridad.',
    precio: 89990,
    categoria: CATEGORIAS.CALEFACCION,
    peso: '9.5 kg',
    stock: 5,
    destacado: true,
    imagen: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80'
  }
];