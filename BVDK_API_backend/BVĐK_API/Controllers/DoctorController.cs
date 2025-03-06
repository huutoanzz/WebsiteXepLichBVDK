using Microsoft.AspNetCore.Mvc;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorRepository _doctorRepository;

        public DoctorController(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        // GET: api/doctor
        [HttpGet]
        public async Task<ActionResult<List<Doctor>>> GetAllDoctors()
        {
            var doctors = await _doctorRepository.GetAllDoctorsAsync();
            return Ok(doctors);
        }

        // GET: api/doctor/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctorById(string id)
        {
            var doctor = await _doctorRepository.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }
            return Ok(doctor);
        }

        // POST: api/doctor
        [HttpPost]
        public async Task<ActionResult> CreateDoctor(Doctor newDoctor)
        {
            // Kiểm tra ID_bacSi đã tồn tại chưa
            var existingDoctorById = await _doctorRepository.GetDoctorByIdAsync(newDoctor.ID_bacSi);
            if (existingDoctorById != null)
            {
                return BadRequest("A doctor with the same ID_bacSi already exists.");
            }

            // Kiểm tra email đã tồn tại chưa
            var existingDoctorByEmail = await _doctorRepository.GetDoctorByEmailAsync(newDoctor.email);
            if (existingDoctorByEmail != null)
            {
                return BadRequest("A doctor with the same email already exists.");
            }

            // Thêm bác sĩ mới nếu không có trùng lặp
            await _doctorRepository.CreateDoctorAsync(newDoctor);
            return CreatedAtAction(nameof(GetDoctorById), new { id = newDoctor.ID_bacSi }, newDoctor);
        }

        // PUT: api/doctor/{id}
        [HttpPut("{id}")]
public async Task<ActionResult> UpdateDoctor(string id, Doctor updatedDoctor)
{
    var existingDoctor = await _doctorRepository.GetDoctorByIdAsync(id);
    if (existingDoctor == null)
    {
        return NotFound();
    }
            // Nếu email đã thay đổi, kiểm tra xem email mới có tồn tại không
            if (updatedDoctor.email != existingDoctor.email)
            {
                var existingDoctorByEmail = await _doctorRepository.GetDoctorByEmailAsync(updatedDoctor.email);
                if (existingDoctorByEmail != null)
                {
                    return BadRequest("A doctor with the same email already exists.");
                }
            }
            // Giữ nguyên ObjectId của bác sĩ hiện có trong updatedDoctor
    updatedDoctor.Id = existingDoctor.Id;
    updatedDoctor.ID_bacSi = existingDoctor.ID_bacSi; // Đảm bảo mã ID_bacSi được giữ nguyên

    // Cập nhật thông tin bác sĩ
    await _doctorRepository.UpdateDoctorAsync(id, updatedDoctor);
    return NoContent();
}

        // DELETE: api/doctor/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDoctor(string id)
        {
            var existingDoctor = await _doctorRepository.GetDoctorByIdAsync(id);
            if (existingDoctor == null)
            {
                return NotFound();
            }
            await _doctorRepository.DeleteDoctorAsync(id);
            return NoContent();
        }
    }
}
