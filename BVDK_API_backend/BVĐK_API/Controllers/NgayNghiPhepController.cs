using Microsoft.AspNetCore.Mvc;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NgayNghiPhepController : ControllerBase
    {
        private readonly INgayNghiPhepRepository _ngayNghiPhepRepository;

        public NgayNghiPhepController(INgayNghiPhepRepository ngayNghiPhepRepository)
        {
            _ngayNghiPhepRepository = ngayNghiPhepRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<NgayNghiPhep>>> GetAllNgayNghiPhep()
        {
            var ngayNghiPhep = await _ngayNghiPhepRepository.GetAllNgayNghiPhepAsync();
            return Ok(ngayNghiPhep);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NgayNghiPhep>> GetNgayNghiPhepById(string id)
        {
            var ngayNghiPhep = await _ngayNghiPhepRepository.GetNgayNghiPhepByIdAsync(id);
            if (ngayNghiPhep == null)
            {
                return NotFound();
            }
            return Ok(ngayNghiPhep);
        }
        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetNgayNghiByDoctorId(string doctorId)
        {
            var ngayNghiList = await _ngayNghiPhepRepository.GetNgayNghiPhepByDoctorIdAsync(doctorId);

            if (ngayNghiList == null || !ngayNghiList.Any())
            {
                return NotFound(new { message = "No records found for the given doctor ID." });
            }

            return Ok(ngayNghiList);
        }

        [HttpPost]
        public async Task<ActionResult> CreateNgayNghiPhep(NgayNghiPhep newNgayNghiPhep)
        {
            if (newNgayNghiPhep.NgayNghi < DateTime.Today)
            {
                return BadRequest("Không thể thêm ngày nghỉ phép cho quá khứ.");
            }

            await _ngayNghiPhepRepository.CreateNgayNghiPhepAsync(newNgayNghiPhep);
            return CreatedAtAction(nameof(GetNgayNghiPhepById), new { id = newNgayNghiPhep.IDBacSi }, newNgayNghiPhep);
        }


        [HttpPut("{maBacSi}/{ngayNghi}")]
        public async Task<ActionResult> UpdateNgayNghiPhep(string maBacSi, DateTime ngayNghi, NgayNghiPhep updatedNgayNghiPhep)
        {

            var existingNgayNghiPhep = await _ngayNghiPhepRepository.GetNgayNghiPhepByMaBacSiAndNgayNghiAsync(maBacSi, ngayNghi);

            if (existingNgayNghiPhep == null)
            {
                return NotFound();  
            }

            updatedNgayNghiPhep.IDBacSi = existingNgayNghiPhep.IDBacSi;  // Preserve the same BacSi ID
            await _ngayNghiPhepRepository.UpdateNgayNghiPhepAsync(maBacSi, ngayNghi, updatedNgayNghiPhep);

            return NoContent();  // Return 204 No Content on successful update
        }


        [HttpDelete("{doctorId}/{ngayNghi}")]
        public async Task<ActionResult> DeleteNgayNghiPhep(string doctorId, DateTime ngayNghi)
        {
            try
            {
                // Call the repository to delete the record
                await _ngayNghiPhepRepository.DeleteNgayNghiPhepAsync(doctorId, ngayNghi);
                return NoContent();  // Return 204 No Content if deletion is successful
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Unable to delete the day off record." });
            }
        }

    }
}