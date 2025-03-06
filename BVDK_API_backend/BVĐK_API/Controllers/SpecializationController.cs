using Microsoft.AspNetCore.Mvc;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using BVĐK_API.Repositories;

namespace BVĐK_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationController : ControllerBase
    {
        private readonly ISpecializationRepository _specializationRepository;

        public SpecializationController(ISpecializationRepository specializationRepository)
        {
            _specializationRepository = specializationRepository;
        }

        // GET: api/specialization
        [HttpGet]
        public async Task<ActionResult<List<Specialization>>> GetAllSpecializations()
        {
            var specializations = await _specializationRepository.GetAllSpecializationsAsync();
            return Ok(specializations);
        }

        // GET: api/specialization/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Specialization>> GetSpecializationById(string id)
        {
            var specialization = await _specializationRepository.GetSpecializationByIdAsync(id);
            if (specialization == null)
            {
                return NotFound();
            }
            return Ok(specialization);
        }

        // POST: api/specialization
        [HttpPost]
        public async Task<ActionResult> CreateSpecialization(Specialization newSpecialization)
        {
            var existingSpecializationById = await _specializationRepository.GetSpecializationByIdAsync(newSpecialization.SpecializationId);
            if (existingSpecializationById != null)
            {
                return BadRequest("Specialization with the same ID already exists.");
            }

            var existingSpecializationByname = await _specializationRepository.GetSpecializationByNameAsync(newSpecialization.SpecializationName);
            if (existingSpecializationByname != null)
            {
                return BadRequest("Specialization with the same Name already exists.");
            }

            await _specializationRepository.CreateSpecializationAsync(newSpecialization);
            return CreatedAtAction(nameof(GetSpecializationById), new { id = newSpecialization.SpecializationId }, newSpecialization);
        }

        // PUT: api/specialization/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSpecialization(string id, Specialization updatedSpecialization)
        {
            var existingSpecialization = await _specializationRepository.GetSpecializationByIdAsync(id);
            if (existingSpecialization == null)
            {
                return NotFound();
            }
            if (updatedSpecialization.SpecializationName != existingSpecialization.SpecializationName)
            {
                var existingSpecializationName = await _specializationRepository.GetSpecializationByNameAsync(updatedSpecialization.SpecializationName);
                if (existingSpecializationName != null)
                {
                    return BadRequest("SpecializationName with the same name already exists.");
                }
            }

            updatedSpecialization.Id = existingSpecialization.Id; // Giữ nguyên ObjectId để không thay đổi
            updatedSpecialization.SpecializationId = existingSpecialization.SpecializationId; // Giữ nguyên ID chuyên khoa

            await _specializationRepository.UpdateSpecializationAsync(id, updatedSpecialization);
            return NoContent();
        }

        // DELETE: api/specialization/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSpecialization(string id)
        {
            var existingSpecialization = await _specializationRepository.GetSpecializationByIdAsync(id);
            if (existingSpecialization == null)
            {
                return NotFound();
            }
            await _specializationRepository.DeleteSpecializationAsync(id);
            return NoContent();
        }
    }
}
