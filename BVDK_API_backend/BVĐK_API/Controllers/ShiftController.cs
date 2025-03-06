using Microsoft.AspNetCore.Mvc;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShiftController : ControllerBase
    {
        private readonly IShiftRepository _shiftRepository;

        public ShiftController(IShiftRepository shiftRepository)
        {
            _shiftRepository = shiftRepository;
        }

        // GET: api/shift
        [HttpGet]
        public async Task<ActionResult<List<Shift>>> GetAllShifts()
        {
            var shifts = await _shiftRepository.GetAllShiftsAsync();
            return Ok(shifts);
        }

        // GET: api/shift/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Shift>> GetShiftById(string id)
        {
            var shift = await _shiftRepository.GetShiftByIdAsync(id);
            if (shift == null)
            {
                return NotFound();
            }
            return Ok(shift);
        }

        // POST: api/shift
        [HttpPost]
        public async Task<ActionResult> CreateShift(Shift newShift)
        {
            // Kiểm tra trùng ID
            var existingShiftById = await _shiftRepository.GetShiftByIdAsync(newShift.ShiftId);
            if (existingShiftById != null)
            {
                return Conflict("A shift with the same ID already exists.");
            }

            // Kiểm tra trùng giờ bắt đầu và giờ kết thúc
            var existingShiftByTime = await _shiftRepository.GetShiftByStartAndEndTimeAsync(newShift.StartTime, newShift.EndTime);
            if (existingShiftByTime != null)
            {
                return Conflict("A shift with the same start and end time already exists.");
            }

            await _shiftRepository.CreateShiftAsync(newShift);
            return CreatedAtAction(nameof(GetShiftById), new { id = newShift.ShiftId }, newShift);
        }

        // PUT: api/shift/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateShift(string id, Shift updatedShift)
        {
            var existingShift = await _shiftRepository.GetShiftByIdAsync(id);
            if (existingShift == null)
            {
                return NotFound();
            }

            // Kiểm tra trùng giờ bắt đầu và giờ kết thúc (ngoại trừ chính nó)
            var existingShiftByTime = await _shiftRepository.GetShiftByStartAndEndTimeAsync(updatedShift.StartTime, updatedShift.EndTime);
            if (existingShiftByTime != null && existingShiftByTime.ShiftId != id)
            {
                return Conflict("A shift with the same start and end time already exists.");
            }

            updatedShift.Id = existingShift.Id; // Giữ nguyên ObjectId
            updatedShift.ShiftId = existingShift.ShiftId; // Giữ nguyên ID ca

            await _shiftRepository.UpdateShiftAsync(id, updatedShift);
            return NoContent();
        }

        // DELETE: api/shift/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteShift(string id)
        {
            var existingShift = await _shiftRepository.GetShiftByIdAsync(id);
            if (existingShift == null)
            {
                return NotFound();
            }
            await _shiftRepository.DeleteShiftAsync(id);
            return NoContent();
        }
    }
}
