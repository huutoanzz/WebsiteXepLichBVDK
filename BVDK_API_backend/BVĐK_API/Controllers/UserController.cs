using BVĐK_API.Interfaces;
using BVĐK_API.Models;
using BVĐK_API.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BVĐK_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        // Constructor to inject the IUserRepository dependency
        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // GET: api/user
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users); // Trả về danh sách người dùng
        }

        // GET: api/user/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<User>> GetUserById(string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(); 
            }
            return Ok(user); 
        }

        // POST: api/user
        [HttpPost]
        public async Task<ActionResult> CreateUser([FromBody] User newUser)
        {
            if (newUser == null)
            {
                return BadRequest("User data is null.");
            }
            var existingUserById = await _userRepository.GetUserByIdAsync(newUser.UserId);
            if (existingUserById != null)
            {
                return BadRequest("User with the same ID already exists.");
            }

            var existingUserByUsername = await _userRepository.GetUserByUsernameAsync(newUser.Username);
            if (existingUserByUsername != null)
            {
                return BadRequest("User with the same userame already exists.");
            }
            await _userRepository.CreateUserAsync(newUser);
            return CreatedAtAction(nameof(GetUserById), new { userId = newUser.UserId }, newUser);
        }

        // PUT: api/user/{userId}
        [HttpPut("{userId}")]
        public async Task<ActionResult> UpdateUser(string userId, [FromBody] User updatedUser)
        {
            if (updatedUser == null)
            {
                return BadRequest("User data is null.");
            }

            var existingUser = await _userRepository.GetUserByIdAsync(userId);
            if (existingUser == null)
            {
                return NotFound(); 
            }
            if (updatedUser.Username != existingUser.Username)
            {
                var existingSpecializationName = await _userRepository.GetUserByUsernameAsync(updatedUser.Username);
                if (existingSpecializationName != null)
                {
                    return BadRequest("User with the same Username already exists.");
                }
            }
                // Giữ nguyên ObjectId và UserId
            updatedUser.Id = existingUser.Id;
            updatedUser.UserId = existingUser.UserId;

            await _userRepository.UpdateUserAsync(userId, updatedUser);
            return NoContent(); 
        }

        // DELETE: api/user/{userId}
        [HttpDelete("{userId}")]
        public async Task<ActionResult> DeleteUser(string userId)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(userId);
            if (existingUser == null)
            {
                return NotFound(); // Nếu không tìm thấy người dùng, trả về lỗi 404
            }

            await _userRepository.DeleteUserAsync(userId);
            return NoContent(); // Trả về mã 204 khi xóa thành công
        }

        // POST: api/user/login
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _userRepository.GetUserByUsernameAsync(loginRequest.Username);

            if (user == null || user.Password != loginRequest.Password)
            {
                return Unauthorized("Invalid username or password.");
            }
            return Ok(user);
        }

        // Lớp dùng để truyền dữ liệu đăng nhập
        public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
        // POST: api/user/change-password
        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest changePasswordRequest)
        {
            // Kiểm tra đầu vào
            if (changePasswordRequest == null)
            {
                return BadRequest("Request data is null.");
            }

            // Lấy người dùng từ cơ sở dữ liệu bằng UserId
            var user = await _userRepository.GetUserByIdAsync(changePasswordRequest.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Kiểm tra mật khẩu cũ có đúng không
            if (user.Password != changePasswordRequest.OldPassword)
            {
                return Unauthorized("Old password is incorrect.");
            }

            // Kiểm tra mật khẩu mới và mật khẩu xác nhận có giống nhau không
            if (changePasswordRequest.NewPassword != changePasswordRequest.ConfirmNewPassword)
            {
                return BadRequest("New password and confirm password do not match.");
            }

            // Cập nhật mật khẩu mới
            user.Password = changePasswordRequest.NewPassword;

            // Lưu lại người dùng với mật khẩu mới
            await _userRepository.UpdateUserAsync(user.UserId, user);

            return Ok("Password updated successfully.");
        }

        // Lớp dùng để truyền dữ liệu đổi mật khẩu
        public class ChangePasswordRequest
        {
            public string UserId { get; set; }
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
            public string ConfirmNewPassword { get; set; }
        }

    }
}
