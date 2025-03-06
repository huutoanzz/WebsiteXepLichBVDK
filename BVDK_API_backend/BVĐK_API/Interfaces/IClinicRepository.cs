// IClinicRepository.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using BVĐK_API.Models;

namespace BVĐK_API.Interfaces
{
    public interface IClinicRepository
    {
        Task<List<Clinic>> GetAllClinicsAsync();
        Task<Clinic> GetClinicByIdAsync(string id);
        
        Task<Clinic> GetClinicByNameAndAddressAsync(string name ,string diachi);
        Task CreateClinicAsync(Clinic newClinic);
        Task UpdateClinicAsync(string id, Clinic updatedClinic);
        Task DeleteClinicAsync(string id);
    }
}
