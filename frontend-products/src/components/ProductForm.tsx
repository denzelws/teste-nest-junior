import { useState } from "react";
import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import type { Product } from "../types";

interface ProductFormProps {
  onProductAdded: (product: Product) => void;
}

const ProductForm = ({ onProductAdded }: ProductFormProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/products", {
        name,
        price: parseFloat(price),
        sku,
      });

      onProductAdded(response.data);
      setName("");
      setPrice("");
      setSku("");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} boxShadow="md">
      <Text fontSize="xl" mb={4}>
        Adicionar Produto
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack align="stretch">
          <Box>
            <Text fontWeight="bold" mb={1}>
              Nome
            </Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do produto"
              required
            />
          </Box>

          <Box>
            <Text fontWeight="bold" mb={1}>
              Preço
            </Text>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Preço"
              required
            />
          </Box>

          <Box>
            <Text fontWeight="bold" mb={1}>
              SKU
            </Text>
            <Input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Código SKU"
              required
            />
          </Box>

          <Button type="submit" colorScheme="teal" mt={2}>
            Cadastrar
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ProductForm;
