namespace PrintFlow.Api.DTOs;

public record FilamentoCreateDto(
    string Nome,
    string Tipo,
    float Peso,
    float Total,
    float Preco,
    string Cor
);

public record FilamentoUpdateDto(
    string? Nome,
    string? Tipo,
    float? Peso,
    float? Total,
    float? Preco,
    string? Cor
);
