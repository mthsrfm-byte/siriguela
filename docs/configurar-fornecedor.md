# Configurar o fornecedor de produção (Dimona) com o Matheus

Instruções para o Claude Code. Abra o Chrome junto com o Matheus (Claude in Chrome) e conduza a configuração de ponta a ponta. Ele dá as permissões e digita senhas, CPF/CNPJ e dados de cartão. Você conduz o resto.

## Contexto

- Repositório `mthsrfm-byte/siriguela`. Site estático em `siriguela.site`. Leia o `CLAUDE.md` (tom de voz e regras da loja) e o `docs/lancamento.md` antes de começar.
- 9 camisetas: Azulejo, Encaixe, Meia-lua, Blocos, Ciranda, Bandeirinhas, Degraus, Jardim e Catavento. Preço de R$ 199,00 (a Blocos, R$ 189,00). Tamanhos de P a GG, modelagem ampla. O site promete entrega em 7 a 15 dias corridos.
- Cor da malha de cada uma em `assets/js/produtos.js` (`camisetas.itens[].cor`): branca, off-white, preta, azul-marinho, azul-petróleo e terracota.
- Arte vetorial de cada estampa em `assets/camisetas/<slug>/estampa.svg`. Nas camisetas escuras, o SVG tem um `<rect>` de fundo na cor do tecido, que precisa sair na arte de impressão.
- O pagamento é na Nextout. Quando o pedido é pago, a Nextout manda o webhook `pedido.pago`, com cliente, endereço e produtos. O formato está em `https://nextout.com.br/docs#webhooks`. Cada item chega com o nome no formato `Camiseta Jardim · tamanho M`.

## Por que a Dimona

É o único fornecedor brasileiro de print-on-demand com API pública documentada (`https://api.dimonatee.com/`). Assim, o nosso Worker cria o pedido sem Shopify ou Nuvemshop no meio. Outros pontos:
- A produção é no Rio de Janeiro.
- Faz DTG e DTF.
- Tem campos de etiqueta própria e de encarte.
- Aceita cadastro com CPF.

O plano B é a Montink: tem oversized de 220 g, mas não tem API e cobra mensalidade. Só mude para ela se a Dimona não tiver as cores ou a oversized, ou se não liberar o token da API.

## Regras para você

- Não digite senha, CPF, CNPJ nem número de cartão. Peça para o Matheus digitar.
- Não confirme pagamento, compra de amostra nem assinatura de plano sem o "pode" dele naquela hora.
- Chave e token nunca vão para o chat nem para o repositório. Vão como secret do Worker (`npx wrangler secret put ...`), digitados pelo Matheus no terminal.
- Antes de mudar o site (prazo, ficha técnica), mostre o texto e siga o `CLAUDE.md`.
- Ao fim de cada fase, diga em uma linha o que ficou pronto e o que falta.

## Fase 1. Perguntas para a Dimona (antes de gastar)

Abra `https://camisadimona.com.br` e, se não houver canal de API ali, `https://www.dimonatee.com/#contact-form`. Ajude o Matheus a enviar esta mensagem pelo canal comercial ou pelo WhatsApp do suporte:

> Olá! Tenho uma marca de camisetas estampadas com loja própria, sem Shopify. Quero integrar pela API de vocês. Preciso de:
> 1. Token da API e o domínio da API para pedidos do Brasil (na documentação aparece só a variável `usa-api-domain`).
> 2. Formato certo para o Brasil: `v2021/orders` ou `v3/orders`.
> 3. Tabela de SKUs das malhas (de preferência oversized/ampla, 100% algodão) com as cores branca, off-white/cru, preta, azul-marinho, azul-petróleo e terracota (ou as mais próximas), de P a GG, com o preço de cada uma.
> 4. Área máxima de impressão no peito (quero cerca de 30 cm) e a técnica recomendada para cores chapadas (DTG ou DTF).
> 5. Prazo de produção e de entrega para SP, Nordeste e Norte, e os valores de `shipping_speed` e `delivery_method_id`.
> 6. Etiqueta própria e embalagem sem a marca de vocês: custo e pedido mínimo.
> 7. Como funciona a cobrança da produção (crédito pré-pago ou cartão) e a nota fiscal (posso mandar a minha, campo `nfe`).
> 8. Política de reimpressão por defeito.
> Obrigado!

Com a resposta, preencha a tabela de mapeamento da Fase 3. Se faltar cor, avise o Matheus e proponha a cor mais próxima. Mudar a cor muda a foto e o texto da peça.

## Fase 2. Conta e cobrança

1. O Matheus cria a conta na Dimona (Camisa Dimona ou Dropsimples) e faz o login no Chrome. Você só acompanha.
2. Configure o remetente e a forma de pagamento da produção com ele.
3. Se a etiqueta própria valer a pena, suba o logo de `assets/img/logo.svg`, exportado em PNG.

## Fase 3. Artes e mapeamento

1. As artes de impressão já estão prontas em `producao/camisetas/<slug>/`: SVG e PNG transparentes em 300 DPI, com 30 cm de largura. As regras de tamanho, posição, técnica, cor da malha e partes vazadas estão em `producao/README.md`. A Dimona baixa a arte por URL pública: `https://siriguela.site/producao/camisetas/<slug>/<slug>-estampa-300dpi.png`. Se a área de impressão dela for menor que 30 cm, mude `largura_cm` em `producao/camisetas.json` e rode `node producao/gerar-arquivos.js`.
2. Acrescente a `producao/camisetas.json` o prefixo de SKU da Dimona de cada camiseta (malha + cor). O SKU final é prefixo + tamanho. O Worker lê esse arquivo.

## Fase 4. Amostras

Antes de anunciar, peça amostras com `sample: true`, pelo painel ou pela API. Comece com 2 ou 3 peças: uma clara (Azulejo), uma escura (Ciranda) e a de mais detalhe (Jardim). Os pedidos de amostra vão para o endereço do Matheus.

Quando chegarem, confira com ele:
- cor da malha;
- nitidez e cor da estampa;
- caimento e tamanho;
- etiqueta;
- prazo real, do pedido até a entrega.

Anote as medidas reais (largura e comprimento de cada tamanho) para a ficha do site.

## Fase 5. Worker `pedidos` (Nextout → Dimona)

Crie `pedidos/worker.mjs` e `pedidos/wrangler.jsonc`, no padrão de `checkout/` e `avisos/`:

1. Rota `siriguela.site/api/pedidos`, só POST.
2. Confira a assinatura `X-Nextout-Assinatura`:
   - é um HMAC-SHA256 de `t + "." + corpo`, feito com o secret `NEXTOUT_WEBHOOK_SECRET`;
   - compare com `crypto.subtle` em tempo constante;
   - recuse se a diferença de `t` passar de 300 s.
3. Use o `id` do evento para não processar o mesmo evento duas vezes. Guarde em um D1 ou KV `pedidos` o evento recebido, o pedido enviado à Dimona e a resposta.
4. Trate só o evento `pedido.pago`. Para cada produto:
   - separe o nome `Camiseta <Nome> · tamanho <T>`;
   - ache a camiseta em `producao/camisetas.json`;
   - monte o SKU e a URL da arte.
5. O webhook não traz a UF: pegue pelo CEP no `https://viacep.com.br/ws/<cep>/json/`. O complemento também não vem: deixe em branco.
6. Chame `POST <domínio Dimona>/api/<versão>/orders` com o token `DIMONA_TOKEN` (secret). Use o id da Nextout como `order_id`/`id`, que impede pedido em dobro. Mande também o `webhook_url` de status, se a Dimona aceitar.
7. Responda 200 rápido. Se a Dimona falhar, guarde o pedido como pendente e avise por e-mail. O binding `send_email` do `avisos` serve de modelo.
8. Na Nextout, em Integrações → Automação → Webhooks, cadastre `https://siriguela.site/api/pedidos` no evento `pedido.pago`. O Matheus cola o segredo `whsec_` com `npx wrangler secret put NEXTOUT_WEBHOOK_SECRET`.
9. A documentação da Nextout avisa que checkout criado pela API pode não disparar webhook. Teste com uma compra real de baixo valor. Se não disparar, fale com o suporte da Nextout e, enquanto isso, o Matheus passa os pedidos à mão do painel da Nextout para o da Dimona.

Para o deploy, o secret `CLOUDFLARE_API_TOKEN` precisa estar no GitHub (veja o `docs/lancamento.md`). Acrescente o `pedidos` ao `.github/workflows/workers.yml`.

## Fase 6. Site e checkout

- Preencha `camisetas.ficha` em `assets/js/produtos.js`: tecido, técnica, cuidados e a tabela de medidas real das amostras.
- Se o prazo real não couber em 7 a 15 dias corridos, mude em `camisetas.entrega` e no `CLAUDE.md`, com o OK do Matheus.
- Na Nextout, em Fretes, use o frete manual com valor fixo de R$ 19,90 para todo o Brasil, sem frete grátis.
- Faça uma compra real do começo ao fim:
  1. pague com Pix;
  2. confira o webhook;
  3. confira o pedido criado na Dimona;
  4. espere a peça chegar.

## Pronto quando

- 9 artes conferidas pelo Matheus em `producao/camisetas/`.
- Amostras aprovadas pelo Matheus.
- Ficha técnica e prazo do site com os números reais.
- Uma compra real que virou pedido na Dimona sem ninguém digitar nada.
