import mongoose from 'mongoose';
import { CategorySchema, Category } from '../src/categories/schemas/category.schema';
import { ProductSchema, Product } from '../src/products/schemas/product.schema';
import { StockSchema, Stock } from '../src/inventory/schemas/stock.schema';

interface SeedCategory {
  name: string;
  slug: string;
}

interface SeedSpec {
  label: string;
  value: string;
}

interface SeedProduct {
  sku: string;
  name: string;
  description: string;
  longDescription: string;
  brand: string;
  highlights: string[];
  specs: SeedSpec[];
  categorySlug: string;
  price: number;
  currency: string;
  imageUrl: string;
  imageUrls?: string[];
  quantity: number;
}

const WAREHOUSE_LOCATION = 'MAIN';

function photo(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=600&q=80`;
}

const categories: SeedCategory[] = [
  { name: 'Periféricos', slug: 'perifericos' },
  { name: 'Audio', slug: 'audio' },
  { name: 'Oficina', slug: 'oficina' },
  { name: 'Computación', slug: 'computacion' },
];

const products: SeedProduct[] = [
  {
    sku: 'KEYBOARD-001',
    name: 'Teclado mecánico RGB',
    description: 'Switches rojos, retroiluminado RGB y cable trenzado de 1.8 m.',
    longDescription:
      'Teclado mecánico diseñado para gaming y productividad. Ofrece respuesta táctil precisa, iluminación RGB personalizable por tecla y construcción resistente para uso diario intensivo.',
    brand: 'KeyForge',
    highlights: [
      'Switches mecánicos rojos de recorrido corto',
      'Iluminación RGB por tecla',
      'Cable trenzado desmontable de 1.8 m',
      'Layout en español Latinoamérica',
    ],
    specs: [
      { label: 'Tipo', value: 'Mecánico' },
      { label: 'Switch', value: 'Rojo lineal' },
      { label: 'Iluminación', value: 'RGB' },
      { label: 'Conexión', value: 'USB-C / cable' },
      { label: 'Dimensiones', value: '440 x 135 x 35 mm' },
      { label: 'Peso', value: '980 g' },
    ],
    categorySlug: 'perifericos',
    price: 79990,
    currency: 'CLP',
    imageUrl: photo('photo-1511467687858-23d96c32e4ae'),
    quantity: 40,
  },
  {
    sku: 'MOUSE-001',
    name: 'Mouse inalámbrico ergonómico',
    description: 'Sensor óptico de 16000 DPI y batería de hasta 70 horas.',
    longDescription:
      'Mouse ergonómico inalámbrico pensado para jornadas largas. Su sensor de alta precisión y forma contorneada reducen la fatiga, ideal para oficina y edición.',
    brand: 'PointLab',
    highlights: [
      'Sensor óptico hasta 16000 DPI',
      'Autonomía de hasta 70 horas',
      'Diseño ergonómico para diestros',
      'Conexión 2.4 GHz y Bluetooth',
    ],
    specs: [
      { label: 'Sensor', value: 'Óptico 16000 DPI' },
      { label: 'Conectividad', value: '2.4 GHz / Bluetooth' },
      { label: 'Batería', value: 'Hasta 70 h' },
      { label: 'Botones', value: '6 programables' },
      { label: 'Peso', value: '89 g' },
    ],
    categorySlug: 'perifericos',
    price: 34990,
    currency: 'CLP',
    imageUrl: photo('photo-1527864550417-7fd91fc51a46'),
    quantity: 65,
  },
  {
    sku: 'DESKMAT-001',
    name: 'Mousepad XL de escritorio',
    description: 'Superficie antideslizante de 900x400 mm con base de goma.',
    longDescription:
      'Superficie XL que cubre teclado y mouse. Costuras reforzadas y base de goma antideslizante para estabilidad en cualquier escritorio.',
    brand: 'DeskPro',
    highlights: [
      'Formato 900 x 400 mm',
      'Base de goma antideslizante',
      'Costuras reforzadas',
      'Superficie de deslizamiento controlado',
    ],
    specs: [
      { label: 'Dimensiones', value: '900 x 400 mm' },
      { label: 'Espesor', value: '3 mm' },
      { label: 'Material', value: 'Tela + goma' },
      { label: 'Lavable', value: 'Sí' },
    ],
    categorySlug: 'oficina',
    price: 14990,
    currency: 'CLP',
    imageUrl: photo('photo-1615663245857-ac93bb7c39e7'),
    quantity: 80,
  },
  {
    sku: 'HEADSET-001',
    name: 'Audífonos con micrófono',
    description: 'Sonido envolvente 7.1 y micrófono con cancelación de ruido.',
    longDescription:
      'Headset gamer con audio virtual 7.1 y micrófono flexible con cancelación de ruido. Cómodo para sesiones largas de juego o llamadas.',
    brand: 'SoundPeak',
    highlights: [
      'Audio envolvente virtual 7.1',
      'Micrófono con cancelación de ruido',
      'Almohadillas acolchadas',
      'Control de volumen en línea',
    ],
    specs: [
      { label: 'Drivers', value: '50 mm' },
      { label: 'Audio', value: '7.1 virtual' },
      { label: 'Micrófono', value: 'Unidireccional' },
      { label: 'Conexión', value: 'USB / 3.5 mm' },
      { label: 'Peso', value: '320 g' },
    ],
    categorySlug: 'audio',
    price: 54990,
    currency: 'CLP',
    imageUrl: photo('photo-1546435770-a3e426bf472b'),
    quantity: 30,
  },
  {
    sku: 'MONITOR-001',
    name: 'Monitor 27" 144Hz',
    description: 'Panel IPS, 1 ms de respuesta y compatible con FreeSync.',
    longDescription:
      'Monitor IPS de 27" con 144 Hz para gaming y trabajo creativo. Colores precisos, bajo input lag y sincronización adaptativa FreeSync.',
    brand: 'ViewNova',
    highlights: [
      'Panel IPS 27" Full HD / QHD',
      '144 Hz y 1 ms de respuesta',
      'Compatible con FreeSync',
      'Ángulos de visión amplios',
    ],
    specs: [
      { label: 'Tamaño', value: '27"' },
      { label: 'Panel', value: 'IPS' },
      { label: 'Frecuencia', value: '144 Hz' },
      { label: 'Respuesta', value: '1 ms' },
      { label: 'Entradas', value: 'HDMI, DisplayPort' },
      { label: 'Montaje', value: 'VESA 100x100' },
    ],
    categorySlug: 'computacion',
    price: 249990,
    currency: 'CLP',
    imageUrl: photo('photo-1527443224154-c4a3942d3acf'),
    quantity: 15,
  },
  {
    sku: 'WEBCAM-001',
    name: 'Webcam Full HD',
    description: '1080p a 60 fps, enfoque automático y micrófono integrado.',
    longDescription:
      'Cámara web Full HD para videollamadas y streaming. Enfoque automático rápido y micrófono omnidireccional integrado para una experiencia clara.',
    brand: 'CamLink',
    highlights: [
      'Resolución 1080p a 60 fps',
      'Enfoque automático',
      'Micrófono integrado',
      'Clip universal para monitores',
    ],
    specs: [
      { label: 'Resolución', value: '1920 x 1080' },
      { label: 'FPS', value: '60' },
      { label: 'Campo de visión', value: '78°' },
      { label: 'Conexión', value: 'USB-A' },
      { label: 'Micrófono', value: 'Dual omnidireccional' },
    ],
    categorySlug: 'computacion',
    price: 42990,
    currency: 'CLP',
    imageUrl: photo('photo-1633114128174-2f8aa49759b0'),
    quantity: 50,
  },
  {
    sku: 'CHAIR-001',
    name: 'Silla ergonómica de oficina',
    description: 'Soporte lumbar ajustable, reposabrazos 3D y malla transpirable.',
    longDescription:
      'Silla ergonómica con soporte lumbar dinámico y malla transpirable. Ideal para home office y jornadas extendidas frente al computador.',
    brand: 'ErgoSit',
    highlights: [
      'Soporte lumbar ajustable',
      'Reposabrazos 3D',
      'Respaldo de malla',
      'Base de aluminio con ruedas suaves',
    ],
    specs: [
      { label: 'Material', value: 'Malla + espuma' },
      { label: 'Reposabrazos', value: '3D ajustables' },
      { label: 'Peso máximo', value: '120 kg' },
      { label: 'Altura asiento', value: '42-52 cm' },
      { label: 'Garantía', value: '2 años' },
    ],
    categorySlug: 'oficina',
    price: 189990,
    currency: 'CLP',
    imageUrl: photo('photo-1580480055273-228ff5388ef8'),
    quantity: 12,
  },
  {
    sku: 'SPEAKER-001',
    name: 'Bocinas de escritorio 2.0',
    description: 'Graves reforzados, entrada USB y auxiliar de 3.5 mm.',
    longDescription:
      'Par de bocinas compactas 2.0 con graves reforzados para escritorio. Conexión simple por USB o auxiliar, perfectas para música y videollamadas.',
    brand: 'WaveBox',
    highlights: [
      'Sistema 2.0 con graves reforzados',
      'Alimentación USB',
      'Entrada auxiliar 3.5 mm',
      'Controles de volumen frontales',
    ],
    specs: [
      { label: 'Potencia', value: '10 W RMS' },
      { label: 'Canales', value: '2.0' },
      { label: 'Entradas', value: 'USB / AUX 3.5 mm' },
      { label: 'Material', value: 'ABS' },
    ],
    categorySlug: 'audio',
    price: 29990,
    currency: 'CLP',
    imageUrl: photo('photo-1545454675-3531b543be5d'),
    quantity: 45,
  },
  {
    sku: 'LAPTOP-001',
    name: 'Notebook 14" ultradelgada',
    description: 'Pantalla IPS Full HD, 16 GB RAM y SSD de 512 GB.',
    longDescription:
      'Notebook ultradelgada de 14" con balance entre portabilidad y rendimiento. Ideal para estudio, oficina y movilidad diaria con buena autonomía.',
    brand: 'NovaBook',
    highlights: [
      'Pantalla IPS Full HD 14"',
      '16 GB RAM',
      'SSD NVMe 512 GB',
      'Chasis liviano de aluminio',
    ],
    specs: [
      { label: 'Pantalla', value: '14" IPS Full HD' },
      { label: 'Procesador', value: 'Intel Core i5 / Ryzen 5' },
      { label: 'Memoria', value: '16 GB RAM' },
      { label: 'Almacenamiento', value: 'SSD 512 GB' },
      { label: 'Peso', value: '1.35 kg' },
      { label: 'Autonomía', value: 'Hasta 10 h' },
    ],
    categorySlug: 'computacion',
    price: 699990,
    currency: 'CLP',
    imageUrl: photo('photo-1496181133206-80ce9b88a853'),
    quantity: 18,
  },
  {
    sku: 'EARBUDS-001',
    name: 'Auriculares Bluetooth',
    description: 'Cancelación activa de ruido y hasta 24 horas de autonomía.',
    longDescription:
      'Auriculares true wireless con cancelación activa de ruido y estuche de carga rápida. Pensados para movilidad urbana y llamadas claras.',
    brand: 'AirBeat',
    highlights: [
      'Cancelación activa de ruido (ANC)',
      'Hasta 24 h con estuche',
      'Resistencia al agua IPX4',
      'Emparejamiento rápido',
    ],
    specs: [
      { label: 'Tipo', value: 'True wireless' },
      { label: 'ANC', value: 'Sí' },
      { label: 'Autonomía', value: '6 h + 18 h estuche' },
      { label: 'Bluetooth', value: '5.3' },
      { label: 'Resistencia', value: 'IPX4' },
    ],
    categorySlug: 'audio',
    price: 89990,
    currency: 'CLP',
    imageUrl: photo('photo-1590658268037-6bf12165a8df'),
    quantity: 55,
  },
  {
    sku: 'MIC-001',
    name: 'Micrófono USB de condensador',
    description: 'Ideal para streaming y llamadas, con brazo articulado.',
    longDescription:
      'Micrófono de condensador USB listo para plug & play. Incluye brazo articulado para posicionarlo fácilmente en setups de streaming o podcast.',
    brand: 'VoiceCast',
    highlights: [
      'Capsule de condensador cardioid',
      'Conexión USB plug & play',
      'Brazo articulado incluido',
      'Monitoreo de latencia cero',
    ],
    specs: [
      { label: 'Tipo', value: 'Condensador' },
      { label: 'Patrón', value: 'Cardioide' },
      { label: 'Conexión', value: 'USB' },
      { label: 'Sample rate', value: '48 kHz / 16-bit' },
      { label: 'Accesorios', value: 'Brazo + filtro pop' },
    ],
    categorySlug: 'audio',
    price: 74990,
    currency: 'CLP',
    imageUrl: photo('photo-1590602847861-f357a9332bbc'),
    quantity: 28,
  },
  {
    sku: 'SSD-001',
    name: 'Disco SSD externo 1 TB',
    description: 'USB 3.2 Gen 2, carcasa metálica y lectura hasta 1050 MB/s.',
    longDescription:
      'SSD portátil de 1 TB con altas velocidades de transferencia. Carcasa metálica resistente y conexión USB-C para backups y edición en movimiento.',
    brand: 'FastDrive',
    highlights: [
      'Capacidad 1 TB',
      'USB 3.2 Gen 2',
      'Lectura hasta 1050 MB/s',
      'Carcasa metálica compacta',
    ],
    specs: [
      { label: 'Capacidad', value: '1 TB' },
      { label: 'Interfaz', value: 'USB 3.2 Gen 2' },
      { label: 'Lectura', value: 'Hasta 1050 MB/s' },
      { label: 'Escritura', value: 'Hasta 1000 MB/s' },
      { label: 'Compatibilidad', value: 'Windows / macOS' },
    ],
    categorySlug: 'computacion',
    price: 99990,
    currency: 'CLP',
    imageUrl: photo('photo-1550009158-9ebf69173e03'),
    quantity: 40,
  },
  {
    sku: 'HUB-001',
    name: 'Hub USB-C 7 en 1',
    description: 'HDMI 4K, lectores SD/TF, USB 3.0 y carga PD de 100 W.',
    longDescription:
      'Hub multipuerto USB-C para notebooks modernas. Expande conectividad con HDMI 4K, USB, lectores de memoria y passthrough de carga PD.',
    brand: 'PortMax',
    highlights: [
      'Salida HDMI 4K',
      'Puertos USB 3.0',
      'Lector SD / microSD',
      'Carga PD hasta 100 W',
    ],
    specs: [
      { label: 'Puertos', value: '7 en 1' },
      { label: 'Video', value: 'HDMI 4K@30Hz' },
      { label: 'USB', value: '2x USB-A 3.0' },
      { label: 'Carga', value: 'PD 100 W' },
      { label: 'Lectores', value: 'SD / TF' },
    ],
    categorySlug: 'perifericos',
    price: 39990,
    currency: 'CLP',
    imageUrl: photo('photo-1625948515291-69613efd103f'),
    quantity: 60,
  },
  {
    sku: 'LAMP-001',
    name: 'Lámpara LED de escritorio',
    description: 'Temperatura de color ajustable y brazo flexible antideslumbrante.',
    longDescription:
      'Lámpara LED de escritorio con temperatura de color configurable y brazo flexible. Reduce fatiga visual en estudio o trabajo nocturno.',
    brand: 'Lumina',
    highlights: [
      'Temperatura de color ajustable',
      'Brazo flexible',
      'Luz antideslumbrante',
      'Control táctil de intensidad',
    ],
    specs: [
      { label: 'Tipo', value: 'LED' },
      { label: 'Potencia', value: '10 W' },
      { label: 'Temperatura', value: '3000K-6500K' },
      { label: 'Alimentación', value: 'USB-C' },
    ],
    categorySlug: 'oficina',
    price: 24990,
    currency: 'CLP',
    imageUrl: photo('photo-1507473885765-e6ed057f782c'),
    quantity: 35,
  },
  {
    sku: 'DESK-001',
    name: 'Escritorio standing eléctrico',
    description: 'Altura ajustable con memoria de posiciones y tablero de 140 cm.',
    longDescription:
      'Escritorio de altura eléctrica con memoria de posiciones. Favorece posturas saludables alternando trabajo sentado y de pie.',
    brand: 'StandWork',
    highlights: [
      'Motor eléctrico silencioso',
      'Memoria de 3 posiciones',
      'Tablero de 140 cm',
      'Capacidad de carga 80 kg',
    ],
    specs: [
      { label: 'Ancho', value: '140 cm' },
      { label: 'Altura', value: '72-118 cm' },
      { label: 'Carga máx.', value: '80 kg' },
      { label: 'Motor', value: 'Eléctrico dual' },
      { label: 'Material', value: 'MDF + acero' },
    ],
    categorySlug: 'oficina',
    price: 349990,
    currency: 'CLP',
    imageUrl: photo('photo-1524758631624-e2822e304c36'),
    quantity: 8,
  },
  {
    sku: 'TABLET-001',
    name: 'Tablet 10.5" Wi-Fi',
    description: 'Pantalla 2K, 128 GB de almacenamiento y lápiz compatible.',
    longDescription:
      'Tablet 10.5" con pantalla 2K para consumo multimedia, lectura y anotaciones. Compatible con lápiz digital y almacenamiento ampliable.',
    brand: 'SlateGo',
    highlights: [
      'Pantalla 10.5" 2K',
      '128 GB internos',
      'Compatible con stylus',
      'Batería de larga duración',
    ],
    specs: [
      { label: 'Pantalla', value: '10.5" 2K' },
      { label: 'Almacenamiento', value: '128 GB' },
      { label: 'RAM', value: '6 GB' },
      { label: 'Conectividad', value: 'Wi-Fi 6' },
      { label: 'Batería', value: '7040 mAh' },
    ],
    categorySlug: 'computacion',
    price: 279990,
    currency: 'CLP',
    imageUrl: photo('photo-1544244015-0df4b3ffc6b0'),
    quantity: 22,
  },
  {
    sku: 'PRINTER-001',
    name: 'Impresora multifunción Wi-Fi',
    description: 'Imprime, escanea y copia; bandeja de 150 hojas y dúplex automático.',
    longDescription:
      'Multifunción Wi-Fi para hogar y oficina pequeña. Imprime, escanea y copia con dúplex automático y app móvil para impresión remota.',
    brand: 'PrintEase',
    highlights: [
      'Impresión, escaneo y copia',
      'Wi-Fi y app móvil',
      'Dúplex automático',
      'Bandeja de 150 hojas',
    ],
    specs: [
      { label: 'Funciones', value: 'Print / Scan / Copy' },
      { label: 'Conectividad', value: 'Wi-Fi / USB' },
      { label: 'Dúplex', value: 'Automático' },
      { label: 'Bandeja', value: '150 hojas' },
      { label: 'Resolución', value: '4800 x 1200 dpi' },
    ],
    categorySlug: 'oficina',
    price: 159990,
    currency: 'CLP',
    imageUrl: photo('photo-1612815154858-60aa4c59eaa6'),
    quantity: 14,
  },
  {
    sku: 'POWERBANK-001',
    name: 'Power bank 20000 mAh',
    description: 'Carga rápida PD 30 W, dos puertos USB-C/A y display LED.',
    longDescription:
      'Batería portátil de alta capacidad con carga rápida PD 30 W. Display LED para monitorear el nivel restante en viajes y oficina.',
    brand: 'ChargeUp',
    highlights: [
      'Capacidad 20000 mAh',
      'Power Delivery 30 W',
      'Puertos USB-C y USB-A',
      'Display LED de nivel',
    ],
    specs: [
      { label: 'Capacidad', value: '20000 mAh' },
      { label: 'Salida PD', value: '30 W' },
      { label: 'Puertos', value: 'USB-C / USB-A' },
      { label: 'Peso', value: '340 g' },
      { label: 'Protecciones', value: 'Sobrecorriente / corto' },
    ],
    categorySlug: 'perifericos',
    price: 32990,
    currency: 'CLP',
    imageUrl: photo('photo-1609091839311-d5365f9ff1c5'),
    quantity: 70,
  },
  {
    sku: 'KEYBOARD-002',
    name: 'Teclado compacto 75%',
    description: 'Formato bajo perfil, teclas silenciosas y conexión Bluetooth.',
    longDescription:
      'Teclado 75% de bajo perfil con teclas silenciosas. Ideal para escritorios compactos y trabajo en espacios compartidos.',
    brand: 'KeyForge',
    highlights: [
      'Formato 75% compacto',
      'Teclas de bajo perfil silenciosas',
      'Bluetooth multipunto',
      'Batería recargable',
    ],
    specs: [
      { label: 'Formato', value: '75%' },
      { label: 'Perfil', value: 'Bajo / silencioso' },
      { label: 'Conexión', value: 'Bluetooth 5.1' },
      { label: 'Autonomía', value: 'Hasta 3 meses' },
      { label: 'Layout', value: 'Español' },
    ],
    categorySlug: 'perifericos',
    price: 59990,
    currency: 'CLP',
    imageUrl: photo('photo-1587829741301-dc798b83add3'),
    quantity: 36,
  },
  {
    sku: 'MOUSE-002',
    name: 'Mouse gamer RGB',
    description: '8 botones programables, sensor 12000 DPI y cable flexible.',
    longDescription:
      'Mouse gamer con iluminación RGB y 8 botones programables. Sensor preciso de 12000 DPI para control fino en FPS y MOBA.',
    brand: 'PointLab',
    highlights: [
      'Sensor 12000 DPI',
      '8 botones programables',
      'Iluminación RGB',
      'Cable flexible de baja fricción',
    ],
    specs: [
      { label: 'DPI', value: 'Hasta 12000' },
      { label: 'Botones', value: '8' },
      { label: 'Iluminación', value: 'RGB' },
      { label: 'Conexión', value: 'USB cableado' },
      { label: 'Peso', value: '95 g' },
    ],
    categorySlug: 'perifericos',
    price: 27990,
    currency: 'CLP',
    imageUrl: photo('photo-1527814050087-3793815479db'),
    quantity: 48,
  },
  {
    sku: 'ROUTER-001',
    name: 'Router Wi-Fi 6',
    description: 'Doble banda AX3000, 4 antenas externas y control parental.',
    longDescription:
      'Router Wi-Fi 6 de doble banda AX3000 para hogares y oficinas. Ofrece mayor capacidad de dispositivos simultáneos, cobertura amplia y herramientas de control parental.',
    brand: 'NetPulse',
    highlights: [
      'Wi-Fi 6 AX3000',
      'Doble banda 2.4 / 5 GHz',
      '4 antenas externas',
      'Control parental y QoS',
    ],
    specs: [
      { label: 'Estándar', value: 'Wi-Fi 6 (802.11ax)' },
      { label: 'Velocidad', value: 'AX3000' },
      { label: 'Bandas', value: '2.4 GHz + 5 GHz' },
      { label: 'Antenas', value: '4 externas' },
      { label: 'Puertos WAN/LAN', value: '1 + 4 Gigabit' },
      { label: 'Seguridad', value: 'WPA3' },
    ],
    categorySlug: 'computacion',
    price: 89990,
    currency: 'CLP',
    imageUrl: photo('photo-1606904825846-647eb07f5be2'),
    quantity: 25,
  },
  {
    sku: 'HEADSET-002',
    name: 'Audífonos over-ear inalámbricos',
    description: 'Almohadillas de memory foam, Bluetooth 5.3 y 40 h de batería.',
    longDescription:
      'Audífonos over-ear inalámbricos con gran confort y autonomía extendida. Memory foam y Bluetooth 5.3 para música y llamadas diarias.',
    brand: 'SoundPeak',
    highlights: [
      'Almohadillas memory foam',
      'Bluetooth 5.3',
      'Hasta 40 h de batería',
      'Modo cable auxiliar incluido',
    ],
    specs: [
      { label: 'Tipo', value: 'Over-ear' },
      { label: 'Bluetooth', value: '5.3' },
      { label: 'Autonomía', value: '40 h' },
      { label: 'Drivers', value: '40 mm' },
      { label: 'Peso', value: '255 g' },
    ],
    categorySlug: 'audio',
    price: 119990,
    currency: 'CLP',
    imageUrl: photo('photo-1484704849700-f032a568e944'),
    quantity: 32,
  },
  {
    sku: 'NOTEBOOK-001',
    name: 'Agenda ejecutiva A5',
    description: 'Tapa dura, papel de 100 g y elástico de cierre.',
    longDescription:
      'Agenda ejecutiva tamaño A5 con tapa dura y papel de 100 g. Ideal para notas de reuniones y planificación semanal.',
    brand: 'PaperCraft',
    highlights: [
      'Formato A5',
      'Tapa dura resistente',
      'Papel 100 g',
      'Cierre elástico y bolsillo interno',
    ],
    specs: [
      { label: 'Formato', value: 'A5' },
      { label: 'Hojas', value: '192' },
      { label: 'Papel', value: '100 g' },
      { label: 'Tapa', value: 'Dura' },
      { label: 'Extras', value: 'Elástico + bolsillo' },
    ],
    categorySlug: 'oficina',
    price: 9990,
    currency: 'CLP',
    imageUrl: photo('photo-1531346878377-a5be20888e57'),
    quantity: 90,
  },
  {
    sku: 'DOCK-001',
    name: 'Docking station USB-C',
    description: 'Dos salidas HDMI, Ethernet gigabit y 4 puertos USB-A.',
    longDescription:
      'Docking station USB-C para transformar un notebook en estación de trabajo. Dual HDMI, red cableada y múltiples USB para periféricos.',
    brand: 'PortMax',
    highlights: [
      'Dual HDMI',
      'Ethernet Gigabit',
      '4 puertos USB-A',
      'Carga PD para notebook',
    ],
    specs: [
      { label: 'Video', value: '2x HDMI' },
      { label: 'Red', value: 'Ethernet Gigabit' },
      { label: 'USB', value: '4x USB-A 3.0' },
      { label: 'Carga', value: 'PD 85 W' },
      { label: 'Host', value: 'USB-C' },
    ],
    categorySlug: 'computacion',
    price: 129990,
    currency: 'CLP',
    imageUrl: photo('photo-1593640408182-31c70c8268f5'),
    quantity: 20,
  },
];

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) {
    throw new Error('Missing environment variable: MONGODB_URI');
  }

  await mongoose.connect(uri, dbName ? { dbName } : {});

  const CategoryModel = mongoose.model(Category.name, CategorySchema);
  const ProductModel = mongoose.model(Product.name, ProductSchema);
  const StockModel = mongoose.model(Stock.name, StockSchema);

  const categoryIdBySlug = new Map<string, mongoose.Types.ObjectId>();

  for (const category of categories) {
    const doc = await CategoryModel.findOneAndUpdate(
      { slug: category.slug },
      { $set: { name: category.name, slug: category.slug, active: true } },
      { upsert: true, new: true },
    ).exec();

    categoryIdBySlug.set(category.slug, doc._id);
    console.log(`Category ready: ${category.name}`);
  }

  await CategoryModel.updateOne(
    { slug: 'computo' },
    { $set: { active: false } },
  ).exec();

  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);

    if (!categoryId) {
      throw new Error(`Unknown category slug: ${product.categorySlug}`);
    }

    const imageUrls = product.imageUrls?.length
      ? product.imageUrls
      : [product.imageUrl];

    await ProductModel.findOneAndUpdate(
      { sku: product.sku },
      {
        $set: {
          sku: product.sku,
          name: product.name,
          description: product.description,
          longDescription: product.longDescription,
          brand: product.brand,
          highlights: product.highlights,
          specs: product.specs,
          category: categoryId,
          price: product.price,
          currency: product.currency,
          imageUrl: product.imageUrl,
          imageUrls,
          stockOnline: product.quantity,
          active: true,
        },
      },
      { upsert: true, new: true },
    ).exec();

    await StockModel.findOneAndUpdate(
      { sku: product.sku, location: WAREHOUSE_LOCATION },
      { $set: { quantity: product.quantity } },
      { upsert: true, new: true },
    ).exec();

    console.log(`Product ready: ${product.name}`);
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
