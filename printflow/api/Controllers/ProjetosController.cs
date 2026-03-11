using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrintFlow.Api.Data;
using PrintFlow.Api.DTOs;
using PrintFlow.Api.Models;

namespace PrintFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjetosController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var query = db.Projetos
            .Include(p => p.Filamento)
            .OrderByDescending(p => p.CriadoEm)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(p => p.Status == status);

        return Ok(await query.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var projeto = await db.Projetos
            .Include(p => p.Filamento)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (projeto is null) return NotFound();
        return Ok(projeto);
    }

    [HttpPost]
    public async Task<IActionResult> Create(ProjetoCreateDto dto)
    {
        var projeto = new Projeto
        {
            Nome        = dto.Nome,
            Emoji       = dto.Emoji,
            Status      = dto.Status,
            TempoHoras  = dto.TempoHoras,
            Custo       = dto.Custo,
            Venda       = dto.Venda,
            FilamentoId = dto.FilamentoId,
        };

        db.Projetos.Add(projeto);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = projeto.Id }, projeto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ProjetoUpdateDto dto)
    {
        var projeto = await db.Projetos.FindAsync(id);
        if (projeto is null) return NotFound();

        if (dto.Nome       is not null) projeto.Nome       = dto.Nome;
        if (dto.Emoji      is not null) projeto.Emoji      = dto.Emoji;
        if (dto.Status     is not null) projeto.Status     = dto.Status;
        if (dto.TempoHoras is not null) projeto.TempoHoras = dto.TempoHoras.Value;
        if (dto.Custo      is not null) projeto.Custo      = dto.Custo.Value;
        if (dto.Venda      is not null) projeto.Venda      = dto.Venda.Value;
        if (dto.FilamentoId.HasValue)   projeto.FilamentoId = dto.FilamentoId;

        await db.SaveChangesAsync();
        return Ok(projeto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var projeto = await db.Projetos.FindAsync(id);
        if (projeto is null) return NotFound();

        db.Projetos.Remove(projeto);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
