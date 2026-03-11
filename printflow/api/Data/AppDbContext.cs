using Microsoft.EntityFrameworkCore;
using PrintFlow.Api.Models;

namespace PrintFlow.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Filamento> Filamentos { get; set; }
    public DbSet<Projeto> Projetos { get; set; }
}
