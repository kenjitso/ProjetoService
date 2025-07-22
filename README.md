# Projeto Frontend Catálogo de Produtos

## Estrutura

- `public/index.html`: página principal (importa main.js via type="module")
- `src/api.js`: comunicação com APIs externas
- `src/utils.js`: funções utilitárias (debounce, formatação, datas úteis etc)
- `src/state.js`: estado global centralizado
- `src/components.js`: funções de renderização de UI, modais, tabelas
- `src/main.js`: inicialização, navegação e orquestração principal

## Como rodar

1. Instale um servidor local (exemplo: `python -m http.server 8080` dentro da pasta `public/`).
2. Acesse `http://localhost:8080` no navegador.
3. Certifique-se de que o HTML referencia o JS principal assim:
    ```html
    <script type="module" src="../src/main.js"></script>
    ```

## Dicas

- Customize os módulos com suas regras de negócio.
- Se precisar de mais exemplos por módulo, veja o código-fonte ou peça ajuda.