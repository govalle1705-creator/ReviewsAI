export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { nombre, resena, tono } = req.body;

    const prompt = `Eres el community manager profesional del restaurante "${nombre}" en Guatemala. 
Un cliente dejó esta reseña en Google: "${resena}"
Escribe una respuesta en español, tono ${tono}, de máximo 4 oraciones.
La respuesta debe: agradecer al cliente, atender su comentario específico, mencionar el nombre del restaurante, e invitarlo a regresar.
Solo escribe la respuesta, sin explicaciones adicionales.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const data = await response.json();
    const respuesta = data.content[0].text;
    res.status(200).json({ respuesta });
}
