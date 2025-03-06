using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Interfaces
{
    public interface INgayNghiLeRepository
    {
        Task<List<NgayNghiLe>> GetAllNgayNghiLeAsync();
        //Task<NgayNghiLe> GetNgayNghiLeByIdAsync(string id);
        //Task CreateNgayNghiLeAsync(NgayNghiLe newNgayNghiLe);
        //Task UpdateNgayNghiLeAsync(string id, NgayNghiLe updatedNgayNghiLe);
        //Task DeleteNgayNghiLeAsync(string id);
    }
}