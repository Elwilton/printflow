using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrintFlow.Api.Data;
using PrintFlow.Api.DTOs;
using PrintFlow.Api.Models;

namespace PrintFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilamentosController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var filamentos = await db.Filamentos
            .OrderByDescending(f => f.CriadoEm)
            .ToListAsync();
        return Ok(filamentos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var filamento = await db.Filamentos.FindAsync(id);
        if (filamento is null) return NotFound();
        return Ok(filamento);
    }

    [HttpPost]
    public async Task<IActionResult> Create(FilamentoCreateDto dto)
    {
        var filamento = new Filamento
        {
            Nome  = dto.Nome,
            Tipo  = dto.Tipo,
            Peso  = dto.Peso,
            Total = dto.Total,
            Preco = dto.Preco,
            Cor   = dto.Cor,
        };

        db.Filamentos.Add(filamento);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = filamento.Id }, filamento);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, FilamentoUpdateDto dto)
    {
        var filamento = await db.Filamentos.FindAsync(id);
        if (filamento is null) return NotFound();

        if (dto.Nome  is not null) filamento.Nome  = dto.Nome;
        if (dto.Tipo  is not null) filamento.Tipo  = dto.Tipo;
        if (dto.Peso  is not null) filamento.Peso  = dto.Peso.Value;
        if (dto.Total is not null) filamento.Total = dto.Total.Value;
        if (dto.Preco is not null) filamento.Preco = dto.Preco.Value;
        if (dto.Cor   is not null) filamento.Cor   = dto.Cor;

        await db.SaveChangesAsync();
        return Ok(filamento);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var filamento = await db.Filamentos.FindAsync(id);
        if (filamento is null) return NotFound();

        db.Filamentos.Remove(filamento);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
