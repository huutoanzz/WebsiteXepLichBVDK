using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BVĐK_API.Interfaces;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace BVĐK_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BackupAndRestoreController : ControllerBase
    {
        private readonly IBackupRestoreRepository _backupRestoreRepository;

        public BackupAndRestoreController(IBackupRestoreRepository backupRestoreRepository)
        {
            _backupRestoreRepository = backupRestoreRepository;
        }

        [HttpPost("backup")]
        public async Task<IActionResult> BackupData([FromBody] BackupRequest backupRequest)
        {
            if (string.IsNullOrWhiteSpace(backupRequest.OutputPath))
            {
                return BadRequest(new { message = "The outputPath field is required." });
            }

            try
            {
                await _backupRestoreRepository.BackupDataAsync(backupRequest.OutputPath);
                return Ok(new { message = "Backup completed successfully." });
            }
            catch (IOException ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        public class BackupRequest
        {
            public string OutputPath { get; set; }
        }


        [HttpPost("restore")]
        public async Task<IActionResult> RestoreData(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded." });
            }

            try
            {
                // Gọi phương thức trong repository để phục hồi dữ liệu
                await _backupRestoreRepository.RestoreDataAsync(file);
                return Ok(new { message = "Restore completed successfully." });
            }
            catch (IOException ex)
            {
                // Nếu có lỗi IO, trả về lỗi với thông điệp chi tiết
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = $"Error restoring data: {ex.Message}" });
            }
            catch (Exception ex)
            {
                // Bắt các lỗi khác ngoài IO
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = $"Unexpected error: {ex.Message}" });
            }
        }

    }
}
