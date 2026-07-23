import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '/logo-white.png';

const PRIMARY: [number, number, number] = [29, 55, 65]; // #1D3741
const SECONDARY: [number, number, number] = [189, 143, 158]; // #BD8F9E

// Dados fictícios do escritório — não correspondem a um endereço ou contato real.
const ESCRITORIO = {
  nome: 'Lex & Co Advocacia e Consultoria Jurídica',
  endereco: 'Alameda das Acácias, nº 456 — Sala 12, Jardim Central, Cidade Exemplo - UF, CEP 00000-000',
  telefone: '(00) 0000-0000',
  email: 'contato@lexeco.adv.br',
};

const ADVOGADOS: Record<string, string> = {
  'dr-ramos': 'Dr. Ramos',
  'dra-almeida': 'Dra. Almeida',
};

export interface NotificacaoPDFData {
  titulo?: string;
  descricao?: string;
  condominio?: string;
  condominos?: string;
  advogadoResponsavel?: string;
}

const gerarProtocolo = () => {
  const data = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const sufixo = Math.floor(Math.random() * 900 + 100);
  return `NE-${data}-${sufixo}`;
};

export const gerarNotificacaoPDF = (dados: NotificacaoPDFData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const hoje = new Date().toLocaleDateString('pt-BR');

  const condominio = dados.condominio?.trim() || '[Nome do Condomínio]';
  const condomino = dados.condominos?.trim() || '[Nome do Condômino]';
  const titulo = dados.titulo?.trim() || 'Notificação Extrajudicial';
  const descricao =
    dados.descricao?.trim() ||
    'Não consta, até a presente data, a regularização da pendência relatada junto ao condomínio.';
  const advogado = ADVOGADOS[dados.advogadoResponsavel ?? ''] ?? 'Responsável não informado';

  // Cabeçalho
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageWidth, 32, 'F');
  doc.addImage(logo, 'PNG', 12, 4, 24, 24);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('NOTIFICAÇÃO EXTRAJUDICIAL', pageWidth - 12, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Protocolo: ${gerarProtocolo()}`, pageWidth - 12, 21, { align: 'right' });
  doc.text(`Data de emissão: ${hoje}`, pageWidth - 12, 26, { align: 'right' });

  // Ficha resumo
  autoTable(doc, {
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3, textColor: 30 },
    headStyles: { fillColor: SECONDARY, textColor: 255, fontStyle: 'bold' },
    head: [['Condomínio Notificante', 'Condômino Notificado', 'Advogado Responsável']],
    body: [[condominio, condomino, advogado]],
  });

  const afterTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Assunto: ${titulo}`, 15, afterTableY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const corpoTexto = `
Prezado(a) Sr(a). ${condomino},

Na qualidade de procurador(a) do condomínio ${condominio}, sirvo-me do presente para notificá-lo(a) formalmente sobre o assunto acima referido:

${descricao}

Neste sentido, e buscando solucionar o impasse de forma amigável, a NOTIFICANTE concede a V.Sa. o prazo de 03 (três) dias úteis, contados do recebimento desta notificação, para a regularização da situação ora exposta.

Caso não haja manifestação ou regularização no prazo mencionado, fica desde já V.Sa. constituído(a) em mora para todos os fins de direito, podendo a NOTIFICANTE adotar as medidas cabíveis, inclusive judiciais, para a garantia de seus direitos.

Para maiores esclarecimentos, favor entrar em contato com nosso escritório pelo endereço, telefone ou e-mail indicados no rodapé desta notificação.

Certos de que seremos prontamente atendidos nesse cordial pedido, subscrevemo-nos.
  `.trim();

  const bodyLines = doc.splitTextToSize(corpoTexto, pageWidth - 30);
  doc.text(bodyLines, 15, afterTableY + 10);

  // Assinatura
  const sigY = pageHeight - 48;
  doc.setDrawColor(...SECONDARY);
  doc.setLineWidth(0.4);
  doc.line(15, sigY, 90, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text(advogado, 15, sigY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(ESCRITORIO.nome, 15, sigY + 10);

  // Rodapé
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 18, pageWidth - 15, pageHeight - 18);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `${ESCRITORIO.nome}  •  ${ESCRITORIO.endereco}`,
    pageWidth / 2,
    pageHeight - 13,
    { align: 'center', maxWidth: pageWidth - 30 }
  );
  doc.text(
    `Tel.: ${ESCRITORIO.telefone}  •  E-mail: ${ESCRITORIO.email}`,
    pageWidth / 2,
    pageHeight - 9,
    { align: 'center' }
  );

  const nomeArquivo = condominio.replace(/[^\p{L}\p{N}]+/gu, '_');
  doc.save(`notificacao_extrajudicial_${nomeArquivo}.pdf`);
};
