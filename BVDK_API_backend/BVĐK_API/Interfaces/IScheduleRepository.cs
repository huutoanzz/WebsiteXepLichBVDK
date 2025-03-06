using System.Collections.Generic;
using System.Threading.Tasks;
using BVĐK_API.Models;

namespace BVĐK_API.Interfaces
{
    public interface IScheduleRepository
    {
        Task<List<LichTruc>> GetAllSchedulesAsync();
        //Task<Schedule> GetScheduleByIdAsync(int id);
        Task CreateSchedulesAsync(List<LichTruc> lichTrucList);
        Task UpdateScheduleAsync(LichTruc lichTruc);
        Task RemovePhongTrucAsync(DateTime ngayTruc, string idBacSi);
        Task<bool> IsScheduleExistForMonthAsync(DateTime dtp);
        Task DeleteSchedulesForMonthAsync(DateTime dtp);
        Task DeleteScheduleAsync(LichTruc lichTruc);
        Task<List<LichTruc>> GetSchedulesBetweenDatesAsync(DateTime startDate, DateTime endDate);

    }
}