using MongoDB.Driver;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Repositories
{
    public class NgayNghiPhepRepository : INgayNghiPhepRepository
    {
        private readonly IMongoCollection<NgayNghiPhep> _ngayNghiPhepCollection;

        public NgayNghiPhepRepository(IMongoDatabase database)
        {
            _ngayNghiPhepCollection = database.GetCollection<NgayNghiPhep>("NgayNghiPhep");
        }

        public async Task<List<NgayNghiPhep>> GetAllNgayNghiPhepAsync()
        {
            return await _ngayNghiPhepCollection.Find(_ => true).ToListAsync();
        }

        public async Task<List<NgayNghiPhep>> GetNgayNghiPhepByDoctorIdAsync(string doctorId)
        {
            return await _ngayNghiPhepCollection.Find(n => n.IDBacSi == doctorId).ToListAsync();
        }

        public async Task<NgayNghiPhep> GetNgayNghiPhepByIdAsync(string id)
        {
            return await _ngayNghiPhepCollection.Find(n => n.IDBacSi == id).FirstOrDefaultAsync();
        }

        public async Task CreateNgayNghiPhepAsync(NgayNghiPhep newNgayNghiPhep)
        {
            await _ngayNghiPhepCollection.InsertOneAsync(newNgayNghiPhep);
        }

        public async Task<NgayNghiPhep> GetNgayNghiPhepByMaBacSiAndNgayNghiAsync(string maBacSi, DateTime ngayNghi)
        {
            var filter = Builders<NgayNghiPhep>.Filter.And(
                Builders<NgayNghiPhep>.Filter.Eq(n => n.IDBacSi, maBacSi),
                Builders<NgayNghiPhep>.Filter.Eq(n => n.NgayNghi, ngayNghi)
            );

            return await _ngayNghiPhepCollection.Find(filter).FirstOrDefaultAsync();
        }
        public async Task UpdateNgayNghiPhepAsync(string maBacSi, DateTime ngayNghi, NgayNghiPhep updatedNgayNghiPhep)
        {
            var filter = Builders<NgayNghiPhep>.Filter.Eq(x => x.IDBacSi, maBacSi) & Builders<NgayNghiPhep>.Filter.Eq(x => x.NgayNghi, ngayNghi);
            var update = Builders<NgayNghiPhep>.Update
                            .Set(x => x.LyDo, updatedNgayNghiPhep.LyDo)
                            .Set(x => x.TrangThai, updatedNgayNghiPhep.TrangThai);
            await _ngayNghiPhepCollection.UpdateOneAsync(filter, update);
        }

        public async Task DeleteNgayNghiPhepAsync(string doctorId, DateTime ngayNghi)
        {
            var filter = Builders<NgayNghiPhep>.Filter.And(
                Builders<NgayNghiPhep>.Filter.Eq(n => n.IDBacSi, doctorId),
                Builders<NgayNghiPhep>.Filter.Eq(n => n.NgayNghi, ngayNghi)
            );

            var result = await _ngayNghiPhepCollection.DeleteOneAsync(filter);

            if (result.DeletedCount == 0)
            {
                throw new KeyNotFoundException("No record found to delete.");
            }
        }
    }
}