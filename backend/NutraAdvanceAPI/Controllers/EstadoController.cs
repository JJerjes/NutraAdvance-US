using Microsoft.AspNetCore.Mvc;

namespace NutraAdvanceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstadoController : ControllerBase
{
  [HttpGet]
  public IActionResult Get() => Ok(new { estado = "ok" });

  [HttpGet("prueba-error")]
  public IActionResult PruebaError() => throw new InvalidOperationException("Error de prueba");
}