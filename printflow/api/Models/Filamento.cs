namespace PrintFlow.Api.Models;

public class Filamento
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public float Peso { get; set; }    // gramas restantes
    public float Total { get; set; }   // gramas totais do rolo
    public float Preco { get; set; }   // preço em R$
    public string Cor { get; set; } = "#444444"; // hex da cor
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
