require('dotenv').config();
const fs = require('fs/promises');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function traduzirComIA(codigoJava) {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Converta este c¨®digo Java para Kotlin idiom¨¢tico.
    Retorne apenas o c¨®digo puro, sem explica??es e sem blocos de markdown (\`\`\`).
    
    C¨®digo Java:
    ${codigoJava}
    `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text().replace(/```[a-z]*\n?/gi, '').trim();
    } catch (erro) {
        throw new Error(`Erro na API: ${erro.message}`);
    }
}

async function iniciar() {
    const arquivoEntrada = process.argv[2];

    if (!arquivoEntrada || !arquivoEntrada.endsWith('.java')) {
        console.error("Uso correto: node tradutor.js Arquivo.java");
        return;
    }

    try {
        const codigoJava = await fs.readFile(arquivoEntrada, 'utf-8');
        if (!codigoJava.trim()) return console.log("O arquivo Java est¨¢ vazio.");

        console.log(`Traduzindo ${arquivoEntrada}...`);
        const codigoKotlin = await traduzirComIA(codigoJava);

        const arquivoSaida = arquivoEntrada.replace('.java', '.kt');
        await fs.writeFile(arquivoSaida, codigoKotlin);

        console.log(`Salvo com sucesso em: ${arquivoSaida}`);
    } catch (erro) {
        console.error("Erro no processo:", erro.message);
    }
}

iniciar();