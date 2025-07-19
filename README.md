# 🧠 NestJS Products API

API RESTful para gerenciamento de produtos, desenvolvida com **NestJS**, **TypeORM** e **SQLite**, seguindo boas práticas de estrutura modular, validação e persistência de dados.

---

## 🚀 Funcionalidades

- ✅ Criar produto (POST /products)
- ✅ Listar todos os produtos (ordenados por nome)
- ✅ Obter um produto específico por ID
- ✅ Atualizar dados de um produto
- ✅ Remover um produto
- ✅ Retornar a primeira letra do alfabeto ausente no nome (`missingLetter`)

---

## 🧾 Exemplo de resposta (`GET /products`)

```json
[
  {
    "id": 1,
    "name": "Monitor",
    "price": 799.9,
    "sku": "MON-001",
    "missingLetter": "a"
  }
]
```
