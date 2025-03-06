using MongoDB.Driver;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Repositories
{
    public class ClinicRepository : IClinicRepository
    {
        private readonly IMongoCollection<Clinic> _clinicCollection;

        public ClinicRepository(IMongoDatabase database)
        {
            _clinicCollection = database.GetCollection<Clinic>("PhongKham"); // Tên collection trong MongoDB
        }

        public async Task<List<Clinic>> GetAllClinicsAsync()
        {
            return await _clinicCollection.Find(_ => true).ToListAsync(); // Lấy tất cả phòng khám
        }

        public async Task<Clinic> GetClinicByIdAsync(string id)
        {
            return await _clinicCollection.Find(c => c.ClinicId == id.ToString()).FirstOrDefaultAsync(); // Tìm phòng khám theo ID
        }
        public async Task<Clinic> GetClinicByNameAndAddressAsync(string name, string address)
        {
            return await _clinicCollection.Find(c => c.ClinicName == name && c.Address == address).FirstOrDefaultAsync(); // Tìm phòng khám theo tên và địa chỉ
        }
        public async Task CreateClinicAsync(Clinic newClinic)
        {
            await _clinicCollection.InsertOneAsync(newClinic); // Thêm phòng khám mới
        }

        public async Task UpdateClinicAsync(string id, Clinic updatedClinic)
        {
            await _clinicCollection.ReplaceOneAsync(c => c.ClinicId == id.ToString(), updatedClinic); // Cập nhật thông tin phòng khám
        }

        public async Task DeleteClinicAsync(string id)
        {
            await _clinicCollection.DeleteOneAsync(c => c.ClinicId == id.ToString()); // Xóa phòng khám theo ID
        }
    }
}
