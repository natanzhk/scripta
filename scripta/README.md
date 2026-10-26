# Scripta

E-commerce demonstrativo de canetas, construído com **HTML5, CSS3 e JavaScript puro**. Não exige dependências, banco de dados, pagamentos ou servidor de autenticação.

## Executar localmente

A forma mais simples é abrir `index.html` no navegador. Para testar em um servidor local, abra um terminal na pasta do projeto e execute:

```bash
python3 -m http.server 3000
```

Depois, acesse `http://localhost:3000`.

## Estrutura

- `index.html`: estrutura, conteúdo, acessibilidade e modais.
- `style.css`: identidade visual, responsividade, animações e componentes.
- `script.js`: catálogo, carrosséis arrastáveis, sacola, login demonstrativo e feedbacks.
- `assets/`: ilustrações SVG de produto, fáceis de substituir por fotos finais.
- `manus-routes.json`: declaração da rota única para o preview.

## Interações disponíveis

Os carrosséis aceitam rolagem por trackpad, toque, arraste do mouse e setas. O botão `+` acrescenta itens à sacola e atualiza o contador. A sacola permite remover itens e exibe subtotal demonstrativo. O login e a newsletter validam campos apenas no front-end.
