using MongoDB.Driver;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Repositories
{
    public class SpecializationRepository : ISpecializationRepository
    {
        private readonly IMongoCollection<Specialization> _specializationCollection;

        public SpecializationRepository(IMongoDatabase database)
        {
            _specializationCollection = database.GetCollection<Specialization>("ChuyenKhoa"); // Tên collection trong MongoDB
        }

        public async Task<List<Specialization>> GetAllSpecializationsAsync()
        {
            return await _specializationCollection.Find(_ => true).ToListAsync();
        }

        public async Task<Specialization> GetSpecializationByIdAsync(string specializationId)
        {
            return await _specializationCollection.Find(s => s.SpecializationId == specializationId).FirstOrDefaultAsync();
        }
        public async Task<Specialization> GetSpecializationByNameAsync(string name)
        {
            return await _specializationCollection.Find(s => s.SpecializationName == name).FirstOrDefaultAsync();
        }

        public async Task CreateSpecializationAsync(Specialization newSpecialization)
        {
            await _specializationCollection.InsertOneAsync(newSpecialization);
        }

        public async Task UpdateSpecializationAsync(string specializationId, Specialization updatedSpecialization)
        {
            await _specializationCollection.ReplaceOneAsync(s => s.SpecializationId == specializationId, updatedSpecialization);
        }

        public async Task DeleteSpecializationAsync(string specializationId)
        {
            await _specializationCollection.DeleteOneAsync(s => s.SpecializationId == specializationId);
        }
    }
}
