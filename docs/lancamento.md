# Lançamento: o que falta para rodar anúncio

Revisão feita em 25/11/2026. O site no ar já tem: as 9 camisetas com hero recortado, textos no tom cartão-postal, sacola, cupom, páginas de Trocas, Privacidade e Contato, aviso de cookies com Pixel da Meta e GA4 (esperando os IDs), UTMs e `fbclid` até o pagamento, sitemap, robots, 404 e canonical em todas as páginas.

## Bloqueia a venda (resolver antes de qualquer anúncio)

1. **O pagamento não abre.** O site chama a Nextout e ela recusa (o Worker devolve 502). As duas causas que a documentação da Nextout aponta:
   - Domínio de checkout não cadastrado: Painel Nextout → Domínio → `checkout.siriguela.site`, e o CNAME `cname.vercel-dns.com` no Cloudflare (DNS only, nuvem cinza).
   - Chave inválida: Painel → Produtos → Integração via API → gerar uma chave `nx_sk_` nova e colar no Cloudflare em Workers → `siriguela-checkout` → Settings → Variables → secret `NEXTOUT_KEY`.
   - Depois: conectar o gateway (Integrações → pagou.ai) e fazer uma compra de teste de ponta a ponta, com Pix.
2. **Frete na Nextout.** Em Fretes, escolher "Frete manual" e criar as faixas: grátis a partir de R$ 399,90 e o valor do fornecedor abaixo disso. Quem envia é o fornecedor, então o "Next Envios" não serve aqui.
3. **Fornecedor de produção** (ver `docs/configurar-fornecedor.md`). Sem ele, uma venda não vira camiseta.
4. **Dados da empresa** em `assets/js/produtos.js` → `empresa`: razão social, CNPJ, endereço. O Decreto 7.962/2013 pede isso no site. Aparecem sozinhos no rodapé e nas páginas de ajuda.

## Necessário para medir os anúncios

5. **Pixel da Meta**: criar no Gerenciador de Eventos e colar o ID em `produtos.js` → `marketing.metaPixel`. O site manda PageView, ViewContent, AddToCart, InitiateCheckout e Lead.
6. **Compra (Purchase)**: a venda acontece no checkout da Nextout. Ligar a **UTMify** na Nextout (Integrações → UTMify) e, na UTMify, conectar a conta de anúncios da Meta, para cada venda voltar para a campanha certa.
7. **Verificar o domínio** `siriguela.site` no Gerenciador de Negócios da Meta (registro TXT no Cloudflare) e priorizar os eventos.
8. **GA4** (opcional): ID `G-...` em `marketing.ga4`.

## Necessário para atender o cliente

9. **E-mail `ola@siriguela.site`** recebendo: Cloudflare → Email → Email Routing → encaminhar para o seu e-mail pessoal. O site inteiro manda as pessoas escreverem para ele.
10. **Ficha técnica** em `produtos.js` → `camisetas.ficha`: tecido, estampa, cuidados e tabela de medidas, com os números do fornecedor escolhido. Enquanto estiver vazia, a seção não aparece.
11. **Instagram no rodapé**: quando o perfil existir, a coluna "Siga" volta em `assets/js/app.js` (está comentada em `chrome()`).
12. **WhatsApp** (opcional) em `empresa.whatsapp`.

## Infraestrutura

13. **Deploy dos Workers**: a Action "Workers" falha desde o começo porque falta o secret `CLOUDFLARE_API_TOKEN` no GitHub (Settings → Secrets and variables → Actions). Sem ele, mudança no catálogo não chega ao checkout.
14. **Deploy do site**: desde 24/11/2026 o siriguela.site não atualiza. Produção ainda serve o PR #26, porque o build "Workers Builds: siriguela" da Cloudflare falha na hora, sem rodar. Confira o motivo em Cloudflare → Workers → siriguela → Builds. Até lá, os PRs #27 em diante (arquivos de impressão, cabeçalhos de segurança, sacola) ficam fora do ar.
15. **Pedido automático no fornecedor**: depois de escolher o fornecedor, um Worker novo recebe o webhook `pedido.pago` da Nextout e cria o pedido na API dele. A documentação da Nextout diz que checkout criado pela API ainda não dispara webhook, então confirme com o suporte dela (WhatsApp na página de documentação). Se não disparar, os primeiros pedidos passam à mão do painel da Nextout para o do fornecedor.

## Antes do primeiro real gasto em anúncio

- Compra de teste paga de verdade, recebida em casa, conferindo estampa, cor, tamanho e prazo.
- Trocar o prazo do site (7 a 15 dias corridos) se o do fornecedor for outro.
- Rever a margem: preço R$ 159,90, menos custo da peça, frete subsidiado, taxa do gateway e cupom de 10%.
