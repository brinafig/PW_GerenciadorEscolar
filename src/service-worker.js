import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

// motor offline do projeto. É ele que roda em segundo plano no navegador, transforma o site comum num PWA


clientsClaim(); //força o Service Worker a assumir o controle imediato de todas as abas da aplicação assim que é ativado

// Arquivos gerados pelo build 
precacheAndRoute(self.__WB_MANIFEST); //Quando roda o npm run build, o Webpack lnaça aqui uma lista com todos os ficheiros gerados. O Service Worker descarrega e guarda tudo isto no cache do navegador

// Navegacao SPA que sempre devolve o index.html
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(({ request, url }) => { //Numa SPA não existem ficheiros /alunos.html... Só existe o index.html.
  if (request.mode !== "navigate") return false;
  if (url.pathname.startsWith("/_")) return false;
  if (url.pathname.match(fileExtensionRegexp)) return false;
  return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"));

registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith(".png"),
  new StaleWhileRevalidate({
    cacheName: "images", //se pedir uma imagem, entrega o que tem guardado
    plugins: [new ExpirationPlugin({ maxEntries: 50 })], //medida de segurança pra não encher a memoria
  })
);

//Quando lança uma versão nova do site, o navegador descarrega o novo Service Worker mas deixa esperando
//  até que o usuario feche todas as abas antiga
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
