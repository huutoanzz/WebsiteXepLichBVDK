    using MongoDB.Driver;
    using BVĐK_API.Interfaces;
    using BVĐK_API.Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    namespace BVĐK_API.Repositories
    {
        public class ShiftRepository : IShiftRepository
        {
            private readonly IMongoCollection<Shift> _shiftCollection;

            public ShiftRepository(IMongoDatabase database)
            {
                _shiftCollection = database.GetCollection<Shift>("CaTruc"); // Tên collection trong MongoDB
            }

            public async Task<List<Shift>> GetAllShiftsAsync()
            {
                return await _shiftCollection.Find(_ => true).ToListAsync();
            }

            public async Task<Shift> GetShiftByIdAsync(string shiftId)
            {
                return await _shiftCollection.Find(s => s.ShiftId == shiftId).FirstOrDefaultAsync();
            }
            public async Task<Shift> GetShiftByStartAndEndTimeAsync(string startTime, string endTime)
            {
                // Tìm ca trực có cùng giờ bắt đầu và giờ kết thúc
                return await _shiftCollection.Find(s => s.StartTime == startTime && s.EndTime == endTime).FirstOrDefaultAsync();
            }


        public async Task CreateShiftAsync(Shift newShift)
            {
                await _shiftCollection.InsertOneAsync(newShift);
            }

            public async Task UpdateShiftAsync(string shiftId, Shift updatedShift)
            {
                await _shiftCollection.ReplaceOneAsync(s => s.ShiftId == shiftId, updatedShift);
            }

            public async Task DeleteShiftAsync(string shiftId)
            {
                await _shiftCollection.DeleteOneAsync(s => s.ShiftId == shiftId);
            }
        }
    }
