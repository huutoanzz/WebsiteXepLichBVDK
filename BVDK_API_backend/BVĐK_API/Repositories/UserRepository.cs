using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserRepository(IMongoDatabase database)
        {
            _userCollection = database.GetCollection<User>("NguoiDung");
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userCollection.Find(_ => true).ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _userCollection.Find(user => user.UserId == userId).FirstOrDefaultAsync();
        }


        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _userCollection.Find(user => user.Username == username).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByPasswordAsync(string password)
        {
            return await _userCollection.Find(user => user.Password == password).FirstOrDefaultAsync();
        }

        public async Task CreateUserAsync(User newUser)
        {
            // Lưu mật khẩu trực tiếp mà không mã hóa
            await _userCollection.InsertOneAsync(newUser);
        }

        public async Task UpdateUserAsync(string userId, User updatedUser)
        {
            // Cập nhật trực tiếp thông tin người dùng mà không mã hóa mật khẩu
            await _userCollection.ReplaceOneAsync(user => user.UserId == userId, updatedUser);
        }

        public async Task DeleteUserAsync(string userId)
        {
            await _userCollection.DeleteOneAsync(user => user.UserId == userId);
        }
    }
}
