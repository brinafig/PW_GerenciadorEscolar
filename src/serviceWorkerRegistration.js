//instalador do Service Worker. Enquanto o service-worker.js dita o que o Service Worker ia fazer
// este dita quando e como o navegador deve instalar
export function register() {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {// trava de segurança pra impedir o sw de ativar enquanto estiver programando
    window.addEventListener("load", () => { //obriga o sistema a esperar que toda a página original seja descarregada pelo usuario antes de tentar instalar o Service Worker em segundo plano
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker 
        .register(swUrl) //localiza o ficheiro service-worker.js gerado. register avisa pra instalar o script
        .then((registration) => {
          console.log("Service worker registrado:", registration.scope);
        })
        .catch((error) => {
          console.error("Erro ao registrar service worker:", error);
        });
    });
  }
}

export function unregister() { //botao de panico, força o navegador a desinstalar o ServiceWorker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) => console.error(error.message));
  }
}
