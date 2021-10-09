import { IEquipe } from "./Equipe";
import { IProduto } from "./Produto";

export interface IPedido {
    id: number;
    endereco: string;
    produtos: IProduto;
    equipe: IEquipe;
    dataCriacaoFormatada: string;
    dataEntregaFormatada: string;
    listaProdutosFormatada: string;
    totalDoPedidoFormatado: string;
}
