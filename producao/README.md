# Produção das camisetas

Os arquivos que vão para o fornecedor e as regras para imprimir as 9 camisetas Siriguela. A arte de origem fica no site (`assets/camisetas/<slug>/estampa.svg`). Tudo desta pasta sai dela pelo `gerar-arquivos.js`.

## O que tem em cada pasta

`producao/camisetas/<slug>/`:

| Arquivo | Para que serve |
|---|---|
| `<slug>-estampa.svg` | Vetor de impressão. Só as tintas, fundo transparente, com a medida real em milímetros. Prefira este quando o fornecedor aceitar vetor. |
| `<slug>-estampa-300dpi.png` | PNG transparente em 300 DPI, na largura de impressão (30 cm = 3.543 px). É o arquivo padrão para DTG e DTF. |
| `<slug>-previa-malha.png` | A estampa sobre a cor da malha. Só para conferir; não vai para a impressão. |
| `<slug>-referencia.webp` | A camiseta pronta, como aparece no site. Mande junto, para o fornecedor ver o resultado esperado. |

A ficha de cada camiseta (cor da malha, tintas e o que fica vazado) está em `camisetas.json`, que o Worker de pedidos também vai ler.

## Regras de impressão

- **Tamanho:** 30 cm de largura, com a altura na proporção de cada estampa (tabela abaixo). Se a área do fornecedor for menor, reduza a largura e mantenha a proporção. Nunca estique.
- **Posição:** frente, centralizada na largura, com o topo da estampa a 8 cm da costura da gola no tamanho M. Use a mesma distância nos outros tamanhos.
- **Técnica:** DTG em malha clara. Em malha escura ou colorida, DTG com base branca ou DTF. Cores chapadas, sem degradê, sem textura e sem contorno.
- **Cor:** as tintas estão em hex sRGB. Peça ao fornecedor a prova de cor na primeira amostra e compare com `<slug>-previa-malha.png` numa tela.
- **Vazado:** onde o arquivo é transparente, aparece a malha. Nas camisetas escuras isso é de propósito: o preto, o azul-marinho e o petróleo do desenho são o próprio tecido. Não preencha.
- **Sem logo:** a estampa é a única coisa na frente. Nada de marca na frente nem nas costas.

Os 30 cm e os 8 cm são o padrão até a primeira amostra. Confirme os dois no corpo e ajuste aqui e em `camisetas.json`.

## As 9 camisetas

| Camiseta | Malha | Cor de referência da malha | Estampa (L × A) | Tintas | Atenção |
|---|---|---|---|---|---|
| Azulejo | Branca | `#F3F1EA` | 30 × 30,0 cm | `#1B2F9E` `#3D63BF` `#8FB0E0` `#C3D5EF` `#F3F1EA` | Os 16 quadrados `#F3F1EA` separam as peças do branco da malha: imprima. |
| Encaixe | Branca | `#F3F1EA` | 30 × 30,0 cm | `#EF8F7B` `#B594D4` `#CDB5E2` `#D99C26` `#2553B0` `#F1ECE2` | O fundo `#F1ECE2` fecha o bloco: imprima. Arte sem transparência. |
| Meia-lua | Off-white | `#EBE3D6` | 30 × 30,0 cm | `#3560B0` `#A5452C` `#EBE3D6` | Os quadrados `#EBE3D6` são o cru do tecido. Na amostra, compare impresso e vazado. |
| Blocos | Preta | `#141414` | 30 × 31,1 cm | `#EFE7D6` `#DBA32B` `#A94F33` | O preto do desenho é a malha (vazado). Base branca embaixo. |
| Ciranda | Azul-marinho | `#131B33` | 30 × 30,0 cm | `#EFDFA8` `#C9992E` | O marinho entre as metades é a malha (vazado). Base branca. |
| Bandeirinhas | Preta | `#141414` | 30 × 31,6 cm | `#EFE7D6` `#DBA32B` `#EE8B78` | O preto entre os triângulos é a malha (vazado). Base branca. |
| Degraus | Azul-petróleo | `#17505F` | 30 × 26,3 cm | `#F0E2B0` `#E98672` | O petróleo entre os degraus é a malha (vazado). Base branca. |
| Jardim | Terracota | `#B04B2F` | 30 × 31,6 cm | `#DD9F2B` `#234F31` `#1F4A93` `#467440` `#93A961` `#EAD59C` `#C2612B` `#F2EBDC` | Estampa cheia, sem vazado. O fio claro `#F2EBDC` entre as formas faz parte do desenho. Base branca embaixo de tudo. |
| Catavento | Off-white | `#EBE3D6` | 30 × 30,0 cm | `#2254B4` `#E0A320` | Os triângulos claros são a malha off-white (vazado). |

**Cor da malha.** O hex é a cor que o site mostra. Nas camisetas escuras e na Meia-lua, ele vem da própria arte. Na Branca, vem do branco do desenho da Azulejo. Na Terracota, foi medido na foto da Jardim. Peça a cartela do fornecedor e escolha a malha mais próxima. Se a cor mudar muito, a foto e o texto da camiseta no site também precisam mudar.

## Quando a arte mudar

1. Edite `assets/camisetas/<slug>/estampa.svg`. Essa é a fonte, a mesma que o site usa.
2. Se mudarem as tintas, a malha ou o tamanho, atualize `camisetas.json`.
3. Rode `node producao/gerar-arquivos.js` na raiz. O script precisa do Playwright com Chromium.
4. Confira as prévias e faça o commit desta pasta.

## Mandar os arquivos para alguém

Para o fornecedor, mande por camiseta o `-estampa.svg`, o `-estampa-300dpi.png` e o `-referencia.webp`, junto com a linha da tabela acima.

Para mandar tudo de uma vez:

```bash
cd producao && zip -r ../siriguela-arquivos-impressao.zip README.md camisetas.json camisetas
```
