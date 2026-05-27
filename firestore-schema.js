// ============================================================
//  firestore-schema.js — Estrutura de dados no Firestore
//  Pedacinho do Céu
// ============================================================
//
//  Este arquivo é DOCUMENTAÇÃO — não precisa ser importado.
//  Descreve todas as coleções e campos usados no Firestore.
//
//  Coleções no Firestore:
//
//  /usuarios/{uid}
//    nome:        string   — "Você", "Arthur", "Mãe", "Pai"
//    email:       string
//    fcmToken:    string   — token para push notifications
//    cor:         string   — "#F59E0B" (cor associada ao membro)
//    avatar:      string   — emoji ou inicial: "🌱" / "A"
//
//  /tarefas/{id}
//    titulo:      string
//    descricao:   string
//    atribuidaPara: string  — uid do responsável
//    criadaPor:   string    — uid de quem criou
//    dataLimite:  timestamp
//    status:      "pendente" | "em_andamento" | "concluida"
//    criadaEm:    timestamp
//
//  /mercado/{id}
//    item:        string
//    quantidade:  string   — "2 kg", "1 caixa"
//    comprado:    boolean
//    adicionadoPor: string — uid
//    criadoEm:   timestamp
//
//  /refeicoes/{id}
//    diaSemana:   "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom"
//    semana:      string   — "2025-W28" (ano-semana ISO)
//    almoco:      string
//    jantar:      string
//    observacoes: string
//
//  /melhorias/{id}
//    titulo:      string
//    descricao:   string
//    materiais:   string
//    prioridade:  "baixa" | "media" | "alta"
//    status:      "ideia" | "planejado" | "em_andamento" | "concluido"
//    criadoEm:    timestamp
//
//  /manutencoes/{id}
//    titulo:      string   — "Troca de óleo Fiesta"
//    periodicidade: "mensal" | "trimestral" | "semestral" | "anual"
//    proximaData: timestamp
//    ultimaData:  timestamp
//    veiculo:     string   — "Fiesta" | "Corsa" | "Casa"
//    observacoes: string
//
//  /inventario/{id}
//    nome:        string   — "Bomba da piscina"
//    marca:       string
//    modelo:      string
//    localizacao: string
//    ultimaManutencao: timestamp
//    proximaManutencao: timestamp
//    observacoes: string
//
//  /horta/{id}
//    nome:        string   — "Tomate cereja"
//    tipo:        "semente" | "muda" | "plantado" | "colhido"
//    dataPlantio: timestamp
//    dataColheita: timestamp (prevista)
//    insumos:     string   — "adubo, água 2x/dia"
//    observacoes: string
//
//  /contatos/{id}
//    nome:        string   — "João — Mecânico"
//    telefone:    string
//    categoria:   "mecanico" | "encanador" | "eletricista" | "guincho" | "emergencia" | "outro"
//    observacoes: string
//
// ============================================================

// REGRAS DE SEGURANÇA (Firestore Rules)
// Cole estas regras em: Firestore → Rules

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Apenas usuários autenticados podem ler/gravar
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
*/
