// main.js - JavaScript compartilhado
document.addEventListener('DOMContentLoaded', () => {
    // Este evento garante que o código só rode depois que a página carregar completamente.
    // Atualmente, a animação de 'fadeIn' é controlada puramente pelo CSS.
    // Este arquivo pode ser usado para lógicas mais complexas no futuro.

    // Exemplo: lógica de transição de página (fade out)
    const allLinks = document.querySelectorAll('a');

    allLinks.forEach(link => {
        // Ignora links que abrem em nova aba ou não são locais
        if (link.target === '_blank' || !link.href.startsWith(window.location.origin)) {
            return;
        }

        link.addEventListener('click', function(e) {
            e.preventDefault(); // Impede a navegação imediata
            const destination = this.href;

            // Aplica uma classe para o efeito de fade-out
            document.body.classList.add('fade-out');

            // Navega para a nova página após a animação
            setTimeout(() => {
                window.location.href = destination;
            }, 400); // Deve ser igual à duração da transição no CSS
        });
    });
});

// Adicione esta classe ao seu CSS para o efeito fade-out
/*
body.fade-out {
    opacity: 0;
}
*/
