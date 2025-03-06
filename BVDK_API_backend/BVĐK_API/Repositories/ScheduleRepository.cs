using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Repositories
{
    public class ScheduleRepository : IScheduleRepository
    {
        private readonly IMongoCollection<LichTruc> _lichTrucCollection;

        public ScheduleRepository(IMongoDatabase database)
        {
            _lichTrucCollection = database.GetCollection<LichTruc>("LichTruc");
        }

        public async Task<List<LichTruc>> GetAllSchedulesAsync()
        {
            return await _lichTrucCollection.Find(_ => true).ToListAsync();
        }

        public async Task CreateSchedulesAsync(List<LichTruc> lichTrucList)
        {
            await _lichTrucCollection.InsertManyAsync(lichTrucList);
        }

        public async Task UpdateScheduleAsync(LichTruc lichTruc)
        {
            // Sử dụng phương thức ReplaceOneAsync để cập nhật bản ghi trong MongoDB
            await _lichTrucCollection.ReplaceOneAsync(
                filter: x => x.Id == lichTruc.Id, // Giả sử LichTruc có thuộc tính Id
                replacement: lichTruc
            );
        }

        public async Task RemovePhongTrucAsync(DateTime ngayTruc, string idBacSi)
        {
            // Tìm lịch trực theo ngày
            var lichTruc = await _lichTrucCollection.Find(x => x.Ngay.Date == ngayTruc.Date).FirstOrDefaultAsync();

            if (lichTruc != null)
            {
                // Xóa phongTruc theo ID bác sĩ
                lichTruc.Phong.RemoveAll(pt => pt.IDBacSi == idBacSi);

                // Cập nhật lại lịch trực
                await UpdateScheduleAsync(lichTruc);
            }
        }

        public async Task<bool> IsScheduleExistForMonthAsync(DateTime dtp)
        {
            var firstDayOfMonth = new DateTime(dtp.Year, dtp.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            // Kiểm tra xem có lịch nào trong tháng này không
            var existingSchedules = await _lichTrucCollection
                .Find(s => s.Ngay >= firstDayOfMonth && s.Ngay <= lastDayOfMonth)
                .ToListAsync();

            return existingSchedules.Any();
        }

        public async Task DeleteSchedulesForMonthAsync(DateTime dtp)
        {
            // Chuyển đổi thời gian về UTC
            DateTime startOfMonth = new DateTime(dtp.Year, dtp.Month, 1);
            DateTime endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);

            // Lấy danh sách các lịch trực trong khoảng thời gian này
            var schedules = await _lichTrucCollection
                .Find(schedule => schedule.Ngay >= startOfMonth && schedule.Ngay <= endOfMonth)
                .ToListAsync();

            if (schedules.Any())
            {
                // Xóa các lịch trực trong khoảng thời gian này
                await _lichTrucCollection.DeleteManyAsync(schedule => schedule.Ngay >= startOfMonth && schedule.Ngay <= endOfMonth);
            }
            else
            {
                throw new Exception("Không có lịch trực để xóa.");
            }
        }

        public async Task DeleteScheduleAsync(LichTruc lichTruc)
        {
            var filter = Builders<LichTruc>.Filter.Eq(l => l.Id, lichTruc.Id);
            await _lichTrucCollection.DeleteOneAsync(filter);
        }

        public async Task<List<LichTruc>> GetSchedulesBetweenDatesAsync(DateTime startDate, DateTime endDate)
        {
            return await _lichTrucCollection.Find(x => x.Ngay >= startDate && x.Ngay <= endDate).ToListAsync();
        }



    }
}