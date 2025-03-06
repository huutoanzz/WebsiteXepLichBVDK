// ISpecializationRepository.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using BVĐK_API.Models;

namespace BVĐK_API.Interfaces
{
    public interface ISpecializationRepository
    {
        Task<List<Specialization>> GetAllSpecializationsAsync();
        Task<Specialization> GetSpecializationByIdAsync(string id);
        Task<Specialization> GetSpecializationByNameAsync(string name);
        Task CreateSpecializationAsync(Specialization newSpecialization);
        Task UpdateSpecializationAsync(string id, Specialization updatedSpecialization);
        Task DeleteSpecializationAsync(string id);
    }
}
