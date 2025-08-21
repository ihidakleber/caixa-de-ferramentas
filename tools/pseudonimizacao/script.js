document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos da página
    const inputDataEl = document.getElementById('input-data');
    const saltKeyEl = document.getElementById('salt-key');
    const outputDataEl = document.getElementById('output-data');
    const processBtn = document.getElementById('process-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadTxtBtn = document.getElementById('download-txt-btn');
    const downloadMapBtn = document.getElementById('download-map-btn');

    let reversalMap = {}; // Armazena o mapa para download

    // Função para converter um buffer de dados em uma string hexadecimal
    function bufferToHex(buffer) {
        return [...new Uint8Array(buffer)]
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Função principal para gerar o hash SHA-256
    async function generateHash(data, salt) {
        const textToEncode = data + salt;
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(textToEncode);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
        return bufferToHex(hashBuffer);
    }
    
    // Função para processar os dados de entrada
    async function processData() {
        const inputData = inputDataEl.value.trim();
        const saltKey = saltKeyEl.value;

        if (!inputData || !saltKey) {
            alert('Por favor, preencha a área de dados e a palavra-chave (Sal).');
            return;
        }

        const lines = inputData.split('\n').filter(line => line.trim() !== '');
        const hashedLines = [];
        reversalMap = {}; // Limpa o mapa anterior

        for (const line of lines) {
            const originalLine = line.trim();
            const hash = await generateHash(originalLine, saltKey);
            hashedLines.push(hash);
            reversalMap[hash] = originalLine; // Adiciona ao mapa de reversão
        }

        outputDataEl.value = hashedLines.join('\n');
        alert('Dados processados com sucesso!');
    }

    // Função genérica para download de arquivos
    function downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Adiciona os eventos aos botões
    processBtn.addEventListener('click', processData);

    copyBtn.addEventListener('click', () => {
        if (!outputDataEl.value) return;
        navigator.clipboard.writeText(outputDataEl.value)
            .then(() => alert('Resultados copiados para a área de transferência!'))
            .catch(err => alert('Falha ao copiar: ', err));
    });

    downloadTxtBtn.addEventListener('click', () => {
        if (!outputDataEl.value) return;
        downloadFile('pseudonimos.txt', outputDataEl.value, 'text/plain');
    });

    downloadMapBtn.addEventListener('click', () => {
        if (Object.keys(reversalMap).length === 0) {
            alert('Nenhum mapa de reversão foi gerado ainda. Processe os dados primeiro.');
            return;
        }
        const mapContent = JSON.stringify(reversalMap, null, 2); // Formata o JSON
        downloadFile('mapa_reversao.json', mapContent, 'application/json');
    });
});
