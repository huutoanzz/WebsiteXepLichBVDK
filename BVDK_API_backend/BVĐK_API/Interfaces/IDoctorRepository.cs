
using BVĐK_API.Models;

namespace BVĐK_API.Interfaces
{
    public interface IDoctorRepository
    {
        Task<List<Doctor>> GetAllDoctorsAsync();
        Task<Doctor> GetDoctorByIdAsync(string idBacSi);  // Sử dụng string cho ID_bacSi

        Task<Doctor> GetDoctorByEmailAsync(string email);
        Task CreateDoctorAsync(Doctor newDoctor);
        Task UpdateDoctorAsync(string idBacSi, Doctor updatedDoctor);  // Sử dụng string cho ID_bacSi
        Task DeleteDoctorAsync(string idBacSi);  // Sử dụng string cho ID_bacSi
    }
}
