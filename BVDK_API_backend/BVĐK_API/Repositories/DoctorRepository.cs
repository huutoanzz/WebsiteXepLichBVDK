using MongoDB.Driver;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly IMongoCollection<Doctor> _doctorCollection;

        public DoctorRepository(IMongoDatabase database)
        {
            _doctorCollection = database.GetCollection<Doctor>("BacSi"); // Tên collection trong MongoDB
        }

        public async Task<List<Doctor>> GetAllDoctorsAsync()
        {
            return await _doctorCollection.Find(_ => true).ToListAsync(); // Lấy tất cả bác sĩ
        }

        public async Task<Doctor> GetDoctorByIdAsync(string idBacSi)
        {
            return await _doctorCollection.Find(d => d.ID_bacSi == idBacSi).FirstOrDefaultAsync(); // Tìm bác sĩ theo ID
        }

        public async Task<Doctor> GetDoctorByEmailAsync(string email)
        {
            return await _doctorCollection.Find(d => d.email == email).FirstOrDefaultAsync(); // Tìm bác sĩ theo email
        }

        public async Task CreateDoctorAsync(Doctor newDoctor)
        {
            await _doctorCollection.InsertOneAsync(newDoctor); // Thêm bác sĩ mới
        }

        public async Task UpdateDoctorAsync(string idBacSi, Doctor updatedDoctor)
        {
            await _doctorCollection.ReplaceOneAsync(d => d.ID_bacSi == idBacSi, updatedDoctor); // Cập nhật thông tin bác sĩ
        }

        public async Task DeleteDoctorAsync(string idBacSi)
        {
            await _doctorCollection.DeleteOneAsync(d => d.ID_bacSi == idBacSi); // Xóa bác sĩ theo ID
        }
    }
}
