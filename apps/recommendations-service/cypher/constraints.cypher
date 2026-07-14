CREATE CONSTRAINT product_id_unique IF NOT EXISTS
FOR (product:Product)
REQUIRE product.id IS UNIQUE;

CREATE CONSTRAINT customer_id_unique IF NOT EXISTS
FOR (customer:Customer)
REQUIRE customer.id IS UNIQUE;
