// Paleta de cores baseada no tema escuro da imagem (estilo Twitch/Discord)
const colors = {
  // Cores principais - fundo escuro
  background: {
    primary: '#0E0E10',      // Fundo principal (quase preto)
    secondary: '#18181B',    // Fundo secundário (cinza escuro)
    tertiary: '#1F1F23',     // Fundo terciário (cinza médio)
    elevated: '#26262C',     // Elementos elevados
  },
  
  // Cores de texto
  text: {
    primary: '#EFEFF1',      // Texto principal (branco quase puro)
    secondary: '#B9A3A3',    // Texto secundário (cinza claro)
    tertiary: '#ADADB8',     // Texto terciário (cinza médio)
    muted: '#71717A',        // Texto desabilitado (cinza escuro)
  },
  
  // Cores de acento - azul
  accent: {
    primary: '#9147FF',      // Roxo/azul principal (estilo Twitch)
    secondary: '#772CE8',   // Roxo/azul secundário
    hover: '#A970FF',       // Hover nos botões
    light: '#C89BFF',       // Versão mais clara
  },
  
  // Cores de estado
  status: {
    live: '#FF4F4D',         // Vermelho para AO VIVO
    success: '#00FA9A',      // Verde para sucesso
    error: '#FF4F4D',        // Vermelho para erro
    warning: '#FFBF00',      // Amarelo para aviso
  },
  
  // Cores de borda
  border: {
    primary: '#2F2F35',      // Borda principal
    secondary: '#3F3F46',    // Borda secundária
    focus: '#9147FF',        // Borda em foco
  },
  
  // Cores de input
  input: {
    background: '#0E0E10',   // Fundo de input
    border: '#2F2F35',       // Borda de input
    placeholder: '#71717A',  // Texto placeholder
  },
  
  // Cores de card
  card: {
    background: '#1F1F23',   // Fundo de card
    hover: '#26262C',        // Hover no card
  },
  
  // Gradientes
  gradient: {
    primary: 'linear-gradient(135deg, #9147FF 0%, #772CE8 100%)',
    secondary: 'linear-gradient(135deg, #772CE8 0%, #5B21B6 100%)',
    dark: 'linear-gradient(180deg, #1F1F23 0%, #0E0E10 100%)',
  },
};

module.exports = colors;
