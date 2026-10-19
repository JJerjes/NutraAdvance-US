var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();

var allowedOrigins =
    builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
  options.AddPolicy(
      "Frontend",
      policy =>
          policy
              .WithOrigins(allowedOrigins)
              .WithMethods("GET", "POST")
              .WithHeaders("Content-Type")
  );
});

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();