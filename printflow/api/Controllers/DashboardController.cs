using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrintFlow.Api.Data;

namespace PrintFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var projetos = await db.Projetos.ToListAsync();

        var concluidos = projetos.Where(p => p.Status == "Concluído").ToList();

        var faturamento = concluidos.Sum(p => p.Venda);
        var custoTotal  = concluidos.Sum(p => p.Custo);
        var lucro       = faturamento - custoTotal;
        var pecas       = concluidos.Count;

        // Filamento consumido: estimativa pelo custo e gasto médio por hora
        var horasTotais = projetos.Sum(p => p.TempoHoras);

        // Top 5 peças mais rentáveis
        var topPecas = concluidos
            .Where(p => p.Venda > 0)
            .Select(p => new
            {
                p.Id,
                p.Nome,
                p.Emoji,
                p.Venda,
                p.Custo,
                Lucro  = p.Venda - p.Custo,
                Margem = p.Venda > 0 ? (p.Venda - p.Custo) / p.Venda * 100 : 0,
            })
            .OrderByDescending(p => p.Margem)
            .Take(5)
            .ToList();

        // Impressões recentes (últimas 5, qualquer status)
        var recentes = projetos
            .OrderByDescending(p => p.CriadoEm)
            .Take(5)
            .Select(p => new
            {
                p.Id,
                p.Nome,
                p.Emoji,
                p.Status,
                p.Custo,
                p.Venda,
                p.CriadoEm,
            })
            .ToList();

        return Ok(new
        {
            Faturamento = faturamento,
            Lucro       = lucro,
            Pecas       = pecas,
            HorasTotais = horasTotais,
            TopPecas    = topPecas,
            Recentes    = recentes,
        });
    }
}
