/* SIRIGUELA — service worker só para o aviso no navegador das sungas (Web Push).
   Não guarda cache nem intercepta páginas. O push chega sem conteúdo: o texto fica aqui. */
self.addEventListener("push", (e) => {
  e.waitUntil(self.registration.showNotification("As sungas chegaram.", {
    body: "A coleção de sungas da Siriguela está à venda. Toque para ver as estampas.",
    icon: "/assets/img/icone-192.png",
    badge: "/assets/img/icone-192.png",
    tag: "sungas",
    data: { url: "/sungas/" }
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || "/sungas/", self.location.origin).href;
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((abertas) => {
    const aba = abertas.find((c) => c.url === url);
    return aba ? aba.focus() : clients.openWindow(url);
  }));
});
