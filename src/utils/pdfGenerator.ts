import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '/logo-blue.png';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const gerarNotificacaoPDF = (dados: any) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    doc.addImage(logo, 'PNG', 15, 15, 40, 15);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTIFICAÇÃO EXTRAJUDICIAL', 105, 40, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const corpoTexto = `
Prezado(a) Sr(a),

Na qualidade de procurador do condomínio ${dados.condominio || '[Nome do Condomínio]'}, sirvo-me do presente para notificá-lo do quanto segue:

Referentes às cobranças das cotas condominiais, não consta no sistema do condomínio o recebimento das referidas cotas.

Neste sentido e buscando solucionar o impasse amigavelmente, a NOTIFICANTE concede oportunidade para que V.Sa. regularize a situação de inadimplência, dentro do prazo de 03 (três) dias contados da data de recebimento da presente notificação.

Caso o débito não seja pago no referido prazo, fica desde já V.Sa. constituído em mora para todos os fins de direito, sendo certo que a NOTIFICANTE adotará todas as medidas necessárias, inclusive JUDICIAIS e PROTESTO DE TÍTULO, para reaver o seu crédito.

Para maiores informações sobre o débito, regularização e apresentações de comprovantes, favor, entrar em contato com o nosso escritório situado na Praça Orlando Leite, nº 01, Condomínio Gil Moreira, 1º Andar, Sala 20, Recreio, Vitoria da Conquista - BA, ou através dos telefones (77) 98838-0588, 77 3202-7833 ou e-mail: juridico@diasenunesadvocacia.com.br.

Certos de que seremos prontamente atendidos nesse cordial pedido, segue a presente NOTIFICAÇÃO EXTRAJUDICIAL, devidamente assinada, representando a salvaguarda dos legítimos direitos do NOTIFICANTE.
    `;
    
    doc.text(corpoTexto, 15, 60, { maxWidth: 180 });

    doc.text(`Vitória da Conquista - BA, ${hoje}`, 15, doc.internal.pageSize.height - 50);
    doc.text('Atenciosamente,', 15, doc.internal.pageSize.height - 30);
    doc.text('Dias & Nunes Advocacia e Consultoria Jurídica', 15, doc.internal.pageSize.height - 25);
    
    doc.save(`notificacao_extrajudicial_${dados.condominio || 'documento'}.pdf`);
};