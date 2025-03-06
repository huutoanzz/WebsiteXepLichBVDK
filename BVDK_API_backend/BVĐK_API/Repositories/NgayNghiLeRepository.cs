using MongoDB.Driver;
using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Repositories
{
    public class NgayNghiLeRepository : INgayNghiLeRepository
    {
        private readonly IMongoCollection<NgayNghiLe> _ngayNghiLeCollection;

        public NgayNghiLeRepository(IMongoDatabase database)
        {
            _ngayNghiLeCollection = database.GetCollection<NgayNghiLe>("NgayNghiLe");
        }

        public async Task<List<NgayNghiLe>> GetAllNgayNghiLeAsync()
        {
            return await _ngayNghiLeCollection.Find(_ => true).ToListAsync();
        }

        //public async Task<NgayNghiLe> GetNgayNghiLeByIdAsync(string id)
        //{
        //    return await _ngayNghiLeCollection.Find(n => n.ID_ngayNghi == id).FirstOrDefaultAsync();
        //}

        //public async Task CreateNgayNghiLeAsync(NgayNghiLe newNgayNghiLe)
        //{
        //    await _ngayNghiLeCollection.InsertOneAsync(newNgayNghiLe);
        //}

        //public async Task UpdateNgayNghiLeAsync(string id, NgayNghiLe updatedNgayNghiLe)
        //{
        //    await _ngayNghiLeCollection.ReplaceOneAsync(n => n.ID_ngayNghi == id, updatedNgayNghiLe);
        //}

        //public async Task DeleteNgayNghiLeAsync(string id)
        //{
        //    await _ngayNghiLeCollection.DeleteOneAsync(n => n.ID_ngayNghi == id);
        //}
    }
}