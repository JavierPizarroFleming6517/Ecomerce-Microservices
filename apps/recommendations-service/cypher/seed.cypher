MERGE (keyboard:Product {id: 'product-keyboard'})
SET keyboard.name = 'Mechanical Keyboard';

MERGE (mouse:Product {id: 'product-mouse'})
SET mouse.name = 'Wireless Mouse';

MERGE (mat:Product {id: 'product-desk-mat'})
SET mat.name = 'Desk Mat';

MERGE (customerOne:Customer {id: 'customer-001'});
MERGE (customerTwo:Customer {id: 'customer-002'});

MATCH (customer:Customer {id: 'customer-001'})
MATCH (keyboard:Product {id: 'product-keyboard'})
MATCH (mouse:Product {id: 'product-mouse'})
MERGE (customer)-[:PURCHASED]->(keyboard)
MERGE (customer)-[:PURCHASED]->(mouse);

MATCH (customer:Customer {id: 'customer-002'})
MATCH (keyboard:Product {id: 'product-keyboard'})
MATCH (mouse:Product {id: 'product-mouse'})
MATCH (mat:Product {id: 'product-desk-mat'})
MERGE (customer)-[:PURCHASED]->(keyboard)
MERGE (customer)-[:PURCHASED]->(mouse)
MERGE (customer)-[:PURCHASED]->(mat);
