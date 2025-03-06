using System.Collections.Generic;
using System.Threading.Tasks;
using BVĐK_API.Models;

namespace BVĐK_API.Interfaces
{
    public interface IShiftRepository
    {
        Task<List<Shift>> GetAllShiftsAsync();
        Task<Shift> GetShiftByIdAsync(string shiftId);
        Task<Shift> GetShiftByStartAndEndTimeAsync(string startTime, string endTime);
        Task CreateShiftAsync(Shift newShift);
        Task UpdateShiftAsync(string shiftId, Shift updatedShift);
        Task DeleteShiftAsync(string shiftId);
    }
}
