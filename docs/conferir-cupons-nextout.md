# Conferir os cupons no painel da Nextout

Roteiro para o Claude Cowork conferir os cupons da Siriguela no painel da Nextout (https://nextout.com.br/painel). O Matheus já está logado no navegador.

## Regras para quem confere

- Só leia e compare. Não salve, não apague e não crie nada sem perguntar ao Matheus antes.
- Não finalize pagamento. Os testes de checkout param na tela de pagamento, antes de pagar.
- Se um campo não existir ou tiver outro nome, anote como está no painel e siga.
- No fim, entregue o relatório no formato do fim deste arquivo.

## 1. Cupons

Caminho: **Marketing → Cupons de desconto**. Abra cada cupom e compare campo a campo.

### SIRIGUELA3POR2 (Black Friday)

| Campo | Esperado |
|---|---|
| Código | `SIRIGUELA3POR2` |
| Tipo | R$ de desconto |
| Valor | R$ 189,00 |
| Pedido mín. R$ | 567,00 |
| Itens mín. | vazio ou 3 |
| Começa em | 27/11/2026 ou antes |
| Vale até | 27/11/2026, 23h59 |
| Limite de usos | vazio (sem limite) |
| 1 uso por cliente | ligado |
| Só na primeira compra | desligado |
| Vale em | nenhuma forma marcada (vale em todas) |
| Mostrar no checkout | desligado (o cupom é só por e-mail) |
| Aplicar sozinho no checkout | desligado |
| Ativo | ligado |

### SIRIGUELA10 (primeira compra)

| Campo | Esperado |
|---|---|
| Código | `SIRIGUELA10` |
| Tipo | % de desconto |
| Valor | 10% |
| Só na primeira compra | ligado |
| Vale até | vazio (sem prazo) |
| Ativo | ligado |

### BLACK25

Esse código saiu do site. Se ele existir no painel, anote se está ativo e pergunte ao Matheus se deve desligar.

### Outros cupons

Liste qualquer outro cupom ativo, com código, tipo, valor e validade.

## 2. Faixa de desconto e frete

- **Marketing → Faixa de desconto:** anote se há faixas ativas e os valores. Se houver, confira no SIRIGUELA3POR2 a opção "Somar com a faixa de desconto" e anote como está.
- **Frete:** o esperado é frete fixo de R$ 19,90 para todo o Brasil, em todo pedido. "Oferecer frete grátis ao cliente" deve estar desligado.

## 3. Teste no checkout

Monte a sacola em https://siriguela.site/camisetas/, vá até o pagamento e aplique o cupom. Pare antes de pagar. Use qualquer tamanho.

Preços: a Blocos custa R$ 189,00 e a Ciranda, R$ 219,00. As outras sete camisetas custam R$ 199,00. Nos testes, use as de R$ 199,00 onde a tabela pede.

| Sacola | Subtotal | Com SIRIGUELA3POR2 | Total com frete |
|---|---|---|---|
| 3 camisetas de R$ 199,00 | R$ 597,00 | R$ 408,00 | R$ 427,90 |
| 2 Blocos + 1 de R$ 199,00 | R$ 577,00 | R$ 388,00 | R$ 407,90 |
| 3 Blocos | R$ 567,00 | R$ 378,00 | R$ 397,90 |
| 2 camisetas de R$ 199,00 | R$ 398,00 | cupom recusado | R$ 417,90 |

Anote também:

- Se o pedido mínimo conta o frete ou só as peças. O caso das 3 Blocos (R$ 567,00, exatamente o mínimo) mostra isso.
- Se dá para usar SIRIGUELA3POR2 e SIRIGUELA10 juntos. O esperado é não.
- A mensagem que aparece quando o cupom é recusado.

## Relatório

Entregue assim:

1. **Resumo:** tudo certo, ou quantos campos divergem.
2. **Divergências:** uma tabela com cupom, campo, esperado e encontrado.
3. **Testes de checkout:** a tabela da seção 3 com uma coluna a mais para o total que apareceu.
4. **Perguntas para o Matheus:** o que precisa de decisão dele antes de mudar.
