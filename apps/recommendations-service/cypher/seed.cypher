// Products (ids = catalog SKUs)
MERGE (keyboard:Product {id: 'KEYBOARD-001'})
SET keyboard.name = 'Teclado mecánico RGB';

MERGE (mouse:Product {id: 'MOUSE-001'})
SET mouse.name = 'Mouse inalámbrico ergonómico';

MERGE (mat:Product {id: 'DESKMAT-001'})
SET mat.name = 'Mousepad XL de escritorio';

MERGE (headset:Product {id: 'HEADSET-001'})
SET headset.name = 'Audífonos con micrófono';

MERGE (monitor:Product {id: 'MONITOR-001'})
SET monitor.name = 'Monitor 27" 144Hz';

MERGE (webcam:Product {id: 'WEBCAM-001'})
SET webcam.name = 'Webcam Full HD';

MERGE (chair:Product {id: 'CHAIR-001'})
SET chair.name = 'Silla ergonómica de oficina';

MERGE (speaker:Product {id: 'SPEAKER-001'})
SET speaker.name = 'Bocinas de escritorio 2.0';

MERGE (laptop:Product {id: 'LAPTOP-001'})
SET laptop.name = 'Notebook 14" ultradelgada';

MERGE (earbuds:Product {id: 'EARBUDS-001'})
SET earbuds.name = 'Auriculares Bluetooth';

MERGE (mic:Product {id: 'MIC-001'})
SET mic.name = 'Micrófono USB de condensador';

MERGE (ssd:Product {id: 'SSD-001'})
SET ssd.name = 'Disco SSD externo 1 TB';

MERGE (hub:Product {id: 'HUB-001'})
SET hub.name = 'Hub USB-C 7 en 1';

MERGE (lamp:Product {id: 'LAMP-001'})
SET lamp.name = 'Lámpara LED de escritorio';

MERGE (desk:Product {id: 'DESK-001'})
SET desk.name = 'Escritorio standing eléctrico';

MERGE (tablet:Product {id: 'TABLET-001'})
SET tablet.name = 'Tablet 10.5" Wi-Fi';

MERGE (printer:Product {id: 'PRINTER-001'})
SET printer.name = 'Impresora multifunción Wi-Fi';

MERGE (powerbank:Product {id: 'POWERBANK-001'})
SET powerbank.name = 'Power bank 20000 mAh';

MERGE (keyboard2:Product {id: 'KEYBOARD-002'})
SET keyboard2.name = 'Teclado compacto 75%';

MERGE (mouse2:Product {id: 'MOUSE-002'})
SET mouse2.name = 'Mouse gamer RGB';

MERGE (router:Product {id: 'ROUTER-001'})
SET router.name = 'Router Wi-Fi 6';

MERGE (headset2:Product {id: 'HEADSET-002'})
SET headset2.name = 'Audífonos over-ear inalámbricos';

MERGE (agenda:Product {id: 'NOTEBOOK-001'})
SET agenda.name = 'Agenda ejecutiva A5';

MERGE (dock:Product {id: 'DOCK-001'})
SET dock.name = 'Docking station USB-C';

// Customers
MERGE (c1:Customer {id: 'customer-001'});
MERGE (c2:Customer {id: 'customer-002'});
MERGE (c3:Customer {id: 'customer-003'});
MERGE (c4:Customer {id: 'customer-004'});
MERGE (c5:Customer {id: 'customer-005'});
MERGE (c6:Customer {id: 'customer-006'});

// Gaming / peripherals desk
MATCH (c:Customer {id: 'customer-001'})
MATCH (keyboard:Product {id: 'KEYBOARD-001'})
MATCH (mouse:Product {id: 'MOUSE-001'})
MATCH (mat:Product {id: 'DESKMAT-001'})
MATCH (headset:Product {id: 'HEADSET-001'})
MATCH (mouse2:Product {id: 'MOUSE-002'})
MERGE (c)-[:PURCHASED]->(keyboard)
MERGE (c)-[:PURCHASED]->(mouse)
MERGE (c)-[:PURCHASED]->(mat)
MERGE (c)-[:PURCHASED]->(headset)
MERGE (c)-[:PURCHASED]->(mouse2);

// Streaming setup
MATCH (c:Customer {id: 'customer-002'})
MATCH (keyboard:Product {id: 'KEYBOARD-001'})
MATCH (mouse:Product {id: 'MOUSE-001'})
MATCH (monitor:Product {id: 'MONITOR-001'})
MATCH (webcam:Product {id: 'WEBCAM-001'})
MATCH (mic:Product {id: 'MIC-001'})
MATCH (headset:Product {id: 'HEADSET-001'})
MERGE (c)-[:PURCHASED]->(keyboard)
MERGE (c)-[:PURCHASED]->(mouse)
MERGE (c)-[:PURCHASED]->(monitor)
MERGE (c)-[:PURCHASED]->(webcam)
MERGE (c)-[:PURCHASED]->(mic)
MERGE (c)-[:PURCHASED]->(headset);

// Mobile / notebook kit
MATCH (c:Customer {id: 'customer-003'})
MATCH (laptop:Product {id: 'LAPTOP-001'})
MATCH (ssd:Product {id: 'SSD-001'})
MATCH (hub:Product {id: 'HUB-001'})
MATCH (dock:Product {id: 'DOCK-001'})
MATCH (earbuds:Product {id: 'EARBUDS-001'})
MATCH (powerbank:Product {id: 'POWERBANK-001'})
MERGE (c)-[:PURCHASED]->(laptop)
MERGE (c)-[:PURCHASED]->(ssd)
MERGE (c)-[:PURCHASED]->(hub)
MERGE (c)-[:PURCHASED]->(dock)
MERGE (c)-[:PURCHASED]->(earbuds)
MERGE (c)-[:PURCHASED]->(powerbank);

// Home office furniture
MATCH (c:Customer {id: 'customer-004'})
MATCH (chair:Product {id: 'CHAIR-001'})
MATCH (desk:Product {id: 'DESK-001'})
MATCH (lamp:Product {id: 'LAMP-001'})
MATCH (printer:Product {id: 'PRINTER-001'})
MATCH (agenda:Product {id: 'NOTEBOOK-001'})
MATCH (keyboard2:Product {id: 'KEYBOARD-002'})
MERGE (c)-[:PURCHASED]->(chair)
MERGE (c)-[:PURCHASED]->(desk)
MERGE (c)-[:PURCHASED]->(lamp)
MERGE (c)-[:PURCHASED]->(printer)
MERGE (c)-[:PURCHASED]->(agenda)
MERGE (c)-[:PURCHASED]->(keyboard2);

// Audio cluster
MATCH (c:Customer {id: 'customer-005'})
MATCH (headset:Product {id: 'HEADSET-001'})
MATCH (headset2:Product {id: 'HEADSET-002'})
MATCH (earbuds:Product {id: 'EARBUDS-001'})
MATCH (speaker:Product {id: 'SPEAKER-001'})
MATCH (mic:Product {id: 'MIC-001'})
MERGE (c)-[:PURCHASED]->(headset)
MERGE (c)-[:PURCHASED]->(headset2)
MERGE (c)-[:PURCHASED]->(earbuds)
MERGE (c)-[:PURCHASED]->(speaker)
MERGE (c)-[:PURCHASED]->(mic);

// Connectivity / home network
MATCH (c:Customer {id: 'customer-006'})
MATCH (router:Product {id: 'ROUTER-001'})
MATCH (laptop:Product {id: 'LAPTOP-001'})
MATCH (tablet:Product {id: 'TABLET-001'})
MATCH (dock:Product {id: 'DOCK-001'})
MATCH (hub:Product {id: 'HUB-001'})
MATCH (ssd:Product {id: 'SSD-001'})
MERGE (c)-[:PURCHASED]->(router)
MERGE (c)-[:PURCHASED]->(laptop)
MERGE (c)-[:PURCHASED]->(tablet)
MERGE (c)-[:PURCHASED]->(dock)
MERGE (c)-[:PURCHASED]->(hub)
MERGE (c)-[:PURCHASED]->(ssd);
