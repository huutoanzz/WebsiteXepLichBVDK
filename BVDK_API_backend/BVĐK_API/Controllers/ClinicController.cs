using Microsoft.AspNetCore.Mvc;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClinicController : ControllerBase
    {
        private readonly IClinicRepository _clinicRepository;

        public ClinicController(IClinicRepository clinicRepository)
        {
            _clinicRepository = clinicRepository;
        }

        // GET: api/clinic
        [HttpGet]
        public async Task<ActionResult<List<Clinic>>> GetAllClinics()
        {
            var clinics = await _clinicRepository.GetAllClinicsAsync();
            return Ok(clinics);
        }

        // GET: api/clinic/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Clinic>> GetClinicById(string id)
        {
            var clinic = await _clinicRepository.GetClinicByIdAsync(id);
            if (clinic == null)
            {
                return NotFound();
            }
            return Ok(clinic);
        }

        // POST: api/clinic
        [HttpPost]
        public async Task<ActionResult> CreateClinic(Clinic newClinic)
        {
            // Kiểm tra trùng ID
            var existingClinicById = await _clinicRepository.GetClinicByIdAsync(newClinic.ClinicId);
            if (existingClinicById != null)
            {
                return Conflict("ID của phòng khám đã tồn tại.");
            }

            // Kiểm tra trùng tên và địa chỉ
            var existingClinicByNameAndAddress = await _clinicRepository.GetClinicByNameAndAddressAsync(newClinic.ClinicName, newClinic.Address);
            if (existingClinicByNameAndAddress != null)
            {
                return Conflict("Tên phòng và địa chỉ đã tồn tại.");
            }

            await _clinicRepository.CreateClinicAsync(newClinic);
            return CreatedAtAction(nameof(GetClinicById), new { id = newClinic.ClinicId }, newClinic);
        }

        // PUT: api/clinic/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateClinic(string id, Clinic updatedClinic)
        {
            // Tìm phòng khám hiện có trong cơ sở dữ liệu dựa trên ID
            var existingClinic = await _clinicRepository.GetClinicByIdAsync(id);
            if (existingClinic == null)
            {
                return NotFound("Không tìm thấy phòng khám.");
            }

            // Kiểm tra trùng tên và địa chỉ với các phòng khám khác (ngoại trừ chính nó)
            var duplicateClinic = await _clinicRepository.GetClinicByNameAndAddressAsync(updatedClinic.ClinicName, updatedClinic.Address);
            if (duplicateClinic != null && duplicateClinic.ClinicId != id)
            {
                return Conflict("Tên phòng và địa chỉ đã tồn tại.");
            }

            // Giữ nguyên ObjectId và ClinicId
            updatedClinic.Id = existingClinic.Id;
            updatedClinic.ClinicId = existingClinic.ClinicId;

            // Cập nhật thông tin phòng khám
            await _clinicRepository.UpdateClinicAsync(id, updatedClinic);
            return NoContent();
        }

        // DELETE: api/clinic/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteClinic(string id)
        {
            var existingClinic = await _clinicRepository.GetClinicByIdAsync(id);
            if (existingClinic == null)
            {
                return NotFound();
            }
            await _clinicRepository.DeleteClinicAsync(id);
            return NoContent();
        }
    }
}