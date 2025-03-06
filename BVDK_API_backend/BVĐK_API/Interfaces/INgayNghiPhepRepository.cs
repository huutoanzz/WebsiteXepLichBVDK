using BVĐK_API.Models;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Interfaces
{
    public interface INgayNghiPhepRepository
    {
        Task<List<NgayNghiPhep>> GetAllNgayNghiPhepAsync();
        Task<NgayNghiPhep> GetNgayNghiPhepByIdAsync(string id);
        Task<List<NgayNghiPhep>> GetNgayNghiPhepByDoctorIdAsync(string doctorId);
        Task CreateNgayNghiPhepAsync(NgayNghiPhep newNgayNghiPhep);
        Task UpdateNgayNghiPhepAsync(string maBacSi, DateTime ngayNghi, NgayNghiPhep updatedNgayNghiPhep);
        Task DeleteNgayNghiPhepAsync(string doctorId, DateTime ngayNghi);

        Task<NgayNghiPhep> GetNgayNghiPhepByMaBacSiAndNgayNghiAsync(string maBacSi, DateTime ngayNghi);

    }
}