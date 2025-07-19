import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Grid,
  VStack,
  Spinner,
  Button,
  Flex,
} from "@chakra-ui/react";

interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  missingLetter: string;
}

const PAGE_SIZE = 6;

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

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
    </Box>
  );
}
