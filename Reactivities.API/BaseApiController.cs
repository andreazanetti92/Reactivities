using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Reactivities.Application.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {

       private IMediator _mediator;

       protected IMediator Mediator =>
            _mediator ??= HttpContext.RequestServices
            .GetService<IMediator>();

       protected ActionResult HandleResult<T>(Result<T> result)
       {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null) return Ok(result.Value);
            if (result.IsSuccess && result.Value == null) return NotFound();

            return BadRequest(result.Error);
       }

    }
}
