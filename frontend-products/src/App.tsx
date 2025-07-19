import axios from "axios";

import { useEffect, useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

import type { Product } from "./types";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <Box px={4} py={8}>
      <Heading textAlign="center" mb={8}>
        Gerenciador de Produtos
      </Heading>

      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-around"
        align="start"
        gap={16}
        minH="80vh"
      >
        <Box w="300px" mt="80px">
          <ProductForm onProductAdded={handleAddProduct} />
        </Box>

        <Box flex="1" maxW="850px">
          <ProductList products={products} setProducts={setProducts} />
        </Box>
      </Flex>
    </Box>
  );
}

export default App;
