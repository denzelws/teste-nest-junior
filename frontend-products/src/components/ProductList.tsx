import { useEffect, useState } from "react";
import { FiTrash2, FiEdit3 } from "react-icons/fi";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import type { Product } from "../types";
import EditProductModal from "./EditProductModal";

interface ProductListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const PAGE_SIZE = 6;

export default function ProductList({
  products,
  setProducts,
}: ProductListProps) {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  function getMissingLetter(name: string): string {
  const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (const char of alphabet) {
    if (!normalized.includes(char)) return char;
  }
  return '_';
}

  const handleProductUpdated = (updated: Product) => {
  const missingLetter = getMissingLetter(updated.name);

  const updatedProductWithLetter = { ...updated, missingLetter };

    setProducts((prev) =>
    prev.map((p) => (p.id === updated.id ? updatedProductWithLetter : p))
  );

    setSelectedProduct(null);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar produtos:", err);
        setLoading(false);
      });
  }, []);

  const paginated = products.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <Box p={6}>
      <Heading mb={6} textAlign="center">
        Lista de Produtos
      </Heading>

      {loading ? (
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {paginated.map((product) => (
              <Box
                key={product.id}
                p={4}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
              >
                <VStack align="start">
                  <Text fontWeight="bold">Nome: {product.name}</Text>
                  <Text>Preço: R$ {product.price.toFixed(2)}</Text>
                  <Text>SKU: {product.sku}</Text>
                  <Box borderBottom="1px solid #e2e8f0" w="100%" />
                  <Text fontSize="sm" color="gray.500">
                    Letra ausente: {product.missingLetter}
                  </Text>
                </VStack>
                <Flex gap={2} mt="20px">
                  <Button
                    size="xs"
                    backgroundColor="blue.700"
                    onClick={() => handleEdit(product)}
                  >
                    <FiEdit3 />
                  </Button>
                  <Button
                    size="xs"
                    backgroundColor="red"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FiTrash2 />
                  </Button>
                </Flex>
              </Box>
            ))}
          </Grid>

          <Flex justify="center" mt={6} gap={4}>
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              Anterior
            </Button>
            <Button
              onClick={() =>
                setPage((prev) =>
                  (prev + 1) * PAGE_SIZE < products.length ? prev + 1 : prev
                )
              }
              disabled={(page + 1) * PAGE_SIZE >= products.length}
            >
              Próxima
            </Button>
          </Flex>
        </>
      )}

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </Box>
  );
}
