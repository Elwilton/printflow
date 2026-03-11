namespace PrintFlow.Api.Models;

public class Projeto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Emoji { get; set; } = "🖨️";
    public string Status { get; set; } = "Em Fila"; // Em Fila | Imprimindo | Concluído | Falhou
    public float TempoHoras { get; set; }
    public float Custo { get; set; }
    public float Venda { get; set; }

    // Relação com filamento (opcional — pode não ter filamento vinculado)
    public int? FilamentoId { get; set; }
    public Filamento? Filamento { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
