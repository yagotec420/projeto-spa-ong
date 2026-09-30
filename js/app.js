import { processarRoteamento } from "./router.js";

// Assim que a casca do site carregar, liga o nosso roteador automático
document.addEventListener("DOMContentLoaded", () => {
    processarRoteamento();
});
