using Microsoft.EntityFrameworkCore;
using PrintFlow.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// ── Banco de dados ──────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=printflow.db"));

// ── Controllers ─────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// ── CORS ─────────────────────────────────────────────────────────────────────
// Permite que o app React Native (Expo web: localhost:8081) acesse a API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// ── Migrations automáticas na inicialização ──────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors("AllowAll");
app.MapControllers();

app.Run();
