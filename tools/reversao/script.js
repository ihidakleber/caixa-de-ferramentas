document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos da página
    const mapFileInput = document.getElementById('map-file-input');
    const inputDataEl = document.getElementById('input-data');
    const outputDataEl = document.getElementById('output-data');
    const processBtn = document.getElementById('process-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadTxtBtn = document.getElementById('download-txt-btn');

    let reversalMap = null; // Armazena o mapa carregado

    // Evento para carregar e ler o arquivo do mapa
    mapFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                reversalMap = JSON.parse(e.target.result);
                alert('Mapa de reversão carregado com sucesso!');
            } catch (error) {
                alert('Erro ao ler o arquivo. Certifique-se de que é um mapa JSON válido.');
                reversalMap = null;
            }
        };
        reader.readAsText(file);
    });

    // Função para reverter os pseudônimos
    function processData() {
        if (!reversalMap) {
            alert('Por favor, carregue um arquivo de mapa de reversão primeiro.');
            return;
        }

        const inputData = inputDataEl.value.trim();
        if (!inputData) {
            alert('Por favor, insira os pseudônimos que deseja reverter.');
            return;
        }

        const lines = inputData.split('\n').filter(line => line.trim() !== '');
        const originalLines = [];

        for (const line of lines) {
            const hash = line.trim();
            const original = reversalMap[hash];
            if (original) {
                originalLines.push(original);
            } else {
                originalLines.push('[NÃO ENCONTRADO NO MAPA]');
            }
        }
        
        outputDataEl.value = originalLines.join('\n');
    }

    // Função genérica para download
    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Adiciona eventos aos botões
    processBtn.addEventListener('click', processData);

    copyBtn.addEventListener('click', () => {
        if (!outputDataEl.value) return;
        navigator.clipboard.writeText(outputDataEl.value)
            .then(() => alert('Resultados copiados para a área de transferência!'))
            .catch(err => alert('Falha ao copiar: ', err));
    });

    downloadTxtBtn.addEventListener('click', () => {
        if (!outputDataEl.value) return;
        downloadFile('dados_originais.txt', outputDataEl.value);
    });
});
