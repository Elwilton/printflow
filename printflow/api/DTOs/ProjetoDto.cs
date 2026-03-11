namespace PrintFlow.Api.DTOs;

public record ProjetoCreateDto(
    string Nome,
    string Emoji,
    string Status,
    float TempoHoras,
    float Custo,
    float Venda,
    int? FilamentoId
);

public record ProjetoUpdateDto(
    string? Nome,
    string? Emoji,
    string? Status,
    float? TempoHoras,
    float? Custo,
    float? Venda,
    int? FilamentoId
);
