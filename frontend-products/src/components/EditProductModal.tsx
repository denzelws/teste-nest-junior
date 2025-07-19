import { Box, Button, Input, Text, VStack, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import type { Product } from "../types";

interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
  onProductUpdated: (updatedProduct: Product) => void;
}

export default function EditProductModal({
  product,
  onClose,
  onProductUpdated,
}: EditProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price));
      setSku(product.sku);
    }
  }, [product]);

  if (!product) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/products/${product.id}`,
        {
          name,
          price: parseFloat(price),
          sku,
        }
      );
      onProductUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg="rgba(0, 0, 0, 0.6)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
    >
      <Box
        bg="white"
        p={6}
        borderRadius="md"
        minW="300px"
        maxW="400px"
        boxShadow="lg"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Editar Produto
        </Text>

        <VStack align="stretch">
          <Box>
            <Text fontWeight="bold">Nome</Text>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Box>

          <Box>
            <Text fontWeight="bold">Preço</Text>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Box>

          <Box>
            <Text fontWeight="bold">SKU</Text>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
          </Box>
        </VStack>

        <Flex justify="flex-end" mt={6} gap={2}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            colorScheme="teal"
            onClick={handleSave}
            loading={loading}
            loadingText="Salvando"
          >
            Salvar
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
