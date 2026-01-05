import { GoogleGenAI } from "@google/genai";
import { Client, Vehicle, SimulationOffer } from "../types";

const apiKey = process.env.API_KEY;

export const generateCreditAnalysis = async (
  client: Client,
  vehicle: Vehicle,
  offers: SimulationOffer[]
): Promise<string> => {
  if (!apiKey) {
    return "Análise de IA indisponível (Chave de API ausente). Com base na simulação, o cliente possui múltiplas ofertas aprovadas com taxas competitivas.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const approvedOffers = offers.filter(o => o.status === 'APPROVED');
    const rejectedOffers = offers.filter(o => o.status === 'REJECTED');
    
    const prompt = `
      Atue como um analista de crédito sênior de uma concessionária de veículos no Brasil.
      Analise os seguintes resultados de simulação de crédito:
      
      Cliente: ${client.name} (Score: ${client.score}, Renda: R$ ${client.income})
      Veículo: ${vehicle.brand} ${vehicle.model} (${vehicle.year}) - Preço: R$ ${vehicle.price}
      
      Resultados:
      - Bancos Aprovados: ${approvedOffers.length} (Melhor Taxa: ${approvedOffers.length > 0 ? Math.min(...approvedOffers.map(o => o.interestRate)).toFixed(2) + '%' : 'N/A'})
      - Bancos Reprovados: ${rejectedOffers.length}
      
      Escreva um resumo conciso e profissional de 2 frases em Português do Brasil para o vendedor.
      Primeira frase: Resuma as chances de aprovação e a melhor estratégia.
      Segunda frase: Sugira um argumento de fechamento baseado na parcela mensal ou na taxa.
      Não use markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Análise concluída.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Análise de IA temporariamente indisponível devido a problemas de conexão.";
  }
};