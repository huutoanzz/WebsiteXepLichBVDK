using Microsoft.AspNetCore.Mvc;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NgayNghiLeController : ControllerBase
    {
        private readonly INgayNghiLeRepository _ngayNghiLeRepository;

        public NgayNghiLeController(INgayNghiLeRepository ngayNghiLeRepository)
        {
            _ngayNghiLeRepository = ngayNghiLeRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<NgayNghiLe>>> GetAllNgayNghiLe()
        {
            var ngayNghiLe = await _ngayNghiLeRepository.GetAllNgayNghiLeAsync();
            return Ok(ngayNghiLe);
        }

        //[HttpGet("{id}")]
        //public async Task<ActionResult<NgayNghiLe>> GetNgayNghiLeById(string id)
        //{
        //    var ngayNghiLe = await _ngayNghiLeRepository.GetNgayNghiLeByIdAsync(id);
        //    if (ngayNghiLe == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(ngayNghiLe);
        //}

        //[HttpPost]
        //public async Task<ActionResult> CreateNgayNghiLe(NgayNghiLe newNgayNghiLe)
        //{
        //    await _ngayNghiLeRepository.CreateNgayNghiLeAsync(newNgayNghiLe);
        //    return CreatedAtAction(nameof(GetNgayNghiLeById), new { id = newNgayNghiLe.ID_ngayNghi }, newNgayNghiLe);
        //}

        //[HttpPut("{id}")]
        //public async Task<ActionResult> UpdateNgayNghiLe(string id, NgayNghiLe updatedNgayNghiLe)
        //{
        //    var existingNgayNghiLe = await _ngayNghiLeRepository.GetNgayNghiLeByIdAsync(id);
        //    if (existingNgayNghiLe == null)
        //    {
        //        return NotFound();
        //    }

        //    updatedNgayNghiLe.ID_ngayNghi = existingNgayNghiLe.ID_ngayNghi; // Giữ nguyên ID
        //    await _ngayNghiLeRepository.UpdateNgayNghiLeAsync(id, updatedNgayNghiLe);
        //    return NoContent();
        //}

        //[HttpDelete("{id}")]
        //public async Task<ActionResult> DeleteNgayNghiLe(string id)
        //{
        //    var existingNgayNghiLe = await _ngayNghiLeRepository.GetNgayNghiLeByIdAsync(id);
        //    if (existingNgayNghiLe == null)
        //    {
        //        return NotFound();
        //    }
        //    await _ngayNghiLeRepository.DeleteNgayNghiLeAsync(id);
        //    return NoContent();
        //}
    }
}