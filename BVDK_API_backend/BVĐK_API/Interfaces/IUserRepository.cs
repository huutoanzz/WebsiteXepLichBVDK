using BVĐK_API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(string userId);
        Task<User> GetUserByUsernameAsync(string username);

        Task<User> GetUserByPasswordAsync(string password);
        Task CreateUserAsync(User newUser);
        Task UpdateUserAsync(string userId, User updatedUser);
        Task DeleteUserAsync(string userId);
    }
}
